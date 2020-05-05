
let db;
const request = indexedDB.open("budget", 1);

request.onsuccess = function(event) {
    db = event.target.result;

    if(navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    console.log("Uh oh," + event.target.errorCode);
};

function saveRecord (record) {
    const transaction = db.transaction(["pending"], "readwrite");

    const store = transaction.objectStore("pending");
    store.add(record);
}

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();
    
    getAll.onsuccess = function() {
        if(getAll.result.length > 0){
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "aplication/json"
                }
            }).then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");

                store.clear();
            }).catch(() => {
                saveRecord();
            })
        }
    };
}

window.addEventListener("online", checkDatabase);
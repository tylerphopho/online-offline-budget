import { response } from "express";

let transactions = []
let theChart;

fetch("/api/transaction").then(response => {
    return response.json();
}).then(data => {
    transactions = data;
    populateTotal()
    populateTable()
    populateChart()
});

function populateTotal() {
    let total = transactions.reduce(total, t => {
        return total + parseInt(t.value);
    }, 0);

    let totalEl = document.querySelector("#total");
    totalEl.textContent = total;
}


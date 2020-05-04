import { response } from "express";

const FILES_TO_CACHE = [
    "/",
    "/js/index.js",
    "/js/indexDB.js",
    "/js/chart.js",
    "/manifest.webmanifest",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener("install", evt => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("The files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE);
        }).catch(err => console.log(err))
    );

    self.skipWaiting();
});

self.addEventListener("fetch", function(evt){
    if(evt.request.url.includes("/api")){
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                .then(response => {
                    if(response.status === 200) {
                        cache.put(evt.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    return cache.match(evt.request);
                });
            }).catch(err => console.log(err))
        );
        return;
    }

    evt.respondWith(
        fetch(evt.request).catch(function(){
            return caches.match(evt.request).then(function(response){
                if(response) {
                    return response;
                } else if (evt.request.headeers.get("accept").includes("text/html")){
                    return caches.match("/");
                }
            });
        })
    );
});
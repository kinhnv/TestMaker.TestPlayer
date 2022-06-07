/// <reference no-default-lib="false"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

import { RequestHandler } from './ts/requesthandler/index';
let VERSION = 1
let CACHE_NAME = `CACHE_NAME_V${VERSION}`;

self.addEventListener('install', async event => {
    let cache = await caches.open(CACHE_NAME);

    cache.addAll([
        "./lib/bootstrap/dist/css/bootstrap.min.css",
        "./css/site.css",
        "./lib/jquery/dist/jquery.min.js",
        "./lib/bootstrap/dist/js/bootstrap.bundle.min.js",
        "./favicon.ico",
        "/",
        "./js/home.js",
        "/TestPlayer",
        "./js/testplayer.js",
        "/Events",
        "./js/events.js",
    ]);
})

self.addEventListener('fetch', async (event: FetchEvent) => {
    async function handleRequest() {
        let requestClone = event.request.clone();
        let cache = await caches.open(CACHE_NAME);

        let response = await (new RequestHandler({
            isOnline: navigator.onLine,
            version: VERSION,
            requestClone: requestClone,
            cache: cache
        }).handleAsync());
        if (response) {
            return response;
        }
        else {
            if (!navigator.onLine) {
                return await cache.match(requestClone);
            }
            else {
                return await fetch(requestClone);
            }
        }
    }

    event.respondWith(handleRequest());
});

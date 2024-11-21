/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from "$service-worker";

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

// install service worker
sw.addEventListener("install", (event) => {
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addFilesToCache());
});

// activate service worker
sw.addEventListener("activate", (event) => {
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) {
        await caches.delete(key);
      }
    }
  }

  event.waitUntil(deleteOldCaches());
});

// listen to fetch events & override URL with cache
sw.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    // serve build files from cache
    if (ASSETS.includes(url.pathname)) {
      const cachedResponse = await cache.match(url.pathname);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // try the network first
    try {
      const response = await fetch(event.request);

      if (!(response instanceof Response)) {
        throw new Error("invalid response from fetch");
      }

      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch (err) {
      // fallback to cache
      console.log("URL Pathname: ", url.pathname);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      throw err;
    }
  }

  event.respondWith(respond());
});

sw.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    sw.skipWaiting();
  }
});

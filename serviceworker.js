const CACHE_NAME = "version-1"
const urlsToCache = ['index.html']
const self = this;

// install service Worker
self.addEventListener('install',(ev)=>{
    ev.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache)=>{
                console.log("open cache")

                return cache.addAll(urlsToCache)
            })
    )
})

//Listen for requests
self.addEventListener('fetch',(ev)=>{
    ev.respondWith(
        caches.match(ev.request)
        .then(()=>{
            return fetch(ev.request)
                .catch(()=> caches.match("index.html"))
        })
    )
})
// Activate the service Worker
self.addEventListener('activate',(ev)=>{
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME)

    caches.keys().then(cacheNames=>Promise.all(
        cacheNames.map(cacheName=>{
            if(!cacheWhitelist.includes(cacheName)){
                return caches.delete(cacheName)
            }
        })
    ))
})
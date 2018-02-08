const isOnLine = () => navigator.onLine; // FOR DEMO PURPOSES ONLY! This property is not trustable across browsers.

const requestBuffer = {
  _requestQueue: [],
  intervalId: null,
  pushRequestForRetry (request, event) {
    this._requestQueue.push(request);
    if (!this.intervalId) {
      this.start(event);
    }
  },
  start (event) {
    const retry = async () => {
      if (isOnLine()) {
        console.log('[service worker] connection re-established, retrying with buffered requests');

        while (this._requestQueue.length) {
          await fetch(this._requestQueue.shift());
        }
        
        const client = await clients.get(event.clientId);
        if (client) {
          client.postMessage({
            msg: 'Connection re-established; pending requests flushed.'
          });
        }

        clearTimeout(this.intervalId);
        this.intervalId = null;
      } else {
        this.intervalId = setTimeout(retry, 5000);
      }
    }
    
    this.intervalId = setTimeout(retry, 5000);
  }
}

self.addEventListener('install', event => {
  // when new version of the sw.js is found, don't wait for anything and swap it immediately
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (!isOnLine()) {
    console.log('[service worker] app is offline - storing a request to retry later');
    requestBuffer.pushRequestForRetry(event.request.clone(), event);
    event.respondWith(Promise.resolve(new Response({}, { status: 202 }))); // 202 - Accepted
  }
});

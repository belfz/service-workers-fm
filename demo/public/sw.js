const isOnLine = () => navigator.onLine; // FOR DEMO PURPOSES ONLY! This property is not trustable across browsers.

const requestBuffer = {
  _requestQueue: [],
  intervalId: null,
  pushRequestForRetry (request) {
    this._requestQueue.push(request);
    if (!this.intervalId) {
      this.start();
    }
  },
  start () {
    const retry = () => {
      if (isOnLine()) {
        console.log('[service worker] connection re-established, retrying with buffered requests');

        while (this._requestQueue.length) {
          fetch(this._requestQueue.shift());
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

self.addEventListener('fetch', event => {
  if (!isOnLine()) {
    console.log('[service worker] app is offline - storing a request to retry later');
    requestBuffer.pushRequestForRetry(event.request.clone());
    event.respondWith(Promise.resolve(new Response({}, { status: 202 }))); // 202 - Accepted
  }
});

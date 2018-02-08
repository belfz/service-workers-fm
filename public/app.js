window.addEventListener('load', () => {
  const result = document.getElementById('result');
  const sendButton = document.getElementById('send');
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'activated') {
              // automatically refresh the website, so that HTTP fetch requests can be intercepted by the service worker
              window.location.reload();
            }
          });
        });
      })
      .catch(error => {
        console.error('service worker installation failed');
      });

    navigator.serviceWorker.addEventListener('message', event => {
      result.innerText = event.data.msg;
      result.className = 'result-ok';
    });
  }

  sendButton.addEventListener('click', () => {
    fetch('/data', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'ping!' })
    })
    .then(({ status, statusText }) => {
      switch (status) {
        case 202:
          result.innerText = `No connection. Request buffered for retrial when app is online again.`;
          result.className = 'result-warning';
          break;
        case 200:
        default:
          result.innerText = `${status} ${statusText}`;
          result.className = 'result-ok';
          break;
      }
    })
    .catch(() => {
      result.innerText = `Other error occured. Check if the server is running.`;
      result.className = 'result-warning';
    });
  });
});

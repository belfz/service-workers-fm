document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('send');
  const result = document.getElementById('result');

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

window.addEventListener('load', () => {
  const reloadNotification = document.getElementById('reload-notification');
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        if (registration.installing) {
          console.log('service worker installing');
        } else if (registration.waiting) {
          console.log('service worker installed');
        }

        registration.addEventListener('updatefound', () => {
          console.log('update for service worker found, please reload');
          reloadNotification.style.display = 'block';
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
});

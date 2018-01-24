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
    result.innerText = `${status} ${statusText}`;
  });
});

window.addEventListener('load', () => {
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
        });
      })
      .catch(error => {
        console.error('service worker installation failed');
      });
  }
});

const sendButton = document.getElementById('send');

sendButton.addEventListener('click', () => {
  fetch('/data', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: 'ping!' })
  });
});

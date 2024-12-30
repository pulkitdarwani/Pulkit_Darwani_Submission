document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('api-key-form');
    const apiKeyInput = document.getElementById('apiKey');
    const statusMessage = document.getElementById('status-message');
  
    // Load saved API key
    chrome.storage.sync.get(['apiKey'], (result) => {
      if (result.apiKey) {
        apiKeyInput.value = result.apiKey;
      }
    });
  
    // Save API key and send it to content.js
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const apiKey = apiKeyInput.value;
  
      if (apiKey) {
        chrome.storage.sync.set({ apiKey }, () => {
          statusMessage.textContent = 'API Key saved!';
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'SET_API_KEY', apiKey });
          });
        });
      }
    });
  });
  
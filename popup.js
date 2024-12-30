document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settings-form');
    const apiKeyInput = document.getElementById('apiKey');
    const modelSelect = document.getElementById('modelSelect');
    const statusMessage = document.getElementById('status-message');
  
    // Load saved settings
    chrome.storage.sync.get(['apiKey', 'model'], (result) => {
      if (result.apiKey) {
        apiKeyInput.value = result.apiKey;
      }
      if (result.model) {
        modelSelect.value = result.model;
      }
    });
  
    // Save settings and send them to content.js
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const apiKey = apiKeyInput.value;
      const model = modelSelect.value;
  
      if (apiKey && model) {
        console.log("event triggered",apiKey);
        localStorage.setItem("geminiapiKey",apiKey);
        chrome.storage.sync.set({ apiKey, model }, () => {
          statusMessage.textContent = 'Settings saved!';
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'SET_SETTINGS', apiKey, model });
          });
        });
      }
    });
  });
  
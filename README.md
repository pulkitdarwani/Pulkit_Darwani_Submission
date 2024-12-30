# AZ AI Helper

## Overview
AZ AI Helper is a Chrome extension designed to assist users in solving problems on the AlgoZenith platform. It injects a custom "AI Chatbot" button into problem pages, allowing users to interact with an AI chatbot for guidance and support.

## Features
- Injects a custom "AI Chatbot" button into problem pages.
- Uses fetch for making HTTP requests to an AI chatbot API (gemini here).
- Monitors URL changes and dynamically updates the page content.
- Handles DOM mutations to ensure the button is always present.
- Allows users to send messages to the AI chatbot by clicking the button or pressing the Enter key.
- Saves and loads chat history for each problem.
- Provides options to clear chat history, to start a new chat with fresh context.
- Provides option to export chat history.
- Provides option to copy initial prompt for using with some other AI (ex: chatgpt);
- Allows users to select the version of AI from popup.
- Allows the users to resize the chatbox smoothly.
- Having Robust Prompt engineering for better user experience.
- Compatible with dark mode.

## Technologies Used
- HTML
- CSS
- JavaScript
- Chrome API

## Tools
- Google Chrome Browser
- IDE or Text Editor of Your Choice

## How It Works
### Mutation Observer
The extension uses a `MutationObserver` to detect changes in the DOM. When changes are detected, it calls the `handlePageChange` function to update the page content dynamically.

### AI Chatbot Button
The `addAIbutton` function injects a custom "AI Chatbot" button into problem pages. When clicked, it opens a chat interface where users can interact with the AI chatbot.

### Chat Interface
The chat interface allows users to send messages to the AI chatbot. It includes features like clearing chat history, exporting chat history, and copying the initial prompt.

### API Integration
The extension uses the `fetch` API to send messages to the AI chatbot API (Gemini). It handles the API response and displays the chatbot's reply in the chat interface.

### Local Storage
The extension saves and loads chat history for each problem using the browser's local storage. It also saves user information and problem details for future use.

### Popup Menu
The extension includes a popup menu that allows users to select the version of AI they want to use. It also provides option to enter the API key for the AI.

### For Developers
1. Clone this project and unzip it.
2. Open Chrome Browser.
3. In a new or blank tab, type in `chrome://extensions/` and press [Enter].
4. At the top right corner of the page, enable "Developer Mode".
5. Click the button that says "Load Unpacked".
6. Navigate to your unzipped project folder, select it, and click OK.
7. You are now ready to start working on the extension! Just make sure you reload after each change to see the updates.

## Usage
1. Navigate to a problem page on the AlgoZenith platform.
2. Look for the "AI Chatbot" button injected into the page.
3. Click the button to open the chat interface.
4. Type your message and press Enter or click the "Send" button to interact with the AI chatbot.
5. Use the "Clear Chat" button to clear the chat history.
6. Use the "Export" button to export the chat history as a JSON file.
7. Use the "Copy Prompt" button to copy the initial prompt to the clipboard.

### Tools
- Google Chrome Browser
- IDE or Text Editor of Your Choice
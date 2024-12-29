const bookmarkImgURL = chrome.runtime.getURL("assets/bookmark.png")
const AZ_PROBLEM_KEY = "AZ_PROBLEM_KEY";

const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
            handlePageChange();
            break;
        }
    }
});

observer.observe(document.body,{childList:true,subtree:true});

addAIbutton();
addInjectScript();

function addInjectScript(){
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.onload = () => script.remove();
    document.documentElement.appendChild(script);
}

let lastPathname =window.location.href;

function onProblemsPage() {
    const pathname = window.location.pathname;
    return pathname.startsWith('/problems/') && pathname.length > '/problems/'.length;
}

function hasUrlChanged() {
    const pathname = window.location.href;
    // console.log("pathname", pathname);
    // console.log("lastPathname", lastPathname);
    const hasChanged = pathname !== lastPathname;
    lastPathname = pathname;
    return hasChanged;
}

function handlePageChange() {
    if(hasUrlChanged()) {
        console.log("URL Changed");
        addInjectScript();
        removeAIbutton();
        addAIbutton();
    }
}


function saveUserId(authToken) {
    fetch('https://api2.maang.in/users/profile/private', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${authToken}` // Assuming the auth token is stored in localStorage
        }
    })
    .then(response => response.json())
    .then(data => {
        let userid = data.data.id;
        localStorage.setItem('userid', userid);
    })
    .catch(error => {
        console.error('Error fetching user profile:', error);
    });
    
}

const problemDataMap = new Map();

window.addEventListener("xhrDataFetched", (event)=>{
    const data = event.detail;
    // console.log(data);
    if(!localStorage.getItem('userid')){
        // send the bearer token from data to saveuserid()
        saveUserId(data.headers.Authorization);
    }
    if(data.url && data.url.match(/https:\/\/api2\.maang\.in\/problems\/user\/\d+/)){
        const idMatch = data.url.match(/\/(\d+)$/);
        if(idMatch){
            const id = idMatch[1];
            const problemData = data.response;
            console.log(`Problem Data for problem id ${id}`, problemData);
            problemDataMap.set(id,problemData);
        }
    }

    // if (data.url && data.url.match(/https:\/\/api2\.maang\.in\/users\/profile\/private/)) {
    //     const userProfileData = data.response;
    //     console.log('User Profile Data:', userProfileData);
    //     localStorage.setItem('userProfileData', JSON.stringify(userProfileData));
    // }
})

function removeAIbutton() {
    const aiChatButton = document.getElementById("ai-chat-button");
    if (aiChatButton) {
        aiChatButton.remove();
    }
    const chatbox = document.getElementById('chatbox');
    if (chatbox) {
        chatbox.remove();
    }
}

function addAIbutton() {
    if (!onProblemsPage() || document.getElementById("ai-chat-button")) return;
    console.log("Adding AI button");

    const aiChatButton = document.createElement('li');
    aiChatButton.id = "ai-chat-button";
    aiChatButton.className = "d-flex flex-row rounded-3 dmsans align-items-center coding_list__V_ZOZ coding_card_mod_unactive__O_IEq";
    aiChatButton.style.padding = "0.36rem 1rem";

    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgIcon.setAttribute("viewBox", "0 0 24 24");
    svgIcon.setAttribute("fill", "none");
    svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgIcon.classList.add("me-1");
    svgIcon.setAttribute("height", "18");
    svgIcon.setAttribute("width", "18");

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M3 5V20.7929C3 21.2383 3.53857 21.4614 3.85355 21.1464L7.70711 17.2929C7.89464 17.1054 8.149 17 8.41421 17H19C20.1046 17 21 16.1046 21 15V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5Z");
    path1.setAttribute("stroke", "#000000");
    path1.setAttribute("stroke-width", "2");
    path1.setAttribute("stroke-linecap", "round");
    path1.setAttribute("stroke-linejoin", "round");

    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M15 12C14.2005 12.6224 13.1502 13 12 13C10.8498 13 9.79952 12.6224 9 12");
    path2.setAttribute("stroke", "#000000");
    path2.setAttribute("stroke-width", "2");
    path2.setAttribute("stroke-linecap", "round");
    path2.setAttribute("stroke-linejoin", "round");

    const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path3.setAttribute("d", "M9 8.01953V8");
    path3.setAttribute("stroke", "#000000");
    path3.setAttribute("stroke-width", "2");
    path3.setAttribute("stroke-linecap", "round");
    path3.setAttribute("stroke-linejoin", "round");

    const path4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path4.setAttribute("d", "M15 8.01953V8");
    path4.setAttribute("stroke", "#000000");
    path4.setAttribute("stroke-width", "2");
    path4.setAttribute("stroke-linecap", "round");
    path4.setAttribute("stroke-linejoin", "round");

    svgIcon.appendChild(path1);
    svgIcon.appendChild(path2);
    svgIcon.appendChild(path3);
    svgIcon.appendChild(path4);
    aiChatButton.appendChild(svgIcon);

    const textNode = document.createTextNode("AI Chatbot");
    aiChatButton.appendChild(textNode);

    const targetUL = document.querySelector(".d-flex.flex-row.p-0.gap-2.justify-content-between.m-0.hide-scrollbar");
    console.log("targetUL", targetUL);
    if (targetUL) {
        targetUL.appendChild(aiChatButton);
    } else {
        console.log("Could not find target UL");
    }

    aiChatButton.addEventListener('click', () => {
        const targetDiv = document.querySelector('.coding_leftside_scroll__CMpky.pb-5');
        if (document.getElementById('chatbox')){
            document.getElementById('chatbox').remove();
            return;}

        const chatbox = document.createElement('div');
        chatbox.id = 'chatbox';
        chatbox.style.border = '1px solid rgb(164, 230, 255)';
        chatbox.style.padding = '10px';
        chatbox.style.marginTop = '10px';
        chatbox.style.backgroundColor = '#fff';
        chatbox.style.fontSize = '16px';
        chatbox.style.fontFamily = 'Source Serif Pro', 'serif';

        const chatArea = document.createElement('div');
        chatArea.id = 'chatArea';
        chatArea.style.height = '250px';
        chatArea.style.overflowY = 'auto';
        chatArea.style.marginBottom = '10px';

        // MutationObserver to watch for new nodes added to the content
        const observer = new MutationObserver(() => {
            console.log("scrolling now.....");
            chatArea.scrollTop = chatArea.scrollHeight;
        });
        
        // Configuration for the MutationObserver to observe child additions
        const config = { childList: true };
        
        // Start observing the content for changes (new child nodes added)
        observer.observe(chatArea, config);

        chatbox.appendChild(chatArea);

        const inputArea = document.createElement('div');
        inputArea.style.display = 'flex';

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.style.flex = '1';
        inputField.style.padding = '5px';
        inputField.style.border = '1px solid #ccc';
        inputField.style.borderRadius = '4px';
        inputField.className = 'ant-input css-19gw05y ant-input-default Input_gradient_dark_input__r0EJI py-2 px-4';
        inputField.placeholder = 'Type your message here...';

        inputArea.appendChild(inputField);

        const sendButton = document.createElement('button');
        sendButton.innerText = 'Send';
        sendButton.style.marginLeft = '5px';
        sendButton.style.padding = '5px 10px';
        sendButton.style.border = 'none';
        sendButton.style.backgroundColor = '#007bff';
        sendButton.style.color = '#fff';
        sendButton.style.borderRadius = '4px';
        sendButton.className = 'ant-btn css-19gw05y ant-btn-default Button_gradient_dark_button__r0EJI py-2 px-4';
            
        inputArea.appendChild(sendButton);

        chatbox.appendChild(inputArea);
        targetDiv.insertAdjacentElement('afterbegin', chatbox);

        inputField.addEventListener('keypress', async (event) => {
            if (event.key === 'Enter') {
                sendButton.click();
            }
        });

        sendButton.addEventListener('click', async () => {
            const userMessage = inputField.value;
            if (!userMessage) return;

            const userMessageDiv = document.createElement('div');
            userMessageDiv.innerText = `You: ${userMessage}`;
            chatArea.appendChild(userMessageDiv);
            inputField.value = '';

            try {
                // const response = await fetch('https://api.gemini.com/v1/chat', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({ prompt: userMessage })
                // });
                // const data = await response.json();
                
                const  response = await sendMessage(userMessage);
                const botMessageDiv = document.createElement('div');
                botMessageDiv.innerText = `Bot: ${response.candidates[0].content.parts[0].text}`;
                chatArea.appendChild(botMessageDiv);
            } catch (error) {
                const errorMessageDiv = document.createElement('div');
                errorMessageDiv.innerText = 'Error: Could not reach the AI bot.';
                chatArea.appendChild(errorMessageDiv);
            }
        });
    });
}

const api_key = "AIzaSyAqVTcis_1GqmcSB9eKOTTvgzOEN3PHJIQ";

// Load chat history from local storage
function loadChat() {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatDiv.innerHTML = '';
    chatHistory.forEach(entry => {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message';
      messageDiv.innerHTML = `<span class="${entry.sender}">${entry.sender === 'user' ? 'You' : 'Bot'}:</span> ${entry.text}`;
      chatDiv.appendChild(messageDiv);
    });
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }
  
  // Save message to local storage
  function saveMessage(sender, text) {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.push({ sender, text });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }

// Send message to the Gemini API
async function sendMessage(prompt) {
    // const userMessage = inputField.value.trim();
    // if (!userMessage) return;
  
    // Display the user's message
    // saveMessage('user', userMessage);
    // loadChat();
    // inputField.value = '';
    
    const apiKey = api_key; // Replace with your actual API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Process the API response as needed

    } catch (error) {
        console.error('Error interacting with the Gemini API:', error);
        throw error;
    }

    // try {
    //   // Replace with your Gemini API URL and API key
    //   const response = await fetch('https://api.gemini.com/v1/chat', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer YOUR_API_KEY'
    //     },
    //     body: JSON.stringify({ message: userMessage })
    //   });
  
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch response from the API');
    //   }
  
    //   const data = await response.json();
    //   const botMessage = data.reply || 'Sorry, I could not understand that.';
  
    //   // Display the bot's message
    //   saveMessage('bot', botMessage);
    //   loadChat();
    // } catch (error) {
    //   saveMessage('bot', 'Error: Unable to connect to the API.');
    //   loadChat();
    // }
  }
  
  function getCurrentProblemId(){
    const idMatch = window.location.pathname.match(/-(\d+)$/);
    console.log("current problem id is ",idMatch);
    return idMatch ? idMatch[1] : null;
  }

  function getProblemDataById(id){
    if( id && problemDataMap.has(id)){
        return problemDataMap.get(id);
    }
    console.log('No data found for problem ID ${id}');
    return null;
  }

  function getLocalStorageValueById(id,lang){
    const userid = localStorage.getItem('userid');
    const key = `course_${userid}_${id}_${lang}`;
    const value = localStorage.getItem(key);

    if(value!=null){
        console.log(`Value for key ${key}: `,value);
    }else{
        console.log(`key ${key} not found in local storage`, key);
    }
    return value;
}

function getBackgroundColor(){
    let bgColor = window.getComputedStyle(document.querySelector('.coding_leftside_scroll__CMpky.pb-5')).backgroundColor;
    console.log(bgColor); // Outputs the computed background color
    return bgColor;
}

const bgButton = document.getElementsByClassName('ant-switch-inner')[0];

bgButton.addEventListener('click',()=>{
    chatbox = document.getElementById('chatbox');
    if(chatbox){
        // chatbox.style.backgroundColor = getBackgroundColor();
        generatePrompt();
    }
});

function getCurrentLanguage() {
    const element = document.getElementsByClassName("d-flex align-items-center gap-1 text-blue-dark")[0];
    return element.textContent;
}

function generatePrompt() {
    let prompt = "";
    const problemId = getCurrentProblemId();
    const currentLanguage = getCurrentLanguage();
    const code = getLocalStorageValueById(problemId, currentLanguage);
    console.log(code);
}


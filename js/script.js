const backendUrl = "https://chatbot-5pbp.onrender.com/api/chat";
let bannedWords = [];

fetch("https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/en")
    .then(response => response.text())
    .then(text => {
        bannedWords = text.split("\n").map(w => w.trim().toLowerCase()).filter(w => w);
    });

function containsBannedWords(message) {
    const lowerMsg = message.toLowerCase();
    return bannedWords.some(word => lowerMsg.includes(word));
}

function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const input = document.getElementById("userInput");
        if (input.value.trim() !== "") {
            sendMessage();
        }
    }
}

function updateCharCount() {
    const input = document.getElementById("userInput");
    const counter = document.getElementById("charCount");
    counter.textContent = `${input.value.length} / 300`;
}

function scrollToBottom() {
    const chat = document.getElementById("chat");
    setTimeout(() => {
        chat.scrollTop = chat.scrollHeight;
    }, 10);
}

function handleChatScroll() {
    const chat = document.getElementById("chat");
    const scrollBtn = document.getElementById("scrollToBottomBtn");
    if (chat.scrollTop + chat.clientHeight < chat.scrollHeight - 100) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
}

async function sendMessage() {
    const input = document.getElementById("userInput");
    const chat = document.getElementById("chat");
    const userMessage = input.value.trim();
    if (!userMessage) return;

    if (containsBannedWords(userMessage)) {
        const warningDiv = document.createElement("div");
        warningDiv.className = "bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 self-center rounded-xl px-4 py-3 max-w-[75%] shadow-md animate-fade-in text-center";
        warningDiv.textContent = "⚠️ Message contains inappropriate language. Please revise.";
        chat.appendChild(warningDiv);
        scrollToBottom();
        return;
    }

    const userDiv = document.createElement("div");
    userDiv.className = "bg-primary text-white self-end rounded-2xl px-4 py-3 max-w-[75%] ml-auto shadow-md animate-fade-in";
    userDiv.textContent = userMessage;
    chat.appendChild(userDiv);
    input.value = "";
    updateCharCount();
    scrollToBottom();

    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        const botMessage = data.reply;

        const botDiv = document.createElement("div");
        botDiv.className = "bg-white dark:bg-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-600 text-gray-800 self-start rounded-2xl px-4 py-3 max-w-[75%] mr-auto shadow-md animate-fade-in";
        botDiv.textContent = botMessage;
        chat.appendChild(botDiv);
        scrollToBottom();
    } catch (err) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-100 self-start rounded-xl px-4 py-3 max-w-[75%] mr-auto shadow-md animate-fade-in";
        errorDiv.textContent = "⚠️ Error connecting to chatbot.";
        chat.appendChild(errorDiv);
        scrollToBottom();
    }
}

function toggleDarkMode() {
    const html = document.documentElement;
    html.classList.toggle("dark");
    const iconPath = document.getElementById("themeIconPath");
    const isDark = html.classList.contains("dark");
    iconPath.setAttribute("d", isDark
        ? "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
        : "M10 2a8 8 0 100 16 8 8 0 000-16zM10 4a6 6 0 110 12 6 6 0 010-12z");
}

window.onload = () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) document.documentElement.classList.add("dark");
    scrollToBottom();
};
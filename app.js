// console.log("Hello World");


const userInput = document.querySelector("#userInput");
const sendBtn = document.querySelector("#sendBtn");
const chatBox = document.querySelector("#chatBox");
const clearChat = document.querySelector("#clearChat")



// enable or disabled btn
userInput.addEventListener('input', ()=>{
  sendBtn.disabled = userInput.value.trim() === "";
});


/* Add Message Function */
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  const time = new Date().toLocaleTimeString();

  messageDiv.innerHTML = `<p>${text}</p> <span class="time">${time}</span>  `;

  chatBox.appendChild(messageDiv);

  // Auto scroll
  chatBox.scrollTop = chatBox.scrollHeight;
}


// send msg

sendBtn.addEventListener("click", async () => {

  const message = userInput.value.trim();
  if(!message) return;

 addMessage(message, "user");

userInput.value = "";
sendBtn.disabled = true;

// Show loading
const loadingDiv = document.createElement("div");
loadingDiv.classList.add("message", "ai");
loadingDiv.innerHTML = "<p>AI is typing...</p>";
chatBox.appendChild(loadingDiv);
chatBox.scrollTop = chatBox.scrollHeight;

// Call AI
const aiReply = await getAIResponse(message);

// Remove loading
loadingDiv.remove();

// Show AI message
addMessage(aiReply, "ai");

});


// Enter support

userInput.addEventListener("keypress" , (e)=> {
  if(e.key === "Enter" && !sendBtn.disabled){
    sendBtn.click();
  }
});


// claer box

clearChat.addEventListener('click' , ()=> {
  chatBox.innerHTML = "";
});



const apiKey = "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";

async function getAIResponse(userMessage) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error(error);
    return "⚠️ AI failed to respond. Try again.";
  }
}



const themeToggle = document.querySelector("#themeToggle");

function setTheme(mode) {
  if (mode === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light Mode";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙 Dark Mode";
  }
  localStorage.setItem("theme", mode);
}

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
});

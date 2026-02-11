const userInput = document.querySelector("#userInput");
const sendBtn = document.querySelector("#sendBtn");
const chatBox = document.querySelector("#chatBox");
const clearChat = document.querySelector("#clearChat");
const themeToggle = document.querySelector("#themeToggle");

userInput.addEventListener("input",()=>{
  sendBtn.disabled = userInput.value.trim()==="";
});

function addMessage(text,sender){
  const div=document.createElement("div");
  div.className=`message ${sender}`;
  const time=new Date().toLocaleTimeString();
  div.innerHTML=`${text}<span class="time">${time}</span>`;
  chatBox.appendChild(div);
  chatBox.scrollTop=chatBox.scrollHeight;
}

sendBtn.addEventListener("click",async()=>{
  const msg=userInput.value.trim();
  if(!msg) return;

  addMessage(msg,"user");
  userInput.value="";
  sendBtn.disabled=true;

  const loading=document.createElement("div");
  loading.className="message ai";
  loading.textContent="AI is typing...";
  chatBox.appendChild(loading);

  const reply=await getAIResponse(msg);
  loading.remove();
  addMessage(reply,"ai");
});

userInput.addEventListener("keypress",e=>{
  if(e.key==="Enter" && !sendBtn.disabled) sendBtn.click();
});

clearChat.addEventListener("click",()=>chatBox.innerHTML="");

/* API */

const apiKey="YOUR_API_KEY";

async function getAIResponse(msg){
 try{
  const res=await fetch("https://openrouter.ai/api/v1/chat/completions",{
   method:"POST",
   headers:{
    Authorization:`Bearer ${apiKey}`,
    "Content-Type":"application/json"
   },
   body:JSON.stringify({
     model:"openai/gpt-3.5-turbo",
     messages:[{role:"user",content:msg}]
   })
  });

  const data=await res.json();
  return data.choices[0].message.content;
 }catch{
  return "⚠️ Error getting response";
 }
}

/* THEME */

function setTheme(mode){
 document.body.classList.toggle("dark",mode==="dark");
 localStorage.setItem("theme",mode);
 themeToggle.textContent = mode==="dark" ? "☀️" : "🌙";
}

setTheme(localStorage.getItem("theme") || "light");

themeToggle.addEventListener("click",()=>{
 setTheme(document.body.classList.contains("dark") ? "light" : "dark");
});

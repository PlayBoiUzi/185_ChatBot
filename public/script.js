const messagesEl = document.getElementById("messages");
const inputEl = document.getElementById("input");
const sendBtn = document.getElementById("send");

const history = [];

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg msg--${type}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

function setLoading(isLoading) {
  sendBtn.disabled = isLoading;
  inputEl.disabled = isLoading;
  if (!isLoading) inputEl.focus();
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  addMessage(text, "user");
  history.push({ role: "user", content: text });
  inputEl.value = "";
  setLoading(true);

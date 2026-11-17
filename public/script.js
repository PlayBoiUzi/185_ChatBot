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

  const typing = addMessage("Sedang mengetik...", "bot");
  typing.classList.add("msg--typing");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    const data = await res.json();
    typing.remove();

    if (!res.ok) throw new Error(data.error || "Terjadi kesalahan.");

    addMessage(data.reply, "bot");
    history.push({ role: "assistant", content: data.reply });
  } catch (err) {
    typing.remove();
    history.pop();
    addMessage(err.message, "error");
  } finally {
    setLoading(false);
  }
}

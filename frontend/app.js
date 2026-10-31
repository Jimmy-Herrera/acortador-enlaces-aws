
const API_URL = "http://98.81.149.232:8000";
const form = document.getElementById("shorten-form");
const urlInput = document.getElementById("url-input");
const submitBtn = document.getElementById("submit-btn");
const errorEl = document.getElementById("error");
const resultEl = document.getElementById("result");
const shortUrlEl = document.getElementById("short-url");
const copyBtn = document.getElementById("copy-btn");
const copyMsg = document.getElementById("copy-msg");

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
  resultEl.hidden = true;
  copyMsg.hidden = true;
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorEl.hidden = true;
  copyMsg.hidden = true;

  const originalUrl = urlInput.value.trim();
  if (!isValidUrl(originalUrl)) {
    showError("La URL no es válida. Debe empezar con http:// o https://");
    return;
  }

  submitBtn.disabled = true;
  try {
    const response = await fetch(`${API_URL}/shorten`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ original_url: originalUrl }),
    });

    if (!response.ok) {
      showError("El servidor rechazó la URL. Revisa que sea válida.");
      return;
    }

    const data = await response.json();
    shortUrlEl.value = data.short_url;
    resultEl.hidden = false;
  } catch (error) {
    showError("No se pudo conectar con el backend. Intenta de nuevo más tarde.");
  } finally {
    submitBtn.disabled = false;
  }
});

copyBtn.addEventListener("click", async () => {
  shortUrlEl.select();
  try {
    await navigator.clipboard.writeText(shortUrlEl.value);
  } catch {
    document.execCommand("copy");
  }
  copyMsg.hidden = false;
});
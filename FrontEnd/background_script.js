// background_script.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PIXEL_INSERTED") {
    console.log("Pixel inserted with ID:", message.id);
    // Optionally log to backend via fetch() if needed
  }
});

chrome.runtime.onMessage.addListener(message => {
  if (message.action === "setCookie" && message.cookie) {
    chrome.cookies.set(
      {
        url: "http://localhost/",
        name: message.cookie.name,
        value: message.cookie.value,
        domain: message.cookie.domain,
        path: message.cookie.path,
        secure: message.cookie.secure
      },
      cookie => {
        if (chrome.runtime.lastError) {
          console.error("Failed to set cookie:", chrome.runtime.lastError);
        } else {
          console.log("Cookie set successfully:", cookie);
        }
      }
    );
  }
});

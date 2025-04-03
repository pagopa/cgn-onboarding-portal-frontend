document.getElementById("button").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async () => {
        try {
          const token = await window.cookieStore.get("pagopa_token");
          if (token) {
            // Send token data to background script to set the cookie
            chrome.runtime.sendMessage({
              action: "setCookie",
              cookie: {
                name: token.name,
                value: token.value,
                domain: "localhost",
                path: "/",
                secure: false
              }
            });

            // Redirect to localhost
            window.location.replace("http://localhost:3000");
          } else {
            console.error("Token not found.");
          }
        } catch (error) {
          console.error("Error retrieving token:", error);
        }
      }
    });
  }
});

document.getElementById("button").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const dialog = window.document.createElement("dialog");
        dialog.innerText = "click here";
        dialog.onclick = async () => {
          const token = await window.cookieStore.get("pagopa_token");
          await navigator.clipboard.writeText(
            `window.cookieStore.set(${JSON.stringify({
              ...token,
              domain: "localhost"
            })}); window.location.reload();`
          );
          window.location.replace("http://localhost:3000");
        };
        window.document.body.appendChild(dialog);
        dialog.showModal();
      }
    });
  }
});

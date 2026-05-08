const PENDING_TRANSFERS_KEY = "pendingOneIdentityTransfers";
const extensionApi = globalThis.chrome ?? globalThis.browser;
let pendingTransfersFallback = {};

function getPendingTransfers(callback) {
  if (!extensionApi?.storage?.local) {
    callback(pendingTransfersFallback);
    return;
  }

  extensionApi.storage.local.get(PENDING_TRANSFERS_KEY, store => {
    const pending = store?.[PENDING_TRANSFERS_KEY] ?? {};
    callback(pending);
  });
}

function setPendingTransfers(pending, callback) {
  if (!extensionApi?.storage?.local) {
    pendingTransfersFallback = pending;
    callback();
    return;
  }

  extensionApi.storage.local.set({ [PENDING_TRANSFERS_KEY]: pending }, callback);
}

function removePendingTransfer(tabId) {
  getPendingTransfers(pending => {
    delete pending[String(tabId)];
    setPendingTransfers(pending, () => {
      if (extensionApi.runtime.lastError) {
        console.error(
          "Failed to clear pending transfer:",
          extensionApi.runtime.lastError.message
        );
      }
    });
  });
}

function injectOneIdentityOnTab(tabId, token) {
  extensionApi.scripting.executeScript(
    {
      target: { tabId },
      func: currentToken => {
        localStorage.setItem("oneidentity", currentToken);
        location.reload();
      },
      args: [token]
    },
    () => {
      if (extensionApi.runtime.lastError) {
        console.error(
          "Failed to inject oneidentity on localhost:",
          extensionApi.runtime.lastError.message
        );
        return;
      }

      removePendingTransfer(tabId);
    }
  );
}

extensionApi.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") {
    return;
  }

  if (!tab?.url?.startsWith("http://localhost:3000")) {
    return;
  }

  getPendingTransfers(pending => {
    const token = pending[String(tabId)];
    if (!token) {
      return;
    }

    injectOneIdentityOnTab(tabId, token);
  });
});

extensionApi.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (
    message.action !== "setOneIdentityOnLocalhost" ||
    typeof message.token !== "string"
  ) {
    return;
  }

  extensionApi.tabs.create({ url: "http://localhost:3000" }, tab => {
    if (extensionApi.runtime.lastError || !tab?.id) {
      sendResponse({
        ok: false,
        error:
          extensionApi.runtime.lastError?.message ?? "Failed to open localhost tab."
      });
      return;
    }

    getPendingTransfers(pending => {
      pending[String(tab.id)] = message.token;
      setPendingTransfers(pending, () => {
        if (extensionApi.runtime.lastError) {
          sendResponse({ ok: false, error: extensionApi.runtime.lastError.message });
          return;
        }

        sendResponse({ ok: true });
      });
    });
  });

  return true;
});

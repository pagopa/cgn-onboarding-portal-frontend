const SAVED_SESSIONS_KEY = "savedOneIdentitySessions";
const LOCAL_FALLBACK_PREFIX = "cgnExtension:";
const extensionApi = globalThis.chrome ?? globalThis.browser;

function readLocalFallback(key) {
  try {
    const rawValue = globalThis.localStorage.getItem(`${LOCAL_FALLBACK_PREFIX}${key}`);
    if (!rawValue) {
      return undefined;
    }

    return JSON.parse(rawValue);
  } catch (error) {
    console.warn("Failed to read popup local fallback storage.", error);
    return undefined;
  }
}

function writeLocalFallback(key, value) {
  try {
    globalThis.localStorage.setItem(`${LOCAL_FALLBACK_PREFIX}${key}`, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to write popup local fallback storage.", error);
  }
}

const sessionNameInput = document.getElementById("sessionName");
const sessionSelect = document.getElementById("sessionSelect");
const saveCurrentButton = document.getElementById("saveCurrentButton");
const sendCurrentButton = document.getElementById("sendCurrentButton");
const sendSelectedButton = document.getElementById("sendSelectedButton");
const deleteSelectedButton = document.getElementById("deleteSelectedButton");
const statusLabel = document.getElementById("status");

function setStatus(message) {
  statusLabel.textContent = message;
}

function getSavedSessions(callback) {
  if (!extensionApi?.storage?.local) {
    callback(readLocalFallback(SAVED_SESSIONS_KEY) ?? {});
    return;
  }

  extensionApi.storage.local.get(SAVED_SESSIONS_KEY, store => {
    const sessions = store?.[SAVED_SESSIONS_KEY] ?? {};
    callback(sessions);
  });
}

function setSavedSessions(sessions, callback) {
  if (!extensionApi?.storage?.local) {
    writeLocalFallback(SAVED_SESSIONS_KEY, sessions);
    callback();
    return;
  }

  extensionApi.storage.local.set({ [SAVED_SESSIONS_KEY]: sessions }, callback);
}

function getCurrentTab(callback) {
  extensionApi.tabs.query({ active: true, currentWindow: true }, tabs => {
    callback(tabs[0]);
  });
}

function readOneIdentityFromTab(tabId, callback) {
  extensionApi.scripting.executeScript(
    {
      target: { tabId },
      func: () => {
        const token = localStorage.getItem("oneidentity");
        if (!token) {
          return { ok: false, error: "oneidentity not found in localStorage." };
        }

        return { ok: true, token };
      }
    },
    callback
  );
}

function withCurrentTabToken(callback) {
  getCurrentTab(tab => {
    if (!tab?.id) {
      setStatus("No active tab found.");
      return;
    }

    readOneIdentityFromTab(tab.id, results => {
      if (extensionApi.runtime.lastError || !results?.[0]?.result) {
        setStatus("Unable to read oneidentity from active tab.");
        return;
      }

      const result = results[0].result;
      if (!result.ok) {
        setStatus(result.error);
        return;
      }

      callback(result.token);
    });
  });
}

function migrateTokenToLocalhost(token) {
  extensionApi.runtime.sendMessage(
    {
      action: "setOneIdentityOnLocalhost",
      token
    },
    response => {
      if (extensionApi.runtime.lastError || !response?.ok) {
        setStatus("Automatic transfer failed.");
        return;
      }

      setStatus("Session sent to localhost.");
    }
  );
}

function refreshSessionSelect(preferredName) {
  getSavedSessions(sessions => {
    const names = Object.keys(sessions).sort((a, b) => a.localeCompare(b));

    sessionSelect.innerHTML = "";

    if (names.length === 0) {
      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "No saved sessions";
      sessionSelect.appendChild(emptyOption);
      sessionSelect.disabled = true;
      sendSelectedButton.disabled = true;
      deleteSelectedButton.disabled = true;
      return;
    }

    names.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      sessionSelect.appendChild(option);
    });

    sessionSelect.disabled = false;
    sendSelectedButton.disabled = false;
    deleteSelectedButton.disabled = false;

    if (preferredName && names.includes(preferredName)) {
      sessionSelect.value = preferredName;
      return;
    }

    sessionSelect.selectedIndex = 0;
  });
}

function saveCurrentSession() {
  const sessionName = sessionNameInput.value.trim();
  if (!sessionName) {
    setStatus("Write a session name first.");
    return;
  }

  withCurrentTabToken(token => {
    getSavedSessions(sessions => {
      sessions[sessionName] = token;
      setSavedSessions(sessions, () => {
        if (extensionApi.runtime.lastError) {
          setStatus("Failed to save session.");
          return;
        }

        setStatus(`Saved session: ${sessionName}`);
        refreshSessionSelect(sessionName);
      });
    });
  });
}

function sendCurrentSession() {
  withCurrentTabToken(token => {
    migrateTokenToLocalhost(token);
  });
}

function sendSelectedSession() {
  const selectedSessionName = sessionSelect.value;
  if (!selectedSessionName) {
    setStatus("No saved session selected.");
    return;
  }

  getSavedSessions(sessions => {
    const token = sessions[selectedSessionName];
    if (!token) {
      setStatus("Selected session is empty.");
      return;
    }

    migrateTokenToLocalhost(token);
  });
}

function deleteSelectedSession() {
  const selectedSessionName = sessionSelect.value;
  if (!selectedSessionName) {
    setStatus("No saved session selected.");
    return;
  }

  getSavedSessions(sessions => {
    if (!sessions[selectedSessionName]) {
      setStatus("Selected session does not exist anymore.");
      refreshSessionSelect();
      return;
    }

    delete sessions[selectedSessionName];
    setSavedSessions(sessions, () => {
      if (extensionApi.runtime.lastError) {
        setStatus("Failed to delete session.");
        return;
      }

      setStatus(`Deleted session: ${selectedSessionName}`);
      refreshSessionSelect();
    });
  });
}

saveCurrentButton.addEventListener("click", saveCurrentSession);
sendCurrentButton.addEventListener("click", sendCurrentSession);
sendSelectedButton.addEventListener("click", sendSelectedSession);
deleteSelectedButton.addEventListener("click", deleteSelectedSession);

if (!extensionApi?.tabs || !extensionApi?.scripting || !extensionApi?.runtime) {
  setStatus("Extension APIs not available in this context.");
  saveCurrentButton.disabled = true;
  sendCurrentButton.disabled = true;
  sendSelectedButton.disabled = true;
  deleteSelectedButton.disabled = true;
}

refreshSessionSelect();

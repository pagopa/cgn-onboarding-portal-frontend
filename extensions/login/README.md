# CGN Session Extension

This extension helps move an authenticated `oneidentity` session from the source environment (for example UAT) to `http://localhost:3000`.

## What it does

- Reads `localStorage.oneidentity` from the active authenticated tab
- Opens `http://localhost:3000`
- Sets `localStorage.oneidentity` on localhost and reloads the page
- Supports multiple named saved sessions (for example `admin`, `user`)

## Install the extension

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this folder: `extensions/login`

If you update extension files, click **Reload** on the extension card.

## Usage

### Quick transfer (current account)

1. Open the authenticated source page (UAT or other environment)
2. Open extension popup
3. Click **Use current on localhost**
4. A localhost tab opens and session is applied automatically

### Save and reuse multiple sessions

1. Log in with first account (example: admin)
2. Open popup, set session name to `admin`, click **Save current session**
3. Log in with second account (example: user)
4. Open popup, set session name to `user`, click **Save current session**
5. To switch account on localhost:
   - Select a name in **Saved sessions**
   - Click **Use selected on localhost**

### Delete a saved session

1. Select the session name
2. Click **Delete selected**

## Troubleshooting

- Ensure app is running on `http://localhost:3000`
- Reload extension after code changes from `chrome://extensions`
- If transfer fails, inspect errors in:
  - popup console
  - background service worker console

## Permissions used

- `activeTab`: read session from current tab
- `scripting`: execute session read/injection scripts
- `tabs`: open localhost tab and listen for tab updates
- `storage`: save named sessions and pending transfers
- `clipboardWrite`: fallback copy flow support

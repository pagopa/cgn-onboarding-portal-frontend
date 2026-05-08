<p align="center">
  <img src="src/assets/images/logo-cgn.png" width="100"/></br>
  <h3 align="center">CGN - Portale esercenti</h3>
</p>

<p align="center">
  <img src="https://img.shields.io/github/contributors-anon/pagopa/cgn-onboarding-portal-frontend" />
  <img src="https://img.shields.io/github/repo-size/pagopa/cgn-onboarding-portal-frontend" />
</p>

- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
    - [NodeJS](#nodejs)
  - [Setup the project](#setup-the-project)
  - [Run the dashboard](#run-the-dashboard)
  - [Login in localhost](#login-in-localhost)
    - [Option 1: Using the Browser Console](#option-1-using-the-browser-console)
    - [Option 2: Using the Browser Extension](#option-2-using-the-browser-extension)
      - [Steps to Use the Extension](#steps-to-use-the-extension)
 

# Getting started

The following sections provide instructions to build and run the app for development purposes.

## Prerequisites

### NodeJS
To run the project you need to install the correct version of NodeJS.
We recommend the use of a virtual environment of your choice. For ease of use, this guide adopts [nodenv](https://github.com/nodenv/nodenv)

The node version used in this project is stored in [.nvmrc](.nvmrc)

## Setup the project
In order to setup the project, we use [yarn](https://yarnpkg.com/) for managing javascript dependencies. 
As stated [previously](#nodejs), we also use `nodenv` for managing the environment:
```bash
# Clone the repository
$ git clone https://github.com/pagopa/cgn-onboarding-portal-frontend

# CD into the repository
$ cd cgn-onboarding-portal-frontend

# Install NodeJS with nodenv, the returned version should match the one in the .nvmrc file
$ nodenv install 

# Install yarn and rehash to install shims
$ npm install -g yarn && nodenv rehash

# Install dependencies 
# Run this only during the first setup and when JS dependencies change
$ yarn install

# Generate the definitions from the OpenAPI specs
# Run this only during the first setup and when specs change
$ yarn generate
```

## Run the dashboard
To run the dashboard, you should start the following code:
```bash
# Start the dashboard on port 3000 and pointing to UAT environment
$ yarn start:uat
```

```bash
# Start the dashboard on port 3000 and pointing to PROD environment
$ yarn start:prod
```

to test minified bundled version of the dashboard use `yarn build:uat-local && yarn preview` or `yarn build:prod-local && yarn preview` depending on which backend you want to point to.

## Login in localhost 
As soon as the dashboard is up and running, you will see a landing page where you should login. Choose what kind of login do you want (login as Operator or login as Admin).
After that you logged in successfully, you will be redirected to UAT environment dashboard. In this case, you need to retrieve the token generated in UAT and put it in the localhost environment. You can do this in two ways:

### Option 1: Using the Browser Console

- Open the browser inspect console and type the following snippet:
```js
const dialog = window.document.createElement("dialog");
dialog.innerText = "click here, then paste in console";
dialog.onclick = async () => {
  const token = localStorage.getItem("oneidentity");
  await navigator.clipboard.writeText(
    `localStorage.setItem("oneidentity", ${JSON.stringify(token)}); location.reload();`
  );
  window.location.replace("http://localhost:3000");
};
window.document.body.appendChild(dialog);
dialog.showModal();
```
- Paste the snippet that was automatically placed in the clipboard in the browser console and press enter.

### Option 2: Using the Browser Extension

To simplify the process, you can use the provided browser extension. The extension reads the `oneidentity` session from the authenticated page and applies it to `http://localhost:3000`.

The extension supports:
- Direct transfer of the current session to localhost
- Multiple saved named sessions (for example `admin` and `user`)
- Reusing a selected saved session on localhost

#### Steps to Use the Extension
1. Install the extension in your browser from the [extensions/login](extensions/login) folder.
2. Navigate to the authenticated environment (for example UAT) and log in.
3. Open the extension popup.
4. Choose one of the following flows:
   - Quick transfer: click `Use current on localhost`
   - Save session for reuse:
     - Type a session name (for example `admin` or `user`)
     - Click `Save current session`
     - Select that session from `Saved sessions`
     - Click `Use selected on localhost`
5. A localhost tab opens and the extension injects `localStorage.setItem("oneidentity", token)` and reloads the page.

#### Manage multiple sessions
- Save one session as `admin`
- Log in with another account and save as `user`
- Switch between them from the popup `Saved sessions` selector
- Use `Delete selected` to remove old sessions

#### Troubleshooting
- If the popup or background script changed, reload the unpacked extension from `chrome://extensions`
- Ensure localhost is running on `http://localhost:3000`
- If transfer fails, open extension logs from `chrome://extensions` and check popup/background console errors

This eliminates the need to manually execute the JavaScript snippet in the browser console.
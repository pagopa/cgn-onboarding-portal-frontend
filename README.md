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
    - [Option 2: Pressing a button](#option-2-pressing-a-button)
    - [Option 3: Using the Browser Extension](#option-3-using-the-browser-extension)
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

## Login in localhost 
As soon as the dashboard is up and running, you will see a landing page where you should login. Choose what kind of login do you want (login as Operator or login as Admin).
After that you logged in successfully, you will be redirected to UAT environment dashboard. In this case, you need to retrieve the token generated in UAT and put it in the localhost environment. You can do this in three ways:

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

### Option 2: Pressing a button

Visiting `https://portal.cgnonboardingportal-uat.pagopa.it/`, in the top right corner there is a dropdown containing the button `authenticate on localhost`

### Option 3: Using the Browser Extension

To simplify the process, you can use the provided browser extension. This extension automates the retrieval of the token from the UAT environment and applies it to the localhost environment.

#### Steps to Use the Extension
1. Install the extension in your browser. You can find the extension in the [extensions/login](extensions/login) folder.
2. Navigate to the UAT environment dashboard and log in.
3. Open the extension and click the "Retrieve CGN token" button.
4. The extension will automatically copy the token and apply it to the localhost environment.

This eliminates the need to manually execute the JavaScript snippet in the browser console.
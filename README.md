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
In order to run the dashboard, you should start the following code:
```bash
# Start the dashboard on port 3000 and pointing to UAT environment
$ yarn start:uat
```

## Login in localhost 
As soon as the dashboard is up and running, you will see a landing page where you should login. Choose what kind of login do you want (login as Operator or login as Admin).
After that you logged in successfully, you will be redirected to UAT environemnt dashboard, so in this case you need to retrieve the token generated in UAT and put it in localhost env, to do so you have to:
- Open the browser inspect console and type the following snippet:
```js
const dialog = window.document.createElement("dialog");
dialog.innerText = "click here";
dialog.onclick = async () => {
  const token = await window.cookieStore.get("pagopa_token");
  await navigator.clipboard.writeText(
    `window.cookieStore.set(${JSON.stringify({
      ...token,
      domain: "localhost",
    })}); window.location.reload();`
  );
  window.location.replace("http://localhost:3000");
};
window.document.body.appendChild(dialog);
dialog.showModal();
```
- Paste the snippet that was automatically placed in the clipboard in the browser console and press enter;

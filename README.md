# Zendesk Coding Challenge
## Name: Tarun Kukreja
## Email: tkukreja@horizon.csueastbay.edu

## Installation

1. Clone the repository in your system
2. Open command line and Navigate to the directory in which you cloned the repository
3. Do 
```
cd zendesk-coding-challenge/
```
3. Type the following
``` 
npm install
```
4. Within the current directory please create a .env file
5. In the env file type the following:

```
USERNAME = {username provided in the email}
PASSWORD = {password provided in the email}

```

Then run the following command to run the CLI app

```
node app.js

```

5. Once you have intercated with the app, you can run the following command to run the unit tests

```
npm test

```


# Design suggestions

The code currently works for my account but we can get the user input for a different sub domain and the credentials for the account, and authenticate the credentials for that subdomain

While using pagination the limit is currently 25 tickets per page but we could customise this by asking the user of how many tickets do they want to view or we can ask the user for the range of ticket numbers they would like to view

I wasn't able to find an API for verifying the Agent's credentials for creating unit test. Like, I thought of creating a test for checking whether the Agent is valid for the account or not. Maybe we can create one.







PS: I wanted to write comments but wasn't able to complete them. Moreover, the first commit which you see is of STSC that's because I am using my university laptop and by default it picked up the username from the system 



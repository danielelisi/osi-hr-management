# Osi Maritime Systems Ltd. - Professional Development Plan

## Requirements

 - Node.js
 
### Install dependencies
`cd` into the project folder and run `npm install`.

### Set up Environment Variables
For security purpose, all sensitive data such as db username, db password, and api keys, has to be stored in a file called `.env` and placed in the root directory of the project.

Create a file named `.env` and add each of these variables on a new line.\
```
AD_USERNAME=\
AD_PASSWORD=\
DB_SERVER_URL=\
DB_USER=\
DB_PASS=\
API_KEY=\
APP_SECRET=\
PORT=\
ENV_MACHINE=
```

## Start the server
Once installed the dependencies and set the environment variables, run the command `npm start` from the project root directory to start the server.
 
Now you can access the app though localhost:port (ie - http://localhost:9000)

## Development Notes

#### How to create a database request
To create new db requests in the code initialize a request with:
  1. `let dbRequest = new sql.Request(sql.globalConnection);`  
`let` is used for function scope variables. It allows the request to automatically close once the function is completed
  2. Now you can issue a new statement with `dbRequest.query()`
  3. For more information on how to use the `mssql` module, check the docs [here](https://www.npmjs.com/package/mssql)

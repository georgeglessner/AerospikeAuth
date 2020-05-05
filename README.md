# Aerospike Auth Service

The Aerospike Auth  service is a middleware function that authenticates a request based on key sent as a `Bearer` token.

If using solely as enpoint auth, this service just checks to make sure the key sent is a valid key. 

If using as user auth, this service will check for a valid key and send back the bins in JSON format upon finding a valid key. 

You will need to configure the hosts array to include your server address(es), as well as the namespace and set of the database. 

## Usage in Application

- Install the package
	- If using Windows you must install the build tools using `npm install windows-build-tools --global --vs2015` and you must also run `Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope Process` in PowerShell before you try to install this package to lift the restrictions.
	- If using Ubuntu run `sudo apt-get install g++ libssl1.0.0 libssl-dev libz-dev` before proceeding.
	- For other OS implementations, visit the [prerequisites](https://github.com/aerospike/aerospike-client-nodejs#Prerequisites) listing. 

- Require Aerospike Auth

`const authServer = require('aerospikeauth');`

### Just Endpoint Authentication

- Apply the authentication middleware to your app as a whole

`app.use(authServer.authenticate);`

- Or apply it to individual endpoints

`app.use("/endpoint", authServer.authenticate, endpointFunction);`

### User Authentication 

- Apply the authentication middleware to your app as a whole

`app.use(authServer.authenticateUser);`

- Or apply it to individual endpoints

`app.use("/endpoint", authServer.authenticateUser, endpointFunction);`

The user info will be stored in `req.user`. 
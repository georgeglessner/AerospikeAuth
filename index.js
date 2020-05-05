const Aerospike = require("aerospike");

// Setup Aerospike
const namespace = "namespace";
const set = "set";

let config = {
	hosts: [
		{ addr: "hostAddress", port: 3000 },
		{ addr: "hostAddress2", port: 3000 },
	],
	log: {
		level: Aerospike.log.ERROR,
		file: 2, // log to console
	},
	policies: {
		read: new Aerospike.ReadPolicy({ totalTimeout: 3000 }),
	},
};

// Initialize with config
const client = Aerospike.client(config);

/*
	Check Aerospike for valid session
 */
function authenticate(req, res, next) {
	if (req.headers && req.headers.authorization) {
		var parts = req.headers.authorization.split(" ");
		if (parts.length == 2) {
			// Setup
			const sessionID = parts[1];
			const key = new Aerospike.Key(namespace, set, sessionID);

			if (client.connected) {
				// Already connected
				client.exists(key, function(error, record) {
					record ? next() : res.status(401).send("Unauthorized");
				});
			} else {
				// Connect to client and check key
				client
					.connect()
					.then((client) => {
						client.exists(key, function(error, record) {
							record
								? next()
								: res.status(401).send("Unauthorized");
						});
					})
					.catch((error) => {
						res.status(500).send({ error: error });
					});
			}
		} else {
			res.status(400).send("Improper authorization request sent");
		}
	} else {
		res.status(401).send("Unauthorized");
	}
}

/*
	Check for valid session, send user info back in the response
 */
function authenticateUser(req, res, next) {
	if (req.headers && req.headers.authorization) {
		var parts = req.headers.authorization.split(" ");
		if (parts.length == 2) {
			// Setup
			const sessionID = parts[1];
			const key = new Aerospike.Key(namespace, set, sessionID);

			if (client.connected) {
				// Already connected
				client.get(key, function(error, record) {
					record.bins
						? ((req.user = JSON.parse(record.bins["json"])), next())
						: res.status(401).send("Unauthorized");
				});
			} else {
				// Connect to client and check key
				client
					.connect()
					.then((client) => {
						client.get(key, function(error, record) {
							record.bins
								? ((req.user = JSON.parse(record.bins["json"])),
								  next())
								: res.status(401).send("Unauthorized");
						});
					})
					.catch((error) => {
						res.status(500).send({ error: error.message });
					});
			}
		} else {
			res.status(400).send("Improper authorization request sent");
		}
	} else {
		res.status(401).send("Unauthorized");
	}
}

exports.authenticate = authenticate;
exports.authenticateUser = authenticateUser;

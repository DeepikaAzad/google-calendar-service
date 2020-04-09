//Express
const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./model/index");

const errorHandlerMiddleware = require("./middleware/errorHandler.middleware");

const router = require("./route/api");
app.use(express.static(__dirname + "/public"))

app.use(
	session({
		name: 'sid',
		saveUninitialized: false,
		resave: false,
		secret: 'sssh, quiet! it\'s a secret!',
		cookie: {
			maxAge: 60000 * 30,
			sameSite: true
		}
	})
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use("/", router);

app.get("/", (req, res) => {
	res.send("Service is running...");
});

const port = process.env.PORT_NO || 3100;

// Error Handling Middleware
app.use(errorHandlerMiddleware.errorHandler);

app.listen(port);
console.log(`Server is started on port ${port}...`);
const express = require('express');
const config = require('./src/config/index');
const dbConnection = require('./src/config/dbconfig');
const app = express();

//connect to database
dbConnection();

const PORT = config.PORT;

app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});

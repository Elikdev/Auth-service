const express = require('express');
const config = require('./src/configs/index');
const cors = require('cors');
const morgan = require('morgan');
const dbConnection = require('./src/configs/dbconfig');
const authRoutes = require('./src/routes/auth.routes');
const {accessToAuthService, userToken} = require('./src/middlewares/midleware');

const app = express();

//connect to database
dbConnection();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get('/api/v1', (req, res) => {
	res.status(200).json({
		message: 'Welcome to this authentication microservice',
	});
});

app.use(accessToAuthService);
app.use(userToken);

app.use('/api/v1/auth/', authRoutes);

const PORT = config.PORT;

app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});

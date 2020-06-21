# Authentication Microservice

# General Setup

To get the microservice running locally:

- Clone this Repository

- Navigate to the directory with `cd auth-service`

- Run `npm install` to install all the dependencies

- Install the mongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) run it by executing `mongod`

- Create a new `.env` file and set your variables based on the `.env-example` file

- `npm run devStart` to start the server locally

To run the microservice as a container with docker

- Clone this Repository

- Navigate to the directory with `cd auth-service`

- Create a new `.env` file and set your variables based on the `.env-example` file

- NOTE: `MONGOURI=mongodb://mongo:27017/auth-db`

- Run `docker-compose up` and voila! All set up.

# Documentation

View the API documentation on postman ([here](https://documenter.getpostman.com/view/9087902/Szzn7wix)) 

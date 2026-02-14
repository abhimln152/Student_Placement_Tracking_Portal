//import all required packages 
const mongoose = require('mongoose');

//sets up the mongodb cloud url
const MongoURL = process.env.MONGO_URL;

//connect to app to mongodb
const connectDB = async () => {
    try {
        await mongoose.connect(MongoURL);
        console.log('DB Connected Successfully');
    } catch (err) {
        console.error('Connection Error in Mongodb', err);
        process.exit(1);
    }
};

module.exports = connectDB;

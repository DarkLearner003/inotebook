const mongoose = require("mongoose");
const mongoURI = "mongodb://0.0.0.0:27017/inotebook"

const connectToMongo= async()=> {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected');
    } catch (error) {
        console.error('Connection error:', error);
    }
}

module.exports = connectToMongo; 

const mongoose = require('mongoose');

//set uri in env
const uri = process.env.MONGO_URI;

// SCHEMAS (SESSION, CUSTOMER, PRODUCT)
const sessionSchema = new mongoose.Schema({
    shopifyUserId: String,
    sessionToken: String,
    // Add other session data fields as needed
});
const Session = mongoose.model('Session', sessionSchema);

async function storeSessionData(sessionData) {
    try {
        // Create a new Session document
        const newSession = new Session(sessionData);

        // Save the new session to the database
        await newSession.save();
        console.log('Session data stored successfully.');
    } catch (err) {
        console.error('Error storing session data:', err);
    }
}

async function connectToDB() {
    try {
        // Connect to MongoDB
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

// Handle MongoDB connection errors
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', () => {
            console.log('Connected to MongoDB');
        });
    } catch (err) {
        console.error(err);
    }
}



module.exports = {
    storeSessionData,
    connectToDB
};

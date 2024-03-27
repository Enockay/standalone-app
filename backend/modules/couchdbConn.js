// Import the nano library
const nano = require("nano");

// Define the URL to your CouchDB instance
const url = "http://medic:password@localhost:5984";

// Create a Nano instance with the URL
const nanoInstance = nano(url);

// Function to connect to CouchDB and fetch up to 200 documents with their IDs
const fetchDocuments = async () => {
    try {
        // Specify the name of the database (table) you want to access
        const dbName = "medic";
        // Use the specified database
        const db = nanoInstance.db.use(dbName);
        console.log("Connected successfully to database:", dbName);

        // Fetch up to 200 documents with their IDs
        const response = await new Promise((resolve, reject) => {
            db.list({ include_docs: true, limit: 200 }, (err, body) => {
                if (err) {
                    console.error("Error fetching documents:", err);
                    reject(err);
                } else {
                    resolve(body.rows.map(row => ({ id: row.id, data: row.doc })));
                }
            });
        });

        return response;
    } catch (error) {
        // Handle any errors that occur during connection or data fetching
        console.error("Error:", error);
        throw error; // Propagate the error to the caller
    }
};

module.exports = fetchDocuments;

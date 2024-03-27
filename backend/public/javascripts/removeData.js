const nano = require('nano')('http://medic:password@localhost:5984'); // Assuming CouchDB is running locally
const db = nano.db.use('medic');

// Function to fetch documents in batches from the database
async function fetchDocumentsInBatches(batchSize) {
    try {
        const allDocuments = [];
        let start = 0;
        let end = batchSize;
        while (true) {
            const response = await db.list({ include_docs: true, limit: batchSize, skip: start });
            const documents = response.rows.map(row => row.doc);
            allDocuments.push(...documents);
            if (documents.length < batchSize) break; // Reached the end of documents
            start += batchSize;
            end += batchSize;
        }
        return allDocuments;
    } catch (error) {
        throw new Error(`Error fetching documents: ${error}`);
    }
}

// Function to delete duplicate documents based on sha256 key and update the database
async function removeDuplicatesAndUpdateDB() {
    try {
        const batchSize = 1000; // Adjust the batch size as needed
        let totalDuplicatesRemoved = 0;

        while (true) {
            // Fetch documents in batches
            const documents = await fetchDocumentsInBatches(batchSize);

            // Break if no more documents
            if (documents.length === 0) break;

            const uniqueDocuments = {};

            // Iterate through the documents and identify duplicates
            documents.forEach(document => {
                if (hasSha256Key(document)) {
                    const sha256Key = document.sha256;
                    if (!uniqueDocuments[sha256Key]) {
                        uniqueDocuments[sha256Key] = document;
                    } else {
                        totalDuplicatesRemoved++; // Increment duplicates count
                    }
                }
            });

            // Remove all documents from the database
            await db.bulk({ docs: documents.map(doc => ({ ...doc, _deleted: true })) });

            // Re-insert unique documents into the database
            const uniqueDocsArray = Object.values(uniqueDocuments);
            await db.bulk({ docs: uniqueDocsArray });
        }

        console.log(`Total duplicates removed: ${totalDuplicatesRemoved}`);
        console.log('Database updated successfully.');
    } catch (error) {
        console.error(`Error removing duplicates and updating database: ${error}`);
    }
}

function hasSha256Key(document) {
    // Check if document has sha256 key
    return document && document.sha256;
}


module.exports = removeDuplicatesAndUpdateDB; // Export the removeDuplicatesAndUpdateDB function

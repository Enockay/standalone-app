const fs = require('fs');
const axios = require('axios');

// Function to read the contents of a directory
async function readDirectory(directoryPath) {
    try {
        return await fs.promises.readdir(directoryPath);
    } catch (error) {
        console.error('Error reading directory:', error);
        throw error;
    }
}

// Function to read the content of a file
async function readFile(filePath) {
    try {
        return await fs.promises.readFile(filePath, 'utf8');
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

// Function to send documents to CouchDB using the Bulk Document API
async function sendDocumentsToCouchDB(documents) {
    try {
        const response = await axios.post('http://localhost:5984/test-data/_bulk_docs', { docs: documents }, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Documents sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending documents to CouchDB:', error);
        throw error;
    }
}

// Main function to read folder contents, create documents, and send them to CouchDB
async function main() {
    const folderPath = '/path/to/your/folder';
    const fileNames = await readDirectory(folderPath);

    // Array to store documents
    const documents = [];

    // Read each file and create a document for it
    for (const fileName of fileNames) {
        const filePath = `${folderPath}/${fileName}`;
        const fileContent = await readFile(filePath);

        // Create document with file content
        const document = {
            _id: fileName, // Use file name as document ID
            content: fileContent // Use file content as document content
        };

        documents.push(document);
    }

    // Send documents to CouchDB
    await sendDocumentsToCouchDB(documents);
}

// Call main function
main().catch(error => console.error('An error occurred:', error));

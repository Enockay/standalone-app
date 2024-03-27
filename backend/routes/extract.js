const fetchDocuments = require("../modules/couchdbConn");
const express = require("express");
const verifyDocument = require("../public/javascripts/dataVerify");
const updateDocuments = require("../public/javascripts/updateVerifiedData"); // Import the function to update documents in CouchDB
const removeDuplicateFlags = require("../public/javascripts/removeDuplicate")
const removeDuplicatesAndUpdateDB = require("../public/javascripts/removeData")
const fetchData = express.Router();

fetchData.get("/", (req, res) => {
   // removeDuplicatesAndUpdateDB();
    fetchDocuments()
        .then(documents => {
            // Filter out documents with the sha256 key
            const documentsWithSha256 = documents.filter(document => hasSha256Key(document));

            // Verify the documents and flag them accordingly
           // const verifiedData = documentsWithSha256.map(document => verifyAndFlag(document));

            // Update the CouchDB with the modified documents
           /* updateDocuments(verifiedData)
                .then(() => {
                      removeDuplicateFlags(verifiedData)
                    // Send the array of verified documents in response
                   
                })
                
                .catch(error => {
                    console.error("Error updating documents:", error);
                    res.status(500).json({ error: "Internal Server Error" }); // Send error response with status code 500
                });*/
                res.json(documentsWithSha256);   
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            res.status(500).json({ error: "Internal Server Error" }); // Send error response with status code 500
        });
});

function hasSha256Key(document) {
    // Convert the document to a string to perform search
    const documentString = JSON.stringify(document);

    // Search for the sha256 key recursively
    return documentString.includes('"sha256"');
}

function verifyAndFlag(document) {
    // Verify the document using the verifyDocument function
    const verifiedDocument = verifyDocument(document);

    // Check if the document is already flagged
    if (document.flag === 1) {
        // Document is already flagged, so do not flag again
        if (verifiedDocument.verified) {
            // If the document is verified, update verified field to true
            document.verified = true;
        }
        return document; // Return the document without modifying the flag
    }

    // Flag the document based on verification status
    if (verifiedDocument.verified) {
        document.flag = 1; // 1 for verified
        document.verified = true; // Set verified to true
    } else {
        document.flag = 0; // 0 for not verified
    }

    return document;
}

module.exports = fetchData;

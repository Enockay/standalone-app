const crypto = require("crypto");

function verifyDocument(document) {
    // Calculate the SHA-256 hash of the document data
    const calculatedHash = calculateSHA256(JSON.stringify(document));

    // Compare the calculated hash with the stored hash value
    if (calculatedHash === document.sha256) {
        document.verified = true; // Mark the document as verified
    } else {
        document.verified = false; // Mark the document as not verified
    }

    return document;
}

function calculateSHA256(data) {
    // Create a SHA-256 hash object
    const hash = crypto.createHash("sha256");

    // Update the hash object with the data
    hash.update(data);

    // Calculate the digest (hash) in hexadecimal format
    return hash.digest("hex");
}

module.exports = verifyDocument
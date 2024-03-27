function removeDuplicateFlags(documents) {
    const flagCountMap = {}; // Map to store the count of flags for each document

    // Count the number of times each document's flag appears
    documents.forEach(document => {
        const flagKey = `${document._id}_${document._rev}`; // Using _id and _rev as a unique key for each document
        if (flagKey in flagCountMap) {
            flagCountMap[flagKey]++;
        } else {
            flagCountMap[flagKey] = 1;
        }
    });

    // Remove the flag and set verified to true if they appear twice
    documents.forEach(document => {
        const flagKey = `${document._id}_${document._rev}`; // Using _id and _rev as a unique key for each document
        if (flagCountMap[flagKey] === 2) {
            delete document.flag; // Remove the flag
            document.verified = true; // Set verified to true
        }
    });

    return documents;
}

module.exports = removeDuplicateFlags

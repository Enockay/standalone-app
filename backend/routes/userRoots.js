const express = require('express');
const router = express.Router();
const fetchData = require('./extract'); // Assuming fetchData module exports a function to fetch and verify data

// Middleware to check user access level
function checkAccessLevel(req, res, next) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "Unauthorized no user specified" }); // No user, so unauthorized
    }
    if (user.accessLevel === "user1" || user.accessLevel === "user2" || user.accessLevel === "user3") {
        // Implement access level logic for user1, user2, user3
        req.userAccessLevel = user.accessLevel;
        next();
    } else {
        return res.status(403).json({ error: "Forbidden" }); // User's access level is not recognized
    }
}

// Route accessible to user1
router.get("/user1-route", async (req, res) => {
    try {
        const verifiedData = await fetchData(); // Fetch and verify data
        const dataForUser1 = extractDataForUser1(verifiedData); // Extract data for user1
        res.json({ message: "User1 route accessed", data: dataForUser1 });
    } catch (error) {
        console.error("Error fetching or processing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route accessible to user2
router.get("/user2-route", async (req, res) => {
    try {
        const verifiedData = await fetchData(); // Fetch and verify data
        const dataForUser2 = extractDataForUser2(verifiedData); // Extract data for user2
        res.json({ message: "User2 route accessed", data: dataForUser2 });
    } catch (error) {
        console.error("Error fetching or processing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route accessible to user3
router.get("/user3-route", async (req, res) => {
    try {
        const verifiedData = await fetchData(); // Fetch and verify data
        const dataForUser3 = extractDataForUser3(verifiedData); // Extract data for user3
        res.json({ message: "User3 route accessed", data: dataForUser3 });
    } catch (error) {
        console.error("Error fetching or processing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Function to extract data for user1
function extractDataForUser1(data) {
    // User1 has access to the entire data
    return data;
}

// Function to extract data for user2
function extractDataForUser2(data) {
    // User2 has minimal access, so only certain fields are included
    const { name, short_name, phone, sex, role } = data;
    return { name, short_name, phone, sex, role };
}

// Function to extract data for user3
function extractDataForUser3(data) {
    // User3 has no access, so return an empty object
    return {};
}

module.exports = router;

// server.js
const express = require('express');
const cors = require('cors');
const dbConfig = require('./db.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Import and use authentication routes
const authRoutes = require('./auth.js');
app.use('/api/auth', authRoutes);

// API endpoint to handle campaign creation and file upload
app.post('/api/save_campaign', async (req, res) => {
    console.log("BODY RECEIVED:", req.body);
    const { campaign_name, email_template, target_group } = req.body;

    if (!campaign_name || !email_template || !target_group) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Save campaign info and file path to MySQL
    try {
        const sql = `
            INSERT INTO campaigns (name, template_type, target_group, created_at)
            VALUES (?, ?, ?, NOW())
        `;
        await dbConfig.execute(sql, [
            campaign_name,
            email_template,
            target_group,
        ]);
        res.json({ message: "Campaign saved successfully" });
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Fetch campaign reports
app.get('/api/reports', async (req, res) => {
    try {
        const sql = `
            SELECT 
                name AS campaign_name,
                template_type AS email_template,
                target_group,
                created_at AS sent_date
            FROM campaigns
            ORDER BY created_at DESC
        `;

        const [rows] = await dbConfig.execute(sql);
        res.json(rows);
    } catch (err) {
        console.error("Report fetch error:", err);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
});


app.listen(5000, () => console.log('Server running on port 5000'));
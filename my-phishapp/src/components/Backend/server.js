// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const xlsx = require('xlsx');
const dbConfig = require('./db.js');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer setup for file uploads
const upload = multer({ dest: uploadsDir });

// Import and use authentication routes
const authRoutes = require('./auth.js');
app.use('/api/auth', authRoutes);

// Count emails in Excel
function countEmailsInExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    let emailCount = 0;
    data.flat().forEach(cell => {
        if (typeof cell === 'string' && cell.match(/^[\w.-]+@[\w.-]+\.\w+$/)) {
            emailCount++;
        }
    });
    return emailCount;
}

// Count emails in PDF
async function countEmailsInPDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;
    const emails = text.match(/[\w.-]+@[\w.-]+\.\w+/g);
    return emails ? emails.length : 0;
}

// API endpoint to handle campaign creation and file upload
app.post('/api/save_campaign', upload.single('file'), async (req, res) => {
    const { campaign_name, email_template, target_group } = req.body;
    const file = req.file;

    if (!campaign_name || !email_template || !target_group || !file) {
        return res.status(400).json({ message: "All fields and file are required" });
    }

    // Read file content and count emails
    let fileContent = '';
    let emailCount = 0;
    let ext = '';
    try {
        ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(file.path);
            const pdfData = await pdfParse(dataBuffer);
            fileContent = pdfData.text;
            emailCount = await countEmailsInPDF(file.path);
        } else if (ext === '.xls' || ext === '.xlsx') {
            const workbook = xlsx.readFile(file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            fileContent = xlsx.utils.sheet_to_json(sheet, { header: 1 });
            emailCount = countEmailsInExcel(file.path);
        } else {
            emailCount = Number(req.body.number_of_emails) || 0;
        }
    } catch (err) {
        console.error("File read error:", err);
    }

    // Save campaign info and file path to MySQL
    try {
        const sql = `
            INSERT INTO campaigns (name, template_type, target_group, created_at, pdf_path)
            VALUES (?, ?, ?, NOW(), ?)
        `;
        await dbConfig.execute(sql, [
            campaign_name,
            email_template,
            target_group,
            file.path
        ]);
        res.json({ message: "Campaign saved successfully", emailCount });
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Serve uploaded files if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(5000, () => console.log('Server running on port 5000'));
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emailTemplate = (req, res) => {
    const filePath = path.join(__dirname, 'mail.html');
    try {
        const html = fs.readFileSync(filePath, 'utf-8');
        res.set('Content-Type', 'text/html');
        res.send(html);
    } catch (err) {
        console.error('❌ Failed to read mail.html:', err);
        res.status(500).send('Error loading email template');
    }
};

export default emailTemplate;

import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const htmlTemplate = fs.readFileSync(path.join(__dirname, './api/mail.html'), 'utf-8');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
    logger: true,
    debug: true
});

const sendEmails = async (req, res) => {
    try {
        let { collectionName, campaign } = req.body;
        if (!collectionName || !campaign) {
            return res.status(400).send('❌ Collection name and campaign are required.');
        }

        // Sanitize collectionName and campaign
        collectionName = collectionName.replace(/[{}]/g, '').trim().toLowerCase();
        campaign = campaign.replace(/[{}]/g, '').trim();

        const emailSchema = new mongoose.Schema({
            email: { type: String, required: true },
            sent: { type: Boolean, default: false },
            clicked: { type: Boolean, default: false },
            timestamp: { type: Date, default: Date.now },
            campaign: { type: String },
            quizMarks: { type: Number }
        });

        const EmailModel = mongoose.models[collectionName] || mongoose.model(collectionName, emailSchema);

        const emailDocs = await EmailModel.find({}, { email: 1 });
        if (!emailDocs.length) {
            return res.status(400).send(`❌ No emails found in '${collectionName}' collection.`);
        }

        const sendPromises = emailDocs.map(doc => {
            const sanitizedEmail = encodeURIComponent(doc.email.trim().toLowerCase());
            const sanitizedCampaign = encodeURIComponent(campaign);

            const personalizedHtml = htmlTemplate
                .replace(/{{\s*email\s*}}/g, sanitizedEmail)
                .replace(/{{\s*campaign\s*}}/g, sanitizedCampaign);

            return transporter.sendMail({
                from: `"Support" <${process.env.SMTP_USER}>`,
                to: doc.email,
                subject: `📦 Amazon Order Confirmation - ${campaign}`,
                html: personalizedHtml
            }).then(() => {
                console.log(`✅ Sent to ${doc.email}`);
                return EmailModel.updateOne({ email: doc.email }, { sent: true, campaign });
            }).catch(err => {
                console.error(`❌ Failed to send to ${doc.email}:`, err.message);
            });
        });

        await Promise.all(sendPromises);
        res.send(`✅ Emails processed for '${collectionName}' collection under campaign '${campaign}'.`);

    } catch (err) {
        console.error('❌ Error in sendEmails():', err.message);
        res.status(500).send('Failed to send emails.');
    }
};

export default sendEmails;

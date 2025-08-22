import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import emailClicked from './api/clicked.js';
import getcreds from './api/getcreds.js';
import sendEmails from './api/sendEmail.js';
import emailLogs from './api/emailLogs.js';
import clearData from './api/cleardata.js';
import emailTemplate from './api/emailtemplate.js';
import uploadEmails from './api/Campaign/Createcampaign.js';
import campaignsRouter from "./api/Campaign/GetCampaign.js"; 
import getemails from './api/Campaign/getEmails.js'

import connectDB from './db.js';
import multer from 'multer';

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
    origin: ['http://10.100.75.206:5173'],
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/pages', express.static(path.join(path.resolve(), 'pages')));
app.use(express.static(path.join(path.resolve(), 'public')));


app.post('/api/sendEmails', sendEmails);
app.get('/api/emailClicked', emailClicked);
app.post('/api/creds_submit', getcreds);
app.get('/api/emailLogs', emailLogs.getEmailLogs);
app.post('/api/emailLogs', emailLogs.postEmailLog);
app.delete('/api/cleardata', clearData);
app.get('/api/email-template', emailTemplate);

app.post("/api/upload-emails", upload.single("file"), uploadEmails);
app.use("/api/campaigns", campaignsRouter);
app.use("/api/getEmails", getemails);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    connectDB();
});

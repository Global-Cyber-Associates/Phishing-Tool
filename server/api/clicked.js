import path from 'path';
import getEmailModel from '../models/emailLog.js';

const __dirname = path.resolve();

const emailClicked = async (req, res) => {
  try {
    const rawEmail = req.query.email;
    const rawCampaign = req.query.campaign;

    if (!rawEmail || !rawCampaign) return res.status(400).send('Missing email or campaign param.');

    const email = decodeURIComponent(rawEmail).trim().toLowerCase();
    const campaign = rawCampaign.replace(/[{}]/g, '').trim().toLowerCase();

    const EmailLogModel = getEmailModel(campaign);

    let latestLog = await EmailLogModel.findOne({ email }).sort({ timestamp: -1 });

    if (latestLog) {
      latestLog.clicked = true;
      await latestLog.save();
    } else {
      latestLog = new EmailLogModel({ email, sent: true, clicked: true });
      await latestLog.save();
    }

    res.sendFile(path.join(__dirname, 'public', 'login.html'));

  } catch (err) {
    console.error('Error in emailClicked:', err);
    res.status(500).send('Server error');
  }
};

export default emailClicked;

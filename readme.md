# 🎯 Phishing Awareness Campaign Tool (MERN)

> A full-stack phishing simulation and awareness training platform built with the **MERN stack**.  
> Security teams can create phishing campaigns, send simulated phishing emails, track clicks, and display an awareness page when users interact.  

![Dashboard Screenshot](./assets/dashboard.png)  
*(Example dashboard – replace with real screenshots)*  

---

## ✨ Features
✅ **Dashboard** – View campaigns, sent emails, clicks, and success rates.  
✅ **Logs** – Track employees who clicked (with timestamp & campaign).  
✅ **Campaign Configs** – Upload Excel email lists, select template, and send.  
✅ **Email Templates** – Prebuilt phishing-style emails with preview support.  
✅ **Click Tracking** – Unique tracking link for each user (e.g. `/click?uid=XYZ123`).  
✅ **Awareness Page** – Redirects users to a training page after click.  

---

## 🚀 Workflow
1. 📤 **Create Campaign** → Upload Excel file with employee emails.  
2. ✉️ **Send Emails** → System generates unique tracking links.  
3. 👆 **User Clicks** → Event logged in MongoDB.  
4. 📚 **Awareness Page** → Shows phishing awareness training.  
5. 📊 **Dashboard Updates** → Admin sees stats of campaign effectiveness.  

---

## 🛠️ Tech Stack
| Layer       | Tech Used |
|-------------|-----------|
| **Frontend** | React, Axios, TailwindCSS |
| **Backend**  | Node.js, Express |
| **Database** | MongoDB (Mongoose ORM) |
| **Email**    | Nodemailer (SMTP) |
| **File Uploads** | Excel Parser (`xlsx`) |


## ⚡ Installation & Setup

### 1️⃣ Clone Repo
```bash
git clone https://github.com/yourusername/phishing-awareness-tool.git
cd phishing-awareness-tool
```

### 2️⃣ Install Dependencies
Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

### 3️⃣ Environment Variables
Create `.env` inside `backend/`:
```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/phishing-awareness
EMAIL_HOST=smtp.yourmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=yourpassword
FRONTEND_URL=http://localhost:3000
```

### 4️⃣ Run App
Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm start
```

🌍 App will run at:  
- Frontend → [http://localhost:3000](http://localhost:3000)  
- Backend → [http://localhost:5000](http://localhost:5000)  

---

## 📊 Example Awareness Page
![Awareness Page Screenshot](./assets/awareness.png)  
*(Replace with your real screenshot)*  

**Message shown to users:**  
```
⚠️ Phishing Simulation
You clicked on a simulated phishing email.

In a real attack, this could have led to credential theft.

✔ Verify sender address
✔ Hover over links before clicking
✔ Never enter credentials on unknown sites
```

---

## 📸 Screenshots
- Dashboard  
  ![Dashboard Screenshot](./assets/dashboard.png)  
- Campaign Config  
  ![Campaign Config Screenshot](./assets/config.png)  
- Logs  
  ![Logs Screenshot](./assets/logs.png)  

---

## 🔐 Disclaimer
⚠️ **This tool is strictly for internal security awareness training.**  
❌ Do **NOT** use it for unauthorized phishing or malicious activity.  
🛡️ The author is not responsible for misuse.  

---

## ⭐ Contribute
Pull requests are welcome.  
If you’d like to add new templates or reporting features, open a PR!  

---

### 🔗 Useful Links
- [MongoDB Docs](https://www.mongodb.com/docs/)  
- [React Docs](https://react.dev/)  
- [Express Docs](https://expressjs.com/)  

---

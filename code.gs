function sendPersonalizedEmailsWithResume_Limited() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const pdfFileId = 'YOURCVID'; // Özgeçmiş PDF dosyasının Google Drive ID’si
  const resumeFile = DriveApp.getFileById(pdfFileId);
  
  const maxEmailsPerDay = 250;
  const delayMs = 10000; // 10 saniye gecikme

  let emailsSent = 0;

  for (let i = 1; i < data.length; i++) {
    if (emailsSent >= maxEmailsPerDay) {
      Logger.log("Günlük kota doldu. Daha fazla mail gönderilmeyecek.");
      break;
    }

    const company = data[i][0]; // Şirket Adı
    const email = data[i][2];   // Mail
    const logStatus = data[i][5]; // Log kolonunu kontrol ediyoruz

    if (logStatus && logStatus.toString().toLowerCase() === "gönderildi") continue;
    if (!email || !company) {
      sheet.getRange(i + 1, 6).setValue("Hata: Eksik veri");
      continue;
    }

    const personalizedMessage = `
      <p>Dear <b>${company}</b>,</p>
      <p>My name is Muhammed Görkem Kılıç, and I am currently a 4th-year Computer Engineering student in Turkey. I’m a highly motivated individual who is eager to learn, take responsibility, and grow within a professional software development environment.</p>
      <p>I would like to apply for a full-time remote Junior Developer position at <b>${company}</b>. This opportunity means much more to me than just a job – it would be a life-changing step in my career. I sincerely want to express that I am ready to do whatever it takes to earn this chance.</p>
      <p>I am available to work 8 hours a day, 5 days a week, and I am confident in my ability to complete any tasks assigned at the Junior level, including development, testing, and documentation. I can commit to being disciplined, reliable, and fully focused.</p>
      <p>While I do not currently speak German, I am absolutely committed to learning it if I am offered the position. Improving communication and becoming a more integrated part of your team is a top priority for me, and I will dedicate myself to learning the language as soon as possible.</p>
      <p>This is not just a temporary opportunity for me – I am looking for a long-term career path, and if accepted, I have no intention of seeking other jobs. I would be proud to grow within your company.</p>
      <p>I do not require any insurance or additional benefits. My only focus is to work, contribute, and prove myself. Under these conditions, a rate of 1000CHF per month would be sufficient for me.</p>
      <p>I have attached my CV for your review. Working with you would be an honor, and I would be more than happy to attend an interview at your convenience.</p>
      <br>
      <p>Kind regards,<br>
      Muhammed Görkem Kılıç<br>
      <a href="mailto:kilicmuhammedgorkem@gmail.com">kilicmuhammedgorkem@gmail.com</a><br>
      <a href="tel:+905079106503">+90 507 910 6503</a><br>
      <a href="https://www.linkedin.com/in/mgorkemklc/">My LinkedIn Profile</a></p>
    `;

    try {
      GmailApp.sendEmail(email, 
        `Job Application – Junior Developer – ${company}`, 
        '', // plain text body boş çünkü htmlBody var
        {
          htmlBody: personalizedMessage,
          attachments: [resumeFile.getAs(MimeType.PDF)],
          name: 'Muhammed Görkem Kılıç'
        }
      );

      sheet.getRange(i + 1, 6).setValue("Gönderildi");
      emailsSent++;
      Utilities.sleep(delayMs);

    } catch (e) {
      Logger.log(`Mail gönderilemedi (${email}): ${e}`);
      sheet.getRange(i + 1, 6).setValue("Hata: " + e.message);
    }
  }

  // === Raporlama: Script sonunda özet mail gönder ===
  try {
    const now = new Date();
    const formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
    const subject = `Mail Gönderim Özeti – ${formattedDate}`;
    const body = `
      Merhaba Görkem,<br><br>
      Bugünkü otomatik mail gönderimi tamamlandı.<br><br>
      <ul>
        <li><b>Gönderilen Mail:</b> ${emailsSent} adet</li>
        <li><b>Toplam Satır:</b> ${data.length - 1}</li>
      </ul>
      <br>
      Google Sheets dosyanı kontrol ederek hata detaylarına ulaşabilirsin.<br><br>
      İyi çalışmalar!<br><br>
  
    `;

    GmailApp.sendEmail("kilicmuhammedgorkem@gmail.com", subject, '', {
      htmlBody: body,
      name: "Başvuru Otomasyonu"
    });
  } catch (reportError) {
    Logger.log("Rapor maili gönderilemedi: " + reportError.message);
  }

  Logger.log(`${emailsSent} mail başarıyla gönderildi.`);
}

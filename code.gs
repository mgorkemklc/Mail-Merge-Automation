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
      <p>I would like to apply for a full-time remote Junior Developer position at <b>${company}</b>.</p>
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

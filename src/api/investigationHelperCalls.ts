const { google } = require("googleapis");
const formidable = require("formidable");
const fs = require("fs");
require("dotenv").config();

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(event, async (err, fields, files) => {
      if (err) {
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: "Failed to parse form data" }),
        });
        return;
      }

      const file = files.file;
      if (!file) {
        resolve({
          statusCode: 400,
          body: JSON.stringify({ error: "No file uploaded" }),
        });
        return;
      }

      console.log("📌 Încărcăm PDF-ul pe Google Drive...");

      try {
        const auth = new google.auth.GoogleAuth({
          keyFile: "google-drive-key.json",
          scopes: ["https://www.googleapis.com/auth/drive.file"],
        });

        const drive = google.drive({ version: "v3", auth });

        const fileMetadata = {
          name: file.originalFilename,
          parents: ["YOUR_GOOGLE_DRIVE_FOLDER_ID"],
        };

        const media = {
          mimeType: "application/pdf",
          body: fs.createReadStream(file.filepath),
        };

        const uploadedFile = await drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: "id, webViewLink",
        });

        console.log("✅ Fișier urcat:", uploadedFile.data.webViewLink);

        resolve({
          statusCode: 200,
          body: JSON.stringify({ url: uploadedFile.data.webViewLink }),
        });
      } catch (error) {
        console.error("❌ Eroare Google Drive:", error.message);
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: error.message }),
        });
      }
    });
  });
};

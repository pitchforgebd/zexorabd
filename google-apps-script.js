// ==============================================================================
// GOOGLE APPS SCRIPT CODE for CV Upload
// ==============================================================================
// 
// Instructions:
// 1. Go to https://script.google.com/
// 2. Create a new project.
// 3. Replace the code in Code.gs with the code below.
// 4. Create a folder in your Google Drive where you want CVs to be uploaded.
// 5. Get the Folder ID from the URL (e.g., https://drive.google.com/drive/folders/YOUR_FOLDER_ID)
// 6. Replace 'YOUR_DRIVE_FOLDER_ID' below with your actual Folder ID.
// 7. Click Deploy -> New deployment.
// 8. Select type: "Web app"
// 9. Execute as: "Me"
// 10. Who has access: "Anyone"
// 11. Click Deploy and authorize the script.
// 12. Copy the "Web app URL" and use it in your React app.

const FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID'; // Replace with your Google Drive Folder ID

function doPost(e) {
  try {
    // Check if body is empty
    if (!e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        message: "Empty request body" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Parse the JSON request body
    const data = JSON.parse(e.postData.contents);
    const fileData = data.file;
    const fileName = data.fileName;
    const mimeType = data.mimeType;
    
    // Decode the Base64 file
    const decodedFile = Utilities.base64Decode(fileData);
    const blob = Utilities.newBlob(decodedFile, mimeType, fileName);
    
    // Get the destination folder
    const folder = DriveApp.getFolderById(FOLDER_ID);
    
    // Create the file in the folder
    const file = folder.createFile(blob);
    
    // Make the file publicly accessible (view only)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Return success response with the file URL
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      url: file.getUrl(),
      fileId: file.getId(),
      fileName: file.getName()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle CORS for preflight options request
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON);
}

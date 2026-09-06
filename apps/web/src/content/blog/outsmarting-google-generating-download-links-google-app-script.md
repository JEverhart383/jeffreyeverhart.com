---
title: "Outsmarting Google: Generating Download Links with Google App Script"
date: 2017-10-17
excerpt: "For the most part, I love working with Google App Script. The APIs are what you expect them to be. Most of the features are well-documented. Heck, I've even tried to [build Google Sheets into a small "
heroImage: "/media/DMR1ZzsXUAArtUN.jpg"
categories: ["Google Apps Script", "Google Drive"]
wpId: 1402
---

For the most part, I love working with Google App Script. The APIs are what you expect them to be. Most of the features are well-documented. Heck, I've even tried to [build Google Sheets into a small relational database.](https://jeffreyeverhart.com/2017/08/12/creating-crud-web-app-google-sheets/) But after you've been around the block for awhile, you realize there is this odd black market of sorts built into Google App Script and the associated Drive services, things you can do that Google never really meant for you to do, or built in as a feature at some point but forgot about. This post exposes one of those dirty back alleys you need to generate a download link for Google Documents.

## The Scenario

In reality, this should have been a straightforward process. We were trying to loop through a directory structure and print out some data about each file into a Google Sheet. The Google Sheet would then just serve some JSON that a little front end app could consume to allow people to download, copy, or view Google Drive files in a custom way. ![Image of some google drive files ](/media/Screen-Shot-2017-10-16-at-10.22.06-PM-1024x375.png) All of the looping part worked as expected, but for some reason a previous version of the download link was no longer working.

```js
function execute(){
  //This is the top level folder
  var folderId = "FOLDER_ID_HERE"; 
  var folder = DriveApp.getFolderById(folderId);
  
  var sheet = SpreadsheetApp.getActiveSheet();
  //Append Headers to Sheet
  sheet.appendRow(["File Name", "Parent Folder Name", "URL", "Download Link", "Copy Link"]);
  //Call function to recurse through subfolders
  loopSubFolders(folder, sheet); 
}

function loopSubFolders(parentFolder, sheet){
  var subFolders = parentFolder.getFolders(); 
  listFilesInFolder(subFolders.next(), sheet); 
  while(subFolders.hasNext()){
    listFilesInFolder(subFolders.next(), sheet); 
  }
  
}

function listFilesInFolder(folder, sheet) {
//writes the headers for the spreadsheet
    var contents = folder.getFiles();  
    var cnt = 0;
    var file;

    while (contents.hasNext()) {
        var file = contents.next();
        cnt++;
// writes the various chunks to the spreadsheet- just delete anything you don't want
            data = [
                file.getName(),
                folder.getName(),
                file.getUrl(),
                file.getUrl().split('/edit')[0] + '/export?format=docx', 
                file.getUrl().split('/edit')[0] + '/copy'
            ];

            sheet.appendRow(data);

        

    };
};
```

Things started to get tricky when logging out the download URL. Google Apps Script makes it easy get the file URL using getUrl, but that is just a link to view the document. After some research, it seemed like [getDownloadUrl](https://developers.google.com/apps-script/reference/drive/file#getDownloadUrl\(\)) might do the trick, but alas that didn't work for any of the Google docs or the random files in the folder. At some point in this process, I also decided it was a good idea to print out the files as binary blobs in the spreadsheet, which summarily crashed the sheet. We were able to find [some older tutorials](https://www.labnol.org/internet/direct-links-for-google-drive/28356/) that broke down some various link structures, but none of those seemed to work for the current Google Drive setup. At the end of the day, we kind of just started trying things based off the structure of the /copy link until we found something that stuck.

```js
https://docs.google.com/documents/d/YOUR_DOCS_ID_HERE/export?format=pdf
```

However, this only seems to work for native Google Drive content types, and it needs an export format or otherwise the documents were downloading as HTML. Either way, bound to be useful to someone.

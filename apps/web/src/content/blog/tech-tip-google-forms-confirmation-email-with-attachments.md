---
title: "Google Forms Confirmation Email with Attachments"
date: 2015-01-30
excerpt: "Google Forms is a great tool to use to make quick and easy sign-up forms, but sometimes you need it to do something else a bit more complex. In this short tutorial we'll talk about how to extend a bas"
categories: ["Ed Tech", "Google", "How to", "Marketing", "technology"]
wpId: 795
---

Google Forms is a great tool to use to make quick and easy sign-up forms, but sometimes you need it to do something else a bit more complex. In this short tutorial we'll talk about how to extend a basic Google Form script that sends confirmation email to also send attachments. If you don't know how to send the Google Form confirmation email, check out the first tutorial on that topic here: [Part 1: Sending a Confirmation Email with Google Forms>>>>>](http://www.jeffreyeverhart.com/2014/01/31/tech-tip-how-to-send-a-confirmation-email-with-google-forms/ "Tech Tip: How to send a confirmation email with Google Forms")  

## Step 1: Get a Google Doc as PDF

The first thing we are going to add to the script will retrieve a Google Doc from your Google Drive App. Create a new variable that accesses the Drive App and gets a particular file by its id.

```js
var file = DriveApp.getFileById("longidstringgoeshere");
```

You can find the id string of your document by looking in its URL in another tab [![Google-Forms-id](/media/DriveFileID.png)](/media/DriveFileID.png)   Now we have created a variable that opens your Drive App and gets a particular file by Id. Next we're going to tell it specifically what file type we want. We will call some specific methods on the file variable to make that happen. Create a new variable to store our final Drive Doc as a PDF:

```js
var pdfFile = file.getAs(MimeType.PDF);
```

Ok, this line of code just specifies the document as a PDF for our attachment. In Step 2, we'll look at how to use this file as an attachment in our mail function.

## Step 2: Add Attachment and Send Email from Google Forms

Now that we have our file built using the Drive App, we can add this attachment variable to our mail function so that an attachment is sent when someone submits something in Google Forms. To do this, we add another parameter to our initial mail function like the code example below:

```js
MailApp.sendEmail(email, subject, body, {attachments:[liabilityWaiver]});
```

  We are adding the attachment through a JavaScript Object (JSON) that we are passing as an additional parameter. A JSON object is created with curly braces and a number of key:value pairs seperated by commas.

```js
{
attachments:[pdfFile]
}
```

In this example we use the key of "attachments" which accepts an array as a value. It accepts an array because we could also include multiple files here formatted as a JavaScript array.

```js
{
attachments:[pdfFile, anotherFile, anotherFileStill]
}
```

After that, you should be ready to save out your code and send an email attachment. Just make sure to check your syntax when ending the mail function line if you get any initial errors. [![](//bluehost-cdn.com/media/partner/images/jeffeverhart383/468x60/bh-468x60-03-dy.png) ](//www.bluehost.com/track/jeffeverhart383/)  Here is the whole script:

```js
function myFunction(e) {
 var name = e.values[1];
 var phoneNumber = e.values[2];
 var email = e.values[3];
 
 var subject = "Thanks for submitting";
 var body = "We look forward to racing with you. Don't forget to fill out and bring the attached waiver on race day.";
 
 var waiver = DriveApp.getFileById("yourFileIdHere");
 var liabilityWaiver = waiver.getAs(MimeType.PDF);
 
 
 
 MailApp.sendEmail(email, subject, body, {attachments:[liabilityWaiver]}); 
}
```

Be sure to review Part 1: [Part 1: Sending a Confirmation Email with Google Forms>>>>>](http://www.jeffreyeverhart.com/2014/01/31/tech-tip-how-to-send-a-confirmation-email-with-google-forms/ "Tech Tip: How to send a confirmation email with Google Forms")

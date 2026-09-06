---
title: "Auto Fill a Google Doc from a Google Form Submission"
date: 2018-09-17
excerpt: "It's been awhile since I have written anything to do with Google Apps Script, so I decided to start exploring some features of the Apps Script world that are new to me."
heroImage: "/media/Screen-Shot-2018-09-17-at-9.58.24-AM.png"
categories: ["Google Apps Script", "Google Drive", "Google Sheets"]
wpId: 1857
---

It's been awhile since I have written anything to do with Google Apps Script, so I decided to start exploring some features of the Apps Script world that are new to me.

When I first got started with Apps Script almost 6 years ago, there were lots of things I wanted to do, but just didn't yet have the skills to figure out or tried but ran into a limitation on the Apps Script platform. Now that Apps Script has matured, it's time to revisit some of those early desires.

In this tutorial, we're going to look at a workflow that should have a large swath of utility for people who read this site. We're going to take a Google Form submission and then use that data to populate a custom template in Google Docs.  

## Getting Our Google Form Ready

To get started, we'll need to create a Google Form to accept submissions and a Google Doc to act as our template.

For this example, I just created a basic form to accept some data that looks like this:

![basic google form that will auto fill a google doc](/media/Screen-Shot-2018-09-17-at-9.34.38-AM-1024x573.png)

![google sheet where form responses are stored](/media/Screen-Shot-2018-09-17-at-9.36.59-AM-1024x572.png)

As you can see nothing fancy going on here. I created a spreadsheet to accept the responses, as that is ultimately where our code will live that will generate the Google Doc.  

## Creating a Google Doc Template

After creating the form and the spreadsheet, I created a Google Doc in the same folder that will serve as our template document. Every time a form is submitted to the spreadsheet, our script will make a copy of this template and replace parts of the text with the data submitted to the form.

As you can see, this is a pretty basic document, but since we are just making a copy, your template could include lots of different styling, images, etc. if you so desire.

![initial google doc template with template tags](/media/Screen-Shot-2018-09-17-at-9.39.14-AM-1024x573.png)

There are a few important things to note about this template though. There are several ways to populate a Google Doc using Google Apps Script. One way is to programmatically create the document using code, meaning we would add the different document elements one by one using a script.

While that is possible, I found it very difficult to do, especially when trying to create a document with an kind of sophistication or styling.

The other way involves the strategy we're taking here. We make a document that acts as a template, then we look for certain pieces of text within the template document, then replace those pieces of text with live data when our form is submitted.

### Best Practices for Template Tags in Google Docs

However, since we'll need to search all of the text in the document to replace it, it is best to make the text you want to replace unique in the document. To do that, you should use what are known in the web development world as replacement tags. In the example above, I've surrounded the names of the fields I want to replace in double curly braces like so {{Field to Replace}}.

While that is only one possibility, there are a few others that are commonly used:

```js
{{Field to Replace}}
%Field to Replace%
#Field to Replace#
[[Field to Replace]]
```

At the end of the day, really all we are focused on is creating a unique tag that we can find later. Using some sort of character as brackets helps with this since two curly braces is an unlikely pattern to find elsewhere.

Another best practice here, just for you own sanity, would be to make sure that the text inside your brackets matches the header in the spreadsheet.

## Using Code to Populate a Google Doc

Now that we've got everything setup, we can look at the code that will make all of this happen. For those unfamiliar with how to write a basic Google Apps Script project file, you might want to check out [an earlier post where I go over the process from beginning to end](https://jeffreyeverhart.com/2014/01/31/tech-tip-how-to-send-a-confirmation-email-with-google-forms/).

For this tutorial, I'll assume that everyone knows how to open Tools > Script Editor to edit a script file [and set a form submission trigger](https://jeffreyeverhart.com/2017/12/01/resetting-triggers-google-apps-script/) on a particular script.

The code below is fairly well commented to show the intent of each line, so I won't rehash a bunch of it here:

```js
function autoFillGoogleDocFromForm(e) {
  //e.values is an array of form values
  var timestamp = e.values[0];
  var firstName = e.values[1];
  var lastName = e.values[2];
  var title = e.values[3];
  
  //file is the template file, and you get it by ID
  var file = DriveApp.getFileById('your_file_id_here'); 
  
  //We can make a copy of the template, name it, and optionally tell it what folder to live in
  //file.makeCopy will return a Google Drive file object
  var folder = DriveApp.getFolderById('your_folder_id_here')
  var copy = file.makeCopy(lastName + ',' + firstName, folder); 
  
  //Once we've got the new file created, we need to open it as a document by using its ID
  var doc = DocumentApp.openById(copy.getId()); 
  
  //Since everything we need to change is in the body, we need to get that
  var body = doc.getBody(); 
  
  //Then we call all of our replaceText methods
  body.replaceText('{{First Name}}', firstName); 
  body.replaceText('{{Last Name}}', lastName);  
  body.replaceText('{{Title}}', title); 
  
  //Lastly we save and close the document to persist our changes
  doc.saveAndClose(); 
}
```

Some things to note about this project, myFunction is what gets called when the form submission trigger runs, and it passes in the form values as the 'e' parameter to the function. This script makes use of both the [DriveApp](https://developers.google.com/apps-script/reference/drive/drive-app) and [DocumentApp](https://developers.google.com/apps-script/reference/document/document-app) classes of Google Apps Script, so be careful when writing your own version to distinguish between what is a Google Drive file and what is a Google Document.

## Setting a Trigger On Form Submit

Now that we have all scripts and Drive resources in place, we need to add a trigger to our project so that the script runs whenever a form is submitted. To do that, we can navigate to the 'Edit' menu in the script editor, and then click on the "Current project's triggers" option.

![an image of the edit menu of google apps script interface with the current project's triggers highlighted](/media/Screen-Shot-2020-02-26-at-9.54.24-AM.png)

The trigger editor will open up in a new window and show us all of the triggers associated with a project if there are any. To add a trigger, click the 'Add Trigger' button in the bottom right of the screen, which will open up a modal menu with options for setting the trigger.

![a modal window to add a trigger in google apps script](/media/Screen-Shot-2020-02-26-at-9.57.44-AM.png)

First, we want to choose the function that will get triggered, in this case 'autoFillGoogleDocFromForm' will get selected. We can leave the deployment as 'Head,' unless you know what you are doing here. Then, we want to select 'From spreadsheet' as our event source and "On form submit" event type. All of those settings ensure that the correct data gets passed to our script when it is triggered.

The last setting, which is an optional recommendation, determines how often you are notified of errors. My recommendation is set that to notify you immediately. Once you've sorted that, we can click save and our trigger will be active. You can give it a try by submitting a test form.

### Wrapping Up

It took me a while to figure this difference out, but it can be summed up like this: all Google Docs are Drive files, but not all Drive files are Google Docs. Google Drive controls things about the file, like where it lives, who has access to it, and how we download it, but to make changes to a file that is a Google Doc we need to operate on it using the DocumentApp class.

After submitting our test form, we end up with a Google Document in the folder we specify that looks like this:

![completed google doc after text has been replaced](/media/Screen-Shot-2018-09-17-at-9.58.24-AM-1024x573.png)

While this is a pretty simple example, I foresee lots of use cases for a workflow like this, from creating certificates to populating invoices or purchase orders, this should be another helpful tool to keep in your Google Apps Script tool belt.

After over 100+ comments on this post and more on YouTube, I've created a few tutorials that branch off of things that people may want to do:

[Auto Fill a Google Doc Template from Google Sheets Data](https://jeffreyeverhart.com/2020/09/29/auto-fill-a-google-doc-template-from-google-sheet-data/) 

This tutorial is very similar to using a Google Form to trigger the automation, but instead we runt the automation from a menu item and pull data from an existing Google Sheet. We also write the URL of the created document back to the sheet.

### Frequently Asked Questions

[Replacing Text with a Clickable URL](https://jeffreyeverhart.com/2023/02/19/find-replace-text-in-google-doc-with-clickable-link/)

Many people have asked how they can replace the text in their Google Doc templates with a clickable link. The tutorial linked above shows how you can modify this script to insert links into your templates.

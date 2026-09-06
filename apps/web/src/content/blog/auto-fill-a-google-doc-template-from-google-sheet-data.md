---
title: "Auto Fill a Google Doc Template from Google Sheet Data"
date: 2020-09-29
excerpt: "In this post, I'll walk you through how to auto fill Google Doc templates with data pulled from a Google Spreadsheet using Google Apps Script. This tutorial is a follow-up of sort to [Auto Fill a Goog"
heroImage: "/media/Source_GSuite.svg"
categories: ["Google Apps Script", "Google Sheets"]
wpId: 2466
---

In this post, I'll walk you through how to auto fill Google Doc templates with data pulled from a Google Spreadsheet using Google Apps Script. This tutorial is a follow-up of sort to [Auto Fill a Google Doc from Google Form Submissions](https://jeffreyeverhart.com/2018/09/17/auto-fill-google-doc-from-google-form-submission/), so if what you want to do involves a form, that would be worth checking out as well.

To make this a helpful starting point for other tools, we will make this automation run by adding a custom menu option to Google Sheets and save the URL to the document we create back to the spreadsheet.

## Prepare The Sheet

For this tutorial, our starting point will contain some data on employees, like their first and last name, hire date, and hourly wage. I've also created a blank column named 'Document Link' at the end of the data range to store a link to the Google Doc that our script will create.

[Click here to make a copy of the Sheet and Script project >>>](https://docs.google.com/spreadsheets/d/1p30UMBZloDsx_lMt7u7cIvNuvQecX84-9i8QDsombFQ/copy)

![a screenshot of employee data in a google spreadsheet](/media/Screen-Shot-2020-09-26-at-1.09.51-PM.png)

By storing the document link in the spreadsheet, we get a handy way  to access the created document, but we can also use that data field to help us control which documents get created when we run the code from the add-on menu options. In this tutorial, we will only create new documents when a spreadsheet row doesn't already have a URL in the 'Document Link' column.

## Creating a Google Doc Template

The best part about populating a Google Doc template is that you can create fairly sophisticated documents and merge data into the copies that you make. In most cases, you'll find this a lot easier than working with the [DocumentApp class](https://developers.google.com/apps-script/reference/document/document-app) in Google Apps Script to create nice looking things.

In this example, we'll create some variable replacement tokens by surrounding the variables we want to replace with two sets of curly braces: `{{First Name}}`

The key here is that whatever text you use in the Google Doc will need to be unique to the document, and it needs to match exactly to a string we use in our code, including whitespace, capitalization, etc.

![An employee details grid in Google Docs](/media/Screen-Shot-2020-09-26-at-1.20.41-PM.png)

This document template will get copied each time our script runs, and then we will use the DocumentApp to search for our replacement tokens in the document body, and then we will replace those tokens with values from our sheet.

## Writing the Code in Google Apps Script

There are two main pieces to our script for this tutorial: the function that adds a menu item to our sheet so that we can easily run our script, and the function that will process our spreadsheet data and autofill the document templates. This code needs to be added to the script editor accessible via the Tools > Script Editor menu.

We can look at the function to create a menu item first:

```generic
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('AutoFill Docs');
  menu.addItem('Create New Docs', 'createNewGoogleDocs')
  menu.addToUi();

}
```

I've written another, more extensive article on [creating menu items in Google Sheets](https://jeffreyeverhart.com/2016/05/02/add-custom-menus-google-docs-sheets-forms/), so check that out if you have any questions or want to learn more about the different menu types.

When we add a menu item, we attach the 'Create New Docs' option to a function called `createNewGoogleDocs` that we'll look at in more detail. I've included the whole function below with a descriptive comment for pretty much every line, but there are a few things I'll break out into more specific examples as well.

```js
function createNewGoogleDocs() {
  //This value should be the id of your document template that we created in the last step
  const googleDocTemplate = DriveApp.getFileById('1RhLb3aKf-C-wm5lfSBe2Zj43U1P0P2av1_kzekbeCP4');
  
  //This value should be the id of the folder where you want your completed documents stored
  const destinationFolder = DriveApp.getFolderById('1VCnjlXCBGOxEvHUsRmogllZ41Snu4RN1')
  //Here we store the sheet as a variable
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Data')
  
  //Now we get all of the values as a 2D array
  const rows = sheet.getDataRange().getValues();
  
  //Start processing each spreadsheet row
  rows.forEach(function(row, index){
    //Here we check if this row is the headers, if so we skip it
    if (index === 0) return;
    //Here we check if a document has already been generated by looking at 'Document Link', if so we skip it
    if (row[5]) return;
    //Using the row data in a template literal, we make a copy of our template document in our destinationFolder
    const copy = googleDocTemplate.makeCopy(`${row[1]}, ${row[0]} Employee Details` , destinationFolder)
    //Once we have the copy, we then open it using the DocumentApp
    const doc = DocumentApp.openById(copy.getId())
    //All of the content lives in the body, so we get that for editing
    const body = doc.getBody();
    //In this line we do some friendly date formatting, that may or may not work for you locale
    const friendlyDate = new Date(row[3]).toLocaleDateString();
    
    //In these lines, we replace our replacement tokens with values from our spreadsheet row
    body.replaceText('{{First Name}}', row[0]);
    body.replaceText('{{Last Name}}', row[1]);
    body.replaceText('{{Position}}', row[2]);
    body.replaceText('{{Hire Date}}', friendlyDate);
    body.replaceText('{{Hourly Wage}}', row[4]);
    
    //We make our changes permanent by saving and closing the document
    doc.saveAndClose();
    //Store the url of our new document in a variable
    const url = doc.getUrl();
    //Write that value back to the 'Document Link' column in the spreadsheet. 
    sheet.getRange(index + 1, 6).setValue(url)
    
  })
  
}
```

One of the many questions I get asked is about using conditional logic, meaning we'll look at a row in a spreadsheet and use that value to decide whether or not a new document is created, or perhaps which template is used is we had different document templates for different employee types.

### Conditional Logic in forEach Loop

To check out how this works, let's look at the first few conditional logic checks in our `forEach` loop:

```generic
//Start processing each spreadsheet row 
rows.forEach(function(row, index){ 

  //Here we check if this row is the headers, if so we skip it 
  if (index === 0) return; 
  //Here we check if a document already exists by looking at 'Document Link', 
  //if so we skip it 
  if (row[5]) return;
```

Using the `forEach` method on our row of spreadsheet data, which is modeled in a JavaScript array, we pass in both the value of the row itself, which is also an array, as well as the index of the current row.

In the next line, the `index === 0` check looks at whether or not this is the header row. If it is the header row, then we `return` the function of our loop for that item so that no other code is processed.

In the following line, we do something similar with the item at the fifth array index (sixth column in the Google Sheet), meaning in this example we look at whether or not the 'Document Link' column has a value. If it does, we `return` the function for this loop item so we skip this code.

However, you could also use this pattern to check other things about the data in the current row and introduce branching logic based on what data you find. For example, you could store a different value for the `googleDocTemplate` variable based on whether the employee was a 'Web Developer' or 'CEO.'

### Creating Clean Strings with Template Literals

Another line worth mentioning is where I use a template literal to construct the string name of our new document:

```js
const copy = googleDocTemplate.makeCopy(`${row[1]}, ${row[0]} Employee Details` , destinationFolder)
```

Template literals are a newer construct in Google Apps Script that allow us to create cleaner strings than we would be able to create using string concatenation. Instead of using either single `''` or double `""` quotes to create a string, a template literal uses back-ticks ` `` ` to create a string.

How you assemble strings in this way is also quite different. With template literals, we interpolate variables into strings using place holders, while  string concatenation involves adding smaller strings into one longer string.

You can see the comparison below for how those practices would work on the example above:

```generic
const templateLiteralExample = `${row[1]}, ${row[0]} Employee Details`
const stringConcatExample = row[1] + " " + row[0] + " Employee Details"
```

Either example above evaluates to the same string, so you can choose based on preference, and often I'll switch between the two techniques in the same project because of the context. I tend to use template literals when I want a string with whitespace, as you can see doing that in the second example can get annoying.

If you are interested in learning more about the modern features of JavaScript available in Google Apps Script, you can read my article on using [template literals](https://jeffreyeverhart.com/2020/02/07/es-6-features-for-google-apps-script-template-literals/).

## Generating the Documents

Once we have saved the code, you can generate the documents from the Spreadsheet using the AutoFill Docs -> Create New Docs menu item. If you ever want to regenerate a document, all you need to do is remove the value in the 'Document Link' column.

![a screenshot of someone using a google add one menu item](/media/Running-Google-Docs-Menu.png)

## Frequently Asked Questions

This is a space where I'll surface relevant FAQs from the comments section.

### Displaying Formatted Values from the Spreadsheet

I've had a number of people ask about how to display formatted values from the spreadsheet (e.g. currency) or values derived from a formula. The easiest way to do this is to use the `getDisplayValues` method instead of `getValues` in the following line of the script:

```js
const rows = sheet.getDataRange().getValues();
```

The methods are essentially the same except one returns the underlying value, and the other returns the values along with any display transformations the spreadsheet is doing. You can find more info about the [getDisplayValues](https://developers.google.com/apps-script/reference/spreadsheet/range#getDisplayValues\(\)) method on the official docs.

---
title: "How to send a confirmation email with Google Forms"
date: 2014-01-31
excerpt: "In this short tech tip, we are going to look at how to make a Google Forms send a confirmation email to the user each time they submit a form. This is just a basic template for how to make this happen"
categories: ["Business", "Google", "How to", "teaching", "technology"]
wpId: 637
---

In this short tech tip, we are going to look at how to make a Google Forms send a confirmation email to the user each time they submit a form. This is just a basic template for how to make this happen, so it is worth mentioning that there are plenty of other ways to accomplish this one task and equally as many different things we could have this form do.

In the following steps, I am just going to give a brief overview of the different steps, so make sure to watch the video if you want to see HOW to complete this task.

[![](//bluehost-cdn.com/media/partner/images/jeffeverhart383/468x60/bh-468x60-03-dy.png)](//www.bluehost.com/track/jeffeverhart383/)

1.  Create a Google Form that accepts some form of user input and create an attached Google Sheet to store the form submissions. Your input fields can really be any of the options that Google Forms gives you. My advice is to think about how best to eliminate confusion for your user. This will ensure that they don’t send you bogus data, or something other than what you asked for.
    
2.  Once you have created the form, open up the corresponding spreadsheet. Google Sheets use zero indexing, meaning that the leftmost column is column ‘0’ and the column directly to the right of column ‘0’ is column ‘1’ and so on. It isn’t a particularly difficult concept to grasp, but it will be important when we start to pull data from the spreadsheet.
    
3.  Go to the ‘Tools’ menu in the spreadsheet and open up the ‘script editor.’ Once the script editor window opens, create a blank project. You should see the beginnings of a function that looks something like this: function myFunction (){}
    
    1.  This first thing we are going to do is pass this function an event parameter by placing a lowercase ‘e’ in between the parentheses: (e); this event holds all of the spreadsheet data that we are going to pull from.
        
    2.  Next, in between the curly braces we are going to define some variables to store some of the specific values we need from the spreadsheet. We are going to use ‘e.values\[1\]’ to pull in the data that the user submitted to the first column, which in the example video would correspond to ‘Name’ (remember zero indexing here). We will assign ‘e.values\[1\]’ to a variable name appropriately ‘Name’: var name = e.values\[1\];
        
    3.  Complete this same step to pull in the other data you want and also create variables for the body of the message and the subject line of the email the script will send.
        
    4.  Once you have defined all of the variable you want to be included in the email, you are going to call the Mail.App method and pass it three arguments, recipient, subject, and body.
        
    5.  The last step is setting a trigger to run the script you just created. In the ‘Resources’ menu, select the ‘current project’s triggers.’ You should see a menu that says there are no triggers for this project, so create a new trigger. We are going to want to create a trigger that runs ‘myFunction’ to process the spreadsheet event ‘on form submit,’ which is the far right drop down menu. Now, any time a user submits a form , this script should run. You will have to authorize Google to access the spreadsheets and you Gmail account to make this work.
        
4.  The last step involves submitting some data to the form to perform a quick test.
    

If you have any questions about how do some of the programming needed for this example, take a look at some of the Javascript tutorials located [here at CodeAcademy](http://www.codecademy.com/tracks/javascript) or some of the tutorials on [Google App Script located here](https://developers.google.com/apps-script/).

// <!\[CDATA\[ (adsbygoogle = window.adsbygoogle || \[\]).push({}); // \]\],>

Here is the code for the script, but note that this will change based on your spreadsheet:

`function myFunction(e){ var userName = e.values[1]; var userEmail = e.values[2]; var date = e.values[3]; var subject = "Form Submitted"; var message = "Thank you, " + userName + " for choosing " +date; MailApp.sendEmail (userEmail, subject, message);}`

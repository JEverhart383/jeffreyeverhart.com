---
title: "How to serve JSON using the Google Apps Script Content Service"
date: 2016-04-14
excerpt: "I've got another Google Apps Script tutorial here for everyone, and this time we'll be taking a look at one of the advanced services provided by Google Apps. Most of what we've talked about so far inv"
categories: ["Google Apps Script", "How to"]
wpId: 991
---

I've got another Google Apps Script tutorial here for everyone, and this time we'll be taking a look at one of the advanced services provided by Google Apps. Most of what we've talked about so far involves building on top of one of the existing Google Apps services, but this one is entirely new and will kick off a string of more advanced tutorials for Google Apps Script. In my recent post on [using Google Sheets as an application backend](http://www.jeffreyeverhart.com/2016/03/01/the-pros-and-cons-of-using-google-sheets-as-an-application-backend/), I talked about some of the pros and cons of using Google Sheets as a DB for a simple data viz site. After doing some more digging, I found a built in service that allows you to serve content in a variety of data exchange formats using Google Apps Script.

## Step 1: Create Some Simple JSON Data

First, we need something to serve when a user makes a request for the URL, so I wrote a simple function that gets some basic stats about the users Gmail inbox using the GmailApp class in Google Apps Script:

```js
function getJSON(){

  var unreadCount = GmailApp.getInboxUnreadCount(); 
  var spamCount = GmailApp.getSpamUnreadCount(); 
  
  var json = {
    'unreadCount':unreadCount, 
    'spamCount': spamCount 
}; 
  
  return json; 
}
```

All we are doing here is making two calls to the GmailApp, which return integers for unread message counts. Then, we assign those variables to properties of a JSON object and finally return that same JSON object at the end of the function. However, there are tons of other more meaningful types of data we could get here by hooking into a spreadsheet or pulling data in from another API.

## Step 2: Serve the Content as JSON using Google Apps Script Content Service

Once we've got a function that creates some JSON, we can take a look at the main function that will do the heavy lifting to serve our content. In the next step, we will publish our script as a web app that will return a specific value from a function we write in this step. If you've worked with any Google Apps Script service published as a web app, you are likely familiar with the doGet function. It might be a good idea to take a look at [the Google Apps Script documentation for Content Service](https://developers.google.com/apps-script/guides/content#the_basics) if you have a lot of questions.

```js
function doGet( ){
//all of your code goes here
//the web app returns something
}
```

Inside of the doGet function, which needs to be declared in this way when publishing or serving content or HTML, we need to return a value that tells the web app how to serve the page or content. At first, this was a bit confusing to me, but just understand that the returned value of doGet will be served to the user. We can still define other functions and call those functions from within the doGet, so don't feel the need to clutter it up with unnecessary stuff.

```js
function doGet() {

  
  var content = getJSON(); 
  return ContentService.createTextOutput(JSON.stringify(content) ).setMimeType(ContentService.MimeType.JSON); 

  
}
```

Inside of the doGet function, we need to either define or load the data that we want to serve using our script. In this example, I just call the getJSON function I created earlier and assign that to a variable named content. From there we just call the ContentService class using the createTextOutput method. To serve valid JSON, make sure to stringify the content and them set the MIME type for the content using the setMimeType method. There are a few other methods you can use to modify the text output, so be sure to check those out in [the Google Apps Script reference for TextOutput](https://developers.google.com/apps-script/reference/content/text-output#methods).

## Step 3: Deploy Script as Web App

The last step is to actually deploy the script as a web app. You can do this through the Publish menu by selecting the "Deploy as Web App" option.[![Screen Shot 2016-04-13 at 9.20.53 PM](/media/Screen-Shot-2016-04-13-at-9.20.53-PM-300x232.png)](http://www.jeffreyeverhart.com/wp-content/uploads/2016/04/Screen-Shot-2016-04-13-at-9.20.53-PM.png) It will ask you a few questions, and if you are updating the script it may ask you to specify a new version number to help you keep track of changes. After that, you will get a unique URL for the web app that you can load in a browser. Sweet! Now we have a simple script that can serve JSON, XML, RSS, or a multitude of other types of data formats. If I load the URL for our script in the browser, I get something that looks like the image below. Since I set the MIME Type to JSON, and have a JSONview plugin installed in Chrome, the browser renders it as actual JSON instead of plain text. [![Screen Shot 2016-04-13 at 9.37.56 PM](http://ec2-34-198-113-124.compute-1.amazonaws.com/wp-content/uploads/2016/04/Screen-Shot-2016-04-13-at-9.37.56-PM-1-300x159.png)](http://ec2-34-198-113-124.compute-1.amazonaws.com/wp-content/uploads/2016/04/Screen-Shot-2016-04-13-at-9.37.56-PM-1.png)   Stay tuned for more Google Apps Script tutorials. Be sure to check out some of my other popular tutorials:

*   [Using Google Apps Script to work with APIs](http://www.jeffreyeverhart.com/2016/02/24/using-google-sheet-and-google-apps-script-to-work-with-apis/)
*   [How to send a confirmation email with Google Forms](http://www.jeffreyeverhart.com/2014/01/31/tech-tip-how-to-send-a-confirmation-email-with-google-forms/)

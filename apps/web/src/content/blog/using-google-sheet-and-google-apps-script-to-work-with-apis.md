---
title: "Using Google Sheets and Google Apps Script to Work with APIs"
date: 2016-02-24
excerpt: "One of the coolest things about working with Google Apps Script is the overall versatility of the Google Apps ecosystem. I've written pretty extensively about how to use Google Apps Script to do a lot"
categories: ["Google Apps Script", "Google Sheets"]
wpId: 914
---

One of the coolest things about working with Google Apps Script is the overall versatility of the Google Apps ecosystem. I've written pretty extensively about how to use Google Apps Script to do a lot of more business focused things, like [send an email with Google Forms submissions](http://www.jeffreyeverhart.com/2014/01/31/tech-tip-how-to-send-a-confirmation-email-with-google-forms/), [sending an attachment with Google Forms submission](http://www.jeffreyeverhart.com/2015/01/30/tech-tip-google-forms-confirmation-email-with-attachments/), and [linking Google Forms so that they create Google Calendar events](http://www.jeffreyeverhart.com/2015/11/03/how-to-create-a-google-calendar-event-with-google-forms/). In this post, I'm going to look at a more robust application of Google Apps Script that will allow us to use Apps Script to retrieve data from an external API, parse that data, and append the parsed data to a Google Spreadsheet. At that point, we can use the Google Spreadsheet as a backend to serve the data as a CSV file or create dynamic charts using the Google Charts service. Although the following code is my own implementation, I used the [examples found at the Bionic Teaching blog as a jumping off point](http://bionicteaching.com/youtube-api-to-google-spreadsheets/).

```js
function myFunction() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
  var sheet = ss.getSheetByName('data'); //get sheet by name from active spreadsheet
  
  
  var apiKey = 'Your API Key'; //apiKey for forecast.io weather api
  var long = "-78.395602"; 
  var lat =  "37.3013648";    
  var url = 'https://api.forecast.io/forecast/' + apiKey +"/" + lat +"," + long; //api endpoint as a string 
  
  var response = UrlFetchApp.fetch(url); // get api endpoint
  var json = response.getContentText(); // get the response content as text
  var data = JSON.parse(json); //parse text into json
  
  Logger.log(data); //log data to logger to check
  
  var stats=[]; //create empty array to hold data points
  
  var date = new Date(); //create new date for timestamp
  
  //The following lines push the parsed json into empty stats array
    stats.push(date);//timestamp 
    stats.push(data.currently.temperature); //temp
    stats.push(data.currently.dewPoint); //dewPoint
    stats.push(data.currently.visibility); //visibility
    
  //append the stats array to the active sheet 
  sheet.appendRow(stats)
  
}
```

This script is basically just a service that connects to the Forecast.io Weather API and returns, among other things, the current temperature, dew point, and visibility for a location specified by longitude and latitude coordinates. You can check out [the docs for the Forecast.io API here](https://developer.forecast.io/). After testing this a few times to make sure it worked, I set it on a trigger to run every hour, so now my spreadsheet has grown quite large. Since the script automatically adds data every hour, I thought it would be cool to attach this spreadsheet to the Google Charts service to create a visualization that automatically updates. I've embedded both below:   There are lots of cool applications for this technique, and if nothing else it makes connecting to a simple API and storing some data much easier than trying to use another backend language. I'm going to work on building out some more advanced applications for this and write some additional posts. I'd really like to publish the spreadsheet as a CSV and access the data from other programs, but I'll need to find a way to work around the CORS rules.

---
title: "How to create a Google Calendar event with Google Forms"
date: 2015-11-03
excerpt: "In this blog post, we're going to look at how to use Google App Script to create a Google Calendar with a Google Form. This tutorial will build on some of the same code and concepts we've been working"
categories: ["Business", "Google Apps Script"]
wpId: 839
---

In this blog post, we're going to look at how to use Google App Script to create a Google Calendar with a Google Form. This tutorial will build on some of the same code and concepts we've been working with in some earlier blog posts, so feel free to check those out:

*   [Send a confirmation email with Google Forms](http://www.jeffreyeverhart.com/2014/01/31/tech-tip-how-to-send-a-confirmation-email-with-google-forms/ "Tech Tip: How to send a confirmation email with Google Forms")
*   [Send a Google Forms confirmation email with PDF attachment](http://www.jeffreyeverhart.com/2015/01/30/tech-tip-google-forms-confirmation-email-with-attachments/ "Tech Tip: Google Forms Confirmation Email with Attachments")

## Step 1: Create a Google Form to accept user input

The first step in creating a Google Calendar event using a Google Form is to actually generate the form that will accept user input. You should create a form using the time and date input fields. These fields will format time and date inputs in a way that makes it easier to create a new JavaScript Date object later.

## Step 2: Extract event values on Google Form submission

As in previous tutorials, we are going to open up the script editor in the spreadsheet that holds the form responses. We are going to write a function that takes the spreadsheet event as a parameter and creates the variables that we need to populate our Google Calendar event. For this particular example, we are going to need to create variables to hold three required parameters of a calendar event: a name or description, a start time date object, and an end time date object. To extend this script one step further, we are also going to ask for a longer description of the event, but this is optional, as are location and some other pieces of information.

```js
function myFunction(e){
var eventName = e.values[1];
var eventDate = e.values[2];
var startTime = e.values[3];
var endTime = e.values[4];
var eventDescription = e.values[5];

}
```

## Step 3:Create DateTime object from Google Forms variables

When we create the Google Calendar event, we will need to pass its constructor function two DateTime objects. To create these two DateTime objects we will need to parse the variable we just created. To do the parsing we'll use the JavaScript built-in date constructor: `var startDate = new Date( );` The JavaScript date object is pretty forgiving, but we will need to concatenate together the eventDate and startTime/endTime string we got from the form submission. Below our initial function definitions, we'll include the next two lines of code to create date objects from our form variables:

```js
startDate = new Date( eventDate + " " + startTime); 
endDate = new Date( eventDate + " " + endTime);
```

Now that we have all of our objects and variables created, we can make the method call to create the Google Calendar event. The first step in that process is using the CalendarApp to access the default calendar for the Google account you're using.

## Step 4: Create a variable to hold the Google Calendar we want to modify

Usually, I like to create a variable that stores Google Calendar that I'll be working with. This just keeps the code clean so that we're not using a lot of different stringed method calls. All of the methods we're working with belong to the [CalendarApp class](https://developers.google.com/apps-script/reference/calendar/calendar-app) in Google Apps Script. Using the [CalendarApp](https://developers.google.com/apps-script/reference/calendar/calendar-app), we can perform CRUD operations on any calendar you have access to, but it very easy to just get a default calendar for the associated Google account. `var myCal = CalendarApp.getDefaultCalendar( );` You can also get calendars using some of the CalendarApp methods available

## Step 5: Create Google Calendar event with the createEvent method

The last part of this function will be a call to the createEvent method on our myCal object with all of our variables to create the Google Calendar event. We can also pass along our eventDescription variable in a JSON object as an additional and optional field in the calendar event:

```js
myCal.createEvent( eventName, startDate, endDate ); 
//Optional method call with description in a JSON object
```

 

## Step 6: Other Options

There are other options that you can pass besides the description. For example, you can specify a location or whether or not to send invites to the people who sign-up.

```js
myCal.createEvent( eventName, startDate, endDate, { 
     description: eventDescription, 
     sendInvites: true, 
     location: "New Business Building"
   }
);
```

You can find out more about the advanced options using the official [Google documentation](https://developers.google.com/apps-script/reference/calendar/calendar-app#createeventtitle-starttime-endtime-options).

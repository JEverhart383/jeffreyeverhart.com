---
title: "Add Custom Menus to Google Docs, Sheets & Forms"
date: 2016-05-02
excerpt: "Using custom menus can help you automate and streamline certain tasks in Google Apps Script by creating easy-to-use interfaces so other people can run and benefit from your code."
categories: ["Google Apps Script", "Google Sheets"]
wpId: 883
---

Using custom menus can help you automate and streamline certain tasks in Google Apps Script by creating easy-to-use interfaces so other people can run and benefit from your code.

In this post, we are going learn how to add custom menus to Google Docs, Sheets, and Forms using Google Apps Script. Adding custom menus allows you to customize the UI of the Google App you are using and lets you create custom functions you can bring into your apps to make your job easier.

## Access the Script Editor

First, choose which type of Google app you want to write a custom menu for. In this example, I will write a custom menu for Google Sheets using a container-bound script, meaning the script that I'm writing will be attached to the spreadsheet. You can read more about [the difference between bound and standalone scripts](https://developers.google.com/apps-script/guides/bound) on the Google Developers page.

![screenshot of script editor menu](/media/screenshot-of-script-editor-menu.png)

To access the script editor from a Google Sheet, click on the Tools menu and then click on the item labeled Script Editor. The process for doing this is similar across all of the Google App types, like Sheets, Docs, Slides, and Forms.

Since you are opening up the Script Editor bound to this Google Sheet, you can access to a number of handy functions like `getActiveSpreadsheet(), getActiveDocument(), getActiveForm()` that help you easily access the parent document.

Additionally, there are also triggers like `onOpen` and functions like `getUi` that will help us activate features and add them to our custom menus in the next step.

## Write a Function to Add Custom Menus

The script editor in Google Sheets provides us with a text editor for our code. We can break this simple script into two parts. The first part will add a custom menu to the spreadsheet's UI when this specific sheet is opened. The second part of the script defines two custom functions that are called when we click a menu item in the custom menu.

So, let's get started by writing the `onOpen`  [simple trigger](https://developers.google.com/apps-script/guides/triggers#onopene) function that will help us add our custom menu to the Google Sheet:

```js
function onOpen( ){


// This line calls the SpreadsheetApp and gets its UI   
// Or DocumentApp or FormApp.

  var ui = SpreadsheetApp.getUi();

 

//These lines create the menu items and 
// tie them to functions we will write in Apps Script
  
 ui.createMenu('Custom Functions')
      .addItem('Get Range', 'getRange')
      .addSeparator()
      .addSubMenu(ui.createMenu('Advanced Options')
          .addItem('Get Range Values', 'getRangeValues'))
      .addToUi();
}
```

To get the menu added to the sheet when the spreadsheet is opened, we need to wrap all of the code for this section in the `onOpen()`function, which will execute everything inside of it when the spreadsheet is opened.

On line two, we make a call to the `SpreadsheetApp`, which returns an instance of the current spreadsheet, and from there we use the `getUi` method to return an instance of the current spreadsheet's UI, which we store in a variable called ui.

The next several lines all work with the UI variable we just created, and we will string together several method calls to start building our custom menu. First, we call the `createMenu`method on our UI variable, and this method takes a string as a parameter for the name of the menu.

Using dot syntax, we continue stringing together method calls and next use `addItem`to add a menu item.

The `addItem` method takes two parameters. The first parameter is a string for the name of the menu item that will be displayed in the custom menu. The second parameter is a string referencing the function that will be called when we click that menu item.

We follow a very similar pattern to add a sub-menu, as you can see in the last few lines of code. The final thing we do is call the `addToUi`method to add our custom menu to the instance of the current spreadsheet's UI.

## Write Functions Tied to Custom Menu Items

Lastly, we will need to write some custom functions that will be called when we click on the items within our custom menus. We'll write two functions, one to return the active range location and another to return all of the values in a spreadsheet's active range.

First, we can define a function called getRange and use some methods inside of the function to get some information about the spreadsheet and alert us through the spreadsheet's UI.

```js
function getRange() {
  // These lines get the active range, then return the first row and column // in that range
  var range = SpreadsheetApp.getActiveRange();
  var row = range.getRow(); 
  var col = range.getColumn(); 
  

  //These lines call the spreadsheet UI's alert window and pass a message
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
  .alert("I'm at this location: \n row:  " + row + "\n col: " + col);
}
```

Since we already attached this function to a custom menu item before defining it, we are all set to go.

The second function we can call getRangeValues, and this is going to do something pretty similar to getRange, but we'll get some more specific values from the sheet. The method we're going to use inside of getRangeValues will return a [two dimensional array](http://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript) of spreadsheet values. You can read more about the [getValues method for Google Apps Script](https://developers.google.com/apps-script/reference/spreadsheet/range#getvalues) if you have questions.

```null
function getRangeValues() {
 //Get active range of spreadsheet 
 var range = SpreadsheetApp.getActiveRange();
 //Get values in 2d array: values[0][0]
 var values = range.getValues();  
 //Call spreadsheet UI's alert window and print values
 SpreadsheetApp.getUi() 
  .alert('Here are the values for this range: ' + values);

}
```

## Customize and Use New Menu Items

After linking the two custom functions into the onOpen function, they will be added to the spreadsheet's menu the next time it is opened. Just click the menu items to test out your newly created timesaving functions. Since we add the menus using the default Spreadsheet UI, there are limited ways to customize your menus. But since [Google Sheets treats emoji characters in strings nicely](https://jeffreyeverhart.com/2020/04/13/using-emoji-in-google-sheets-formulas/), we can use them as a part of the labels we create for our menu items.

So, if we change the above code that adds the custom menu to look like this:

![an image of a function that includes emoji in string parameters, it is the same code as contained in the written onOpen example above](/media/Screen-Shot-2020-05-22-at-11.04.51-AM.png)

We wind up with some cool menu items that look like this when we access them from our Spreadsheet. Adding nuances like this can be a huge help to the people using your tools or add-ons and iconography tends to increase the understanding of what an interface options might do.

![A screenshot of our custom menu items using emoji](/media/Screen-Shot-2020-05-22-at-10.45.09-AM.png)

![an image of a request for authorization from Google Apps Script](/media/Screen-Shot-2020-05-22-at-10.52.05-AM.png)

Each time you add menu items that interact with different Google Apps, you'll be asked to authorize the application to perform those actions as a particular user.

If you click 'Continue,' you will be redirected through an OAuth flow wherein you'll select a Google Account to proceed with. Then, if the add-on hasn't been verified, Google will show a particular harsh security message about the app not being verified.

![an image of the app ins't verified screen in Google OAuth flow](/media/Screen-Shot-2020-05-22-at-10.52.27-AM-1.png)

To get past this screen, we need to choose the "Go to Custom Menu (unsafe)" link in the bottom of that alert message. After clicking that message, we are then finally asked to verify that we want to give this script access to the resources it wants to use:

![an image of the approval screen for a Google OAuth flow](/media/Screen-Shot-2020-05-22-at-10.52.54-AM.png)

After doing all of that, we can finally run our two custom functions : )

Running the 'Get Range' menu option creates an alert that give us the position of our cursor in the active spreadsheet, like a map pin of where we are :

![an image of our custom menu popup alerting the location](/media/Screen-Shot-2020-05-22-at-11.00.30-AM.png)

And, as expected our "Get Range Values" menu option creates an alert dialog of all of the values that we have currently selected using the cursor:

![an image of our custom menu creating an alert with range values](/media/Screen-Shot-2020-05-22-at-11.00.43-AM.png)

## Related Google Apps Tutorials

*   [How to serve JSON using the Google Apps Script Content Service](http://www.jeffreyeverhart.com/2016/04/14/how-to-serve-json-using-the-google-apps-script-content-service/)
*   [How to create a Google Calendar event with Google Forms](http://www.jeffreyeverhart.com/2015/11/03/how-to-create-a-google-calendar-event-with-google-forms/)
*   [Google Forms confirmation email with attachments](http://www.jeffreyeverhart.com/2015/01/30/tech-tip-google-forms-confirmation-email-with-attachments/)

---
title: "Retrieve Rows from Google Spreadsheet with Google Apps Script"
date: 2019-03-01
excerpt: "Lots of the Google Apps Script projects that people are working on start with a Google Spreadsheet as a base. Sometimes a Google Form writes data to a spreadsheet that triggers other events, or you ha"
heroImage: "/media/Source_GSuite.svg"
categories: ["Google Apps Script", "Google Sheets"]
wpId: 2009
---

Lots of the Google Apps Script projects that people are working on start with a Google Spreadsheet as a base. Sometimes a Google Form writes data to a spreadsheet that triggers other events, or you have a Sheet you've imported that you want to use to coordinate a larger workflow. This post will describe different ways of getting row data from a Google Sheet using Google Apps Script, and then walk you through ways to process the spreadsheet data using JavaScript array methods.

## Understanding Data Range

There are a ton of different methods you can use to select values in a Google Sheet, so I'm just going to focus on the easiest one that will work for the most people. Let's say we start with a spreadsheet that looks like this: ![google sheet with three columns and seven rows](/media/Screen-Shot-2019-03-01-at-10.28.29-AM.png) Our data range for this spreadsheet, which means the range of cells in which data is present, is 3 columns wide and 7 columns long including our headers. The concept of data range is important since some rows may not have data in all columns, so blank values will be included where there is nothing present. In other words, if you have 3 rows of data and 15 columns, that will construct the bounds of your data range even if all rows don't have those cells filled in. So, how do we do we get all of those values in Google Apps Script? The following line of Apps Script will access the current active sheet in your spreadsheet, find the data range of your sheet (i.e. the maximum extent of values in cols/rows), and then return those values as a two dimensional array:

```js
var rows = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
```

The better you understand how to work with [arrays in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), the more sense this data structure will make. At the end of the day, this is what our `rows` variable looks like after calling the above methods:

```js
rows = [
    ['ID','Event','Date'],
    [1, 'Meeting', '02/03/2019'],
    [2, 'Presentation', '02/05/2019'],
    ...additional rows here
  ]
```

The 2D array structure of `rows` is one outer array that corresponds to the data range of the sheet. This outer array contains an array for each row in the data range. And this inner array contains all of the values available for that particular row.

### Accessing Rows and Values using Array Index

The most important thing to know about working with arrays in this context is how to access the items inside of them. Arrays in JavaScript are zero indexed, meaning the first item inside of each array actually has an index of zero, the second item has an index of one and so on:

```js
rows[0]
// First row, index zero
// ['ID','Event','Date']

rows[1]
// Second row, index one
// [1, 'Meeting', '02/03/2019']
```

From here, the process is similar to access the values inside of each row array.

```js
rows[0][0]
// First row, index zero
// First value, index zero 
// 'ID'

rows[1][1]
// Second row, index one
// Second value, index one
// 'Meeting'
```

If this seems annoying, it certainly can be. My best advice is that if you find yourself getting a value you don't expect, double check your array indexes. The good news is that there are other patterns we can use to work with arrays depending on what kinds of things we want to make happen.

## Getting Specific Ranges

In addition to using `getDataRange().getValues()` to get all of the values in the sheet, we can be more specific with the rows we return from these queries using a variant of the `getRange` method. For example, if we wanted to only select values from our example table in the first and second columns, excluding the headers this time, we could use an expression that looks like this:

```js
var rows = SpreadsheetApp.getActiveSheet().getRange(2, 1, 6, 2).getValues()
```

The first and second parameters we pass into `getRange` represent the top-left of our range (e.g. second row, first column), while the third parameter tells the function how many rows tall the `Range` will be ( e.g. six rows tall), and the last parameter tells the function how wide the `Range` will be (e.g. two rows wide). The values we have stored in the `rows` variable correspond to this shape in our spreadsheet: ![a selected Range within a google sheet](/media/Screen-Shot-2020-03-04-at-1.23.47-PM.png) If we log out the value of `rows` using the last select statement, we get a 2D array that looks like this:

```null
rows = [ 
[1, 'Meeting'], 
[2, 'Presentation'], 
...additional rows here 
]
```

From here we can manipulate the array however we want using JavaScript to execute additional parts of your program.  

### A Gotcha with Mental Models of Ranges vs. Arrays

A lot of times when you are programming, you develop a mental model of how a things work together that helps you handle complexity. In Google Sheets and Google Apps Script, you can start to envision the entire spreadsheet as a giant 2D array. While that is a helpful construct, sometimes it can lead to confusion when things in JavaScript and Google Apps Script don't correspond. A great example of that is how both JavaScript arrays and Google Sheets apply indexing. Remember that arrays are zero-index, and a Sheets index starts at 1 for rows and columns. Take a look at this little function, that attempts to get and access the same value using those two conventions.

```js
function getSpecificValue () {
  var value = SpreadsheetApp.getActiveSheet().getRange(1, 1).getValues();
  var id = value[0][0]; 
}
```

In practice, this is a common place for someone to superimpose a value that leads to a lot of frustrated time debugging. If you are getting and reading data from a spreadsheet, and the results aren't expected, check this place first before questioning your sanity.

## Processing Rows of Google Sheets

Now that we have talked about different ways to select Google Sheets rows in Google Apps Script, it's likely that you want to process them in some way as a part of a large automation. Some common patterns involve doing something for each entry, or filtering each entry based on a particular condition.

### Do Something For Each Row | forEach loop

Once we get all of the rows and values in a spreadsheet, a very common thing is to perform the same operation on all of the rows. Maybe we have a list of clients, and [we want to send them all the same templated email](https://jeffreyeverhart.com/2014/01/31/tech-tip-how-to-send-a-confirmation-email-with-google-forms/) (i.e. mail merge type operation), or maybe [we have a list of people signed up for a 5K and we want to generate PDF waivers for each of them.](https://jeffreyeverhart.com/2018/09/17/auto-fill-google-doc-from-google-form-submission/) The possibilities are endless. We can fairly easily accomplish this pattern using [a forEach loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) on the result we get back from the data selection function above.

```js
/****
rows = [
  ['Jeff', 'jeff@email.com', 'Cool guy...']
]
****/

rows.forEach(function(row) {
 var email = row[1];
 MailApp.sendEmail(email, 'Hey you!', 'This is the body of the message');

});
```

The forEach method is super powerful and helpful. For starters, it lets you remove one time consuming step of individual selecting rows using array indices. From there, you just have to worry about passing in the row and accessing the values within each row. If you need to skip a row or a few based on some condition, we can also do something like this:

```null
/****
rows = [
  ['Name', 'Email', 'Bio'],
  ['Jeff', 'jeff@email.com', 'Cool guy...']
]
****/

rows.forEach(function(row, index) {
 if (index !== 0) { 
   var email = row[1];
   MailApp.sendEmail(email, 'Hey you!', 'This is the body of the message');
 }
});
```

In the above example, we have a row of headers that we need to skip, so we can pass the `index` parameter into our forEach loop so that we can write some conditional logic to check if the index is zero, which means we are looking at our header row. The forEach loop is super powerful, and I imagine most scripts of this type will make use of the forEach loop in some capacity. I'd recommend reading the JavaScript docs above to get a good sense for how it can and should be used.

### Filtering Rows that Meet a Condition | filter

Another question I get asked a lot is how to do something when a particular value in a row meets a condition. For example, when filling out an event registration form, I want to send an email only to people who selected 'Vegetarian' as the dinner option. Technically, we could also do that similar to the conditional logic in the example above, i.e. `if row[3] === 'Vegetarian'`, and just execute our code, but that can easily lead to a ton of nested code inside a forEach loop. There is a better array method to filter results out of an array:

```null
/***
rows = [
  ['Email', 'Number of Guests', 'Dinner Choice'],
  ['jeff@email.com', 2, 'Vegetarian'],
  ['someone@email.com', 1, 'Beef'],
  ['else@email.com', 3, 'Vegetarian'],
]
****/

var filteredRows = rows.filter(function(row){
  if (row[2] === 'Vegetarian') {
    return row;
  }
});


/***

Now, filteredRows looks like this

filteredRows = [
  ['jeff@email.com', 2, 'Vegetarian'],  
  ['else@email.com', 3, 'Vegetarian'], 
]
***/
```

We call the filter method on our array of rows, and then we pass in a callback function that takes the row as a parameter. Inside the callback function, you check for whatever value you are looking for or not looking for, and return the row if it meets your condition. If you want the row filtered out, just don't return anything. From there, we can call `forEach` on the `filteredRows` array to do the things we want to do on the subset of rows:

```js
filteredRows.forEach(function(row) {
  //Do something here
}
```

## Wrapping Up

There are several other ways to get data out of the spreadsheet that are slightly more complex than what I've talked about here, but again this method should work for most people doing most things. If you have a particular thing you are trying to accomplish that these methods might not support, feel free to leave a comment with more details. [Make a Copy of the Example Sheet and Code](https://docs.google.com/spreadsheets/d/1VqC2ljSIAxqVkal5LP8TAtYAjHn1sZoH_O0OcQtnBYM/copy)

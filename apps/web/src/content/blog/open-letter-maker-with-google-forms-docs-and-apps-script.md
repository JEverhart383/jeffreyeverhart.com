---
title: "Open Letter Maker with Google Forms, Docs, and Apps Script"
date: 2020-05-18
excerpt: "I've had a few people ask me about variations to [my write-up of how to auto-populate Google Docs from Google Forms submissions](https://jeffreyeverhart.com/2018/09/17/auto-fill-google-doc-from-google"
heroImage: "/media/Screen-Shot-2020-05-18-at-1.43.11-PM.png"
categories: ["Google Apps Script"]
wpId: 2383
---

I've had a few people ask me about variations to [my write-up of how to auto-populate Google Docs from Google Forms submissions](https://jeffreyeverhart.com/2018/09/17/auto-fill-google-doc-from-google-form-submission/). One of the most recurring involves appending all responses to a single doc instead of creating a new one from a template.

> Does anyone have a better method than manually updating a Google doc to collect signatures for an open letter? I feel like there \*must\* be a more elegant solution out there?
> 
> — will pooley lecturer in management of the deceased (@willpooley) [May 18, 2020](https://twitter.com/willpooley/status/1262293535317012480?ref_src=twsrc%5Etfw)

After getting a more specific use-case via Twitter and a shout out to the original post, I was looped in via [Sourabh Choraria](https://twitter.com/schoraria911) and decided to just make an example. There are bound to be lots of open letters circulating in Higher Ed over the coming months, so this should be someplace to point those people.

## Setting Up the Google Form and Doc

There is a lot of overlap and more in-depth explanation in the post I linked above, so I'd recommend following reviewing that post as well. I created a pretty basic form here to collect some of my personal info, but you can collect whatever you want and even lock down the Google Form to just your G Suite domain.

![an image of a google form capturing some basic personal info](/media/Screen-Shot-2020-05-18-at-1.43.11-PM.png)

From here, I also created a responses Spreadsheet from the Form to store the responses. **A Spreadsheet is require to use the code snippet below, so keep that in mind. If you put your script in the Google Form, it will not work.**

![An image of a google spreadsheet used for an open letter generator](/media/Screen-Shot-2020-05-18-at-1.48.18-PM.png)

After creating these basic parts, I created a Google Doc that will serve as my open letter. Again, that can be as fancy or as plain as you want it to be, but the part that is required here is that all of our signature lines should be stored in a table.

And in this example, this signature table needs to be the first and preferably only table in your Google Doc:

![an image of a blank open letter ready for signatures](/media/Screen-Shot-2020-05-18-at-1.41.34-PM.png)

Now that we have the G Suite resources created, we can use a simple script to take our form responses and add them as signature lines.

## Adding in Google Apps Script

In the responses spreadsheet, you can open the Tools > Script Editor menu to access the scripting environment. Then you can add this function to the existing script project:

```js
function appendSignatureRow(e){
  
  //Since there could be a bunch of people submitting, we lock the script with each execution
  //with a 30 second timeout so nothing gets overwritten
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  //Here we read the variables from the form submission event
  const date = new Date(e.values[0]).toLocaleDateString();
  //of you can use toLocaleString method if you want the time in the doc
  const name = e.values[1];
  const department = e.values[2];

  //Next format those values as an array that corresponds to the table row layout
  //in your Google Doc
  const tableCells = [name, name, department, date]
  
  //Next we open the letter and get its body
  const letter = DocumentApp.openById('YOUR_DOC_ID_HERE')
  const body = letter.getBody();
  
  //Next we get the first table in the doc and append an empty table row
  const table = body.getTables()[0]
  const tableRow = table.appendTableRow()

  //Here we loop through our table cells from above and add
  // a table cell to the table row for each piece of data
  tableCells.forEach(function(cell, index){
    let appendedCell = tableRow.appendTableCell(cell)
  })
  
  //Once we've appended the table cells, we can format the font of the 
  //signature to look more legit
  const style = {}
  style[DocumentApp.Attribute.FONT_FAMILY] = 'Yellowtail';
  const signatureCell = tableRow.getChild(0).asTableCell()
  signatureCell.setAttributes(style)
  
  //here we save and close our letter and then release a lock 
  letter.saveAndClose();  
  lock.releaseLock();
}
```

After we've done this step, save the script project and then add a trigger. That step is the same as is outline in [the post on auto-populating a Google Doc](https://jeffreyeverhart.com/2018/09/17/auto-fill-google-doc-from-google-form-submission/), so check there if you need step-by-step.

After that, you should be able to submit the Form and have a row appended to the table.

![an image of a google doc with a signature line appended to an open letter](/media/Screen-Shot-2020-05-18-at-1.41.25-PM.png)

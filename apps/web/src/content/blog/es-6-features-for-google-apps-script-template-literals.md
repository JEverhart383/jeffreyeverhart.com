---
title: "ES 6 Features for Google Apps Script: Template Literals"
date: 2020-02-07
excerpt: "Google recently announced that it is bringing [the V8 JavaScript runtime to the Google Apps Script environment](https://developers.google.com/apps-script/guides/v8-runtime), and the community, myself "
heroImage: "/media/es6-and-google-apps-script.png"
categories: ["Google Apps Script", "JavaScript"]
wpId: 2171
---

Google recently announced that it is bringing [the V8 JavaScript runtime to the Google Apps Script environment](https://developers.google.com/apps-script/guides/v8-runtime), and the community, myself included, reacted with much enthusiasm.

> This is amazing! [https://t.co/Qmbb0MIugx](https://t.co/Qmbb0MIugx)
> 
> — Jeff Everhart (@J\_Everhart383) [February 6, 2020](https://twitter.com/J_Everhart383/status/1225454768937689092?ref_src=twsrc%5Etfw)

There are a lot of things to be excited about with this new change, but I also realized at the same time that many of the people I know who do impressive work in Google Apps Script also don't ride the bleeding edge of JavaScript. So, I figured I'd share at least a few things I'm excited about in the hopes that it might encourage others to think about how this will be beneficial for their own projects. Instead of making this a super long post, I'm going to release a quick series of focused posts that dive deeper into some of these concepts over the next two weeks. The idea here is that I'll make some CodePen examples that people can edit on their own to get a feel for how these features work in the wild.

## Template Literals

By far the thing I'm most excited about coming to Google Apps Script is [the template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). Template literals let us dynamically construct strings of text, even multiline strings of text, in a more elegant way than concatenation. With template literals, you define them by surrounding a string in backticks, and then interpolating data into them using a kind of mustache-like syntax. In addition to interpolating strings into our template literal, we can also execute JS expressions to make them even more dynamic and powerful. In the first example below, we include a string variable inside of the placeholders, and the value of the variable gets rendered when the string is included in the DOM. However, we are not limited to only including strings inside of the placeholders. The curly braces can accept any valid JavaScript expression. In the second example, we perform some multiplication inside of a set of placeholders, and in the third we even call a function to randomly determine my writing schedule.

See the Pen [Basic Template Literal Example](https://codepen.io/JEverhart383/pen/wvavNEB) by Jeff Everhart ([@JEverhart383](https://codepen.io/JEverhart383)) on [CodePen](https://codepen.io).

While the above example uses some mathematical and function expressions, we can also use a few other tricks to construct more complex templates. Say for example we had an array of spreadsheet data with speaker names and presentation times:  

See the Pen [Multiline HTML Template Literal](https://codepen.io/JEverhart383/pen/XWbWOzg) by Jeff Everhart ([@JEverhart383](https://codepen.io/JEverhart383)) on [CodePen](https://codepen.io).

The example above introduces at least a few concepts, including a multiline string template, nested template literals, and some significant logic in the placeholder expression, nothing is really magic here. If we were to unpack the expression, we're using two pretty common array methods, `Array.map` and `Array.join`, to do a lot of heavy lifting. `Array.map` helps us transform our existing 2D array of spreadsheet data into an array of templates containing table rows, and then `Array.join` helps us put it all together back into a string that we could send in an email. Most people who've worked with Google Apps Script for some time have had to write a plain text email template that is full of new line characters and concatenation operators. Frankly, this was just a painful and error prone process that I'm thankful can be eliminated by switching to template literals. Stay tuned for the next installment in this series where I'll talk about arrow functions and how they can be useful for Google Apps Script developers.

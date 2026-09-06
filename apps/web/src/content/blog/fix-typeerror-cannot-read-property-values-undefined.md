---
title: "Fixing error: cannot read property \"values\" from undefined"
date: 2016-08-06
excerpt: "Typeerror: cannot read property \"values\" from undefined is one of the most persistent and frequent errors you can get when doing any type of scripting in Google Apps Script. One of the most frequent q"
categories: ["Google Apps Script"]
wpId: 1048
---

Typeerror: cannot read property "values" from undefined is one of the most persistent and frequent errors you can get when doing any type of scripting in Google Apps Script. One of the most frequent questions I get on this blog, so I decided to dedicate a post to helping people troubleshoot this pesky error. First, we'll talk about what this error means, then we'll look at the two most common scenarios in which you might get this error, and finally, we'll talk about what we can do to fix it.

## What does typeerror: cannot read property "values" from undefined really mean?

To understand this, you first need to understand what it means to be undefined in JavaScript. Let's take a look at a simple example using variables:

```js
// This line is a variable declaration
// we create it, but do not assign it a value 
// so it is undefined

var a; 

// In this line we declare and assign a variable
// this is not undefined 

var b = 6;
```

Something is undefined in JavaScript when it is an object that is expected to hold a reference to a value, but in fact references nothing. There is a really good explanation at [W3 schools on undefined in JS](http://www.w3schools.com/jsref/jsref_undefined.asp) that is worth a look if you want some better examples. In the context of our error message, it says we are trying to read a set of properties called "values" from something that is undefined, likely with a line that looks something like this if you are using the resources on this site: `var email = e.values[4];` When the script runs, it gets to this line or a line like it and and says "Ok, I see you want to create a variable called email, and you want this variable to equal the 5th value of something called e (our form submission event), but wait a minute, e is undefined! There is nothing there! Error!" The event parameter (e) exists because we injected it into the script, but it doesn't equal anything, so in turn we can't access any of its properties. In the case of most Google Apps Scripts projects, this occurs because there is not event (e) passed in when you run the script in the debugger. **What Can I Do to Fix This in Google Apps Script?**  For most people, this is a quick fix: **Submit a test form. DO NOT TRY TO RUN IN DEBUGGER.**  Remember the script needs an event, meaning we have to give it one. Since we've set a trigger tied to a form submission, that is the type of event that it expects.

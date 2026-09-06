---
title: "Using Emoji in Google Sheets Formulas"
date: 2020-04-13
excerpt: "I'm working on a project right now that allows people to send images to the Google Cloud Vision API for analysis using a Google Sheet and Google Apps Script. As part of that project, we talked about h"
heroImage: "/media/Screen-Shot-2020-04-07-at-6.47.03-PM.png"
categories: ["Google Sheets"]
wpId: 2309
---

I'm working on a project right now that allows people to send images to the Google Cloud Vision API for analysis using a Google Sheet and Google Apps Script. As part of that project, we talked about how we could incorporate emoji into the analysis in various ways to produce insights. Since this is also for a non-technical audience, I'm playing around with using emoji to help represent different elements of 'state' on a config sheet that need to be set to make successful calls to the API. Right now, it looks something like this: ![image of emoji enhanced interface in google sheets](/media/Screen-Shot-2020-04-07-at-3.33.56-PM.png)   As the users enter information and the cells reevaluate, the emoji can provide feedback about what information the script still needs to run. There are a few ways to use emoji in Google Sheets, so I'll talk about a few of them pretty quickly. Google Sheets is one of those things with endless workarounds, so there could be many simpler ways to do what I'm describing here.

### Copy/Paste

Since Google Sheets doesn't have a menu item for Insert > Special Characters like Google Docs, you can just use the typical copy/paste function of your browser to get emoji into Google Sheets, either in the cells or in the function bar. However, if I try to use copy/pasted emoji inside of a function, I get a formula parse error: ![screenshot of emoji in function creating parse error](/media/Screen-Shot-2020-04-07-at-3.46.51-PM.png) Thanks to [Martin Hawksey's](https://mashe.hawksey.info/)  advice, I realized this is the wrong way to approach including an emoji directly in the formula bar. At the end of the day, an emoji is a unicode character, which is meant to be rendered as a part of a string of text. To pass the emoji around they need to be represented as a part of a string with quotation marks: ![an image of the google sheets formula bar using emojis wrapped in strings](/media/Screen-Shot-2020-04-13-at-12.41.59-PM.png)

### Cell Reference to Copy/Paste

Looking at other ways to work with emoji, I can also copy/paste the emoji into my worksheet somewhere and use references to them to create an intersting interface. ![a screenshot of a google sheets interface using emoji and absolute references](/media/Screen-Shot-2020-04-07-at-3.53.35-PM.png) In this example, I provide absolute references to the cells that contain the relevant emoji, and that seems to work. Absolute references are very handy in the case where we want to fill down with a formula, but point to consistent cells as we do it.  However, the downside to this is that somewhere in your sheets, you would need to have a list of all of the emoji you were using, and you would need to hand build that list every time you started a project.

```md
=IF(LEN(B4) > 5, $G$5, $G$6 )
```

 

### Using CHAR Function and HTML Entity Code

I found one last way to use emoji in formulas, which looks to be the cleanest method, but also a bit more involved than just copying/pasting emoji into a sheet. Using the [CHAR function](https://support.google.com/docs/answer/3094120#) we can pass in the value of the emoji, or any unicode character, using decimal notation to render it in the spreadsheet. Using this function, we are able to construct a formula that looks like this:   ![ a screenshot of a google sheet using the CHAR function to render emoji](/media/Screen-Shot-2020-04-07-at-6.40.52-PM.png)  

```null
=IF(LEN(B4) > 5, CHAR(9989), CHAR(10060) )
```

I was able to find [several tables that list the decimal and hexadecimal codes of a wide range of emoji,](https://www.w3schools.com/charsets/ref_emoji.asp) which you can use as a reference if needed. However, that particular table isn't very searchable, so I also worked up a slightly more complicated formula that should let us use the much more common unicode format. ![a screenshot that demonstrates using the replace and hex2dec functions to transform unicode to decimal format](/media/Screen-Shot-2020-04-07-at-6.47.03-PM.png)  

```null
=IF(LEN(B4) > 5, CHAR(HEX2DEC(REPLACE("U+2705", 1, 2, ""))), CHAR(HEX2DEC(REPLACE("U+274C", 1, 2, ""))) )
```

### Emoji Lookup with UNICODE function

If you want an easier way to get at the emoji decimal code, you can use what is basically a lookup function called UNICODE in Google Sheets. You provide the emoji wrapped in quotes as a parameter, and the function returns the decimal code for the provided UNICODE character: ![A screenshot of the google sheets formula bar using the unicode function](/media/Screen-Shot-2020-04-13-at-1.02.15-PM.png)

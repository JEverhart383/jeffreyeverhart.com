---
title: "Find & Replace Text in Google Doc with Clickable Link"
date: 2023-02-19
excerpt: "This post should be a short one, and builds on a few previous posts that involve creating custom Google Docs. In those articles, I demonstrate how to use various methods of `DocumentApp` to create cus"
heroImage: "/media/Source_GSuite.svg"
categories: ["Google Apps Script"]
wpId: 3196
---

This post should be a short one, and builds on a few previous posts that involve creating custom Google Docs. In those articles, I demonstrate how to use various methods of `DocumentApp` to create custom Google Docs using Google Apps Script.

In most of those examples, I use a method called `replaceText` that exists on the document body to find text with a particular pattern and replace that text with other text supplied either from [a spreadsheet](https://jeffreyeverhart.com/2020/09/29/auto-fill-a-google-doc-template-from-google-sheet-data/) or [a form response](https://jeffreyeverhart.com/2018/09/17/auto-fill-google-doc-from-google-form-submission/). However, lots of people have asked me how to replace some text with a clickable link instead of just some text. While this is possible, it requires a little bit more work using the `DocumentApp` class.

```js
var doc = DocumentApp.openById("Your Doc Id Here");

var body = doc.getBody();

body.replaceText("{{Title}}", "Doc Title");
body.findText("{{ClickableLink}}").getElement().setText("Click Here").setLinkUrl("https://google.com");

doc.saveAndClose();
```

Since the `Body.replaceText` method is only meant for finding and replacing text with other pieces of text, we need to dig deeper into the document to set additional properties. Instead, we use the `findText` method that returns a more generic object called a `RangeElement`, which is essentially a representation of where inside of the document structure this text is located that contains the actual element.

From here, we call `getElement` to actually return us the [Text element](https://developers.google.com/apps-script/reference/document/text) of our replacement tag, and then we call `setText` and `setLinkUrl` to set the anchor text to "Click Here" and the actual link url to Google Search. The end result of this in the Google Doc is a clickable URL inside our table.

![screenshot of text in a google doc with a clickable url](/media/Screen-Shot-2023-02-19-at-1.41.55-PM.png)

It's outside the scope of this tutorial to talk about [RangeElements](https://developers.google.com/apps-script/reference/document/range-element) and [Elements](https://developers.google.com/apps-script/reference/document/element), if you're interested in doing more complicated work with Google Docs and Apps Script, it might be worth referencing the docs. Everything you see or interact with inside of a Google Doc is a more specific element.

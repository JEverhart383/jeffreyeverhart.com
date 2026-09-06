---
title: "Translate Text Selection in a Google Doc using Google Apps Script"
date: 2018-10-05
excerpt: "In this quick tutorial, we're going to build a simple little menu add-on for Google Docs that lets you translate text into another language. Some of this functionality may be baked into Google Docs at"
heroImage: "/media/Source_GSuite.svg"
categories: ["Google Apps Script", "Google Drive"]
wpId: 1871
---

In this quick tutorial, we're going to build a simple little menu add-on for Google Docs that lets you translate text into another language. Some of this functionality may be baked into Google Docs at this point, but this should be a good tutorial that wraps together a few different services and methods of augmenting Google Docs, including something new to me, the PropertiesService. 

[via GIPHY](https://giphy.com/gifs/3q1v2D3sDopp31uL5v)

You can see the basic functionality of what we will build in the GIF above. But the basics of it are that we'll add a few menu items to the Docs menu, then tie those menu items to functions that allow us to set the target language for our translation add-on and another function that will actually translate the target of our selection. 

So, let's get started. 

## Adding Menu Items

First, we're going to add some menu items to our Google Doc menu. Each one of these items will tie into a function that we will write later to actually translate the selection and save our language selection into the PropertiesService object. 

```js
function onOpen() {

var ui = DocumentApp.getUi(); 
  
ui.createMenu('Translation Tools')
.addItem('Translate Selection', 'translateSelection')
.addItem('Modify Language', 'modifyLanguage')
.addToUi(); 

}
```

We are going to write all of this code in the function onOpen, which is a function defined by Google Apps Script that will be automatically called when you open the Doc, Sheet, etc. that this script is bound to if it is [a container-bound scripts.](https://developers.google.com/apps-script/guides/bound#special_methods)  

If you are looking for a more in-depth tutorial on how to create menus for Google Apps, I have [a separate post on that that goes deep into the how-to's of that process](https://jeffreyeverhart.com/2016/05/02/add-custom-menus-google-docs-sheets-forms/). 

## Storing Language Preferences with PropertiesService 

One of the things I like about doing these tutorials is that I frequently use them as excuses to learn new things about Google Apps Script. The "new to me" thing about this particular article is the method of storing user data with the [PropertiesService.](https://developers.google.com/apps-script/reference/properties/properties-service) The PropertiesService of Apps Script lets you save data in a key:value store, which is similar to a JSON object, that have [a few different levels of scope](https://developers.google.com/apps-script/guides/properties). 

For this document, we'll look at storing some preferences that are specific to a user using getUserProperties. 

```js
function modifyLanguage() {

  var ui = DocumentApp.getUi(); 
  // Here we will use a ui.prompt instance to get some input from the user; 
  // while the prompt is open, the rest of the script will pause while we wait on user input 
  
  var response = ui.prompt('Choose the language used by the translation tools. This should be the two character language code, i.e. EN or en'); 
  
  if (response.getSelectedButton() == ui.Button.OK) {
    // If they click the OK button, we'll get the text they input into the prompt 
    var text = response.getResponseText(); 
    var lowercased = text.toLowerCase(); 
    PropertiesService.getUserProperties().setProperty('target_language', lowercased); 
  } else {
    Logger.log('The user clicked the close button in the dialog\'s title bar.');
  }


}
```

As usual, the code is fairly well commented, but I'll give a little recap here of what is going on. First, we get an instance of the document UI, then fire off a prompt to have the user input the [language code](https://cloud.google.com/translate/docs/languages) they want to set as the target language. 

As with other instances of Google Apps Script UI dialogs, this will pause the running script and wait for a response from the user. With this type of prompt, we write an if/else statement to process the possible response from the user. 

If they click OK, we get the response text, transform it to lower case, and then use the PropertiesService to set the user property 'target\_language' to the language code the user has submitted. 

From here, we can write our main function to actually translate the text selection. 

## Translating Text Selections

In terms of complicatedness, this function contains some of the most hair pulling functionality I've written in Google Apps Script in awhile. It took me a fair amount of experimenting to get what I wanted, and maybe even hacked a little bit to get there : )

```js
function translateSelection () {

  var ui = DocumentApp.getUi(); 
  var selection = DocumentApp.getActiveDocument().getSelection();
  var rangeElements = selection.getRangeElements(); 
  
  // This part is a little bit complicated. Since the selection in a Google Doc returns a range, not text, 
  // we have to do some massaging to get the text. Since rangeElements is an array data type, we'll map it 
  // to a new array that returns the text. Then, once we have an array with text, we'll join that into a sentence
  // using array methods
  var text = rangeElements.map( function(element) {
    // Here we have to walk down the classes to get to usable text:
    // We go from rangeElement to Element to Text and then get the text as a string
    return element.getElement().asText().getText(); 
  })
  var string = text.join('');
  // Here we'll get a user property called target_language
  // PropertiesService is basically a key:value store like localStorage  
  var userDefinedLanguage = PropertiesService.getUserProperties().getProperty('target_language')
  // Next we do some checking and if userDefinedLanguage is undefined, we'll set a default
  var targetLanguage = userDefinedLanguage ? userDefinedLanguage : 'es';  
  var translation = LanguageApp.translate(string, 'en', targetLanguage);
  // Confirm the translation to be made; the script will pause execution here to wait for user input
  ui.alert('The following translation will be made: \n' + string + ' -> ' + translation);
  
  // Here we'll actually replace the document contents 
  DocumentApp.getActiveDocument().getBody().replaceText(string, translation) 

}
```

### Getting Actual Selection Text 

Overall, the most difficult thing here was getting the text of the selection, meaning whatever is highlighted by the mouse when the function is triggered. That code is a bit tricky because of all of the different Element classes Google Apps use. The getSelection method returns a range, which are essentially X,Y coordinates of where the selection is in the document. From there, we get the RangeElements which are still not entirely useful to us, but I consider them an array of elements that hold the Elements. 

So, we take our array of RangeElements and use the .map method to transform it into a new array. The .map method works similar to the .forEach method, but produces a new array. So for each RangeElement in the array we call the getElement method on that, then asText() and finally getText() to get the text of that element, which could be a character, whitespace, punctuation, etc. 

After all of that, we have a variable text that should look something like this: 

```js
text = ["t","h","i","s"," ","i","s"," ","t","e","x","t"];
```

It is basically our selection broken up into individual characters and spaces. To reassemble this, we can just use the .join array method to make one string. 

### Translating Our String

Now that we have the string of our selection, we can retrieve the target language from the PropertiesService using the getProperty method. In this case, there is always the potential that no target language has been explicitly set, so we set a default if not: 

```js
var userDefinedLanguage = PropertiesService.getUserProperties().getProperty('target_language')
var targetLanguage = userDefinedLanguage ? userDefinedLanguage : 'es';
```

I do that checking using [the ternary operator,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) which is basically syntactical shortcut for if/else. The first argument, in this case userDefinedLangauge is evaluated for true/false. If true, the variable targetLangauge is set to userDefineLangauge, but if false, we set it to 'es.' I'm relying on what the PropertyService returns here if nothing has been set, which is undefined. 

Once we have the target language as a variable, we can use the LanguageApp to actually do the translating: 

```js
var translation = LanguageApp.translate(string, 'en', targetLanguage);
```

In this example, I am hardcoding the source language as 'en,' but in a more comprehensive example, we may want to make that configurable as well. The translate method of the LanguageApp takes the string we want to translate, the source language, and the target language, returning the translated string. 

In the more comprehensive code snippet above, I actually show the translation in a UI for the user to confirm, but won't go over that in depth. From there, we just replace the original selection with the translated text: 

```js
DocumentApp.getActiveDocument().getBody().replaceText(string, translation)
```

### Wrapping Up 

Overall, I learned a lot of new and useful things from writing this post. First, this was my first experience with the [LanguageApp](https://developers.google.com/apps-script/reference/language/language-app), and it's very cool to learn about the functionality available here if you do anything regarding translation. Second, this was also my first rodeo with the [PropertiesService](https://developers.google.com/apps-script/reference/properties/properties-service) available through Apps Script, so I'm really intrigued as to possible uses for this in storing user preferences that persist across script sessions. 

### Related Posts

Here are just a few posts that might be of interest to you or dig a bit deeper into things I've only glossed over here relating to Google Apps Script: 

*   [Add Custom Menus to Google Apps](https://jeffreyeverhart.com/2016/05/02/add-custom-menus-google-docs-sheets-forms/)
*   [Replace Text in Google Docs](https://jeffreyeverhart.com/2018/09/17/auto-fill-google-doc-from-google-form-submission/)

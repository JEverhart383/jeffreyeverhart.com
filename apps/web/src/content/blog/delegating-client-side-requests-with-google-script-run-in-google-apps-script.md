---
title: "Delegating Client-Side Requests with google.script.run in Google Apps Script"
date: 2020-05-09
excerpt: "This should be a quick post, but I'm doing more of my Google Apps Script development in [clasp](https://github.com/google/clasp) using TypeScript now, which exposes some interesting ways of doing thin"
heroImage: "/media/google-apps-script-typescript.png"
categories: ["Google Apps Script", "TypeScript"]
wpId: 2365
---

This should be a quick post, but I'm doing more of my Google Apps Script development in [clasp](https://github.com/google/clasp) using TypeScript now, which exposes some interesting ways of doing things that I'll continue to document as time allows.

As much as I appreciate the built-in script editor, the cognitive overload of even moderate software with a bunch of top level files and global functions is a huge barrier to productivity. It feels really great to develop for a platform like Apps Script with my own tools.

For me, at least, that's because software is easier to reason about as a collection of clearly labeled objects and folder hierarchies. Clasp and TypeScript allow me to develop this way, and transpile it all to code that works in the Apps Script runtime. Awesome, but not perfect...

## We Still Need _Some_ Global Functions

With the recent switch to the V8 runtime, Apps Script made it easier to use object-oriented code by [allowing you to pass object methods as callbacks](https://developers.google.com/apps-script/guides/v8-runtime#call_object_methods_from_triggers_and_callbacks) that would previously only accept a global function.

Since this release, I've been taking a lot of my work-in-progress projects and converting them to clasp and TypeScript, while doing a lot of refactoring along the way, taking advantage of ES6 features like classes, [template literals](https://jeffreyeverhart.com/2020/02/07/es-6-features-for-google-apps-script-template-literals/), and [arrow functions](https://jeffreyeverhart.com/2020/02/12/es6-features-for-google-apps-script-arrow-functions/) wherever it makes sense.

For the most part, this is fantastic, but when working on the interface for an options modal I ran into a place that still requires the use of global functions to work appropriately, the [google.script.run client-side API.](https://developers.google.com/apps-script/guides/html/reference/run)

This handy API allows you to invoke functions exposed in a server-side script from the HTML output of a Apps Script web app. This makes it easy for any front-end code or JS framework to communicate back with a server-side script using asynchronous JS. Since the script is included automatically in the output of a published web app, it makes it very friendly to develop complex SPAs that take advantage of this easy to use API.

In practice, that looks something like this played out in a single Vue instance:

```generic
const restfulSheets = new Vue({
   el: '#restful-sheets',
   data: {
    newTable: {
      name: '',
      columns: []
    },
    existingDataModel: null,
    existingSheets: [],
    selectedSheet: ''
   },
   methods: {
    addColumnToNewTable: function () {
      let newColumn = {
        name: '',
        type: '',
        state: 'editing'
       }
       this.newTable.columns.push(newColumn)
    },
    addTable: function () {
      google.script.run.withSuccessHandler(this.onSuccess).addTableToSpreadsheet(this.newTable)
    },
    deleteTable: function (sheet) {
      google.script.run.withSuccessHandler(this.onSuccess).deleteTable(sheet)
    },
    loadExistingDataModel: function (data) {
      console.log(data)
      this.existingDataModel = data
    },
    getAllTablesSuccess: function (data) {
      this.existingSheets = data
    },
    onSuccess: function (data) {
     M.toast({html: data})
    }
   },
   computed: {
   },
   created: function () {
     google.script.run.withSuccessHandler(this.getAllTablesSuccess).getAllTables()
     google.script.run.withSuccessHandler(this.loadExistingDataModel).getProperties()
   }
 })
```

For example, in the `addTable` method of the Vue instance, we make a call to the server-side script and pass some data, as well as attach a callback that will resolve in the on the Vue instance on success via the `onSuccess`callback:

```js
google.script.run.withSuccessHandler(this.onSuccess).addTableToSpreadsheet(this.newTable)
```

This asynchronous API makes communication between a web-app and a script fairly straightforward, but the limitations of the google.script.run API force us into a design constraint.

In the above example, the  `addTableToSpreadsheet` function has to be exposed as a global function in the server-side script.

At present, something like the example below returns an error, even though I didn't expect this to work either given that [object methods are hidden from the client](https://developers.google.com/apps-script/guides/html/communication#private_functions).

```js
google.script.run.withSuccessHandler(this.onSuccess).SheetsService.addTableToSpreadsheet(this.newTable)
```

This constraint is a bit of a pickle for overall code organization, as ideally I'd like to limit the number of global functions I have in favor of composing more useful objects via classes, methods, and properties.

However, since we have a more useful object-oriented toolbox with TypeScript and clasp, I was able to arrive at a pattern that helps to overcome some of these platform constraints.

## The Delegation Pattern

After a while, writing code becomes less about knowing all of the specifics of a language, framework, or platform, but more about being able to match patterns. After seeing a sufficient number of different problems, you get better at saying, "Hey, this bit of problem X seems a lot like this part of problem Y, maybe we could use that."

Unsurprisingly, some of the more academic coders have spent lots of time documenting some of these [patterns that are either structural or behavioral](https://en.wikipedia.org/wiki/Software_design_pattern) in nature. If we would all just read the docs, right...

The [Delegation Pattern](https://en.wikipedia.org/wiki/Delegation_pattern) describes an object whose role it is to accept requests, delegate those responses to other objects, then return the responses to the original caller. At face value, this seems to fit my problem. I don't want a smattering of 10-15 global functions hooked into the UI. I want one object that takes all requests, delegates the request to other parts of my code, and then returns the value when all is settled.

To implement this in practice, I created one global function named `callUiService` that is called by all client-side invocations of `google.script.run` calls. The `callUiService` function in turn passes its data to an instance of the `UiService` class that delegates the response out to the particular object needed to fulfill the request.

In this example,  `UiService` is our delegation object, with one global function that calls it and passes its result to the client:

```js
//This is our global function we will call from the web app
function callUiService(callable: string, data: any) {
  const uiService = new UiService(callable, data)
  return uiService.delegate()
}
```

In the user interface code, I'm able to tap into the `callUiService` function using the `google.script.run` API and pass a callable function name as a string and any optional data I might need for the server-side script, which looks like this:

```js
//In the UI, we pass the name of the function we want to run and any data
created: function () {         
google.script.run.withSuccessHandler(this.loadExistingDataModel).callUiService('getDataModel')        google.script.run.withSuccessHandler(this.loadBaseURL).callUiService('getPublicUrl')
}
```

In this instance, the `callable` argument passed into the `callUiService` global function is a string that corresponds to the name of a method on the `UiService` class.

The `UiService`class is where the bulk of the magic happens, as it is responsible for coordinating the work between other service objects and implementing any business logic to prepare the result for the UI:

```typescript
import DataModel from "../DataModel";

export default class UiService {
  private callable:string = null
  private data:any = null
  constructor (callable:string, data:any) {
    this.callable = callable
    this.data = data
  }
  delegate () {
    if (typeof this[this.callable] === 'function') {
      return this[this.callable](this.data)
    } else {
      throw new Error('The callable passed to UiService was not a function')
    }
  }

  getDataModel () {
    return DataModel.getMasterPropsAsJSON();
  }

  getPublicURL () {
    return ScriptApp.getService().getUrl(); 
  }
}
```

The `delegate` method of this class is the most interesting part. First it verifies that the function name passed in is actually callable, and then it calls it passing in any payload data :

```typescript
delegate () {
  if (typeof this[this.callable] === 'function') {
    //this.callable = 'getDataModel'
    return this[this.callable](this.data)
  } else {
    throw new Error('The callable passed to UiService was not a function')
  }
}
```

The benefit of this approach is that the callable functions on `UiService` can be as simple or as complex as you like. The reason I trended towards this path is because I have at least ten more methods that need to be available from the UI, all with varying requirements for return data.

In this instance, a lot of this app's functionality will be split between API operations available over GET/POST requests and others available via an interface in Google Sheets.

Abstracting away the calls from the user interface allows me to create flexible service classes that cover the overlap between the two use cases (Sheet CRUD operations, reading/writing to Properties, etc...) while implementing them in different ways based on who is calling a particular operation.

For me, as well, the pattern described above helps take away some of the ambiguity involved in writing code. By enforcing an opinionated pattern, I always know where to look for issues when debugging, e.g. if an HTML interface is requesting data, I know it is doing so through the `UiService` class.

## Wrapping Up

Overall, this was an interesting thing for me to experiment with and write-up as an example. This site and its articles have always functioned as a way to help solidify my own understandings of things I'm learning. As tools change, the patterns of the problems vary so much less. The process of writing up this post has helped remind me of that fact.

After having used clasp for awhile now, I'm a huge fan. The tight integration I get with VS Code helps me to feel super productive by also using the CLI to automate builds and deployments. But using your own tools is key. The built-in editor always felt like someone else's living room. Happy Coding.

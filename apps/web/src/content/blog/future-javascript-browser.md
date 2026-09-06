---
title: "The Future of JavaScript and the Browser"
date: 2017-02-20
excerpt: "I've been doing a deep dive into Vanilla JavaScript lately, partly as a pretty overt reaction to the proliferation of client-side MV\\* frameworks. My thought process is that the time spent learning fr"
heroImage: "/media/download.png"
categories: ["JavaScript", "Web Development"]
wpId: 1183
---

I've been doing a deep dive into Vanilla JavaScript lately, partly as a pretty overt reaction to the proliferation of client-side MV\* frameworks. My thought process is that the time spent learning frameworks isn't necessarily transferrable beyond some of the high-level concepts they help you solve, things like routing, data-binding, and dependency injection. But, once you learn what data-binding is with AngularJS, it's pretty much the same in Knockout, React, or Angular 2, although it may be implemented differently using different tooling. As the JavaScript standard continues to evolve, it's my feeling that we should need these types of frameworks less and less as the problems they solve should be built into the language itself. I want to take a second and just and talk about some of ways in which I see this transformation happening using some features of ES6.

## JavaScript | Fetch and Promises

Most modern applications have some need to manage AJAX requests, so numerous libraries have tried to simplify this common problem. Although not too difficult to grasp on its own, there is a certain tedium in handling all of the particular states of an [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest). jQuery is a more popular example of taking this pattern from the vanilla XHR to something as quick as $.ajax. The downside is that as we abstract away from the lower-level APIs (as low-level as JavaScript can be), we also lose some understanding of what is going on underneath the hood. Therefore, it's great to see the browsers implementing parts of the ES6 standard that simplify this in a way that no library is needed. Let's take a look at a few examples.

```js
var xhr = new XMLHttpRequest();
xhr.open('GET', '/some-path-here.css', true);

xhr.addEventListener('load', function () {
  console.log(this.responseText); 
});

xhr.send();
```

This is a pretty bare bones AJAX request, so imagine this with more config boilerplate setting headers or a more intensive call back. There is a clear pattern here: create a new XHR object, open a connection, register a callback, send the request, run callback on response. However, once we have the need to process and use the data in the initial response for subsequent calls, the pattern breaks down. Additionally, to do error handling in this paradigm, we'd also need to register another event listener and callback. It's pretty easy to see how that could get messy quickly.

### Fetch to the Rescue

Not that they are perfect, but [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) make this much easier to handle by addressing the need to process and build data objects from successive network calls. Nowhere is this utility better illustrated then in the use of [the new Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). Although I'm not sure this has wide enough browser adoption to use in production with a polyfill, the future looks very promising with this handy little addition.

```null
var myImage = document.querySelector('img');

fetch('/some-data-path-here.json')
.then(function(response) {
 return response.text(); 
})
.then(function(text){
console.log(text)
})
.catch(function(error){
console.log(error); 
});
```

While there are still more than a few callbacks in this pattern, at least their execution happens in what appears to be a synchronous manner. In typical async patterns, it's easy to get lost in callback hell, but the then/catch pattern makes things a whole lot simpler. I'll be looking forward to using the Fetch API liberally when its browser support grows, until then I'm happy to create my own wrappers around the standard XMLHttpRequest and promises.

---
title: "How to build an HTTP file server with Node.js"
date: 2016-04-23
excerpt: "Over the last year or so, I've been working more and more with Node.js for a variety of projects. I started by building a few command line apps, progressed to some simple Node/Express sites, and more "
categories: ["JavaScript", "Web Development"]
wpId: 998
---

Over the last year or so, I've been working more and more with Node.js for a variety of projects. I started by building a few command line apps, progressed to some simple Node/Express sites, and more recently tackled some pretty complex apps that integrate RESTful web services that are hosted on AWS and Heroku. While I've gotten pretty good at using Node.js and other npm packages to do what I want, I can't really say that I know more about the core Node modules than I did a year ago. As any good developer needs to do to keep their skills sharp, finding good learning resources is key to figuring things out quickly, so I checked out two courses on Udemy that I'll give links to that have helped me build a better understanding of Node. In this tutorial, I want to expand on the simple server taught in most Node tutorials so that we can learn a little bit more about the url, file system, and path modules to help us build better Node apps. \*\*\* In reality, I'd still use Express, but our goal here is to learn more about Node, not to quickly build out an application.

## Step 1. Creating a server using the HTTP module

Ok, this section is basically the bread and butter of any first Node tutorial, so I'm not going to spend a lot of time on this section.

```js
//First require the http module
var http = require('http'); 


var server = http.createServer(function(req,res){


  res.writeHead("200");
  res.end("Hello World"); 
 
   

}); 

server.listen(8080); 

console.log("server is listening on port 8080...");
```

First, you want to require the core http module to act as our server, and then call createServer on the http module. That takes a callback function with the request and response objects as parameters. Understanding the request (req) and response (res) objects in Node is important to understanding how to deal with I/O.

### Request

The request is what gets sent to the server from the browser. When you type in an address like localhost:8080/about, you are making a request to a server for a specific resource or file. Each request comes with a lot of information about the request itself and the user agent, so just for fun throw the request object into a console.log and see what happens. Try poking through it and find out some of the data that it passes.

### Response

The response is what the Node server will send back to the browser, and we can decide what type of file to send and set all of the headers for our HTTP response. Let's try writing a response.

### Writing a Response

Once we create the server and give it access to the request & response objects, we need to tell it how to handle requests. In this example, we will just tell it to write an HTTP header of 200 OK and end by sending the string "Hello World" to the browser.

```js
var server = http.createServer(function(req,res){


  res.writeHead("200");
  res.end("Hello World"); 
 
   

});
```

###  Telling the Server to Listen

After we've created the server and told it how to handle incoming requests, we need to tell it to listen on a specific port. We call the listen method on our server variable and pass it a port number to listen on. After that, we'll just console log a message about the server so that we know everything is working the way it should.

```js
server.listen(8080); 
console.log("server is listening on port 8080...");
```

##  Step 2. Building out the file system

Ok, so we've got a minimally functional file server that sends a string anytime someone makes a request on that port, but that is far from helpful in most real life scenarios. To get a better idea of how to use core Node modules to serve files, we need a more elaborate file system to work with. Go ahead and build out a few simple HTML pages to serve to the browser. My project folder looks like this  

```null
---node-server
------app.js
------index.html
------about.html
------routes.js
```

Since we have more than one page to serve based on different HTTP requests, I also created another JS file that will hold a router module that we will create to handle the route requests.

## Step 3. Accessing the request URL

As I said before, the request object gives the server a ton of information about the specific request being made, and one thing it passes along is information about the url that was requested. To use that to help us route requests, we'll need to access the url of the request sent by the browser. There is a pretty simple built in way to access the request URL, but there are some limitations:

```js
requestURL = req.url;
```

Each request object has a url property that we can access using dot syntax. However, if we incorporate the url module, we can parse the request url in a much better way. Thinking about how we route more complex URL requests, the url module makes a lot of sense. For example, let's take a look at the following two URLs:

```null
http://localhost:8080/about

http://localhost:8080/about?page=1&something=7
```

The first url path is straightforward, while the second one can be more difficult to route unless we do some additional parsing.

### Requiring the url module

To get started parsing the url, we add an additional require statement to our app.js file that pulls in the url core module. From there, we call url.parse on req.url to generate a helpful object that we can use when creating our routers in the next step.

```js
var http = require('http'); 
var url = require('url'); 


var server = http.createServer(function(req,res){

  res.writeHead("200"); 
  
  var parsedURL = url.parse(req.url); 
  var parsedPathname = parsedURL.pathname; 

   

}); 

server.listen(8080); 

console.log("server is listening on port 8080...");
```

Let's take a look at what we get when we parse a url using url.parse.

```js
Original Request URL: http://localhost:8080/about?page=1&something=6

console.log(url.parse(req.url));

Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '?page=1&something=6',
  query: 'page=1&something=6',
  pathname: '/about',
  path: '/about?page=1&something=6',
  href: '/about?page=1&something=6' }
```

When we parse the request.url property with url.parse, we get an object that separates the pathname and query string into separate properties, which makes them much easier to work with. Great! We've got a nicely parsed url to work with, so let's set up some routes.

## Step 4. Routing our requests

In most scenarios, you should use the Express framework to help you work with routes, but just to learn a bit more about Node, let's build one using the file system module. This is where the routes.js file we created earlier comes into play. Inside of the route.js file, require the file system module so that we can use it later.

```js
var fs = require('fs');
```

  To get started building the router, let's define an object that we will export into app.js to handle routes. I'm going to call this router, but you can call it whatever you'd like. Inside of this object, let's create a method called checkRoutes. This will be a function that takes a few parameters and instructs the file system to load different pages based on the url path of the request.

```null
var router = {

 checkRoute : function(url, req, res){
   //accepts a url path, req object, response object 
   //do all of our routing in this function

 }

}

module.exports = router;
```

After we've defined the object we will export, we can write a quick function to handle the routing. Since I want this function to have access to the http request/response object, I'll need to explicitly pass them as parameters to keep them inside the right function scope.

```js
var router = {

  checkRoute : function(url, req, res){

    switch(url){

      case "/":
      fs.readFile('index.html', function(err, data){	
        if(err){
          console.log(err); 
        }
        res.end(data); 
      }); 
      break;

      case "/about": 
      fs.readFile('about.html', function(err, data){	
        if(err){
          console.log(err); 
        }
        res.end(data); 
      }); 
      break;

      default: 
      res.writeHead(404); 
      res.end("I'm not sure what you're looking for.");
    }

  }
```

We can use a quick switch statement to test a few conditions and respond with a 404 if nothing is found that matches a path we defined. I'm sure there are other ways to do this that are more scalable, but I felt like playing around with a switch statement :)

### Using the file system module

Let's take a closer look at the usage of the file system module since that is what we are looking at anyway.

```null
fs.readFile('about.html', function(err, data){

    //do something with error and data here 
});
```

Using the readFile method of the file system module, we can read in a file and do something with the data, although it is also a good idea to implement some sort of error checking in case the file you are looking for is not found. In this case, since we have access the Node request and response objects, we can simply end the response and pass the data returned by the readFile method to the browser so that it will render the HTML. Since there is always the potential for someone to type a route you haven't defined, we can include a default switch behavior to send a 404 error.

```js
switch(url){

      case "/":
      fs.readFile('index.html', function(err, data){	
        if(err){
          console.log(err); 
        }
        res.end(data); 
      }); 
      break;

      case "/about": 
      fs.readFile('about.html', function(err, data){	
        if(err){
          console.log(err); 
        }
        res.end(data); 
      }); 
      break;

      default: 
      res.writeHead(404); 
      res.end("I'm not sure what you're looking for.");
    }
```

 

### Export your module to app.js

Lastly in router.js, we just need to export the router object so that we can use it in app.js.

```js
module.exports = router;
```

##  Step 5. Using the router with the server

Now that we have the router module exported, we just need to require it in our main app.js file to start using it.

```js
var router = require('./router');
```

Route checking is as easy as making a call the checkRoute method and passing it the url parsed pathname, the request object, and the response object.

```js
var server = http.createServer(function(req,res){

  res.writeHead("200"); 
  
  var parsedURL = url.parse(req.url); 
  var parsedPathname = parsedURL.pathname; 

  router.checkRoute(parsedPathname, req, res); 
   

});
```

Our call to the router will then respond with different files when they are requested from the browser. That is the basics of how to set up an HTTP server with Node.js. If you want to learn more, check out some of these other posts:

## Want to learn more?

If you are looking for more specific and detailed material, check out these courses on Udemy that I've taken and reviewed: [Learning and Understanding NodeJS by Anthony Alicia](https://www.udemy.com/understand-nodejs/) This is a great course because it teaches you about the core of Node.js, how it's written, and its inner workings. The course also touches on some popular topics like the MEAN stack and exposes you to popular npm packages like mongoose and express. [Learn Nodejs by building 12 projects by Eduonix Learning Solutions](https://www.udemy.com/learn-nodejs-by-building-10-projects/) This course does exactley what it says and and walks you through a lot of different by very beneficial projects. This course covers CRUD operations with node and touches on authentication packages. They don't spend as much time the architecture of Node itself, but it does teach you a lot of awesome ways to use it to build things.

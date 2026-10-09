# Building a GitHub activity feed with Node.js and Socket.io

Source: https://knock.app/blog/building-a-github-activity-feed-with-nodejs-and-socket-io
Author: Jeff Everhart (Developer Advocate)
Published: 2024-04-17
Captured: 2026-09-13

---

An in-depth guide that covers building a real-time activity feed using Node.js, Socket.io and GitHub webhooks.

---

In a previous article, we discussed [the benefits of creating an activity feed for your product](https://knock.app/blog/the-benefits-of-adding-an-activity-feed-to-your-product). In this post, we’ll cover how to build an activity feed directly into your product using Node.js and Socket.io.

Let’s say we’re building a B2B SaaS app for developers, and it needs to show an activity feed of what is happening in their organization’s GitHub repo. Any commits pushed to the repository should be displayed in the app in real-time. That’s what we'll build in this post. You can find [the completed project available on GitHub](https://github.com/JEverhart383/github-activity-feed).

We’ll use a library called Socket.io to implement WebSockets that send events in real-time from our backend Node.js server to our frontend JavaScript client whenever the server gets a message from GitHub that a repo has been updated. We’ll create webhooks to get that information from GitHub and set up our Node.js server to listen for these webhook events.

## Creating your server

First, let’s create the Node.js server that listens for GitHub webhook events and updates connected clients in real-time using WebSockets via `socket.io`. It will also serve a static HTML file for the client-side interface.

To set up this project, create a new directory and initialize a Node.js project:

```bash
mkdir github-webhook-feed
cd github-webhook-feed
npm init -y
```

Install the following packages using `npm`:

```bash
npm install express body-parser socket.io
```

Create a file called `index.js` and include the following code for this server:

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
app.use(bodyParser.json()); // For parsing application/json
const server = http.createServer(app);
const io = socketIo(server);

// Endpoint for GitHub Webhooks
app.post("/webhook", (req, res) => {
  const event = req.body;
  // Check for a push event
  if (event && event.pusher) {
    io.emit("new_commit", event);
  }
  res.status(200).end();
});

// Serve the client HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("A user connected");
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
```

Let's break down this code step-by-step. First, we have the module imports and initializations.

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
app.use(bodyParser.json()); // For parsing application/json
const server = http.createServer(app);
const io = socketIo(server);
```

First, we import `express`. The [Express framework](https://expressjs.com/) allows us to create routes that will respond to webhook POST requests and serve an HTML file when a GET request is made to the root of the site.

Next, we import `body-parser`, which is middleware for parsing incoming request bodies before your route handlers run, available under the `req.body` property.

Then, we have the two imports we need to set up our WebSockets. The `http` module creates a basic HTTP server, and `socket.io`, a library for building real-time applications, enables real-time, bidirectional, and event-based communication between web clients and servers.

### Using Express with Socket.IO

Once we’ve imported all our modules, we create an instance of Express and assign it to a variable called `app`, and then call the `.use()` method with `body-parser` as an argument, which tells Express to use the middleware to parse the JSON body of incoming requests.

Then, we create an HTTP server and pass the Express `app` as an argument and initialize a new instance of `socket.io` by passing that HTTP server object into `socketIo`. This allows `socket.io` to work in conjunction with the Express app to handle both regular routes and WebSockets.

### Creating server endpoints

Now that we’ve configured a server that can use both Express and Socket.io, let’s add the endpoints we’ll need to accept webhook payloads and serve our user interface.

#### Receiving webhook POST requests

First, we’ll create our `/webhook` endpoint using the `app.post` method:

```javascript
app.post("/webhook", (req, res) => {
  const event = req.body;
  // Check for a push event
  if (event && event.pusher) {
    io.emit("new_commit", event);
  }
  res.status(200).end();
});
```

This listens for POST requests to the `/webhook` path, and when a POST request is received it runs the callback function we provide. Inside the callback function, we check the request's body using the `req.body` parameter. In this example, `req.body` will contain event data from GitHub. If the event data includes a `pusher` object, which indicates a push event, we’ll emit a `new_commit` event to all connected WebSocket clients using `socket.io` and pass in the GitHub event data.

#### Serving static HTML with GET handlers

We’ll also need a front end to connect to our WebSockets, and we do that by serving the client HTML file.

```javascript
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
```

This is a route handler for GET requests to the root URL (`/`). It serves the `index.html` file located in the same directory using the `res.sendFile` method in Express.

### Handling WebSocket connections

Next, we’ll add a function to create our [socket.io](http://socket.io/) connection handler.

```javascript
io.on("connection", (socket) => {
  console.log("A user connected");
});
```

This listens for `connection` events on the `socket.io` instance. Every time a new client connects, the callback function is executed, and the message "A user connected" is logged to the console.

Finally, we start the server and listen on port 3000:

```javascript
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
```

Let’s set up our client code next.

## Creating your client

Now, let’s move on to the frontend. Create an `index.html` file in the same directory as your `index.js` file and add this code:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>GitHub Commit Feed</title>
    <script src="/socket.io/socket.io.js"></script>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
      }
      .notification {
        background-color: #fff;
        border: 1px solid #ddd;
        padding: 10px 15px;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .notification-header {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <h1>GitHub Commit Feed</h1>

    <script>
      document.addEventListener("DOMContentLoaded", function () {
        const socket = io();

        socket.on("new_commit", function (data) {
          const notificationDiv = document.createElement("div");
          notificationDiv.className = "notification";

          const header = document.createElement("div");
          header.className = "notification-header";
          header.textContent = `New commit in ${data.repository.name}`;

          const content = document.createElement("div");
          content.textContent = `Commit by ${data.pusher.name}: "${data.head_commit.message}"`;

          notificationDiv.appendChild(header);
          notificationDiv.appendChild(content);
          document.body.appendChild(notificationDiv);
        });
      });
    </script>
  </body>
</html>
```

There are a few critical parts of this HTML file to highlight.

The first is the `script` tag in the `head` of our HTML document that loads the Socket.IO client library. This script tag includes the [Socket.IO](http://socket.io/) client library that will communicate with our [socket.io](http://socket.io) server from the code above.

We then have a few CSS styles for the document `body`, and `notification`, and `notification-header` classes.

Then, in our document’s `body` section, we have some JavaScript that we’re using to update our feed. The JS is wrapped inside an event listener on the `DOMContentLoaded` event, which runs after the DOM is fully loaded. This allows us to make sure the Socket.io client script is loaded before we use it in our code.

We create a new variable called `socket` and initialize it to a new `io()` client object. This establishes a WebSocket connection to the server.

From there we create a new event listener on `socket` that listens for the `new_commit` event we send from the server when a GitHub webhook is received. When a new commit event is received, the callback function is executed to handle the data.

Inside the callback, we use some vanilla JavaScript to create the HTML structure for our notifications:

    * A new `div` element with the class `notification` is created to represent a notification.
    * Two more `div` elements are created within this notification `div` to display the repository name (with class `notification-header`) and the commit details.
    * These elements are appended to the `notificationDiv`, and then `notificationDiv` is appended to the `body` of the document, making the commit data visible on the page.

The JS code in the `<script>` tag dynamically updates the web page's content in real-time as new commit data is received from the server via the established WebSocket connection. Each new commit results in a new notification being added to the page with the details of the commit.

## Setting up your webhook

To start our server locally, you can run the following command:

```bash
node index.js
```

At the moment, our webhook endpoint is at `http://localhost:3000/webhook`. But we can’t give this URL to GitHub and expect anything to happen—GitHub can’t access our local server.

The solution is to use a service like ngrok to expose our server to the internet. [Download and install ngrok](https://ngrok.com/), then, in a different terminal tab, run:

```bash
ngrok http 3000
```

This will expose the server on that port to the internet and give you a public URL you can use that will look something like this:

This URL is what you are going to give to GitHub. Follow the

1. Go to your GitHub repository.
2. Navigate to **Settings** > **Webhooks** > **Add webhook**.
3. In the **Payload URL**, enter the ngrok URL followed by **<code>/webhook</code>**.
4. Choose <strong><code>application/json</code></strong> for content type.
5. Select <strong>Just the push event</strong>.
6. Add the webhook.

Whenever a push is made to the repository, GitHub will send a POST request to your server.

Let’s push some changes to a GitHub repository and see what happens.

<ImageModal
  src="/assets/blog/building-a-github-activity-feed-with-nodejs-and-socket-io/github-activity-feed-example.gif"
  alt="A Gif of the feed updating on repo commit"
>
  <img
    src="/assets/blog/building-a-github-activity-feed-with-nodejs-and-socket-io/github-activity-feed-example.gif"
    alt="A Gif of the feed updating on repo commit"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

## Building more sophisticated feeds

So, we have a basic feed, but what’s missing here? If you read the first part of this series on [the benefits of creating an activity feed for your product](https://knock.app/blog/the-benefits-of-adding-an-activity-feed-to-your-product), you know that a lot goes into making a _good_ activity feed.

For a production-level feed, we’d likely need to consider the following things:

- This feed should be a separate component with different variants, like a full-page inbox or a popover inside a header. We might also want to style it differently for commits, PRs, merges, etc.
- We’d probably want to store the GitHub activity events in a database and pull from that to populate the frontend activity feed. Then, we could include logic to always show the last N events. Right now, refreshing the client loses the feed because we have no persistence for our activity feed.
- We'd want some way to manage message status, such as marking a notification as seen or dismissing notifications, as well as some mechanism for the user to personalize their feed experience.
- We'd have to manage the infrastructure for this extra server, and in this example we really only have one client user. It would require a lot more server-side logic to handle these updates across thousands of repositories and hundreds of organizations.

Creating a basic activity feed is easy, but creating a usable activity feed that will scale with your product is harder. This is where services such as [Knock](https://knock.app/) can help. Knock allows developers to include[ in-app notifications](https://knock.app/features/in-app-notifications) with pre-built components with no extra infrastructure and no custom code.

If you want to learn more about Knock, our[ documentation](https://docs.knock.app/) will show you how to build something better than above with less code. You can also join our [Slack community](https://knock.app/join-slack) to see how others use Knock, or [contact us](mailto:hello@knock.app) to chat about using Knock in your application.

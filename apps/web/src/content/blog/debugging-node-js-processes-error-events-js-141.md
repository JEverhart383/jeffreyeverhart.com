---
title: "Debugging Node.js Processes | Error events.js 141"
date: 2016-02-17
excerpt: "Debugging Node.js processes on the server can be kind of painful depending on what tools you have available to help you make sense of error messages. After scouring the web, it seems that a lot of peo"
categories: ["Development", "JavaScript"]
wpId: 903
---

Debugging Node.js processes on the server can be kind of painful depending on what tools you have available to help you make sense of error messages. After scouring the web, it seems that a lot of people get frustrated by an error that gets thrown at events.js 141, which seems to be a generic socket hang up. I'm sure there are lots of reasons why this happens, and I'll let someone much smarter than myself weigh in on those, but I will share my one particularly frustrating encounter with this error and how I fixed it.

## The App

The app I was working on is just a simple MEAN stack application (without MongoDB) that is used to communicate and perform tasks using the Canvas LMS REST API. Won't go into much more detail, but you can check out [the live tool on Heroku.](https://canvas-api-tool.herokuapp.com/)

## Heroku Development Environment

For this project, I was using Heroku as a hosting platform and trying to test the app locally. The Heroku command line tool has some awesome features built in, and you should be able to start the application from localhost:5000 with on simple command.

```shell
$ heroku local web
```

The first time I ran this, I got the typical boilerplate I usually get when booting the app, but every time an error got thrown before starting up the server. Usually,  this happens later on down the line when one of the API calls that Node handles breaks something, so this seemed very odd to me.

```shell
Your version of git is 1.8.3.4. Which has serious security vulnerabilities.
More information here: https://blog.heroku.com/archives/2014/12/23/update_your_git_clients_on_windows_and_os_x
forego | starting web.1 on port 5000
web.1  | events.js:141
```

I had made some pretty significant changes the day before, so I started looking through the most recent code to figure what change broke the server so early in its start-up process. I commented out everything I had written the day before and worked my way to the bare bones of an Express app, all to no avail.

## The Solution (in my case at least) for error events.js 141

After doing some digging on GitHub and StackOverflow, it looks like the events.js 141 error is a pretty generic error that people get for a lot of reasons. Since I was getting the error on the start-up of the server, I was almost certain it had nothing to do with the meat of the Node API. One of the threads I found that was particularly helpful noted [that the server can throw this error if there is already another process running on the same port.](http://stackoverflow.com/questions/16827987/expressjs-throw-er-unhandled-error-event) Thinking back to my coding session the day before, I remember writing some changes, but couldn't recall actually killing the server when I was done. From here I did some more digging with the command line to see what other node processes were running.

```shell
$ ps aux | grep node
```

Using this line of code in the terminal, you can list all of the running processes (ps) for all users (a), show the owner of the process (u), and even find processes not attached to a terminal (x). Check out this link for [a better description of the ps aux command](http://unix.stackexchange.com/questions/106847/what-does-aux-mean-in-ps-aux). The second part of the command behind the pipe, grep node, allows you to [filter those processes to only those that match the regular expression node](https://en.wikipedia.org/wiki/Grep). Low and behold the root of my problems. When I ran the command above, I could see some extra node processes still running from the day before:

```shell
user      8381   0.0  0.0  3065084   1224   ??  S     2:14PM   0:00.83 node index.js
user      8379   0.0  0.0  2443608    252   ??  Ss    2:14PM   0:00.01 /bin/bash -c source ".profile" 2>/dev/null; node index.js
user     28867   0.0  0.0  2432772    640 s000  S+    9:48AM   0:00.00 grep node
```

At this point, I felt like an idiot. I had spent twenty minutes debugging and commenting out irrelevant code because I forgot to enter CTRL+C  into the terminal to kill the node server before I was done working. From here, all I needed was one command get everything up and running again, which I got from [this thread on killing processes](http://stackoverflow.com/questions/19968069/try-to-kill-all-nodes-but-failed-on-osx):

```shell
$ sudo killall node
```

I felt good about this since there were only two node processes running, but it goes without saying to be careful when you use either sudo or kill/killall in the command line. Hopefully, this post can help some other poor soul from wasting an hour of debugging time struggling with error events.js 141.

---
title: "Open Files and Folders in Sublime Text from Terminal"
date: 2017-09-14
excerpt: "This post is the first in what will hopefully be a weekly tip or trick focused on workflow since I think many of these things can be helpful across the board for a lot of folks. For a long time, I fee"
heroImage: "/media/sublime-text.png"
categories: ["Web Development", "Workflow"]
wpId: 1357
---

This post is the first in what will hopefully be a weekly tip or trick focused on workflow since I think many of these things can be helpful across the board for a lot of folks. For a long time, I feel like I've relied too heavily on brute force to get a lot done. When there are tons of things to do, just work harder. That philosophy has served me well, but eventually you reach the upper limit of what you can do with this methodology. I think I've been there for awhile now, but it just took some time to realize that. So, in an effort to work smarter around development efforts, I'm going to capture a bunch of small tips, tricks, shortcuts, and tools that should help me (and other people) develop smarter workflows.

## How to Save a Few Keystrokes

Once you start doing stuff in the command line, it becomes awkward to have to jump between typing commands and using the mouse and GUI to do things in concert. For example, when creating a new project or prototype, you might do something like this:

```shell
cd desktop
mkdir project && cd project 
touch index.html 
touch app.js
touch style.css 
git init
```

So, in a few keystrokes, I've got my project folder and assets created and hooked up with Git, but from here I have to open the folder in Sublime Text by either dragging the folder to the application icon in the dock or opening the app and using the menus. This is something I'm going to call context switching, which has an actual definition in computer science, but for this purpose we can consider it any action that makes you switch contexts: going from one application to another, switching from typing to using the mouse, etc. Just like in computer processing, context switching is costly for humans as well. So, the longer we can remain in a single context, the more productive we can be. I've seen a lot of people use a handy terminal shortcut to open up files and folders in Sublime Text, so I finally decided to set this up. It turns out it was very easy with a few commands.

## Sublime Text Made Easy

First, make sure that everything is set up correctly. If you run the following command, it should open up Sublime Text:

```shell
open -a /Applications/Sublime\ Text.app
```

If Sublime Text opens, all is good with your setup. After that, we just need to add one line to your .bash\_profile, and you're good to go.

```shell
#open up .bash_profile for editing
nano ~/.bash_profile
#add this command to the end of .bash_profile
alias sublime="open -a /Applications/Sublime\ Text.app"
#then run this command to refresh the .bash_profile with this new command
source ~/.bash_profile
```

Now you should be able to use the sublime command to open up files and folders from the command line.

```shell
sublime myproject
```

Enjoy the benefits of some focused productivity! Be on the look out for future workflow tips in the coming weeks.

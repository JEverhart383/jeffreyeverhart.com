---
title: "Debugging WordPress PHP with VS Code and MAMP"
date: 2017-09-22
excerpt: "This is the blog post I wish existed a few weeks ago when I started trying to configure Visual Studio Code to debug PHP and WordPress interactively. Although this setup might not work for everyone dep"
heroImage: "/media/Screen-Shot-2017-09-22-at-2.06.50-PM-e1506104493705.png"
categories: ["Web Development", "WordPress"]
wpId: 1375
---

This is the blog post I wish existed a few weeks ago when I started trying to configure Visual Studio Code to debug PHP and WordPress interactively. Although this setup might not work for everyone depending on your environment, it will save anyone using MAMP already a hell of a lot of time.

## The Benefits of Debugging WordPress

One of the reasons I use VS Code is because of its capabilities as an interactive debugger, but how is that different from other types of 'debugging'? For a lot of things in development, we can get away with having the program print out some information as it is executing, think console.log for JS or echo, var\_dump for PHP, and so on. But as things get more complicated, you might need to get a better look at what is going on underneath the hood. Enter interactive debugging, which allows you to inspect different variables as the program is executing and step through functions and control flow structures until we decide to release certain breakpoints. ![debugging wordpress code in vs code](/media/Screen-Shot-2017-09-22-at-2.06.50-PM-e1506104493705-1024x454.png) Typically, this helps you resolve issues a lot quicker, especially when something isn't solved easily by printing out a few key variables.

## Enable PHP Debugging in VS Code

VS Code came with support for NodeJS debugging out of the box, so I expected things to be as straightforward for PHP, since it's more widely used. Sadly, it was not so. First, you need to install the [PHP Debug extension](https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug) for VS Code by either running the following command in the command palette or searching for the package in the extensions menu:

```null
ext install php-debug
```

From here is where things got murky for me. If you install the debugger package, and try to run the debugger it will start throwing errors. Reading the docs for the extension, it says it needs something called Xdebug. After reading the links to Xdebug on the docs, I embarked on a long trek to download and compile Xdebug from source, configure it with the version of PHP installed on my system (php7), and then it proceeded to keep failing when I tried to have the PHP thread talk back to the debugger. As it turns out, since I was using MAMP as a local server, Xdebug already comes installed with MAMP, so all you really need to do is instruct MAMP to use Xdebug for the current version of PHP. I'm sure the other stuff would have been the necessary path if I was using the command line to manage the Apache/MySQL servers.

## Enabling Xdebug for MAMP

After spending hours compiling binaries and exporting PATHs, the fix was almost embarrassingly easy. To enable Xdebug on MAMP, we just need to add a few lines to the two php.ini files MAMP references. Open up the following files in a text editor:

```null
/Applications/MAMP/conf/php[version]/php.ini
 
/Applications/MAMP/bin/php/php[version]/conf/php.ini
```

Make sure to look in MAMP to see what version of PHP is set as the default, since there are likely dozens of PHP folders inside of the application. With the files open, add the following lines at the bottom of each file:

```null
[xdebug]
zend_extension="/Applications/MAMP/bin/php/[php_version]/lib/php/extensions/no-debug-non-zts-20100525/xdebug.so"
xdebug.remote_autostart=1
xdebug.remote_enable=1
xdebug.remote_host=localhost
xdebug.remote_port=9000
xdebug.remote_handler=dbgp
```

At that point, you should be able to restart MAMP, throw a breakpoint in Visual Studio, then hit that breakpoint from your web browser on localhost:8888 or whatever your MAMP config specifies. Credit to Sean Patterson for [the MAMP config details.](https://dillieodigital.wordpress.com/2015/03/10/quick-tip-enabling-xdebug-in-mamp-for-osx/) Hopefully, this will help out some other poor soul by adding to the Google keywords that might lead you to salvation.

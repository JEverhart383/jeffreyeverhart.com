---
title: "Fixing PHP Warning:  mysqli_real_connect(): (HY000/2002):  with WP CLI and MAMP"
date: 2019-02-21
excerpt: "This will be a short post, but I felt it necessary to do since I had to deal with this is a non-standard way given my situation. I decided to play around with WP CLI to scaffold out the theme for a pr"
heroImage: "/media/wordpress-logo.png"
categories: ["WordPress"]
wpId: 2004
---

This will be a short post, but I felt it necessary to do since I had to deal with this is a non-standard way given my situation. I decided to play around with WP CLI to scaffold out the theme for a project that we are starting, but ran into a few configuration issues. It was easy enough to install, but I got a series of errors after running the following command:

```shell
wp scaffold _s
```

The stack trace of the error started off with something link the following error message kicked out by PHP:

```shell
PHP Warning:  mysqli_real_connect(): (HY000/2002): Connection refused in /path/to/wordpress/wp-includes/wp-db.php on line 1531
```

And then it ended with a friendlier, but a bit less helpful error from WP CLI:

```shell
Error: Error establishing a database connection. This either means that the username and password information in your `wp-config.php` file is incorrect or we can’t contact the database server at `127.0.0.1`. This could mean your host’s database server is down.
```

I had been messing with my local databases all morning, so I figured this was something I had screwed up. After checking that everything was running and I hadn't swapped any ports in MAMP, I went out to Stack Overflow. I found a few answers [here](https://stackoverflow.com/questions/32809896/warning-mysqli-real-connect-hy000-2002-no-such-file-or-directory-in-priv) and [here](https://stackoverflow.com/questions/4219970/warning-mysql-connect-2002-no-such-file-or-directory-trying-to-connect-vi) that explain the essence of the issue is that the PHP `mysqli_real_connect()` class is trying to access the underlying UNIX socket in a way that doesn't play well with `localhost.` I didn't get into the weeds of what is actually happening at the system level, since I really just wanted a cleaner way to start of a new theme. A few answers suggest changing `localhost`  to a local IP like `127.0.0.1` but that didn't seem to fully resolve the issue for me, which lead me back to MAMP and MySQL Workbench. Based on the in-depth answers on Stack Overflow, it looks like this PHP class would expect SQL to be running on its default port, which is typically 3306. Since my MAMP version defaults to port 8889, I figured that could be the issue. In the end, this what my `wp-config.php` looks like and everything seems to be working now:

```php
/** MySQL hostname */
define('DB_HOST', '127.0.0.1:8889');
```

Again, I'm not sure this was worth writing about, but every time I have to solve a problem in a way that isn't already on the internet, I figure I might be able to save someone else 30 minutes of pain. Happy coding : )

---
title: "Match Multiple Patterns with GREP And"
date: 2019-03-07
excerpt: "We've been dealing with some decently complex system-level issues for awhile on Rampages. In an effort to track them down to the source, I've been digging through lots of log files. While we still don"
heroImage: "/media/command-line.png"
categories: ["Linux"]
wpId: 2024
---

We've been dealing with some decently complex system-level issues for awhile on Rampages. In an effort to track them down to the source, I've been digging through lots of log files. While we still don't fully understand what is happening yet, I'm learning a lot more about sys admin type tools for tracking bugs across the layers of a system. Here is a good example of a line from the Apache error\_log file that I wanted to examine in depth:

```shell
[Thu Mar 07 00:50:41.452546 2019] [fcgid:warn] [pid 28204:tid 47506001921792] [client 165.227.76.242:0] mod_fcgid: stderr: [rampages.us/playground] [feedwordpress]  Polling feed [https://rampages.us/fakeglobesite/category/some-category/feed], referer: https://rampages.us/playground/wp-cron.php?doing_wp_cron=1551937838.8430619239807128906250
```

We have tons of sites with Feed WordPress installed, which is mediated by wp-cron. In this case, I wanted to see how many of this type of error were thrown on a particular day. So, I googled and came up with this `grep` command to target two different patterns in the log file:

```null
grep -E 'Thu Mar 07.*feedwordpress' error_log
```

This is a logical AND pattern, but it could also be configured to perform an OR match, or any other number of [different types of patterns for multiple matches](https://www.shellhacks.com/grep-or-grep-and-grep-not-match-multiple-patterns/).

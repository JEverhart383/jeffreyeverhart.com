---
title: "Using the Right Tools: Indexing in MySQL"
date: 2018-08-27
excerpt: "As I'm sure this is with most people, my deepest learning moments come from random walks down different avenues. In preparation for a GIS focused project I might get to work on, I spent a few minutes "
heroImage: "/media/31829.png"
categories: ["MySQL"]
wpId: 1844
---

As I'm sure this is with most people, my deepest learning moments come from random walks down different avenues. In preparation for a GIS focused project I might get to work on, I spent a few minutes reviewing the geospatial features available in MySQL, which lead me down some side research into database indexes. You can see how I start to go sideways.... A few months ago, I wrote a tutorial on [how to change the default timeout settings on MySQL Workbench](https://jeffreyeverhart.com/2017/11/04/mysql-workbench-error-code-2013-lost-connection-mysql-server-query/), the management software I use for interacting with databases. I figured all of that out in response to some queries that were taking a really long time to run. I left feeling OK. I'd gotten the data I needed and written a post that has generated a decent amount of traffic for my site, which means that other people are having the same issues with slow queries. However, my random side trip this morning got me thinking about the idea of indexes and this particular project, so I decided to add some and see what happened. The results were pretty astounding, and I'll never forget this lesson: ![a table of database queries](/media/Screen-Shot-2018-08-27-at-10.43.45-AM.png) Here you can see some of the output from my noodling. Initially, the un-indexed query returns roughly 25K rows in around 50 seconds. After that, you can see the two commands to add indexes to the tables I'm joining, which are both very simple versions of what is below:

```sql
ALTER TABLE `table_name` ADD INDEX (`column_name`);
```

After that, I reran the original query, and the difference is astounding. While I've used databases extensively, most of what I do involves transactions where adding indexes isn't as helpful, because each insert or update triggers another transaction on the index or indexes. And at the same time, not much of what I'm working on has the scale of data that is contained in the IPEDS data set. However, as I start doing more work on data analysis, I'm having to shift my thinking a little bit to optimize for additional scenarios like this one, and it helps to fully understand all of the tools available to you.

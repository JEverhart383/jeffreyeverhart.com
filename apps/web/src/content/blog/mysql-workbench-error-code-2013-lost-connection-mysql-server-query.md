---
title: "Query Timeout in MySQL Workbench | Error Code: 2013. Lost connection to MySQL server during query"
date: 2017-11-04
excerpt: "This is kind of a silly and duplicative post, but I spent too much time searching for the right answer, so maybe this will help the right course of action bubble to the top faster in the future."
heroImage: "/media/31829.png"
categories: ["SQL"]
wpId: 1436
---

This is kind of a silly and duplicative post, but I spent too much time searching for the right answer, so maybe this will help the right course of action bubble to the top faster in the future.

## The Issue

I was trying to run a query on my local SQL install (whatever MAMP manages and provisions) using MySQL Workbench 6.3 for Mac but kept getting a timeout error. ![error code 2013: lost connection to MySQL server during query](/media/Screen-Shot-2017-11-04-at-1.47.44-PM.png) The query itself wasn't overly complex, but I was using aggregate functions, group by, and a join to consolidate a dataset. I'm working with [distance education reporting data for all U.S. colleges and universities from 2012-2015](https://github.com/RVA-ALT-Lab/ipeds), so this join involved a 7K row table and another with 25K rows, so not inconsequential but also not BIG data level.

```sql
SELECT
STABBR as State,
EFDELEV as Level , 
SUM(EFDETOT) as Total_Distance,
SUM(EFDEEXC) as Exclusive_Distance,
SUM(EFDESOM) as Some_Distance,
SUM(EFDENON) as None_Distance

FROM hd2012 LEFT JOIN ef2012a_dist_rv
ON hd2012.UNITID = ef2012a_dist_rv.UNITID
GROUP BY State,  Level;
```

I did some initial googling on the error code, but it is a pretty general error code, so it was difficult to be sure whether this was a limitation of SQL or the Workbench DBMS. I read a few posts that suggested manipulating some of the .conf files for the underlying MySQL install, and I went too long down this road before trying something in Workbench itself. It turns out there are timeout settings for the DBMS that you extend to make sure that it waits a sufficient amount of time for your query to return data. Thanks to [this specific answer on StackOverflow](https://stackoverflow.com/questions/15712512/mysql-workbench-how-to-keep-the-connection-alive), but the description of "how-to" it links to is no longer valid, hence this blog post.

## The Fix

There is a quick setting in Preferences that helped me. As you might expect, the DBMS has settings to manage its connection to the SQL server. In my case, those were just too short for my long running queries. I changed the 30 second defaults to 180, and returned the data I needed. However, I'd imagine that some things would call for a much higher timeout, especially if you wanted to do a lot of transactions. ![preferences settings menu my sql workbench](/media/Screen-Shot-2017-11-04-at-2.03.49-PM.png)

## Another Fix

As of 08/27/2018, I did some additional noodling around with the queries that produced this slow result and realized some simple indexing reduced the query time from ~50 seconds to .227 seconds. You can find a more detailed [post about that here](https://jeffreyeverhart.com/2018/08/27/using-the-right-tools-indexing-in-mysql/). If you are looking for a way to stop the timeout error, now you have two options. However, now I realize that most of my issue had nothing to do with MySQL Workbench and everything to do with the way I constructed the underlying database : ) However, options are always good, so good luck!

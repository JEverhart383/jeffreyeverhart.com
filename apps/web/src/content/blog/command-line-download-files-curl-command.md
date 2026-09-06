---
title: "Command Line: Download Files with cURL Command"
date: 2017-01-19
excerpt: "I'm not sure how I didn't know about this command sooner since I use cURL for a few other tasks. I've been using WGET to download remote files, but I recently stumbled across this new little shortcut "
heroImage: "/media/Screen-Shot-2017-01-18-at-9.15.52-PM-1.png"
categories: ["Web Development"]
wpId: 1173
---

I'm not sure how I didn't know about this command sooner since I use cURL for a few other tasks. I've been using WGET to download remote files, but I recently stumbled across this new little shortcut that should save me a few seconds here or there. If you'd rather just watch a short video, here it is: I'm putting it here so that I don't forget about it. Link all of the best commands, there are a few variations.

### Naming the Output File

This first variation lets you download the remote file into a new file with a name you supply:

```shell
curl http://www.gutenberg.org/cache/epub/1322/pg1322.txt -o leavesofgrass1855.txt
```

Here we call the cURL command, give it a url to some resource to download, the use the -o flag to specify an output file. This would result in a file called leavesofgrass1855.txt being created with the results of the download.

### Using Original File Name

This second variation just downloads the file using the original name of the remote file by using a different flag.

```null
curl -O http://www.gutenberg.org/cache/epub/1322/pg1322.txt
```

Now, we've got a file with this same name in the working directory.

### Benefits of cURL command

There are lots of other things you can use the cURL command for, so I'll be sure to cover some of those additional topics in future videos. If you can learn a few helpful commands here and there, before you know it you will be using the command line all the time to speed up development workflows and automate repetitive tasks. Here is a [link to the docs for the CURL command for further reading.](https://curl.haxx.se/docs/manpage.html)

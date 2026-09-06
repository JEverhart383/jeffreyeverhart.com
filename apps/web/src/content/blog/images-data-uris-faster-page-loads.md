---
title: "Convert Images to Data URIs for Faster Page Loads"
date: 2016-04-30
excerpt: "For anyone looking for faster page loads, converting images to data URIs can provide a speed boost in certain instances. In modern web development, page load time is extremely important, not just beca"
categories: ["HTML", "Web Development"]
wpId: 1024
---

For anyone looking for faster page loads, converting images to data URIs can provide a speed boost in certain instances. In modern web development, page load time is extremely important, not just because people who use web sites have little tolerance for a slow loading site, but also because responsive sites are asked to support a wide variety of devices on wireless or cellular network connections. While we all find the occasional sloth funny and entertaining, we certainly don't tolerate that type of behavior from the websites we frequent. [via GIPHY](http://giphy.com/gifs/e0gAcTwGygrny)

## Why we need faster page loads?

In most cases, the majority of a website's page weight comes from image files, and the largest overhead we experience when accessing a website involves the multiple round trips the browser must make to get all of the things required to render the page. Just take a look at all the separate requests the browser made to load the home page of my blog! Well, it looks like I'll need to practice what I preach :) [![faster-page-loads](/media/Screen-Shot-2016-04-30-at-1.58.47-PM-1.png)](/media/Screen-Shot-2016-04-30-at-1.58.47-PM-1.png) Since we know that images are what make the web slow, that seems like a natural place to start optimizing the front end of our websites.

## What is a data URI?

A data URI, also sometimes called a data URL, is a base64 encoded binary representation of an image file. What that means in real talk is that a data URI is a really long string of characters that can be converted back into an image and displayed in the browser. What that means for us as front end developers is that we can embed this data URI directly within HTML to cut out a round trip request to a server for an actual image file. Let's take a look at some examples.

```html
<!-- Typical image tag --!>

<img src="http://code-maven.com/img/node.png"/>
```

With a typical image tag we specify a source attribute for the image which is usually a relative or absolute file path to an image file somewhere, whether that is on your server or someone else's. But either way, the browser has to go out to that server and get the image before it can display it in the browser. Data URIs let us do something a little bit different that can help achieve faster page loads in certain contexts. We just include the encoded binary within the image source, which lets us send the image along with our HTML to the browser in one request:

```html
<!-- Data URI image tag --!>

<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXcAAAFoCAYAAACsQLuwAAAKO2lDQ1BpY2MAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49..."/>
```

As you can see, that binary string is pretty wild, and for this example I cut it off at the ellipses. In reality, this example string is likely only one tenth or less of the full string that would be sent to the browser.

## Converting image files to data URIs

The easiest way to start converting your image files to data URIs is to use a conversion service. Tons of them exist if you just Google "convert image file to data uri" or something like that, but there is one service in particular that I like to use: [http://dataurl.net/#about](http://dataurl.net/#about)

## The trade offs of using data URIs

We've already talked about some of the benefits of using data URIs, but there are a few drawbacks, so we'd better talk about all of those things to be sure we all know when to use them and when to stick with image files.

### Pros of data URIs

*   Save HTTP requests by sending image within HTML
*   Less bandwidth usage in some cases, depending on HTTP/HTTPS context and file size
*   Faster page loads of above the fold or critical content

### Cons of data URIs

*   Images rendered with data URIs cannot be cached
*   Data URIs are actually around 33% larger than image files, so for larger files it may be better to spend a request and additional HTTP overhead
*   You must re-encode images each time you change them. If you change the size of a JPG, you can't just upload it to the same file path. You must re-encode it and change every instance of the encoding in your markup.

## Wrapping up

Overall, there are some very real reasons we would want to use data URIs to get faster page loads. Namely, we should use data URIs with small files that won't add more to page weight if they become 1/3 larger and for parts of the page that need to be loaded with the initial HTML markup. Don't use data URIs for things at the bottom of a page that the user will have to scroll to see. I like to use data URIs for above the fold content so that as soon as the DOM is rendered, all of the necessary images are displayed. Either way data URIs are an important concept for every front end developer to have in their toolbox, so explore, experiment, and let me know how it goes.

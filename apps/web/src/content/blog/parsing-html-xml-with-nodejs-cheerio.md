---
title: "Parsing HTML/XML with NodeJS and cheerio"
date: 2019-05-03
excerpt: "Eventually, this post will be a small part of a long post-mortem describing a ton of unexpected challenges I've faced recently trying to wrangle some historical geospatial data. However, this post is "
heroImage: "/media/node-js.png"
categories: ["JavaScript"]
wpId: 2058
---

Eventually, this post will be a small part of a long post-mortem describing a ton of unexpected challenges I've faced recently trying to wrangle some historical geospatial data. However, this post is going to look at just one piece of that long process where I used the NodeJS library [cheerio](https://cheerio.js.org/) to help clean-up a GeoJSON file.

To set some context, I have a pretty large GeoJSON file (20MB) that I'm working with that outlines all of the counties in Virginia from the 1870 census. It looks a little bit like this.

![outlines of Virginia counties in 1870](/media/Screen-Shot-2019-05-03-at-8.41.38-AM.png)

As a result of a long conversion process (source coordinate system -> web mercator -> shapefile -> KML -> GeoJSON), there was a bunch of artifact added to each county feature that made it difficult to use. It seems that ArcGIS and KML like to export data properties on the feature as full blown HTML/XML. That made for some easy to use popups, but made it next to impossible to locate the individual counties among other features and join them with additional data.

For each key of `feature.properties.description` this is what I had to work with:

```html
<html xmlns:fo=\"http://www.w3.org/1999/XSL/Format\" xmlns:msxsl=\"urn:schemas-microsoft-com:xslt\">\n\n<head>\n\n<META http-equiv=\"Content-Type\" content=\"text/html\">\n\n<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n\n</head>\n\n<body style=\"margin:0px 0px 0px 0px;overflow:auto;background:#FFFFFF;\">\n\n<table style=\"font-family:Arial,Verdana,Times;font-size:12px;text-align:left;width:100%;border-collapse:collapse;padding:3px 3px 3px 3px\">\n\n<tr style=\"text-align:center;font-weight:bold;background:#9CBCE2\">\n\n<td>1870</td>\n\n</tr>\n\n<tr>\n\n<td>\n\n<table style=\"font-family:Arial,Verdana,Times;font-size:12px;text-align:left;width:100%;border-spacing:0px; padding:3px 3px 3px 3px\">\n\n<tr>\n\n<td>FID</td>\n\n<td>2</td>\n\n</tr>\n\n<tr bgcolor=\"#D4E4F3\">\n\n<td>DECADE</td>\n\n<td>1870</td>\n\n</tr>\n\n<tr>\n\n<td>NHGISNAM</td>\n\n<td>Accomack</td>\n\n</tr>\n\n<tr bgcolor=\"#D4E4F3\">\n\n<td>NHGISST</td>\n\n<td>510</td>\n\n</tr>\n\n<tr>\n\n<td>NHGISCTY</td>\n\n<td>0010</td>\n\n</tr>\n\n<tr bgcolor=\"#D4E4F3\">\n\n<td>ICPSRST</td>\n\n<td>40</td>\n\n</tr>\n\n<tr>\n\n<td>ICPSRCTY</td>\n\n<td>10</td>\n\n</tr>\n\n<tr bgcolor=\"#D4E4F3\">\n\n<td>ICPSRNAM</td>\n\n<td>ACCOMACK</td>\n\n</tr>\n\n<tr>\n\n<td>STATENAM</td>\n\n<td>Virginia</td>\n\n</tr>\n\n<tr bgcolor=\"#D4E4F3\">\n\n<td>ICPSRSTI</td>\n\n<td>40</td>\n\n</tr>\n\n<tr>\n\n<td>ICPSRCTYI</td>\n\n<td>10</td>\n\n</tr>\n\n<tr bgcolor=\"#D4E4F3\">\n\n<td>ICPSRFIP</td>\n\n<td>51001</td>\n\n</tr>\n\n<tr>\n\n<td>GISJOIN</td>\n\n<td>G5100010</td>\n\n</tr>\n\n<tr bgcolor=\"#D4E4F3\">\n\n<td>GISJOIN2</td>\n\n<td>5100010</td>\n\n</tr>\n\n<tr>\n\n<td>STATE</td>\n\n<td>510</td>\n\n</tr>\n\n<tr bgcolor=\"#D4E4F3\">\n\n<td>COUNTY</td>\n\n<td>0010</td>\n\n</tr>\n\n<tr>\n\n<td>PID</td>\n\n<td>636</td>\n\n</tr>\n\n<tr bgcolor=\"#D4E4F3\">\n\n<td>X_CENTROID</td>\n\n<td>1762470.8191</td>\n\n</tr>\n\n<tr>\n\n<td>Y_CENTROID</td>\n\n<td>219175.167844</td>\n\n</tr>\n\n</table>\n\n</td>\n\n</tr>\n\n</table>\n\n</body>\n\n</html>\n\n
```

Like I said, it made for some nice popups, but was tough to use in subsequent JS programs. After failing to write some REGEX to pull out the `td`tag content after the one with NHGISNAM as content, I decided to look into another alternative.

Having used some HTML parsing libraries in the past, mostly [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/) for Python, I figured something like that had to exist for Node as well. Lo and behold, cheerio is server-side extension of jQuery that lets you load, parse, and traverse HTML strings in the Node runtime.

Since it is just jQuery under the hood, it took me only a few minutes to write this little script to find the correct table cell, extract its content, overwrite the original property on the GeoJSON object, and then write that result to a new file:

```js
const fs = require('fs')
const cheerio = require('cheerio')

// Read in and parse the JSON file
const file = fs.readFileSync('./va_counties_1870_lat_lng.json');
const json = JSON.parse(file)
// Loop through each of the features in this feature collection
json.features.forEach(feature => {
  // Load the HTML description into cheerio for parsing 
  let $ = cheerio.load(feature.properties.description)
  // Get the text in the td sibling adjacent to the td that contains "NHGISNAM"
  let name = $('td:contains("NHGISNAM") + td').text()
  // Overwrite the description property with the data I need
  feature.properties.description = {
    name: name
  }
})

// Write the new JSON object to a new file
fs.writeFileSync('./new-json.json', JSON.stringify(json))
```

Although a lot of this data wrangling has been a pain, I really like the idea of using cheerio for more advanced things. When I have the courage to write-up a longer post on the steps that lead me here, I include a link here.

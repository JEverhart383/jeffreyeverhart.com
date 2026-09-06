---
title: "Get All Users in Canvas Account via API with Google Apps Script"
date: 2021-02-09
excerpt: "VCU is in the beginning stages of an LMS transition, and the instructional designers in our department are doing pretty much all of their professional development courses in Canvas now. Since everythi"
categories: ["Canvas", "Google Apps Script"]
wpId: 2447
---

VCU is in the beginning stages of an LMS transition, and the instructional designers in our department are doing pretty much all of their professional development courses in Canvas now. Since everything still isn't integrated with Banner, there is still some backend admin work to add users to our professional development account.

Today I was asked if I could get a list of all of the users in our account, and I was able to get a quick snippet up and running in Google Apps Script that does just that. If you haven't already looked at what is available using [the Canvas API](https://canvas.instructure.com/doc/api/index.html), I'd recommend starting there. The great thing about Canvas is that it exposes pretty much all of its behavior and functionality through this API, which means that people like me can build cool integrations or tools that work on top of the Canvas infrastructure.

**Prerequisites**

*   This guide assumes that you have at least administrative access over one account in you Canvas instance
*   You will need to [generate an API token as an admin](https://community.canvaslms.com/docs/DOC-10806-how-do-i-manage-api-access-tokens-as-an-admin) and have it available

## The Script

Overall, I was able to encapsulate pretty much all of the logic to get all of an account's users into one recursive function that you can see below:

```js
function getAllUsers(nextLink = null) {
  const url = nextLink ? nextLink + '&access_token=' + CANVAS_API_KEY() : 'https://yourdomain.instructure.com/api/v1/accounts/' + ACCOUNT_ID() + '/users?per_page=100&access_token=' + CANVAS_API_KEY()
  const params = {
    method: 'GET',
    muteHttpExceptions: true
  }
  const response = UrlFetchApp.fetch(url, params )
  const headers = response.getAllHeaders();
  const links = headers['Link'].split(',').filter(link => link.includes('next'))
  const users = JSON.parse(response.getContentText())
  Logger.log(users)
  const peopleSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('People')
  users.forEach(user => {
     peopleSheet.appendRow([user.id, user.name, user.login_id])
  })
 
  if (links.length > 0) {
    const nextLink = links[0].split(';')[0].replace("<", "").replace(">", "")
    getAllUsers(nextLink)
  }
}
```

Since I can't get all of the users in a single request, I wrote a recursive function called `getAllUsers` that calls the Canvas API and appends the return data to the Sheet until there are no more results.

The function is set to accept a parameter called `nextLink` with a default value of `null`if we don't provide one. The first thing we do is construct our Canvas API URL. The calls to functions like `CANVAS_API_KEY()` and `ACCOUNT_ID()` are functions that pull values from a config sheet in my example, but you could populate them however you want, including hardcoding them into the strings.

The following lines of code uses the [ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) to test the value of `nextLink`, and then we concatenate the URL values together with the access token. If the function is being called recursively, it will have the `nextLink` value passed in. Otherwise, we create it manually:

`const url = nextLink ? nextLink + '&access_token=' + CANVAS_API_KEY() : 'https://yourdomain.instructure.com/api/v1/accounts/' + ACCOUNT_ID() + '/users?per_page=100&access_token=' + CANVAS_API_KEY()`

From here, we use that URL and make fetch call with `UrlFetchApp`and then parse the response in a few different ways:

```generic
const params = { method: 'GET', muteHttpExceptions: true } 
const response = UrlFetchApp.fetch(url, params ) 
const headers = response.getAllHeaders(); 
const links = headers['Link'].split(',').filter(link => link.includes('next'))
const users = JSON.parse(response.getContentText())
```

Since the Canvas API has a limit of 100 on the number of users I can request, the [request set ends up getting paginated](https://canvas.instructure.com/doc/api/file.pagination.html). Canvas conveys that information to the caller by using [the Link Header](https://www.w3.org/Protocols/9707-link-header.html). This is basically a string with a certain structure that contains resource URLs for other resource sets with a particular relationship to the current request. The example the Canvas documentation provides looks like this:

```generic
<https://<canvas>/api/v1/courses/:id/discussion_topics.json?opaqueA>; rel="current",
<https://<canvas>/api/v1/courses/:id/discussion_topics.json?opaqueB>; rel="next",
<https://<canvas>/api/v1/courses/:id/discussion_topics.json?opaqueC>; rel="first",
<https://<canvas>/api/v1/courses/:id/discussion_topics.json?opaqueD>; rel="last"
```

Inside of this header, we get URLs for the current, next, first, and last pages in this particular format. This helps us in two ways: first, we don't need to construct a URL as we make recursive calls because the API provides us with a pre-formatted URL; second, checking for the presence of a next url in the header is how we can determine when our recursive function is done.

To get this information from the Canvas API response, I examine the headers of the response and then execute a few string and array methods to transform the data:

```generic
const headers = response.getAllHeaders()
const links = headers['Link'].split(',').filter(link => link.includes('next'))
```

Calling `.split(',')` on the header values creates an array with the string value of the link and its rel text. From there, I filter that array so that it only contains strings that include the text "next." I'll later use this array as a flag for when to recurse, and also use the value to pass into the recursive function call.

Before we do anything with the value of the link headers, the function writes out some of the response data to a particular sheet:

```generic
const users = JSON.parse(response.getContentText())
const peopleSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('People') 
users.forEach(user => { 
  peopleSheet.appendRow([user.id, user.name, user.login_id]) 
})
```

After we've written that request's data to the sheet, we check whether or not that was the last set of results. To do that, I look at the length of our array of links. If there is a "Next" link in the header, it will be in this array as the first and only item:

```generic
if (links.length > 0) { 
  const nextLink = links[0].split(';')[0].replace("<", "").replace(">", "") 
  getAllUsers(nextLink) 
}
```

To get the clean URL, we do some splitting to remove the relationship data, and then replace the angle brackets with empty strings to remove them, leaving us with a callable URL. We then pass this into the `getAllUsers` function to start the process all over again. Using this technique, that means that we will call this function until we get a response from the Canvas API that does not include a link for the next result set.

## Limitations

One limitation to this could be an execution time out based on how many users you have. For this project, there were only about 450 or so users, and it still took "awhile" for this script to run. With several thousand, you want to think of a better way to loop through the users and keep track of where you are in the results set.

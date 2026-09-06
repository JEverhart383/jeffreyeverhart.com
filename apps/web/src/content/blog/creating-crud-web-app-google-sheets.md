---
title: "Creating a CRUD Web App with Google Sheets"
date: 2017-08-12
excerpt: "Google Sheets tends to be my go to whenever I need to build a really lightweight application that has a limited life span. Usually, these things typically involve a short turnaround or some type of ve"
heroImage: "/media/Screen-Shot-2017-08-11-at-8.37.40-PM.png"
categories: ["Google Apps Script", "Google Sheets"]
wpId: 1289
---

Google Sheets tends to be my go to whenever I need to build a really lightweight application that has a limited life span. Usually, these things typically involve a short turnaround or some type of very well-defined set of requirements. After Tom did some work demonstrating the utility of [silent Google Forms submissions using JS](http://bionicteaching.com/splot-light/) and how it could be extended to make "real" web content, I wanted to see what other design patterns might be useful in that same vein. I'm pretty familiar with using Google Sheets/Forms to do some automated stuff, as you can see from other articles on the blog, but I've always had the desire to build out more advanced tools that live on top of Google Sheets. However, since Google Forms was the only way to write data to Google Sheets for a long time, I pursued other things. As the platform has evolved, Google has added additional ways to interact with its services in Drive, including an [Advanced Sheets Service](https://developers.google.com/sheets/api/quickstart/js). There is some rich functionality in the Advanced Services, but for various reasons, many GSuite admins decide to disable that functionality for most users. However, there is another way to have your client side code communicate and run functions directly inside of your Google Sheet using the "Publish as Web App" feature.

## The Proof of Concept

For a recent project, we are working with VCU's da Vinci Center to create a site that functions closely to [Open IDEO](https://challenges.openideo.com/challenge), a group that curates and facilitates open design challenges. From an application perspective, the functionality was pretty straightforward. Users needed to register using their email address, submit an idea for voting, and then vote on submissions they felt were the most promising. We could easily build all of that into a WordPress custom theme, which is likely the route we'll take for the final product, but I wanted to take some time to experiment with some alternate routes to implementing something for this type of use case. I've included an iframe of the deployed web app below, but [here is a link as well for those who are interested.](https://script.google.com/macros/s/AKfycbxqLsuGHfeklmXpq7UFx5p4C0cG8awyAUlgHdPEanpocU6_GUo/exec)  First of all, I was really pleased with how functional the app felt even when rendered in an iframe on another site. Since you don't have the ability to set up real server side routing from a Google Sheet, you are kind of forced into building a single page application. But since you end up interacting with Google Apps Script through a JS interface anyway, it becomes a really easy way to pass JS objects back and forth from the sheets to the front end.

## The Sheets (aka Database)

Although the application's data model is pretty straightforward, it was still more complicated that what I felt like I could build into a single row, or table if we are extending the database metaphor. I decided on breaking the main spreadsheet into three sheets for the three main objects in the data model: registered users, submitted ideas, and a votes table. ![google sheet as database](/media/Screen-Shot-2017-08-11-at-8.33.17-PM.png) From here,  each row added to the spreadsheet could be a variable length list of values. Since I didn't have to specify data types for columns like in SQL, this reminded me a bit of a mix between the table structure of SQL with no-SQL flexibility in varying a data model. But running queries would be very easy to do using spreadsheet syntax. ![Google Spreadsheet as Database](/media/Screen-Shot-2017-08-11-at-8.37.40-PM-1024x622.png) Overall, it was very easy to append rows and add data to the sheet, as you would with INSERT. However, I didn't try to do much selecting of records back using a SELECT query. Rather, I handled this by just getting all of the data values and iterating through them to find what I need. I'm sure this could be easily addressed using some sort of more advanced query through the spreadsheet, but it highlights a potential limitation to this type of set up.

## The Front End Code

The resulting code from this little web app ended up being about 400 total lines, most of it JavaScript/Google Apps Script. Instead of cluttering up this post with all of the code, I'll just talk about a few select sections below, but you can find [the full project in this GitHub Gist](https://gist.github.com/JEverhart383/2ccf7ad995af3e05590f3395b2064253). First, to even get this to work as a web app, your Google Apps Script project has to register a doGet function in .GS file:

```js
function doGet(){

return HtmlService.createHtmlOutputFromFile('Index').setSandboxMode(HtmlService.SandboxMode.IFRAME)
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); 

}
```

This function references an Index.html file that is also in the project, and the setXFrameOptionsMode allows the web app to be loaded in an iframe on any other website. Once you register this doGet function, choose "Deploy as web app" from your publish options menu. ![deploy as web app google sheets](/media/Screen-Shot-2017-08-11-at-8.48.10-PM-300x221.png) That should generate a URL for your project, which you should be able to view as you save. **\*\*\* One Painful Note** As you develop, you will have to manage the versions of your web app after you deploy the project for the first time. After you initially publish, as you make changes you want to push live, click File > Manage Versions and add a new version number with a commit message. Then, when you click on "Deploy as Web App" again, you can select the newest version of your app to push live. ![publish version of web app google apps script](/media/Screen-Shot-2017-08-11-at-8.52.48-PM-281x300.png)

### The JavaScript Part

This part was the most fun to write for me at least. Vue is the latest JS framework I've added to my tool belt, and overall I'm loving it. It really combines the ease-of-use of something like Knockout with a more modern syntax of something like React without all of the unnecessary build bloat. I could write a whole post bashing JS frameworks, but I'll leave that for another day. This code below represents the bulk of the Vue portion of the app. You can see some handy data properties, like isAuthenticated, that hide/show portions of the UI to the user based on their auth state. This is condensed for illustrative purposes, but the important parts for the Google Sheets app deal with the methods, particularly the lines that look like this: `google.script.run.withSuccessHandler(onUserAuthentication).addIdea(user, idea);` This is the API to communicate directly with the Google Script file running the project. The withSuccessHandler callback is something you define to handle the success/failure of your call to the Google Script and deal with any data that you pass back. The addIdea function is what is defined in the Google Script, and we are passing it data collected from Vue's VM. Pretty neat.

```js
var app = new Vue({
    el: '#idea-app', 
    data: {
      isAuthenticated: false, 
      user : {
         name: '', 
         email: ''
      }, 
      idea: {
        name: '', 
        description: '',
        image: '', 
      },
      ideas: [], 
      message: '', 
    
    }, 
    methods: {
    
    submitIdea: function(){
       var user = {
        email: this.user.email, 
        name: this.user.name,
       }; 
    
       var idea = {
         name: this.idea.name, 
         description: this.idea.description,
         image: this.idea.image, 
      }; 
  
      google.script.run.withSuccessHandler(onUserAuthentication).addIdea(user, idea);
      google.script.run.withSuccessHandler(renderIdeas).getIdeas();
    
    }, 
    upvoteIdea: function(idea){ 
      google.script.run.withSuccessHandler(renderIdeas).addVote(this.user, idea); 
      console.log(idea); 
    }
    
    }, 
    mounted: function(){
    
    google.script.run.withSuccessHandler(renderIdeas).getIdeas();
    
    }
  
  });
```

This next code block represents the typical pattern I used for dealing with data into and out of the Google Sheet. You can see that these functions are pretty sparse. At the outset of the project, I wrote the two helper methods getTableData and tableContainsUser because they would be repeated each call. The first gets the sheet data as a multidimensional array, and the second looks for an instance of the user.email at the first index \[0\] of each row. After I defined the data transfer object that would pass between client/Google Script, it was pretty easy to do some error handling if someone had already submitted a response or they were/weren't found.

```js
function addIdea(user, idea){
  var data = getTableData(IDEAS_TABLE); 
  if(!tableContainsUser(data, user)){
  
    IDEAS_TABLE.appendRow([user.email, idea.name, idea.description, idea.image]); 
    
    return {
      success: true, 
      message: "Idea with the name '"+ idea.name + "' has been submitted by " + user.email + "." , 
      authUser: user
    };
  
  } else {
  
    return {
     error: true, 
     message: "User with the email " + user.email + " has already submitted an idea."
    };
  
  }

  
  
  
}
```

The return objects from these functions in the Google Script would then trigger updates in the Vue UI. As you get more sophisticated, I'm sure you could exploit the depth of Google Apps Script to do some really cool things, since there is so much available to you through that platform that is easy to implement.

## Overall Reflections

As a whole, this was a pretty productive exploration. On the upside, it has huge potential to speed up the development of certain types of applications. One of the downsides is the lack of publishing options for the web app. When you deploy it, Google assigns it a really long and unwieldy URL. Iframing it is an option, as you see here, but that has performance, security, and aesthetic downsides. I did some reading about deploying Google App Scripts to Google Sites, which you can then assign a custom domain to, but I have yet to test that out. Overall, a very cool concept.

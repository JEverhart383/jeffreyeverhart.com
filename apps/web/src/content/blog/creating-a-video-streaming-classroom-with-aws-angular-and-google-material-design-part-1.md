---
title: "Creating a Video Streaming Classroom with AWS, Angular, and Google Material Design | Part 1"
date: 2016-03-05
excerpt: "I've been thinking a lot lately about video streaming platforms used in the ed tech space, what makes them different from one another, and how feasible it would be to create one from scratch. After a "
categories: ["Angular", "Ed Tech", "JavaScript", "Web Development"]
wpId: 937
---

I've been thinking a lot lately about video streaming platforms used in the ed tech space, what makes them different from one another, and how feasible it would be to create one from scratch. After a short discussion with some people on the DEC team, I looked into the possibility of hosting and streaming video content on AWS. We inevitably decided to go in a different direction, but I was curious about the possibilities and decided to explore for myself. [Check out the working project here >>>](https://s3.amazonaws.com/everhartmedia/index.html) This will be a rather long post as this project covered some new ground for me with hosting static and video assets on Amazon S3 and using Google Material Design instead of trusty old Bootstrap for the front-end. Since there is so much to cover, and hopeful so much for others to learn from my mistakes and decisions, I'm going to split this into two posts. The first post will cover the set-up process for the hosting and the creation of the media classroom bones. The second post will cover the interactive tools I made for the classroom, like time synced notes and discussion comments.

## Getting Started with AWS Simple Storage Service

I've had a little bit of experience with Amazon Web Services over the past few years, but I never really built anything of substance. When looking at services used to host and stream video assets, the S3 service offered by AWS stood out as an obvious choice. At the time, we were talking about transferring several TBs of video to AWS and thinking of ways to make those videos accessible to students and faculty as we transitioned lecture capture systems. One of the immediate issues we ran into was the cost of data storage and transfer. Even though most of our users would be located withing the Virginia availability zone for AWS, it would still cost around $0.03 to store a GB of video and $0.09 per GB of data transferred out of our S3 bucket. At scale, that cost started to add up. Even if we were to store only a TB of data and consume that amount each month, the monthly cost would add up to around $12.00 per TB. The second challenge with this method involved the way that HTML5 loads video. Each time an HTML page is loaded with a video tag, part of that resource is downloaded by default whether the user watches the video or not. For some of the tests I ran on a 50MB video, the initial content load for the video partial was around 3MB. Again, not huge, but something worth thinking about if looking at scaling this solution across users and if presenting multiple videos in one view. Eventually, we decided to go in a different direction, but I was interested in how to make this work from a technical perspective given these constraints at scale. I uploaded several recorded presentations and videos from faculty workshops I'd given and started trying to recreate a "video classroom" with some of the same tools available in any of the popular active learning video solutions in the ed tech space.

## Setting Up the Page for the Video Classroom

Over the last several months, I've relied pretty heavily on Node and Express to help me build out JavaScript apps, but I wanted to challenge myself to make this project happen with a single, static HTML page served from the same AWS S3 bucket where my video resources are stored. To add to the challenge, I really wanted to get away from using Bootstrap 3 for every project. Some of the tech-savvy students I work with had been talking up Google's Material Design a lot, so I decided to throw that in the mix.  To keep something consistent, I decided to use Angular to help me work out some of the trickier things I wanted to do with the view layer. I got started by basically copying a Material Design template built using Angular directives, which [you can find at this link](https://material.angularjs.org/latest/getting-started). The blank shell application was enough to get me started and helped out by pre-loading all of the dependencies using Google's CDN (\*\*\*I had to change http:// to https:// to get all of the libs to load on the final project is S3. Since S3 serves https, it gets angry when you don't). There was [a really helpful getting started guide](https://github.com/angular/material-start/tree/es5-tutorial) that walked me through adding my first few view components, and my final design doesn't differ too much from the example created on the getting started guide.  Here is a look at the bare bones layout I created from the getting started examples:

```html
<md-toolbar>
      <h1 class="md-padding">Jeff Everhart | Media &amp; Presentation Library</h1>
    </md-toolbar>

    <!-- Container #2 -->
    <div flex layout="row">

        <!-- Container #3 -->
        <md-sidenav md-is-locked-open="true" class="md-whiteframe-z2">
          <md-list>
            <md-list-item>
            <md-button>
              <!-- Video Titles Would Go Here -->
            <md-button>
            </md-list-item>
          </md-list>
        </md-sidenav>

        <!-- Container #4 -->
        <md-content flex id="content" class="md-padding">

          <h2>Selected Video Title Display Here</h2>
          
          <video id="my-video" class="video-js" controls preload="auto" width="640" height="264"      data-setup="{}" ng-src="videosrchere" type="video/mp4">
           
           <p class="vjs-no-js">
           To view this video please enable JavaScript, and consider upgrading to a web browser that
           <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
           </p>
           </video>

  </md-content>

</div>
```

If you are familiar with Bootstrap or another front-end framework, the ideas of Material Design should be pretty familiar to you, especially if you have used the Bootstrap Angular UI directives. Basically, the Angular Material Design directives compile down to regular HTML with all of the class and CSS styles that the directives represent. The next step was to get the Angular code in place to start rendering some of the view elements.

## Toggling Video Sources with Angular JS

After setting up the page layout with Material Design, I started working on the Angular code that would control which videos were displayed. I was pretty set on having Angular swap out the source path on the one video element on the page as the user toggled between videos in a side nav menu, which should help keep the overall data transfer down as well. Instead of loading a page with multiple videos and wasting 3MB per video tag, I could use one video tag and swap out the source with Angular, thus only using data when the user requested a specific video. Since AWS S3 is flat object storage instead of file storage or a DB, I knew that I would have to start with some sort of data model. I created an array of objects and assigned those to a $scope variable:

```js
$scope.videos = [
        {
          title: "The ABCs of the Canvas REST API", 
          dbPath: "api",
          src: "canvasAPI.mp4", 
          tags: [], 
          comments: [], 
          notes: []

        },
        {
          title: "Calling All Humanists",
          dbPath: "humanities",
          src: "digitalhumanities.mp4", 
          tags: [], 
          comments: [], 
          notes: [] 

        } 

      ];
```

I included empty arrays for the tags, comments, and notes, as some of these things would be added to the $scope later through user interaction. Eventually, I want to add support for Firebase DB to store comments and notes across sessions, so I included a dbPath property for each object since I'll need that later. Since the JS code is just in a script tag at the bottom of the index.html file served from my S3 bucket, I could reference the file paths to the videos as relative paths. Although it was pretty simple for me to do in this example, partially because my S3 bucket only has five items (four videos, one HTML file), it won't always be that easy.

### Loading $scope Data into the View

Once I had the data model attached to the $scope.videos array, I needed to work on getting that information into the view. For the most part, that was as easy as using some simple Angular directives and a really simple function that changed the selected video based on user input. The first step was displaying the titles of videos in the sidebar nav. I did this by just calling ng-repeat on the $scope.videos array to append the video title wrapped in a button inside of a list item:

```html
<md-sidenav md-is-locked-open="true" class="md-whiteframe-z2">
          <md-list>
            <md-list-item ng-repeat="video in videos">
            <md-button ng-click="selectVideo(video)">
              {{video.title}}
            <md-button>
            </md-list-item>
          </md-list>
        </md-sidenav>
```

The next step was using ng-click to update the selected video as users switched between the different video titles in the sidebar nav. This was still pretty easy using Angular's built-in directives, but there were a couple of things I needed to think about before things really got working. First, I needed to figure out a way to display a video on page load. Since I wanted to dynamically update the source attribute of the video tag, I couldn't just hard code in a value, so I had to get creative and use some additional $scope variables to make it happen:

```
//This line initializes the first video in the videos array as a selectedVideo
$scope.selectedVideo = $scope.videos[0];

//This function takes a video as a parameter and sets it to the new //selectedVideo
$scope.selectVideo = function(video){
        $scope.selectedVideo = video; 

      };
```

First, I just created a variable called $scope.selecteVideo to hold the currently selected video, and wrote a simple function that takes a video as a parameter and updates the selected video. Once this was in place, I needed to revisit a few places in my markup to tie into these parts of the controller.

```html
//Use ng-click to call selectVideo function with the current video
//in the ng-repeat loop as a parameter
<md-list-item ng-repeat="video in videos">
            <md-button ng-click="selectVideo(video)">
              {{video.title}}
            <md-button>
</md-list-item>

//Use ng-src to set video source attribute to src proprty of //selectedVideo
<video id="my-video"  ng-src="{{selectedVideo.src}}" type="video/mp4">
 </video>
```

Just a few things to point out in these few sections of code. First, if you ever want to dynamically update the source of an image, audio, or video tag using Angular, make sure to use the ng-src directive instead of the src attribute. Including the Angular curly braces {{}} inside of src attributes will cause a huge error since the braces will be parsed as a part of the file path. Second, this particular use of ng-click, passing a parameter to a function inside of ng-repeat, is likely one of my favorite uses of Angular. It just makes it so easy to update the view layer based on specific data points.

## Wrapping Things Up for Part 1

That pretty much sums up the process of getting things rolling on my streaming video classroom. Using just a few lines of JavaScript I was able to create a clickable side nav menu that dynamically updated the sources of the video player, making it really easy for users to switch between videos without leaving the page while also keeping data transfer to a minimum. In Part 2 of this series, I'll talk about how I made everything a little bit more interactive by adding tools for time synced notes and discussion comments.

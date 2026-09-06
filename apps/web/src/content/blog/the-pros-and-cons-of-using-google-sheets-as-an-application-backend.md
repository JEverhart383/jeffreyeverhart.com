---
title: "The Pros and Cons of Using Google Sheets as an Application Backend"
date: 2016-03-01
excerpt: "I've been doing more lately working with APIs of different sorts, and I recently stumbled onto some cool ways to use [Google Sheets to connect with APIs and store the data very easily in a spreadsheet"
categories: ["Google Apps Script", "Google Sheets", "JavaScript"]
wpId: 923
---

I've been doing more lately working with APIs of different sorts, and I recently stumbled onto some cool ways to use [Google Sheets to connect with APIs and store the data very easily in a spreadsheet](http://www.jeffreyeverhart.com/2016/02/24/using-google-sheet-and-google-apps-script-to-work-with-apis/). Having completed the linked project in less than an hour, I was really interested in figuring out the pros and cons of using Google Sheets as a full on backend for a more robust application that included some custom data visualization. The example I've been working on, which you can find linked in the project above, gets the current weather for Farmville, VA every hour and adds it to a spreadsheet. Most of the applications I've made lately have been some variation of the MEAN stack, and I was working on an application that uses the Geolocation API to make weather forecasts for a current location already, so I figured that it would be cool to build in a function to make use of the historical weather data I already had stored in Google Sheets. You can check out [a fully working version of the app here.](https://nameless-thicket-50828.herokuapp.com/#/home) This post will explore just of few of my thoughts and reflections on the process.

## Getting Data Out Requires Some Work

The first step of the process involved getting the data out of Google Sheets. I had already published the sheet to the web as a CSV. Since I was using Angular to help structure the front-end, I hoped that I could just use the $http module to get the sheet as a CSV. Alas, I was busted by the CORS police. CORS, or [cross-origin resource sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS), is a big no-no for many modern browsers, and for good reasons. This rule typically prevents sites from requesting resources from a different domain, so if I served the page from localhost or my Heroku container, I could only request resources from those locations.

```js
var url = "GoogleSheetsLinkHere"
$http.get(url).
success(function(data){
   console.log(data);

}).error(function(data){
   console.log('Error: ' + data); 

}

//This did not work. Loading Google Sheets CSV from browser breaks CORS settings.
```

 

### Enter Node and Express

After getting busted by the CORS restrictions, I decided to just write a quick Node route to handle the AJAX request from Angular. That way, my Node server was making the request to Google Sheets, which is totally OK, and then passing off the results of the request to Angular. I was able to do this in just a few lines of code.

```null
//Angular JS code to load Google Sheets CSV on click 

$scope.getSheet = function(){

 $http.get("/getSheet")
 .success(function(data){ 
 
   console.log(data);
 
 })
 .error(function(data){
   console.log('Error: ' + data);

   });
 }; 



//Node JS Route to Load Google Sheet as CSV

app.get('/getSheet', function(request, response){


  //Create variables for the host and path
  var host = 'docs.google.com'
  var path = '/spreadsheets/d/sheetIDhere/pub?gid=0&single=true&output=csv'; 

  //Create str variable to hold Google Sheets response
  var str = '';
  		
  var options = {
        	host: host,
      		path: path,
      		method: 'GET'

        };
  		
 //Make https request using variables 
 var req = https.request(options, function(res){
  			
    		res.on('data', function (chunk) {
          	str += chunk;	
        });

        res.on('end', function () {
          	response.send(str); 

        		});
      }); 

      req.end(); 

      req.on('error', function(e){
        console.error(e);
      });




});
```

The code above, which consists of an Angular $http request and a Node route to handle that request, return the Google Sheets as a string of CSV. From there, I wanted to use D3 to parse the data and display a chart of the results.

### Be Careful with CSV Headers

This is where I ran into my first problem with manipulating the data. Since the Google Sheets CSV is returned as a string, and the CSV headers are taken directly from the first line of the sheet, some funky things can happen when you parse the data if you're not careful about how you create your headers in Google Sheets. When I parsed the CSV into JSON using D3, I was stuck with an odd looking object like the one below:

```js
var csv = dataFromNodeResponse; 
d3.csv.parse(csv, function(d){
console.log(d); 

});

//Each parsed JSON object looked like this
{
Temperature: 45.95, 
"Dew Point": 45.67, 
"Visibility " : 7.65, 
Timestamp: "02/23/2016"
}
```

There were a couple of things that made this JSON difficult to deal with. First, the "Dew Point" key made it really difficult to access the value using dot syntax, so instead of being able to use data.dewPoint, I would have to use data\["Dew Point"\]. Not a huge deal, but just another thing to deal with. However, the fix for that was easy enough, and I just changed "Dew Point" to "dewPoint" in the CSV header to create a much cleaner object. The second issue was more of just an oversight. When I created the data spreadsheet in Google Sheets, I manually added the header row and left an extra trailing space after "Visibility," which again prevented me from accessing that value using dot syntax. But again, the fix was easy enough: delete the trailing space from the Google Sheet. Lessons learned = be careful with CSV headers, or add them programmatically with Google Apps Script to avoid human error.

## Google Makes Analysis and Visualization Too Easy

My entire goal with this project was to visualize the weather data using some library built on top of D3. I've already used the [dimple.js](http://dimplejs.org/) library and its corresponding Angular directives in several other projects, so I thought I'd look at another library call [nvd3](http://nvd3.org/). If you have ever used a charting library, you likely understand how picky these libs can be about the way you model the data you want to chart. In dimple, it really prefers an array of JSON objects, but nvd3 uses a much more complicated data structure that looks like this:

```js
$scope.farmvilleData = [

          {
            "key": "Temperature", 
            "values": [ {"x": "02/23/2016", "y": "45.67"}]
          }, 
          {
            "key": "dewPoint", 
            "values": [{"x": "02/23/2016", "y": "45.67"} ]
          }
        

    ];
```

You start with one array to hold specific objects for each series you want to chart, and each one of those has key/values properties. However, the values property for each object holds an array of objects that map to the X and Y coordinates of the chart. So my challenge at this point was coercing the CSV data, which was parsed into individual JSON objects, into this very specific format.

```js
d3.csv.parse(data, function(d){
            weatherArray.push(d); 

            $scope.farmvilleData[0].values.push({
              "x": d.Timestamp, 
              "y": d.Temperature
            }); 

            $scope.farmvilleData[1].values.push({
              "x": d.Timestamp, 
              "y": d.dewPoint
            }); 
            
          });
```

Overall, that seemed easy enough to do, although the way I'm accessing each of the series objects using these lines tightly couples this code to both the data model and the visualization since I'm hard-coding the array index of the key/value object. I'm sure there is a better way to do this, maybe with a JavaScript map function of using a foreach loop. After looking at the final visualization, I was really unimpressed with what had taken me three or four hours, from start to finish, to do, especially when I was able to create a quality, interactive visualization with Google Sheets that I was able to embed on my blog with just a few click in the Google Sheets UI. I think making the visualization in pure D3 would have been easier since you have more flexibility to define how you will model and access the data, so much of the futzing I had to do to get the data into a format nvd3 would accept could have been bypassed. I'm going to try and do a few more visualizations or other things with Angular to make sure I explore this project fully before making a ruling. But, at the end of the day, if you're looking to make a quick API backend and present a simple data viz, Google Sheets is tough to beat. \*\*\*Also, as a side note, I'm unhappy with how some of Bootstrap 3's components treat SVG data visualizations. If you take a look at the example MEAN app, when you toggle between tabs with a rendered data visualization, it will crunch the existing viz to one side. Something to look into, and I also wonder if that is because I'm using vanilla Bootstrap and not the Angular Bootstrap UI directives. We all  know how picky Angular can be :)

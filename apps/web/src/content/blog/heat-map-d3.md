---
title: "Building A Simple Heat Map with D3"
date: 2016-03-12
excerpt: "Heat maps are a great way to analyze frequency in a data set. Beautiful and creative things happen when you are stuck in an airport for four hours. I've been wanting to explore heat map visualizations"
categories: ["Data Visualization", "JavaScript", "Web Development"]
wpId: 970
---

Heat maps are a great way to analyze frequency in a data set. Beautiful and creative things happen when you are stuck in an airport for four hours. I've been wanting to explore heat map visualizations for awhile now, so when I had some time to kill flying back from SXSW, I decided to take a stab at creating a pretty simple heat map visualization. I've embedded the Code Pen here, but I'll also walk through this implementation. I'm going to skip the basic stuff like creating the SVG, so if you're interested in that, check out the CodePen.

See the Pen D3 Heat Map by Jeff Everhart ([@JEverhart383](http://codepen.io/JEverhart383)) on [CodePen](http://codepen.io).

## The Data

This is likely the most unrealistic data set that anyone would use to create a heat map, but it ended up working for the way I decided to create the visualization.

```js
var data = [

        {
          "week": 1, 
          "day" : 1, 
          "value": 6
        }, 
        {
          "week": 1, 
          "day" : 2, 
          "value": 7
        }
//So on and so forth

    ];
```

Just some simple JSON objects with a property for the day and property for the week, which would eventually become my X and Y coordinates for building the SVG, and a property for the value. I was trying to replicate GitHub's daily commit heat map or something like it so this was all I really needed in the data department.

## The Color Scale

I needed to create a color scale to help color the rectangles of the heat map, so I used the D3 extent method to get the extent min and max of the dataset as an array, which you need to build the color scale. Then, you create a linear scale, pass your min and max values to the domain of that linear scale, and then specific an output range. D3 supports passing valid CSS color strings as arguments, but I could have just as easily used hex code or RGB.

```js
var colorDomain = d3.extent(data, function(d){
      return d.value;
    });

    var colorScale = d3.scaleLinear()
      .domain(colorDomain)
      .range(["lightblue","blue"]);
```

Understanding the ideas of domain and range are pretty tricky, but I always like to think of it as the fact that you are mapping and input domain (min, max values) to an output range (min, max values). Jerome Cukier has a great image and [explanation here for those interested in learning more about scales](http://www.jeromecukier.net/blog/2011/08/11/d3-scales-and-color/). ![d3 range heat map](/media/d3scale1.png)  

## Creating Rectangles from Data

Next up, I used the wizardry of D3 to generate a rectangle for each JSON object in the data array. For those of you used to working with D3, the first variable declaration should look normal to you, but I'll do a bit of explaining for everyone else. In D3, when you bind data to SVG elements, you use this pattern, essentially selecting all non-existent elements, which then creates a reference to those elements, and then we inject data into those references before appending them to the parent SVG. If that sounds weird, it totally is, so it's better to just accept its awesomeness.

```js
var rectangles = svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect"); 

    rectangles
    .attr("x", function(d){
      return d.day * 50; 

    })
    .attr("y", function(d){
      return d.week * 50; 
    })
    .attr("width", 50)
    .attr("height", 50). 
    style("fill", function(d){
      return colorScale(d.value); 
    });
```

Once I created the rectangles, I still needed to tell them where to be positioned and which color to be. To do that, you can tie attributes like X, Y, and color to functions that calculate the values based on the data point tied to the SVG element. For example, to create the X position, I set the X attribute of the rectangle SVG equal to the value of the day multiplied by 50, which was also the width of my rectangles. That created a nice row that went across for each day of the week. To create additional rows for week 2, I just did the same function for the week so that each new week created an additional row. Lastly, to set the color, I just set the fill of the SVG equal to the color scale we created, which returns a value from the range we specified based on the value passed to it.

## Wrapping Up our Heat Map

Overall, this was a fun start to what I hope is more experience with heat maps in the future. Next time, I'll try tackling a larger and more complex data set and adding axes or labels to the heat map.

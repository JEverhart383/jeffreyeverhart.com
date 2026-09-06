---
title: "Using AmCharts with Vue and Webpack"
date: 2017-10-25
excerpt: "I finally swallowed the Webpack pill, mostly because I wanted to get the most out of single file Vue components for some new projects I'm working on, and Webpack is along for the ride. ![vue and webpa"
heroImage: "/media/logo.png"
categories: ["JavaScript", "Web Development"]
wpId: 1412
---

I finally swallowed the Webpack pill, mostly because I wanted to get the most out of single file Vue components for some new projects I'm working on, and Webpack is along for the ride. ![vue and webpack](/media/logo.png) Overall, it's been a semi-frustrating but also instructive experience. Before this I never used ESLint or any other type of linting, and I'm still pretty on the fence about its usefulness outside of really large and complex projects, but it's taught me a few things about what people consider 'modern' JavaScript to look like. Webpack itself seems to be like Gulp on steroids and a bit more to wrap your head around. However, the biggest change it necessitates for me is adoption of ES6 module patterns. I'm familiar with this type of pattern from my work on Node projects, but its usage with single file Vue components was new to me. More importantly, a lot of the previous patterns I've used to build things on the front end are now pretty much bunk. I'll talk about a few ways to work around some module conventions if you are using a project that doesn't support that method.

## The Issue at Hand

In a lot of my previous projects, I handled dependency management in a more straightforward fashion. If the project was small, a few script tags in the body sufficed. If it was larger, I would use Gulp to minify and concatenate all of the files together into one bundle. Webpack, on the hand, introduces the idea of the dependency graph and organizes your code so that each module is self-contained, and only has access to the code it needs to do its job. Overall, this promotes good design patterns and reduces the amount of bugs that can be introduced into your code. While that's all well and good, those benefits come at the cost of added complexity, especially if the code you use to build things doesn't adhere to the module pattern. In this case, [Amcharts](https://www.amcharts.com/javascript-charts/) is a library I use quite frequently for charting, and it wasn't _immediately_ compatible with Vue and Webpack. The fix was fairly easy, but I figured I'd write a blog post to help further my own understanding as well as add to the searchable material that others might find useful.

## Understanding the Module Pattern

To better understand how to make random things work with Webpack, let's look at how it works and what it needs/expect to do what it does. Before advanced JS bundling, most library developers followed the practices outlined below:

```null
window.sweetLibrary = {
      method: function () {
       console.log('sweet method')
      }, 
      property: 'sweet prop'
}


sweetLibaray.method()
```

You would define a global variable or attach an object to the global window object, which are both ways of saying make the library interface available to any JavaScript program executing in the same thread. This is pretty straightforward, but not without its downsides. If we have a bunch of different libraries mucking around in the global scope, the potential for namespace collisions goes up. Lots of smart developers came up with ways to make this more sensible for larger-scale projects, mostly involving closures, but I won't get into all that. There is a great article from the Free Code Camp community that [sums up JS modules](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc) better than I could. **So, how is the module pattern different?** Instead of making our JS libraries available to the global scope, we can explicitly export objects and import them only when needed. For example, we might define a locally scoped object, and then expose that through a module interface using module.exports:

```null
//sweet-library.js

let sweetLibrary = {
    method: function () {
      console.log('sweet library')
    }, 
    prop: 'sweet prop'
}

module.exports = sweetLibrary
```

Here we are exporting an object, but we can really export anything we want. Once we've exported something, we can import or require that module in another piece of code to gain access to its functionality.

```null
//sweet-component.js 
let sweetLibrary = require('sweet-library')
sweetLibrary.method()
//sweet method

//Or, we could use import 
import sweetLibrary from 'sweet-library'
sweetLibrary.method()
//sweet method
```

Mostly these two methods do the same thing by giving you access to another library or object through this export/import pattern. And, more importantly, this is the way the Webpack expects you to use JS code if you want it to be managed by the Webpack build process.

## Getting Amcharts to Work (using non-module libraries with Webpack)

Back to my initial issue. I have this library I use a lot for charting, and want to use it within my Webpack project, so what to do once you find out Amcharts does not support the module pattern. At first, I reverted back to including a script tag in the HTML file, hoping that my Vue code could grab the reference from the global scope. I'm sure that might have worked, but my new ESLinter gently reminded me that wasn't a best practice. ? It's worth noting that Amcharts published [a quick tutorial on some of this](https://www.amcharts.com/kbase/using-amcharts-vue-js-webpack/), but it seemed to incur some additional costs to load images, but also didn't work with ESLint because the AmSerial was never used even though it was imported. ESLint apparently is very picky about things. So, I found this [Github issue that pretty clearly stated Amcharts wasn't going to support modules](https://github.com/amcharts/amcharts3/issues/20) any time soon. I tried a few things listed in the comments, but no luck. However, there was one person who mentioned getting it to work with Vue and Webpack by working around with the window object. AhHa! And sure enough that was the key to getting the best of both worlds. I ended up doing something like the code below:

```null
import 'amcharts3/amcharts/amcharts'

var chart = window.AmCharts.makeChart('chartdiv', {
      config: 'config'
    }
```

The import statement indicates to Webpack that Amcharts is a dependency and needs to be included in the bundle, but since the Amcharts library doesn't export anything using modules.export, there is no way to interface with it that way. After digging into the Amcharts source code, I could easily see in the first few lines that it was modifying the global window object. So, by tapping into the window object myself, I was able to get everything work and pass the ESLint checks. Maybe there is a better way to go about this type of thing, and I'm sure I'll learn more as I use Webpack and Vue CLI more, but hopefully this will help some poor soul as they wade through the module murkiness.

---
title: "Analyzing and Visualizing Networks"
date: 2017-10-03
excerpt: "One of the [current projects I'm working on](https://rampages.us/davinci-events/) involves building out some analytical tools that sit on top of an application that lets students track attendance at e"
heroImage: "/media/Screen-Shot-2017-09-28-at-2.14.08-PM.png"
categories: ["Data Visualization", "JavaScript"]
wpId: 1383
---

One of the [current projects I'm working on](https://rampages.us/davinci-events/) involves building out some analytical tools that sit on top of an application that lets students track attendance at extra curricular events for a living and learning program for the [daVinci Center](http://www.davincicenter.vcu.edu/). For most of the visualizations, I used [amCharts](https://www.amcharts.com/) to build out some nice looking and functional charts, but since this data set is pretty unique, I also wanted to explore some of the unique information available that other analytical tools might ignore. After working together a pretty gnarly SQL query to expose all of the student attendance data through the WordPress REST API, I settled on creating a network graph that shows all of the co-attendance between the students at all of the events.

See the Pen [Student Network Analysis](https://codepen.io/JEverhart383/pen/EwwjXK/) by Jeff Everhart ([@JEverhart383](https://codepen.io/JEverhart383)) on [CodePen](https://codepen.io).

Overall, I was really happy with how this turned out for a few reasons. One of the key tenants of the da Vinci model and its living and learning programs is that the cross-pollination of ideas across disciplines is what leads to innovation. While the program is open to anyone, at least to my knowledge, they focus on getting students from Business, Engineering, and the Arts to work together. Thus, by encoding those groups in the network graph by using color, we should be able to literally visualize the ways in which students are interacting across those boundaries. More importantly, it can also help very quickly identify outliers that might not immediately be apparent in other forms, which we can see by the pair of students off in the corner. In a program where collaboration is encouraged, it might be worthwhile to check in on these folks to see what's up.

## Notable Algorithms and Such

Part of the reason that I wanted to do this visualization in the first place was because I'd never written code to piece together the nodes and edges of the network before. As with most things, I decided not to consult the oracles on StackOverflow immediately, and am happy to say that I came up with a working implementation without copying anything from anyone else. Since this was a [undirected graph](https://en.wikipedia.org/wiki/Graph_\(discrete_mathematics\)#Undirected_graph), meaning there is no directionality associated with the links or edges between nodes, I needed to capture each unique occurrence of a pair of students attending the same event. Here is what each attendance record looked like in simplified form:

```json
{eventID:511, userEmail:"jeff@awesome.com", ...}
```

And here is what the finished data structure looked like before feeding it into D3:

```js
let network = {
    "nodes": [{
        "id": "jeff@awesome.com", 
        "group": "Humanities & Sciences"
    }], 
    "links": [{
        "source":"jeff@awesome.com", 
        "target":"everhart@me.com", 
        "value":1
    }]
}
```

We have a network object, with properties for the nodes and links that both contain array of different objects. Each link object contains a source, target, and value. Since this is undirected, the source and target are sort of arbitrary, and the value specifies the number of times that those two people attended the same event. The value count was integral in helping to weight the links on the force directed graph so that students with more co-attendances are linked more tightly together. At present, we have only about 50 or so records, but that number will easily quadruple by the end of the semester, so I was interested in making the code used to construct this network diagram as efficient as possible. In the end, there is one section that amounts to O(n^2) runtime, but I was able to prevent a lot of loops within loops by making using of hash tables, or just plain old objects in JavaScript as my in between data structures. If you're interested in looking at that code, you can take a look at [the source on GitHub.](https://github.com/RVA-ALT-Lab/davinci-events/blob/master/page-templates/analytics.php)

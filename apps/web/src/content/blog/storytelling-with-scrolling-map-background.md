---
title: "Storytelling with Scrolling Map Background"
date: 2018-05-18
excerpt: "For a recent project, we were helping a group from the Environmental Sciences department translate some of their academic research on a particular type of bird into a more general narrative targeted t"
heroImage: "/media/Screen-Shot-2018-05-18-at-10.35.26-AM.png"
categories: ["Data Visualization", "GIS"]
wpId: 1633
---

For a recent project, we were helping a group from the Environmental Sciences department translate some of their academic research on a particular type of bird into a more general narrative targeted towards a general audience.

As a part of this process, we wanted to create a section of our companion site that illustrates the annual migration pattern of the [Prothonotary Warbler.](https://en.wikipedia.org/wiki/Prothonotary_warbler) The migration is important because of the wide range the birds travel, starting in the North American south and ending in the Panamanian mangroves during winter.

In preparation for our part of the work, we looked at other examples of compelling digital storytelling and found a lot of great examples at [The Pudding](https://pudding.cool/). Most of their most polished pieces use an interesting sticky scrolling pattern, where the screen is split into equal parts and as the user scrolls through textual explanations a corresponding data visualization of some kind is updated based on the user's position.

Matt worked up some great mockups that we were using to build out our interactive components, and his mockup used a full screen background that outlines this migration pattern. After looking at this, it seemed like we should be able to make this interactive in the same way The Pudding does using some simple map libraries.

I based my code in part on [the examples describing the usage of the Scrollama JS library](https://pudding.cool/process/introducing-scrollama/) and found everything pretty intuitive. There isn't anything super fancy here with the code, so you can check that out in the embedded code pen below, but I figured this was worth writing about because it seems like an interesting take on an already popular pattern in digital storytelling.

See the Pen [Scroll Map Background](https://codepen.io/JEverhart383/pen/dewYRW/) by Jeff Everhart ([@JEverhart383](https://codepen.io/JEverhart383)) on [CodePen](https://codepen.io).

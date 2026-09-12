---
title: "Build a Headless WordPress App with React and WPGraphQL"
date: 2022-04-18
summary: "The same crash course without the framework: a plain React app, Apollo wired up by hand, and WPGraphQL queries built live in the GraphiQL IDE before they ever hit a component."
url: "https://www.youtube.com/watch?v=cdBBCCvIqvo"
platform: youtube
videoId: "cdBBCCvIqvo"
durationSeconds: 1575
org: wp-engine
series: "Headless WordPress Roadmap"
tags: ["wordpress", "headless", "react", "wpgraphql", "apollo", "graphql"]
---

The React counterpart to the Next.js crash course, three days later. Everything
runs in a CodeSandbox starter, so there's no local setup to get wrong — the whole
video is the data layer.

Doing it in plain React makes the Apollo part more visible than the Next.js
version does. No `getStaticProps` to hide the fetch in: you create the client,
wrap the tree in a provider, and then it's `useQuery` in the component that needs
posts. Queries get drafted in the online GraphiQL IDE first and pasted in once
they work, including the variable-passing for a single post by slug.

Starter sandbox:
[headless-wordpress-react-demo-starter](https://codesandbox.io/s/headless-wordpress-react-demo-starter-3sid45).

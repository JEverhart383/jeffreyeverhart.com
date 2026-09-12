---
title: "Build a Headless WordPress Site with Next.js and WPGraphQL"
date: 2022-04-15
summary: "A crash course on WP Engine's channel: stand up a local WordPress site, put WPGraphQL in front of it, and wire a Next.js app to it with Apollo — static routes, dynamic routes, and all."
url: "https://www.youtube.com/watch?v=wfy51nhjfUQ"
platform: youtube
videoId: "wfy51nhjfUQ"
durationSeconds: 2084
org: wp-engine
series: "Headless WordPress Roadmap"
tags: ["wordpress", "headless", "nextjs", "wpgraphql", "apollo", "graphql"]
---

A start-to-finish build for people who know WordPress and are meeting Next.js for
the first time. Local WordPress site, WPGraphQL installed, debug mode on so the
GraphiQL IDE is there to poke at — then the front end, from an empty Apollo
client to a post list to dynamic post routes.

The half that tends to trip people up is the routing. `getStaticProps` fetching
one post by URI is straightforward; `getStaticPaths` deciding *which* posts exist
at build time is where the headless mental model actually has to click. Roughly
the back half of the video is that.

There's a written version with the same code on the WP Engine developer blog, and
the repo is at [JEverhart383/crash-course-headless-wp-next-wpgraphql](https://github.com/JEverhart383/crash-course-headless-wp-next-wpgraphql).

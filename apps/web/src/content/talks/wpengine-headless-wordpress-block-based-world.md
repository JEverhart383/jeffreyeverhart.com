---
title: "Building with Headless WordPress in a Block-based World"
date: 2023-09-15
summary: "A livestream on what full site editing does to headless WordPress: the anatomy of a block, how to get block data out over WPGraphQL or REST, and how to map it back to React components."
format: livestream
venue: "WP Engine"
url: "https://www.youtube.com/watch?v=5e9fV01a3Oc"
videoId: "5e9fV01a3Oc"
durationSeconds: 3383
org: wp-engine
tags: ["wordpress", "headless", "gutenberg", "blocks", "wpgraphql", "faustjs", "nextjs"]
---

Headless WordPress spent years pretending the block editor wasn't happening. This
session starts from the opposite premise: full site editing is where WordPress
actually went, so a decoupled front end has to have an answer for blocks or it's
building against a CMS that no longer exists.

The hour works up from block markup and `block.json` to ACF blocks as an
alternative authoring flow, then to the part that matters for a decoupled site —
querying block data through WPGraphQL or the REST API and mapping each block to a
component, which Faust.js's `WordPressBlocksProvider` does for you.

It closes on where this was heading: the last stage of the React–Gutenberg
bridge, interactive blocks, and what FSE means for anyone rendering WordPress
content somewhere other than WordPress.

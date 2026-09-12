---
title: "How to Build Video Activity Notifications in Next.js"
date: 2024-05-31
summary: "A guest post on Mux's blog wiring Mux webhooks and player events into Knock workflows, so a Next.js app can tell people a video is ready, live, or worth watching without burying them."
url: "https://www.mux.com/blog/how-to-build-video-activity-notifications-in-next-js"
org: knock
publisher: "Mux"
kind: guest-post
coAuthors: ["Dave Kiss"]
tags: ["nextjs", "video", "webhooks", "notifications", "knock", "mux"]
---

Co-written with Dave Kiss at Mux. Two paths through the same problem: notifying
someone when a viewer watches a video they shared, and notifying subscribers when
a stream goes live. `MuxPlayer` events and Mux webhooks are the trigger; a Knock
workflow is what decides whether the message is worth sending.

The argument underneath it is that the interesting part of a notification
feature isn't the send — it's batching, delays, and preferences. Anyone can fire
an email on a webhook. Not burying the user is the work.

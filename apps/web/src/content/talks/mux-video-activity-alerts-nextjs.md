---
title: "Build Video Activity Alerts for Your Next.js App"
date: 2024-04-13
summary: "A livestream with Mux's Dave Kiss building the YouTube-style notification bell: Mux event webhooks on one end, Knock workflows on the other, multi-channel delivery in between."
format: livestream
venue: "Mux"
url: "https://www.youtube.com/watch?v=Bx7BDK6HMiw"
videoId: "Bx7BDK6HMiw"
durationSeconds: 3485
hosts: ["Dave Kiss"]
org: knock
tags: ["nextjs", "video", "webhooks", "notifications", "knock", "mux", "livestream"]
---

Streamed on Mux's channel with Dave Kiss. The framing is a question everyone has
already answered for themselves without noticing: how does the YouTube bell know
to light up?

We build it against a fictional app — MyTube — and work outward from the easy
version. Mux fires an event webhook, Knock turns it into a notification. Then the
parts that actually decide whether the feature is any good: batching so a busy
channel doesn't send twenty emails, subscriptions so people only hear about
creators they follow, and preferences so they can turn any of it off.

Six weeks later this became a written guide on Mux's blog.

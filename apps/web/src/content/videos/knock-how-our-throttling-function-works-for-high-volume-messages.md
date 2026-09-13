---
title: "How our throttling function works for high-volume messages"
date: 2025-04-21
summary: "🔔 High-volume events in your product, like usage-based billing alerts, system monitoring alerts, or frequent activity updates can be difficult to manage."
url: "https://www.youtube.com/watch?v=bCvCSNzGo9s"
platform: youtube
videoId: "bCvCSNzGo9s"
durationSeconds: 241
org: knock
publisher: "Knock"
tags: []
archive:
  slug: knock-how-our-throttling-function-works-for-high-volume-messages
  capturedAt: 2026-09-13
  linkStatus: live
draft: true
---

🔔 High-volume events in your product, like usage-based billing alerts, system
monitoring alerts, or frequent activity updates can be difficult to manage.

Sending too many notifications leaves your users drowning in information, unsure
if an alert is a new server failing or the same one they’re already working to
restore. Sending too few notifications means your users may miss important
context, like that a server has gone from ‘warning’ status to ‘error.’

Knock’s throttle functionality was built to handle use cases like these and
provides you with abstractions to limit the flow of notifications during
high-volume events without sacrificing important information a user may need.

## Resources

- [Try the demo](https://v0-throttle-demo.vercel.app/)
- [Read the docs](https://docs.knock.app/designing-workflows/throttle-function)

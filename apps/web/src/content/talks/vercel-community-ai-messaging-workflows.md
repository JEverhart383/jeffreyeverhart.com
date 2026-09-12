---
title: "AI Messaging Workflows with Knock"
date: 2025-07-03
summary: "A Vercel Community Session on wiring Knock's workflow engine to the Vercel AI SDK, so an agent can decide what to send and Knock handles how it gets delivered."
format: livestream
venue: "Vercel Community Session"
url: "https://community.vercel.com/live/community-session-ai-messaging-workflows-with-knock/15127"
recordingUrl: "https://www.youtube.com/watch?v=5GVKDIZTMFI"
videoId: "5GVKDIZTMFI"
durationSeconds: 4000
hosts: ["Amy Egan", "Jacob Paris"]
org: knock
tags: ["ai", "vercel-ai-sdk", "knock", "messaging", "devrel"]
---

A live session with the Vercel community on what changes when the thing deciding
to send a message is a model rather than a `if (user.subscribed)` branch.

The demo connects the Vercel AI SDK to Knock: the model reasons about what needs
to happen and calls a tool, and Knock's workflow engine takes it from there —
channel routing, batching, preferences, and delivery. The split is the point.
The agent decides *what* to say and to whom; none of the delivery mechanics
leak into the prompt.

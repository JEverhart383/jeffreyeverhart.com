---
title: "How to send in-app notifications with Next.js"
date: 2023-12-19
summary: "In this video, you'll learn how to create an in-app notification feed in a Next.js 13 project using Knock, a notification infrastructure."
url: "https://www.youtube.com/watch?v=yN0A_wjaWmc"
platform: youtube
videoId: "yN0A_wjaWmc"
durationSeconds: 2010
org: knock
publisher: "Knock"
tags: ["next.js", "react", "postgres"]
archive:
  slug: knock-how-to-send-in-app-notifications-with-next-js
  capturedAt: 2026-09-13
  linkStatus: live
draft: true
---

In this video, you'll learn how to create an in-app notification feed in a
Next.js 13 project using Knock, a notification infrastructure. The demo app uses
Vercel Postgres, Auth.js, and the Next.js app directory with server components
and actions. Knock's powerful primitives and pre-built React components make
this process super straightforward.

***Update Notice***
Since publishing this video, we've released a new React package that is slightly
different from what's shown in this video. Check out the differences here

## Resources

- [docs.knock.app: react migrating from react notification feed](https://docs.knock.app/in-app-ui/react/migrating-from-react-notification-feed)
- [docs.knock.app: react feed](https://docs.knock.app/in-app-ui/react/feed)
- [docs.knock.app: managing recipients identifying recipients](https://docs.knock.app/managing-recipients/identifying-recipients)
- [docs.knock.app: in app ui security and authentication](https://docs.knock.app/in-app-ui/security-and-authentication)

## Chapters

- `00:02` — Introduction
- `00:33` — Demo App Overview
- `01:54` — Creating an In-App Channel Feed
- `02:29` — Creating a Workflow
- `03:50` — Editing In-app Message Template
- `04:59` — Commit Workflow to Development
- `06:09` — Install NPM Dependencies
- `06:44` — Get Secret API Key
- `07:30` — Identify Users with Knock Client
- `12:11` — Create NotificationMenu Component
- `15:02` — Ensure Client-only Rendering with useEffect
- `19:32` — Trigger Workflow from Server Action
- `21:30` — Get Recipients from Postgres
- `22:58` — Trigger Workflow with Knock Client
- `26:38` — Testing In-app Notifications
- `28:02` — Enable Enhanced Security Mode
- `29:02` — Implementing Knock Signing Key
- `33:02` — Wrapping Up

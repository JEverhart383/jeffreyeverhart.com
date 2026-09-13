# How to send in-app notifications with Next.js

Source: https://www.youtube.com/watch?v=yN0A_wjaWmc
Captured: 2026-09-13

---

In this video, you'll learn how to create an in-app notification feed in a Next.js 13 project using Knock, a notification infrastructure. The demo app uses Vercel Postgres, Auth.js, and the Next.js app directory with server components and actions. Knock's powerful primitives and pre-built React components make this process super straightforward.

***Update Notice***
Since publishing this video, we've released a new React package that is slightly different from what's shown in this video. Check out the differences here: https://docs.knock.app/in-app-ui/react/migrating-from-react-notification-feed

Knock Documentation Links
https://docs.knock.app/in-app-ui/react/feed
https://docs.knock.app/managing-recipients/identifying-recipients
https://docs.knock.app/in-app-ui/security-and-authentication

00:02 - Introduction
00:33 - Demo App Overview
01:54 - Creating an In-App Channel Feed
02:29 - Creating a Workflow
03:50 - Editing In-app Message Template
04:59 - Commit Workflow to Development
06:09 - Install NPM Dependencies
06:44 - Get Secret API Key
07:30 - Identify Users with Knock Client
12:11 - Create NotificationMenu Component
15:02 - Ensure Client-only Rendering with useEffect
19:32 - Trigger Workflow from Server Action
21:30 - Get Recipients from Postgres
22:58 - Trigger Workflow with Knock Client
26:38 - Testing In-app Notifications
28:02 - Enable Enhanced Security Mode
29:02 - Implementing Knock Signing Key
33:02 - Wrapping Up

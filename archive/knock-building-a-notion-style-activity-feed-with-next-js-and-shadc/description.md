# Building a Notion-style activity feed with Next.js and shadcn/ui

Source: https://www.youtube.com/watch?v=V-65frts9X0
Captured: 2026-09-13

---

In this video, we’ll look at how to build an entirely custom in-app feed experience inspired by Notion using Knock’s JavaScript client. The example app is built using Next.js and shadcn/ui, and you can find it on our GitHub here: https://github.com/knocklabs/notion-feed-example

We’ll cover creating an in-app channel and workflow in Knock, using the client to fetch a user’s feed, how to manage message statues like ‘read’ and ‘archived,’ and then we’ll explore a few touches that make Notion’s feed experience so great.

Knock quick start
https://docs.knock.app/getting-started/quick-start

JavaScript client quick start
https://docs.knock.app/sdks/javascript/quick-start

Message statuses
https://docs.knock.app/send-notifications/message-statuses#engagement-status

In-app channel
https://docs.knock.app/integrations/in-app/knock

Chapters 
0:00 - Intro
0:35 - What will we build?
1:16 - Configure Knock resources
2:00 - Public API key
2:23 - In-app feed channel ID
2:40 - Getting a user ID
3:25 - Send test in-app messages
4:51 - Fetch a user's feed
5:00 - Initialize the Knock client
7:26 - Fetch feed inside useEffect
11:17 - Add event listener to knockFeed
13:54 - Compute archived/unarchived lists with useMemo
16:47 - Render feed items using FeedItemCard
19:39 - Display unread count using feed metadata
22:35 - Update message statuses
24:52 - How the Knock feed updates message statuses
26:13 - Implement markAllAsRead and markAllAsArchived
27:28 - Examining Notion details
27:39 - Unread feed item icon
28:45 - Applying opacity to read feed items
29:47 - Outro

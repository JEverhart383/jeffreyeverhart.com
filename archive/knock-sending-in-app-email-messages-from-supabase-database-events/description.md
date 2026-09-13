# Sending in-app & email messages from Supabase database events

Source: https://www.youtube.com/watch?v=JjVuTI6V_6k
Captured: 2026-09-13

---

Send notifications from any Supabase database event — not just auth events — using Knock's data sources. No serverless functions required.

In this walkthrough, we connect Knock to Supabase with database webhooks, sync users from the auth table, trigger a welcome workflow on signup, then build a pub/sub flow where users subscribe to posts and get notified when those posts update.

What we cover:
• Connecting Knock to Supabase via database webhooks
• Identifying users from auth.users events
• Triggering a welcome workflow with the Knock agent
• Modeling posts as Knock objects
• Subscribing users to objects from a subscriptions table
• Fan-out notifications to every subscriber with one workflow trigger

Read the full tutorial: https://knock.app/blog/building-a-notification-system-with-supabase
Knock's Supabase docs: https://docs.knock.app/integrations/sources/supabase
Supabase database webhooks: https://supabase.com/docs/guides/database/webhooks

Get started with Knock: https://knock.app

00:00 Intro
00:30 What you'll need
01:00 Connecting Knock to Supabase
02:30 Identifying users from auth events
03:30 Building a welcome workflow with the agent
05:00 Listening to any table event
06:30 Modeling posts as Knock objects
08:00 Subscribing users to objects

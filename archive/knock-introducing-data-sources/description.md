# Introducing data sources | Send messages from events in Stripe, Supabase, Clerk, WorkOS, and PostHog

Source: https://www.youtube.com/watch?v=Q0VSjeTJDp0
Captured: 2026-09-13

---

Today we're releasing data sources. With Knock data sources, you can connect events from any tool to your messaging infrastructure in a few clicks, no code required.

When events occur in your other services—like a new user in Clerk, a payment in Stripe, or a directory sync event in WorkOS—you can send that event data to Knock to create users, trigger workflows, and update audiences. Knock ingests, verifies, and transforms the event data for you to take action on.

We're shipping five pre-configured data sources: Stripe, Supabase, PostHog, Clerk, and WorkOS. For each, we've handled verification schemes and created pre-configured action mappings so you can get set up with a few clicks.

For any other providers, use our custom data source to map any event to an action in Knock. Custom sources include a flexible JavaScript scripting framework to process, validate, and transform incoming requests.

Data sources are available today for all Knock customers. Read more in the docs: https://docs.knock.app/integrations/sources/overview

# Twilio Notify EOL: Migrating to Knock

Source: https://knock.app/blog/migrating-from-twilio-notify-to-knock
Author: Jeff Everhart (Developer Advocate)
Published: 2025-06-27
Captured: 2026-09-13

---

How to transition your Twilio Notify implementation to Knock

---

[Twilio Notify](https://www.twilio.com/docs/notify) was Twilio's multi-channel messaging API that let developers deliver push notifications, SMS, and other notifications through a single interface. It supported device registrations through bindings, user targeting through identities and tags, and flexible delivery options like time-to-live (TTL) and priority settings.

However, Twilio announced in 2022 that Notify would be deprecated, and the service is now officially reaching [its end-of-life on December 31, 2025](https://www.twilio.com/en-us/changelog/notify-api-end-of-life-further-extension-notice). After this date, the Notify API will no longer function.

If you're still relying on Twilio Notify, it's important to plan your migration now to avoid service interruptions. In this post, we'll walk through how to move your notification infrastructure to Knock, complete with:

- Feature-by-feature mapping
- API code samples
- A suggested cutover schedule

Let's dive in.

## Why migrate to Knock?

The Twilio Notify service unified SMS, push, and email into a single API—but it had limitations: no in-app support, basic preference management, and limited workflow logic.

While it did eliminate some manual work for teams who needed cross-channel engagement, it fell short of providing a fully-featured notification system that an entire organization could rely on.

In comparison, Knock provides product and marketing teams flexibility in how they send notifications, covering both transactional and promotional use cases. With Knock, you can send customer or product messaging through the following methods:
- Transactional, event-based messaging using API triggers directly from your product using [Workflows](https://docs.knock.app/concepts/workflows)
- One-time, promotional journeys using [Broadcasts](https://docs.knock.app/concepts/broadcasts) that are triggered from the dashboard
- [Audience-based notifications](https://docs.knock.app/concepts/audiences) when a user enters a particular audience segment
- Native in-product messaging using [Guides](https://docs.knock.app/concepts/guides)
- Event-based messaging using triggers from a CDP like [Segment](https://docs.knock.app/integrations/sources/segment) or [Rudderstack](https://docs.knock.app/integrations/sources/rudderstack)

In addition to flexibility around sending messages, Knock also provides key functionality to complete the 'notification layer' of your technology stack:
- First-class support for SMS, email, push, in-app, and chat (Slack, MS Teams)
- Workflow builder with [delays](https://docs.knock.app/designing-workflows/delay-function), [batching](https://docs.knock.app/designing-workflows/batch-function), [throttling](https://docs.knock.app/designing-workflows/throttle-function), and [branching](https://docs.knock.app/designing-workflows/branch-function)
- [User preferences](https://docs.knock.app/preferences/overview) that are automatically evaluted when sending
- [Developer-first SDKs, in-app components, and observability](https://docs.knock.app/developer-tools/overview)
- [Visual template management](https://docs.knock.app/designing-workflows/template-editor/overview) using a Notion-like template editor
- [Translation management tools](https://docs.knock.app/concepts/translations) that scale with your product

## Mapping concepts from Notify to Knock

Any successful migration depends on mapping concepts from your source system to your destination system in a clear way. This allows you to better compare the functionality of both systems to understand where there are feature gaps or where you'll be able to take advantage of new functionality.

### Users and identities

Twilio Notify used concepts like **bindings** and **identities** to manage how and where users received messages. A binding linked a user identity to a specific channel and address, like an SMS number or push token.

In Knock, this is represented more directly:

- **Identities** map to [Knock user ID](https://docs.knock.app/concepts/users) — typically something stable like a database ID or UUID, and these users are commonly referred to as `recipients` in Knock.

- **Bindings** map to **channel data** or **properties** on a Knock user. Properties like `phone_number` or `email` are reserved in Knock and tell Knock where to send particular messages. For token-based communication methods, like push or Slack, `channel_data` allows you to store a number of different tokens for use with a particular channel.

In addition to providing you the data model to manage the tokens and email addresses, Knock also provides you with SDKs and drop-in components that make it easier to acquire tokens for channels like push or Slack.

### User properties and channel data

```js
// In Knock:

await knock.users.update("user-123", {
  phone_number: "+15551234567",

  channel_data: {
    APNS_CHANNEL_ID: {
      tokens: ["apns-push-token"],
    },
  },
});
```

### Sending methods

The method of sending notifications slightly differs between Twilio Notify and Knock, but there are also a lot of similarities.

When sending a notification with Twilio Notify, you need to directly specify the service, either SMS or push, that you want to use to send the notification, as well as pass either an identity or a binding to correctly route the notification to the right user and device.

```js
const client = require("twilio")(accountSid, authToken);

client.notify.services(serviceSid).notifications.create({
  identity: "user-123",

  body: "You have a new alert!",
});
```

In contrast, Knock uses a concept called workflows to encapsulate different notifications channels and any corresponding logic. When you trigger a workflow for a particular recipient, Knock handles resolving any necessary channel data or user properties and will execute sends across all orchestrated channels.

```js
import { Knock } from "@knocklabs/node";

const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.workflows.trigger("new-alert", {
  recipients: ["user-123"],

  data: { message: "You have a new alert!" },
});
```

### Notify tags vs. Knock Objects and Subscriptions

In Notify, you can use **tags** to group users under labels and send messages to everyone associated with a tag.

```js
client.notify.services(serviceSid).notifications.create({
  tag: "team:abc",

  body: "Your team has a new message!",
});
```

In Knock, you model groups using [objects](https://docs.knock.app/concepts/objects), and connect users to them via [subscriptions](https://docs.knock.app/concepts/subscriptions):

```js
//Objects in Knock live in a collection, have a unique id, and store properties

await knock.objects.set("teams", "team:abc", { name: "Team ABC" });

await knock.objects.addSubscriptions("teams", "team:abc", {
  recipients: ["user-123"],
});

await knock.workflows.trigger("team-update", {
  recipients: [{ collection: "subscriptions", id: "team:abc" }],

  data: { message: "Your team has a new message!" },
});
```

### Mapping summary

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Twilio Notify</th>
      <th>Knock</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Group identifier</td>
      <td>
        <code>tag: "team:abc"</code>
      </td>
      <td>
        <code>object_id: "team:abc"</code>
      </td>
    </tr>
    <tr>
      <td>Group targeting</td>
      <td>Send to a tag</td>
      <td>Send to object's subscribers</td>
    </tr>
    <tr>
      <td>Group metadata</td>
      <td>❌ not stored in Notify</td>
      <td>
        ✅ stored in <code>objects</code> or <code>subscription</code>{" "}
        properties
      </td>
    </tr>
    <tr>
      <td>Hierarchical subscription</td>
      <td>❌ flat tag structure</td>
      <td>✅ hierarchical subscriptions</td>
    </tr>
  </tbody>
</table>
<br />
In comparison to Twilio Notify, Knock's system provides more structure and
visibility into relationships, enabling richer targeting logic.

## Create migration plan

### Set up channels

Since Knock supports more channels and providers than Twilio Notify, it's possible to add additional channels to your notification system for orchestration. At a minimum, you'll need to [set up channels in Knock](https://docs.knock.app/integrations/overview) for each type of Notify output you use in your existing system:
- SMS: via Twilio
- Push: via FCM or APNs
- Email: via SendGrid
- In-app: via Knock's realtime infrastructure

### Build workflows

Rebuild Notify message flows in Knock's workflow builder with:
- Message steps (customizable per channel)
- Batching, branching, delay, or throttling logic
- Preferences and send windows

### Implement user preferences

Knock allows fine-grained control over what messages users receive and where they receive them. These granular controls make it less likely that a user unsubscribes from an entire channel.

```js
// Opt user out of SMS for 'marketing' notifications

await knock.users.setPreferences("user-123", {
  channel_types: { sms: false },
  workflows: {
    "new-comment": {
      channel_types: {
        email: true,
        push: false,
      },
    },
    categories: {
      marketing: {
        channel_types: {
          sms: false,
          email: true,
        },
      },
    },
  },
});
```

### Cutover plan

<table>
  <thead>
    <tr>
      <th>Phase</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>📦 Inventory</td>
      <td>Catalog Notify services, tags, recipients, and message types</td>
    </tr>
    <tr>
      <td>🔧 Setup</td>
      <td>Configure Knock: channels, workflows, user imports</td>
    </tr>
    <tr>
      <td>⚙️ Parallel Testing</td>
      <td>
        Send test events to both Notify and Knock; validate delivery + content
      </td>
    </tr>
    <tr>
      <td>🚦 Shadow Traffic</td>
      <td>
        Gradually send real traffic through Knock (with fallback to Notify)
      </td>
    </tr>
    <tr>
      <td>✅ Primary Migration</td>
      <td>Switch production traffic to Knock workflows</td>
    </tr>
    <tr>
      <td>🪑 Cleanup</td>
      <td>
        Remove Notify bindings; finalize preference rules, analytics, logging
      </td>
    </tr>
    <tr>
      <td>❌ Sunset</td>
      <td>Disable Twilio Notify APIs before shutdown on Dec. 31st, 2025</td>
    </tr>
  </tbody>
</table>

## Upgrade your notification stack with Knock

Twilio Notify's end-of-life doesn't have to be a setback. It's a chance to upgrade your notification stack. Knock offers a flexible, developer-friendly platform for multi-channel delivery, with full observability and control.

With [the Knock MCP server](https://docs.knock.app/developer-tools/mcp-server), you can speed up your migration by creating workflows and templates directly from your IDE. Check out [this video series](https://www.youtube.com/watch?v=6rIOkz9Kc20&list=PLq61CrysyX0yxz2rrcdXOjIRgRZvvWT1H) to learn more.

Start now, and you'll be ready well ahead of December 31, 2025.

If you need help getting started, check out [Knock's Twilio SMS integration guide](https://docs.knock.app/integrations/sms/twilio), or [reach out to our team](https://knock.app/contact-sales).

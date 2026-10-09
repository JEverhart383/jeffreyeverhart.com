# Using Slack ephemeral messages in product notifications

Source: https://knock.app/blog/using-slack-ephemeral-messages-in-product-notifications
Author: Jeff Everhart (Developer Advocate)
Published: 2024-06-20
Captured: 2026-09-13

---

An in-depth guide that covers the various ways to use Slack ephemeral messages in product notifications

---

Have you ever tagged someone or posted a link to a third-party service like Google Docs or Notion and gotten a message like this?

<ImageModal
  src="/assets/blog/using-slack-ephemeral-messages-in-product-notifications/ephemeral-message-example.png"
  alt="An example of Slack ephemeral messages in action"
>
  <img
    src="/assets/blog/using-slack-ephemeral-messages-in-product-notifications/ephemeral-message-example.png"
    alt="An example of Slack ephemeral messages in action"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

These are Slack’s ephemeral messages, and, as they say, they are “only visible to you.” They exist to give you user-specific notifications that don’t need to persist in a channel’s notification history. They’re used to show the user sensitive data securely and provide contextual assistance.

In this post, we'll explore how you can leverage ephemeral messages in Slack to enhance your app's functionality and user experience.

## The basics of Slack ephemeral messages

Ephemeral messages are messages that only a specific user can see. Users can view sensitive, temporary, or contextual information without cluttering the conversation history.

Ephemeral is a bit of a misnomer. These messages don’t disappear after a specific time period or once viewed. But they are session-dependent. They don’t persist across reloads, and if you viewed the message on desktop, you won’t see it on mobile. So they don’t show up in the permanent history for a channel or user.

Ephemeral messages' temporary nature makes them well-suited for notifications you want users to see and act on in the moment, but you need to think about how and where they fit into your messaging strategy.

The implementation uses the Slack <code>[chat.postEphemeral method of the Web API](https://api.slack.com/methods/chat.postEphemeral)</code>. Here’s the basic code you need to send ephemeral messages in Node.js:

```javascript
// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require("@slack/web-api");

// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient("xoxb-your-token", {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG,
});

// ID of the channel you want to send the message to
const channelId = "C12345";
// ID of the user you want to show the ephemeral message to
const userId = "U12345";

async function sendEphemeralMessage() {
  try {
    // Call the chat.postEphemeral method using the WebClient
    const result = await client.chat.postEphemeral({
      channel: channelId,
      user: userId,
      blocks: message,
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

sendEphemeralMessage();
```

You’ll need the `channelId`, `userId`, and `message`. You’ll also need a [bot token](https://api.slack.com/authentication/token-types#bot) and to set your app as having a `chat.write` [scope](https://api.slack.com/scopes/chat:write:bot) in Slack.

Utilizing the Slack API and the `chat.postEphemeral` method, you can customize the message content, include block and other interactive components, and trigger messages based on user actions or milestones, creating tailored notifications.

However, how you use this basic setup will change depending on the purpose of the ephemeral message.

## Types of ephemeral messages

Since ephemeral messages serve such a specific purpose, there are common patterns where you'll see them used in Slack integrations. Let's explore some of the ways we see ephemeral messages being used for product notifications.

### Targeted notifications

Ephemeral messages are perfect for sending targeted notifications to specific users or groups. You can use them to inform users about product updates, new releases, service outages, or any other information that is relevant only to them.

```javascript
const message = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Hey there 👋 I'm TaskBot. I'm here to help you create and manage tasks in Slack.\nThere are two ways to quickly create tasks:",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*1️⃣ Use the `/task` command*. Type `/task` followed by a short description of your tasks and I'll ask for a due date (if applicable). Try it out by using the `/task` command in this channel.",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*2️⃣ Use the _Create a Task_ action.* If you want to create a task from a message, select `Create a Task` in a message's context menu. Try it out by selecting the _Create a Task_ action for this message (shown below).",
    },
  },
  {
    type: "image",
    title: {
      type: "plain_text",
      text: "image1",
      emoji: true,
    },
    image_url:
      "https://api.slack.com/img/blocks/bkb_template_images/onboardingComplex.jpg",
    alt_text: "image1",
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "➕ To start tracking your team's tasks, *add me to a channel* and I'll introduce myself. I'm usually added to a team or project channel. Type `/invite @TaskBot` from the channel or pick a channel on the right.",
    },
    accessory: {
      type: "conversations_select",
      placeholder: {
        type: "plain_text",
        text: "Select a channel...",
        emoji: true,
      },
    },
  },
  {
    type: "divider",
  },
  {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: "👀 View all tasks with `/task list`\n❓Get help at any time with `/task help` or type *help* in a DM with me",
      },
    ],
  },
];
```

In this example, we're sending a targeted product notification to a specific user about features in the app. The notification includes:

- How to use particular commands within the app on Slack.
- An image of how to use one of the application’s functions.
- A select dropdown to start using the app right away.

Here’s how that looks in Slack.

<ImageModal
  src="/assets/blog/using-slack-ephemeral-messages-in-product-notifications/targeted-notification-example.png"
  alt="An example of a targeted notification in Slack using ephemeral messages"
>
  <img
    src="/assets/blog/using-slack-ephemeral-messages-in-product-notifications/targeted-notification-example.png"
    alt="An example of a targeted notification in Slack using ephemeral messages"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

By using ephemeral messages for targeted notifications, you can ensure that users receive relevant updates without overwhelming the public channel with messages that may not apply to everyone. The interactive elements, such as the select, allow users to take immediate action based on the notification.

### Sensitive information

When a notification contains sensitive details you don't want saved in the message history of a channel, ephemeral messages provide a secure, temporary way to convey that information to a specific user.

```javascript
const message = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "You have a new request:\n*<fakeLink.toEmployeeProfile.com|Fred Enriquez - New device request>*",
    },
  },
  {
    type: "section",
    fields: [
      {
        type: "mrkdwn",
        text: "*Type:*\nComputer (laptop)",
      },
      {
        type: "mrkdwn",
        text: "*When:*\nSubmitted Aut 10",
      },
      {
        type: "mrkdwn",
        text: "*Last Update:*\nMar 10, 2015 (3 years, 5 months)",
      },
      {
        type: "mrkdwn",
        text: "*Reason:*\nAll vowel keys aren't working.",
      },
      {
        type: "mrkdwn",
        text: '*Specs:*\n"Cheetah Pro 15" - Fast, really fast"',
      },
    ],
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          emoji: true,
          text: "Approve",
        },
        style: "primary",
        value: "click_me_123",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          emoji: true,
          text: "Deny",
        },
        style: "danger",
        value: "click_me_123",
      },
    ],
  },
];
```

Using an ephemeral message to send this notification, the sensitive information about the employee's device request is only visible to the intended recipient and doesn't persist in the channel history. This ensures the employee's request details are kept private and confidential.

<ImageModal
  src="/assets/blog/using-slack-ephemeral-messages-in-product-notifications/sensitive-notification.png"
  alt="An example of Slack ephemeral message to send sensitive information"
>
  <img
    src="/assets/blog/using-slack-ephemeral-messages-in-product-notifications/sensitive-notification.png"
    alt="An example of Slack ephemeral message to send sensitive information"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

Using ephemeral messages for sensitive notifications like this helps maintain the privacy of user information while still providing the necessary details for the recipient to take appropriate action.

### Contextual help

Ephemeral messages are great for providing contextual tips, links to documentation, or other helpful information about your products. They allow you to assist users when they need it without cluttering the conversation history with permanent messages.

```javascript
const message = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "It looks like you're trying to create a new project. Here are some helpful resources:",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Creating a New Project*\n1. Click on the 'New Project' button in the dashboard.\n2. Fill in the project details, such as name, description, and team members.\n3. Choose the project template or start from scratch.",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Project Templates*\nWe offer a variety of project templates to help you get started quickly. Here are some popular ones:",
    },
  },
  {
    type: "section",
    fields: [
      {
        type: "mrkdwn",
        text: "• Agile Development\n• Marketing Campaign\n• Event Planning",
      },
      {
        type: "mrkdwn",
        text: "• Product Launch\n• Research Project\n• Client Onboarding",
      },
    ],
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "For more information, check out our documentation on creating projects: <https://example.com/docs/create-project|Project Creation Guide>",
    },
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          emoji: true,
          text: "Create Project",
        },
        style: "primary",
        url: "https://example.com/create-project",
      },
    ],
  },
];
```

We're providing contextual help to a user attempting to create a new project. The ephemeral message includes:

1. An introduction mentioning that the user is creating a new project and offering helpful resources.
2. Step-by-step instructions on how to create a new project within the application.
3. Information about project templates available to help the user get started quickly.
4. A link to the documentation page that provides more detailed information on creating projects.
5. An action button that allows the user to navigate to the project creation page directly.

<ImageModal
  src="/assets/blog/using-slack-ephemeral-messages-in-product-notifications/contextual-help.png"
  alt="An example of Slack ephemeral messages to provide contextual help"
>
  <img
    src="/assets/blog/using-slack-ephemeral-messages-in-product-notifications/contextual-help.png"
    alt="An example of Slack ephemeral messages to provide contextual help"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

You can assist users in real-time by providing contextual help through ephemeral messages without overwhelming the channel with permanent messages. The ephemeral nature of the message ensures that the help content is only visible to the user who needs it and doesn't clutter the conversation history.

### Interactive notifications

Ephemeral messages can be enhanced with interactive components like buttons, allowing users to take quick actions related to a notification. For example, users can acknowledge an update, view more details, or perform other relevant tasks directly from the notification.

```javascript
const message = [
  {
    type: "section",
    text: {
      type: "plain_text",
      emoji: true,
      text: "Looks like you have a scheduling conflict with this event:",
    },
  },
  {
    type: "divider",
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*<fakeLink.toUserProfiles.com|Iris / Zelda 1-1>*\nTuesday, January 21 4:00-4:30pm\nBuilding 2 - Havarti Cheese (3)\n2 guests",
    },
    accessory: {
      type: "image",
      image_url:
        "https://api.slack.com/img/blocks/bkb_template_images/notifications.png",
      alt_text: "calendar thumbnail",
    },
  },
  {
    type: "context",
    elements: [
      {
        type: "image",
        image_url:
          "https://api.slack.com/img/blocks/bkb_template_images/notificationsWarningIcon.png",
        alt_text: "notifications warning icon",
      },
      {
        type: "mrkdwn",
        text: "*Conflicts with Team Huddle: 4:15-4:30pm*",
      },
    ],
  },
  {
    type: "divider",
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Propose a new time:*",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Today - 4:30-5pm*\nEveryone is available: @iris, @zelda",
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        emoji: true,
        text: "Choose",
      },
      value: "click_me_123",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Tomorrow - 4-4:30pm*\nEveryone is available: @iris, @zelda",
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        emoji: true,
        text: "Choose",
      },
      value: "click_me_123",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Tomorrow - 6-6:30pm*\nSome people aren't available: @iris, ~@zelda~",
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        emoji: true,
        text: "Choose",
      },
      value: "click_me_123",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*<fakelink.ToMoreTimes.com|Show more times>*",
    },
  },
];
```

In this example, we're creating an interactive notification to inform the user about a scheduling conflict with an event. The ephemeral message includes:

1. A section mentioning the scheduling conflict.
2. Details about the conflicting event, including the event name, date, time, location, and number of guests.
3. A context section highlighting the specific conflict with the "Team Huddle" event.
4. A divider to separate the sections.
5. A section prompting the user to propose a new time.
6. Multiple sections offering alternative time slots, each with a "Choose" button to select the preferred option.
7. A section with a link to show more available time slots.

<ImageModal
  src="/assets/blog/using-slack-ephemeral-messages-in-product-notifications/interactive-notifications.png"
  alt="An example of Slack ephemeral messages with interactive components"
>
  <img
    src="/assets/blog/using-slack-ephemeral-messages-in-product-notifications/interactive-notifications.png"
    alt="An example of Slack ephemeral messages with interactive components"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

Your application will receive an interaction payload when the user clicks one of the "Choose" buttons. You can handle this interaction and perform the necessary actions, such as updating the event time or sending a confirmation message.

By using interactive components like buttons in ephemeral messages, you provide users with a convenient way to take action directly from the notification. This enhances the user experience and allows quick decision-making without leaving the Slack interface.

Remember to customize the interactive notification based on your specific use case and the actions you want users to take. Depending on the nature of the notification and the required user input, you can include various interactive elements, such as buttons, select menus, or date pickers.

We've written about creating interactive notifications in Slack before. You can check out our [guide on creating interactive notifications in Slack](/blog/creating-interactive-slack-apps-with-bolt-and-nodejs) for more information.

### Gentle reminders

Ephemeral messages are well-suited for gentle reminders about product-related tasks, deadlines, or events. They can be sent to specific users, giving them a nudge to complete an action or stay informed about upcoming milestones. Once the reminder is no longer needed, it disappears, ensuring it doesn't become bothersome or clutter the conversation history.

Here is all the code for this example, as we’re making a minor tweak. Instead of using blocks, we are just sending a plain text message in this notification:

```javascript
// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require("@slack/web-api");

// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient("xoxb-your-token", {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG,
});

// ID of the channel you want to send the message to
const channelId = "C12345";
// ID of the user you want to show the ephemeral message to
const userId = "U12345";

const message = "You're doing great! :the_horns:";

async function sendEphemeralMessage() {
  try {
    // Call the chat.postEphemeral method using the WebClient
    const result = await client.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: message,
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

sendEphemeralMessage();
```

In this example, we're using an ephemeral message to gently remind a specific user. When executed, this code will send the ephemeral message "You're doing great! :the_horns:" to the specified user in the designated channel. The message will only be visible to that user and will not appear in the channel's message history.

<ImageModal
  src="/assets/blog/using-slack-ephemeral-messages-in-product-notifications/gentle-reminders.png"
  alt="An example of Slack ephemeral messages for gentle reminders"
>
  <img
    src="/assets/blog/using-slack-ephemeral-messages-in-product-notifications/gentle-reminders.png"
    alt="An example of Slack ephemeral messages for gentle reminders"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

You can customize the reminder message based on your specific use case. For example, you can include details about the task, deadline, or event the user needs to remember. You can also include links, buttons, or other interactive elements to help the user take action.

Using ephemeral messages for gentle reminders, you can give users helpful nudges and information without overwhelming them or cluttering the conversation. The reminders disappear once they are no longer relevant, ensuring a clean and focused communication experience.

### Onboarding assistance

Ephemeral messages can effectively provide onboarding assistance to new users. By sending targeted messages with helpful tips, documentation links, and guidance, you can help users get up to speed quickly with your product or application. These onboarding messages can be triggered based on specific user actions or milestones.

```javascript
const message = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Hi Colin :wave:",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Great to see you here! App helps you to stay up-to-date with your meetings and events right here within Slack. These are just a few things which you will be able to do:",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "• Schedule meetings \n • Manage and update attendees \n • Get notified about changes of your meetings",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "But before you can do all these amazing things, we need you to connect your calendar to App. Simply click the button below:",
    },
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Connect account",
          emoji: true,
        },
        value: "click_me_123",
      },
    ],
  },
];
```

Image

<ImageModal
  src="/assets/blog/using-slack-ephemeral-messages-in-product-notifications/onboarding-notifications.png"
  alt="An example of Slack ephemeral messages for onboarding assistance"
>
  <img
    src="/assets/blog/using-slack-ephemeral-messages-in-product-notifications/onboarding-notifications.png"
    alt="An example of Slack ephemeral messages for onboarding assistance"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

In this example, we're sending an onboarding assistance message to a specific user using an ephemeral message. The message includes:

1. A welcome message to greet the user and set expectations for the onboarding tips.
2. Step-by-step instructions on key actions the user should take, such as creating a new project, inviting team members, and exploring features.
3. A link to the app's documentation for more detailed information.
4. An action button that allows the user to start an interactive tutorial.

You can customize the onboarding message based on your app's features and user journey. Include relevant information, step-by-step guidance, and links to resources to help users get started quickly and effectively.

By leveraging ephemeral messages for onboarding assistance, you can provide targeted and timely support to new users without overwhelming them with permanent messages. The onboarding messages can be triggered at critical moments in the user's journey, such as after sign-up, completing the first project, or reaching a specific milestone.

## Wrapping up

Ephemeral messages in Slack provide a powerful tool for delivering targeted, contextual, and interactive notifications to your users. By leveraging ephemeral messages strategically, you can enhance your app's functionality and user experience in various ways.

Remember to use ephemeral messages judiciously, focusing on timely and relevant information that users need in the moment. By striking the right balance and providing value to your users, you can use ephemeral messages to enhance your app's overall user experience and drive engagement in Slack.

Here, we’ve used Slack directly to create our ephemeral messages. However, for a more streamlined way of working with regular notifications in Slack, you can use [SlackKit](https://docs.knock.app/integrations/chat/slack-kit/overview) to help you build out a Slack integration for your product. If you are interested in sending Slack ephemeral messages from Knock workflows, please reach out.

SlackKit is a powerful toolkit that provides a comprehensive set of components, hooks, and APIs. It enables developers to integrate Slack functionality into their applications, allowing users to connect and interact with their Slack workspaces effortlessly. [Sign up for Knock](https://dashboard.knock.app/signup) today to get started, or [reach out](mailto:support@knock.app?subject=SlackKit) to learn more about Knock and SlackKit.

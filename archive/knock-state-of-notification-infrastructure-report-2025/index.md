# State of notification infrastructure report 2025

Source: https://knock.app/blog/state-of-notification-infrastructure-report-2025
Author: Jeff Everhart (Developer Advocate)
Published: 2024-12-12
Captured: 2026-09-13

---

In our inaugural state of notification infrastructure report, we surveyed teams about the tools, strategies, and metrics they use to power customer engagement.

---

Over the past few years, the notification infrastructure space has taken off, becoming a [G2-recognized category](https://www.g2.com/categories/notification-infrastructure).

Product notification infrastructure platforms like Novu, Courier, SuprSend, and Knock have transformed how product and engineering teams build notifications, and industry leaders like Duolingo, Slack, and Facebook have doubled down on creating top-tier product communications.

In this report, we'll look at how product and engineering teams built their notification infrastructure in 2024 and outline some of our predictions for 2025.

Keep reading to learn:

- Why teams are investing in notifications
- How Duolingo and Facebook built their notification playbooks
- The notification channels driving the greatest impact
- Which complex notification features engineers are using
- How notification infrastructure companies are reimagining engineering workflows

## Notifications improve engagement and adoption

Many companies take a spray-and-pray approach to notifications, blasting users with a high volume of irrelevant messages. According to [Statista](https://www.statista.com/statistics/420391/spam-email-traffic-share/), in December 2023, nearly half (46.8%) of all emails worldwide were identified as spam.

A poor notification experience isn’t always due to a lack of effort — many product and engineering teams don’t have the time or resources to build the notification tooling required for delivering great experiences to users.

It’s not uncommon for teams to cobble together notification solutions using a combination of API services and marketing automation platforms.

In our recent survey, almost 67% of respondents reported that they don’t have a way to analyze engagement data and don’t know if people are opting out of communications. One respondent said before using Knock they tracked engagement by “manually combing through MailChimp to grab send and click rates on emails.”

<ImageModal
  src="/assets/blog/state-of-notification-infrastructure-report/opt-out-data.png"
  alt="A pie chart describing opt-out data"
>
  <img
    src="/assets/blog/state-of-notification-infrastructure-report/opt-out-data.png"
    alt="A pie chart describing opt-out data"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

Leading organizations recognize the importance of investing time and resources into building notifications: when done right, they drive business growth. Thoughtful notifications delivered through the right channel with the right message at the right time improve the product experience and increase engagement.

In our recent survey, 89% of respondents cited increasing user engagement or improving the user experience as the top reasons for prioritizing notifications.

<ImageModal
  src="/assets/blog/state-of-notification-infrastructure-report/business-focus.png"
  alt="A pie chart describing the business focus of notifications"
>
  <img
    src="/assets/blog/state-of-notification-infrastructure-report/business-focus.png"
    alt="A pie chart describing the business focus of notifications"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

Let’s take a look at two examples of companies using notifications to drive long term growth.

### Duolingo grew daily active users by 4.5x with push notifications

The origins of Duolingo’s standout notifications date back to 2018 – a time when user growth was lagging. The team was looking for new levers to pull that would increase the number of active users, and quickly realized the massive impact push notifications could have.

When designing their push notifications, the Duolingo team wanted to avoid mistakes other companies had made. They knew that sending a high volume of messages would drive an initial spike in engagement, but that it would ultimately result in unhappy and disengaged users.

<QuoteWithAttribution
  author={{
    name: "Jorge Mazal",
    role: "Former Chief Product Officer at Duolingo",
  }}
>
  One often underappreciated risk with aggressively A/B testing emails and push
  notifications is that it results in users opting out of the channel, and even
  if you kill the test, those users remain opted out forever. Do this many
  times, and you’ve destroyed your channel. This was the outcome to avoid. For
  our push notifications, we established one foundational rule: protect the
  channel. – [How Duolingo reignited user growth, Lenny's
  Newsletter](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
</QuoteWithAttribution>

With that in mind, the Duolingo team carefully tested different timing, templates, images, and copy to identify message wins, while keeping notification volume in check.

The results spoke for themselves – thoughtful notifications increased CURR (current user retention rate) by 21%, reduced daily churn by 40%, and increased DAU (daily active users) by 4.5x.

<ImageModal
  src="/assets/blog/state-of-notification-infrastructure-report/duolingo-growth-chart.png"
  alt="A pie chart describing message volume per channel"
>
  <img
    src="/assets/blog/state-of-notification-infrastructure-report/duolingo-growth-chart.png"
    alt="A pie chart describing message volume per channel"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>
<figcaption>
  Adapted from [The secret to Duolingo's growth, Lenny's
  Newsletter](https://www.lennysnewsletter.com/p/the-secret-to-duolingos-growth)
</figcaption>

<QuoteWithAttribution
  author={{
    name: "Sean Colombo",
    role: "VP of Engineering at Duolingo",
  }}
>
  Modifying existing notifications and even (rarely and carefully) adding new,
  useful notifications has been a nearly infinite source of gains. We’ve been
  improving notifications for years, and they still deliver consistent wins that
  affect a huge slice of the pie. – [The secret to Duolingo's growth, Lenny's
  Newsletter](https://www.lennysnewsletter.com/p/the-secret-to-duolingos-growth)
</QuoteWithAttribution>

### Facebook increased app usage with curated notifications

Curated notifications are also top of mind for the team at Facebook.

The Facebook Notifications Data Science team at Meta ran a survey and found that users preferred to receive only a few in-app notifications. This discovery wasn’t surprising — sending an influx of messages often causes users to tune out notifications or opt out altogether — but it was validating as they headed into the next experimentation stage.

The Facebook Notifications team then started sending fewer, but more relevant messages. Over time, they saw a huge jump in app usage and increased user satisfaction.

<ImageModal
  src="/assets/blog/state-of-notification-infrastructure-report/meta-usage-chart.png"
  alt="A chart showing app usage grow at Meta"
>
  <img
    src="/assets/blog/state-of-notification-infrastructure-report/meta-usage-chart.png"
    alt="A chart showing app usage grow at Meta"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>
<figcaption>
  Adapted from [Analytics @
  Meta](https://medium.com/@AnalyticsAtMeta/notifications-why-less-is-more-how-facebook-has-been-increasing-both-user-satisfaction-and-app-9463f7325e7d)
</figcaption>

<QuoteWithAttribution
  author={{
    name: "Analytics Team",
    role: "Meta",
  }}
>
  After a year we saw that in the fewer notifications experience, users were
  using Facebook more — it just took a long time for user behavior to shift and
  less disruption led to high organic usage, which increased both user
  satisfaction and app usage. – [Analytics @
  Meta](https://medium.com/@AnalyticsAtMeta/notifications-why-less-is-more-how-facebook-has-been-increasing-both-user-satisfaction-and-app-9463f7325e7d)
</QuoteWithAttribution>

It’s clear that notifications can drive major business results, but we wanted to dig a layer deeper to understand _exactly how_ teams constructed their notification infrastructure this year.

## How companies approached notification infrastructure in 2024

We analyzed data from Knock customers sending over 10,000 monthly notifications to bring you insights into how teams approached notification infrastructure in 2024. Our customers include everything from startups to enterprise companies in the B2B, B2C, and marketplace spaces.

We also surveyed leading product and engineering professionals to get their thoughts on the current and future state of product notifications.

Here’s what we found.

### Email and in-app are the most popular notification channels

Contrary to many bold internet proclamations, email isn’t dead.

Based on our customer data and survey results, it’s evident product and engineering teams are using both old (email) and new (in-app) channels to find the perfect notification mix.

In our survey, 85% of Knock customers rated email or in-app as their most valuable notification channels. And, together email and in-app notifications account for 92% of all messages sent by Knock customers.

Here’s what our survey respondents had to say about why they’re doubling down on email and in-app messages.

> In-app and email are both valuable channels because they work together as a pair: In-app provides real-time notifications when working in the app and email is great for notifications you missed.

> We only use email and in-app, email is a way to let users know to come back into the application as our end user is not in-app daily.

Diving a layer deeper, 36% of all messages sent by Knock customers are emails.

<ImageModal
  src="/assets/blog/state-of-notification-infrastructure-report/messages-per-channel.png"
  alt="A pie chart describing message volume per channel"
>
  <img
    src="/assets/blog/state-of-notification-infrastructure-report/messages-per-channel.png"
    alt="A pie chart describing message volume per channel"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

But, even more teams are turning to in-app messages. In fact, 56% of all notifications sent by Knock customers are in-app messages. In-app messages are less intrusive and enable teams to deliver more mindful notifications that require less attention from the user. These types of messages also make it easier for users to take action immediately.

<Callout emoji="🔮">
  <strong>2025 prediction:</strong> In-app messages will continue to grow in
  popularity as teams look for ways to deliver more mindful notifications that
  require less attention from the user. In 2025, we'll see more teams moving
  in-app messaging outside of the feed, powering more real-time [message
  types](https://docs.knock.app/in-app-ui/message-types) for both transactional
  and promotional purposes.
</Callout>

#### Email providers used by Knock customers

Product and engineering teams are using a variety of email providers.

Sendgrid is the most popular email provider overall, but AWS and Postmark aren’t too far behind. Newer email providers like Resend are also gaining traction, with around 6% of Knock customers using Resend.

<ImageModal
  src="/assets/blog/state-of-notification-infrastructure-report/email-providers.png"
  alt="A pie chart describing email providers"
>
  <img
    src="/assets/blog/state-of-notification-infrastructure-report/email-providers.png"
    alt="A pie chart describing email providers"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

<Callout emoji="🔮">
  <strong>2025 prediction:</strong> We predict that tools like Resend will drive
  a shakeup in the email provider space as more teams look for tools that
  support the developer experience and provide more flexibility in email design.
</Callout>

<QuoteWithAttribution
  author={{
    name: "Zeno Rocha",
    role: "Founder & CEO at Resend",
  }}
>
  Developers deserve more from their email providers — better developer experience, intuitive APIs, streamlined SDKs, and a modern approach to email template development. The providers of the last decade aren’t giving them that. That’s why we’re building Resend, a next-generation email platform designed to bring email into 2024.

</QuoteWithAttribution>

### In-app messages garner more attention than emails

As discussed above, Knock customers send the highest volume of messages through email and in-app, so we took a closer look at engagement rates by channel.

**Email and in-app conversion rates**

<table>
  <tbody>
    <tr>
      <td></td>
      <td>
        <strong>Open rate</strong>
      </td>
      <td>
        <strong>Interaction rate</strong>
      </td>
    </tr>
    <tr>
      <td>
        <strong>Email</strong>
      </td>
      <td>23%</td>
      <td>10%</td>
    </tr>
    <tr>
      <td>
        <strong>In-app</strong>
      </td>
      <td>38%</td>
      <td>30%</td>
    </tr>
  </tbody>
</table>

<br />

The findings?

[In-app messages](https://knock.app/channels/in-app-notifications) are more likely to be read. They are often less bothersome and fit seamlessly into a user’s existing workflow.

In-app messages also have a much higher interaction rate. You’re capturing someone’s attention when it matters most – while they’re using the product.

As one survey respondent aptly shares, “In-app is the most valuable notification channel because it gets the most engagement.”

Here are some best practices to consider when building an [in-app notification strategy](https://knock.app/blog/getting-started-with-in-app-messaging):

- **Think about the user experience**: Consider the in-app message type (modal, banner, card, feed, inbox, toast), frequency, and category (promotional or transactional) and determine which will resonate most with your end user.

- **The more in-app messages you send, the fewer end users will see.** Don’t go overboard with messages – send only what’s likely to get users to take action.

- **To boost your engagement rate, only send relevant messages**: Maintain your in-app messages as valuable sources of information by only sharing timely and helpful notifications in the product.

- **Use segmentation and personalization**: In-app messages aren’t one-size-fits-all. Tailor your messages to get the biggest bang for your buck.

### Chat is an emerging B2B notification channel

Historically, chat has been thought of as a 1:1 or team communication channel, but it’s also becoming a popular way to extend B2B applications, with many SaaS companies sharing product notifications directly in [Slack channels](https://knock.app/blog/how-to-think-about-slack-as-a-notification-channel).

Almost half of Knock customers use a chat provider to send notifications. And a quarter of survey respondents say they plan to implement chat next as their next channel.

<Callout emoji="🔮">
  <strong>2025 prediction:</strong> We predict that chat will continue to grow
  in both the volume of total messages sent and the number of companies using
  chat as a notification channel. In 2025, we'll see more companies building
  chat integrations into their products to meet users where they are, whether
  that means Slack, Teams, WhatsApp, or another chat provider.
</Callout>

We’re also seeing more products being built specifically for Slack, including support tools like Thena and Pylon.

<ImageModal
  src="/assets/blog/state-of-notification-infrastructure-report/chat-providers.png"
  alt="A pie chart describing chat providers"
>
  <img
    src="/assets/blog/state-of-notification-infrastructure-report/chat-providers.png"
    alt="A pie chart describing chat providers"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

[Mike Molinet, Founder at Thena](https://knock.app/blog/building-an-inbox-to-simplify-support), focused on Slack as a notification channel because it was clear that companies preferred it over email for day-to-day interactions. And Slack’s real-time nature means customers are more likely to engage with notifications as they happen.

<QuoteWithAttribution
  author={{
    name: "Mike Molinet",
    role: "Founder at Thena",
  }}
>
  Marketing teams have historically sent product updates over email, but we
  found that the engagement was relatively low. When we pushed messages to Slack
  channels, engagement was much higher. Everyone is in Slack all day every day,
  so it’s more likely that you’re going to see and engage with a Slack message.
</QuoteWithAttribution>

Using chat as a notification channel is a great way to meet users where they are.

### Push and SMS notifications are product dependent

Having a mobile app is a prerequisite for sending mobile push notifications and [SMS notifications](https://knock.app/channels/sms) really shine for a subset of transactional use cases like 2FA or escalting alerts.

That means that web-based products without a mobile app won't be sending push notifications and SMS messages are sent less frequently, which accounts for their lower message volume. But more importantly, the type of product you're building will dictate the extent to which you use these channels.

For example, Bounce is the largest global luggage storage network, and travelers being able to book storage on-the-go is a key part of their product experience. Naturally, SMS and push are important channels for them.

But for hosting companies like Webflow or Vercel, where the majority of their users are at a computer, push and SMS notifications are less important.

But that’s not to say product and engineering teams aren’t using push or SMS entirely. In fact, 29% of Knock customers use at least one push notification provider and 30% use at least one SMS provider.

Firebase Cloud Messaging is the most [popular push notification provider](https://knock.app/blog/evaluating-the-best-push-notifications-providers-2024) and Twilio is the most popular SMS provider.

<ImageModal
  src="/assets/blog/state-of-notification-infrastructure-report/push-and-sms-providers.png"
  alt="A pie chart describing push and sms providers"
>
  <img
    src="/assets/blog/state-of-notification-infrastructure-report/push-and-sms-providers.png"
    alt="A pie chart describing push and sms providers"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

When building your push and SMS strategy, don't forget Duolingo's golden rule, "protect the channel." Push and SMS messages can quickly become overwhelming and noisy to users, so only send relevant and timely messages.

To give users more control, you can build your own [channel prefereces](https://knock.app/features/preferences) feature instead of relying on app-level preferences in the mobile OS. This way, users can opt in or out of specific types of messages without killing an entire channel.

By using notification infrastructure to orchestrate cross-channel notifications, there are a few more complex features that product and engineering teams are using create thoughtful notifications experiences: batch and delay functions in your workflows.

### Less is more: sending fewer notifications to deliver more value to customers

As we’ve discussed, sending fewer, more impactful notifications is top of mind for product and engineering teams.

Teams today are sending 3 notifications per day per user, on average. And, product and engineering leaders are [building their notification infrastructure using batch](https://knock.app/blog/building-a-batched-notification-engine) and delay functions.

[Batch](https://docs.knock.app/designing-workflows/batch-function) (collecting notifications related to the same subject to minimize messages) and [delay](https://docs.knock.app/designing-workflows/delay-function) (sending messages on a set interval or dynamically) are the most commonly used step types by Knock customers.

Batch functions are useful when a recipient needs to be notified about a lot of activity at once. For example, the batch function enables teams to aggregate comments, so users receive one notification for multiple comments rather than a notification for each individual comment.

Delay functions are especially useful when creating multi-stage journeys, reminder/appointment workflows, or when combining messaging channels where one step relies on a user seeing or a previous step.

<ImageModal
  src="/assets/blog/state-of-notification-infrastructure-report/workflows-function-type.png"
  alt="A pie chart of workflows by function type"
>
  <img
    src="/assets/blog/state-of-notification-infrastructure-report/workflows-function-type.png"
    alt="A pie chart of workflows by function type"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

Building robust notification workflows with branching and batching logic enabled the [EdApp team](https://knock.app/blog/customers-edapp) to double course completion rates and increase course open rates by 41%.

We also found that most teams are mostly using 1-2 channel types per workflow, and as expected, email and in-app are the most used channels in workflows.

<ImageModal
  src="/assets/blog/state-of-notification-infrastructure-report/workflows-channel-type.png"
  alt="A pie chart describing channel types per workflow"
>
  <img
    src="/assets/blog/state-of-notification-infrastructure-report/workflows-channel-type.png"
    alt="A pie chart describing channel types per workflow"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

By using more [complex workflow step types](https://knock.app/features/workflow-engine) product and engineering teams can achieve the coveted outcomes – increased engagement and usage.

> We wanted to improve product engagement and user experience by optimizing our workflows so that our users get more valuable information in their notifications. We used to be very spammy with an 'all or nothing' notification setting. Making it more granular and adding batch steps have made our users much more happy. – Survey respondent

## Notification infrastructure platforms enable teams to work faster and smarter

In addition to improving the user experience, notification infrastructure tools positively impact the entire organization.

Notification infrastructure platforms allow product and engineering teams to create workflows quickly. Before using a notification infrastructure tool, only 23% of survey respondents introduced new product notifications in less than 5 days. After implementing Knock, 74% of respondents reported shipping notifications in less than 5 days, with some customers reporting significant even more time-savings when introducing new workflows.

<ImageModal
  src="/assets/blog/state-of-notification-infrastructure-report/speed-of-delivery.png"
  alt="A bar chart showing speed of delivery before and after using Knock"
>
  <img
    src="/assets/blog/state-of-notification-infrastructure-report/speed-of-delivery.png"
    alt="A bar chart showing speed of delivery before and after using Knock"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

And, moving quickly is top of mind for product and engineering leaders. In our survey, most respondents (82%) cited the "speed of introducing new notifications or channels" as a core reason they decided to buy vs. build.

<QuoteWithAttribution
  author={{
    name: "Utkarsh Sengar",
    role: "VP of Engineering at Webflow",
  }}
>
  We are not wasting our time figuring out infra. We are just able to focus on
  driving adoption of new features. With our recent localization add-on, we had
  all of our messaging ready and in three days it was live. It was a big success
  and ARR driver.
</QuoteWithAttribution>

Notification infrastructure platforms also make notifications accessible to all departments since they're no longer siloed in a codebase. This means that engineering is no longer the bottleneck for updating existing notifications or exprimenting with new channels.

<QuoteWithAttribution
  author={{
    name: "Hussien Hussien",
    role: "Senior Product Manager at VendorPM",
  }}
>
  The centralization and visibility of the entire system in Knock was really
  compelling to us. We can change logic on the fly, we can A/B test the system,
  we can find issues and fix them in minutes. The other day we found a typo in
  the subject line of a notification and had a fix in production within five
  minutes, without needing any intervention from engineering. That couldn’t
  happen without Knock.
</QuoteWithAttribution>

Before using Knock, 91% of survey respondents shared that their customer support or success teams didn't have access to product notifications to help resolve issues. After implementing Knock, teams can improve collaboration and drive the business forward with more impactful notifications.

<ImageModal
  src="/assets/blog/state-of-notification-infrastructure-report/support-access.png"
  alt="A pie chart describing support access to notifications"
>
  <img
    src="/assets/blog/state-of-notification-infrastructure-report/support-access.png"
    alt="A pie chart describing support access to notifications"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

## Conclusion

Sending mindful notifications is and will continue to be a priority for product and engineering teams.

Delivering a great user experience hinges on access to advanced orchestration capabilities, like batching and branching. But these features are often expensive and time-consuming to build in-house, making them unavailable to most companies.

Adopting notification infrastructure helps teams realize user experience gains at a lower cost than building these features in-house. And, as we’ve seen, the benefits extend beyond the product and engineering teams to the entire organization.

Here are just a few reasons why teams are investing in notification infrastructure:

- User engagement and experience are top priorities for product teams, and larger companies like Duolingo and Facebook have seen massive growth by investing in notifications.
- Most teams don't have the time or resources to build the notification tooling required for delivering great experiences to users, nor do they have a way to analyze engagement data.
- Notification infrastructure platforms enable teams to work faster and make notifications accessible to all departments, reducing the engineering time required to add or update product notifications.

We'll be keeping an eye on how this category changes over the next year and will continue to bring you the latest insights on how product and engineering teams are building their notification infrastructure. Thanks for reading, and knock on! 🤘

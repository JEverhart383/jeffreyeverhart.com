# How Nellis Auction doubled engagement while boosting cost efficiency

Source: https://knock.app/blog/how-nellis-auction-doubled-engagement
Author: Jeff Everhart (Developer Advocate)
Published: 2025-12-16
Captured: 2026-09-13

---

Learn how Nellis Auction uses Knock to manage and send user-centric notifications in an auction-based marketplace.

---

When you're running an auction platform with 140,000 items listed daily across nine locations, every notification matters. At Nellis Auction, an online marketplace for returned and overstock items, each message sent represents a potential bidder, and every bidder drives up prices.

"An item sells for $1 if you only get one person interested in it," explains Brian Lee, VP of Engineering at Nellis. "If you get two people interested, you have the competition required for it to sell at a price that makes you break even or profitable. Getting as many bidders as possible is an absolutely necessary part of the equation in our business."

<ImageModal
  src="/assets/blog/how-nellis-auction-doubled-engagement/cover-image.png"
  alt="Cross-channel messages that drive bidder engagement."
>
  <img
    src="/assets/blog/how-nellis-auction-doubled-engagement/cover-image.png"
    alt="Cross-channel messages that drive bidder engagement."
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>
  <figcaption className="mt-0 text-sm text-gray-500">
    Cross-channel messages that Nellis uses to drive bidder engagement.
  </figcaption>

For Nellis, which runs daily auctions to around one million active users, notifications aren't just nice to have. They're the engine that drives competition, engagement, and revenue.

But by late 2024, their in-house notification system had reached its limits.

<Callout2
  title="Key takeaways"
  items={[
    "<strong>Global ecommerce marketplace.</strong> Nellis Auction operates in an e-commerce niche where communication can directly drive revenue, but they were limited by an in-house system and dependent on costly SMS as their primary channel.",
    "<strong>Up to 60% SMS cost savings.</strong> Nellis decided that buying a platform could de-risk their engineering investment and ran a proof-of-value test of Knock that showed smart batching could reduce SMS costs by up to 60%.",
    "<strong>Doubled visits per user.</strong> After moving their messaging workflows into Knock, Nellis saw average weekly visits per user increase over 100% and site impressions jump by 1M weekly views.",
    "<strong>Fast cross-channel expansion.</strong> Nellis then expanded their notification channels to include in-app and push with minimal engineering investment.",
    "<strong>Better cost efficiency.</strong> Now Nellis employs a sophisticated, multi-channel approach to user communication that helps drive record bidder engagement while getting more value per dollar spent on messaging.",
  ]}
/>

## Reaching the limits of in-house infrastructure

Like many fast-growing platforms, Nellis had built their notification system incrementally as needs arose. It worked well for their initial scale, but as the platform grew, new requirements emerged that would require significant refactoring.

"Our notifications went out in mass volume," Lee recalls. "We couldn’t really limit or change the way we communicate with our customers without rebuilding a system of our own."

The team was also building a native mobile app and wanted to move beyond SMS as their primary notification channel. Expanding to push notifications and in-app messaging would be critical for the user experience, but they'd require entirely new infrastructure.

The team identified several areas where they wanted to evolve their approach:

- Adding batching and intelligent throttling capabilities.
- Implementing more sophisticated personalization.
- Launching in-app notifications across web and mobile.
- Adding push notification support for their native mobile app.
- Gaining better visibility into engagement and delivery.

Tessa Kilbride, Senior Product Manager at Nellis, had designed an in-app notification system three years earlier as one of her first projects at the company. "We put it on the back burner because building it was going to be too much of an effort," she says.

The team also lacked the analytics infrastructure to understand how users were responding to notifications. Without proper engagement tracking, they couldn't optimize their communication strategy.

<QuoteWithAttribution
  author={{
    name: "Brian Lee",
    role: "VP of Engineering",
    picture:
      "/assets/blog/how-nellis-auction-doubled-engagement/brian-lee.jpeg",
  }}
>
  Telling users about an item they are interested in, engaging them, getting
  them on the site, staying on the site is really important during hours where
  items are closing.
</QuoteWithAttribution>

For an auction platform where every engaged user represents potential revenue, better communication strategy required better tooling.

## The build vs. buy decision: managing risk

By the time Lee met the Knock team at React Summit 2024 in New York, Nellis was three months into planning their notification infrastructure overhaul. They'd mapped requirements, estimated timelines, and were ready to commit engineering resources.

Then they reframed the question: not just what would building cost, but what risks would it introduce?

"While we could use intuition to select a few features and implement those within a short timeframe, if we made those assumptions and found they were incorrect, the scope would increase dramatically," Lee explains. "The business would take on the cost of development, the cost of bugs, the cost of opportunity."

The technical complexity was manageable. Nellis knew they could build message queues, implement retry logic, and connect to various delivery providers. But Lee saw a more subtle risk, locking the team into early architectural decisions.

By buying a platform instead of building, Nellis could experiment with features like batching, throttling, and cross-channel intelligence without committing to a specific approach upfront. If their initial assumptions proved wrong, they could pivot without refactoring core infrastructure.

Another aspect of the build-versus-buy decision that often gets overlooked is observability.

<QuoteWithAttribution
  author={{
    name: "Brian Lee",
    picture:
      "/assets/blog/how-nellis-auction-doubled-engagement/brian-lee.jpeg",
    role: "VP of Engineering",
  }}
>
  Building a really nice dashboard that gives a non-technical role the ability
  to interface with it well is oftentimes an entire project all on its own.
  Tessa wouldn't have a very nice way of interacting with it. It would often
  take the form of Slack messages to engineers. And we're a small organization,
  so that would cost a lot to us.
</QuoteWithAttribution>

For a small engineering team, the risk wasn't just the initial build. The real risk was the ongoing maintenance burden and the opportunity cost of engineers handling workflow changes instead of building auction features.

For Kilbride, the appeal was immediate. "One of the biggest things for me with Knock was the ability to change workflow logic without needing a developer," she says. "I could test it out myself in staging before deployment. I don't need a developer to write a ticket, test it, have QA test it. We can do a lot of that ourselves."

By choosing to buy, Nellis was essentially buying down risk, less risk of building the wrong thing, less risk of ongoing maintenance burden, and less risk of diverting engineering resources from their core auction business.

Still, they needed proof, so they devised a way to get measurable data.

## Proving the concept: a one-day production test

In January 2025, Nellis ran an ambitious test. They would run Knock in sandbox mode alongside their existing notification system for 24 hours during live auctions.

Their strategy involved batching together many of the bidding activities that happen in the last hour of an auction, where competition is at its greatest. These new messages contained a more accurate picture of price movement on an item than a stream of singular messages about a new bid, providing a better UX while reducing the total amount of messages sent.

<ImageModal
  src="/assets/blog/how-nellis-auction-doubled-engagement/outbid-workflow.png"
  alt="A batched multi-channel workflow that modifies batch logic based on the time left in an auction."
>
  <img
    src="/assets/blog/how-nellis-auction-doubled-engagement/outbid-workflow.png"
    alt="A batched multi-channel workflow that modifies batch logic based on the time left in an auction."
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>
  <figcaption className="mt-0 text-sm text-gray-500">
    A chart showing the difference in SMS messages sent with and without
    batching applied.
  </figcaption>

Extrapolated across a month at a similar scale, that represented more than 2 million messages that could be eliminated, not by reducing communication, but by making it smarter. Based on Twilio’s publicized SMS rates, that equates to around $200,000 in annual savings.

The business case was clear.

## Implementation and multi-channel expansion

Despite the complexity of Nellis's requirements, integration moved quickly.

"It was pretty easy to build a model that represented a workflow execution and write in the workflow execution everywhere a text message was being sent," Lee explains. "A lot of that stuff was really easy."

For Kilbride's product team, velocity was remarkable. "I had our workflows built in a week or two," she recalls. "Now I can build a workflow in two seconds."

One feature Lee particularly appreciated was transparency. "I like how transparent the interface is when you send messages through. You can typically see a failure in a workflow execution right from the UI. That makes it really easy to diagnose when something's wrong."

But Knock didn't just replace Nellis's existing notification system, it enabled channels they'd never been able to build.

<ImageModal
  src="/assets/blog/how-nellis-auction-doubled-engagement/notification-center.png"
  alt="Nellis' in-app notification center, powered by Knock."
>
  <img
    src="/assets/blog/how-nellis-auction-doubled-engagement/notification-center.png"
    alt="Nellis' in-app notification center, powered by Knock."
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>
  <figcaption className="mt-0 text-sm text-gray-500">
    Nellis' in-app notification center, powered by Knock.
  </figcaption>

Kilbride's three-year-old in-app notification design finally became reality, launching in both their mobile app and website. More importantly, Knock's workflow conditions enabled intelligent sending flows that would have taken months to build in-house.

<QuoteWithAttribution
  author={{
    name: "Tessa Kilbride",
    role: "Senior Product Manager",
    picture:
      "/assets/blog/how-nellis-auction-doubled-engagement/tessa-kilbride.jpeg",
  }}
>
  We saw that there was the ability to have workflow conditions. So if I
  interact with an in-app notification, I don't have to send the text because I
  know they've already seen that message. That was huge.
</QuoteWithAttribution>

The product team could now track exactly what users did with each notification, whether they read it, interacted with it, or clicked through. That data fed back into smarter delivery decisions.

Push notifications became part of the communication strategy as well, particularly for their native mobile app. "As we were building the native app, we decided this could be a really good piece to help us build out our new communication channels—ones that get us away from SMS," Lee notes.

## The results: record-breaking engagement

The numbers tell a clear story.

Before implementing Knock, Nellis users visited the website an average of three times per week. After implementation, that jumped to 6.5 times per week—nearly daily engagement.

Site activity events, like impressions, clicks, hovers, and other interactions, increased by approximately one million in the two-week period immediately following implementation.

This engagement surge coincided with broader platform growth. "Our weekly bidder base has broken three or four records in the past few months," Lee says. "Engagement is high, we're getting more users on the site, and we're expanding our markets and locations."

Cost efficiency improved as well. Despite Nellis's user base growing by hundreds of thousands over the next six months, their Twilio bill stayed roughly the same thanks to batching. Their value per dollar spent on notifications had transformed completely.

"While our Twilio bill isn't going down because we have more users than ever, the data from logs, BigQuery, and the Knock dashboard indicates significant savings on the messages we would have sent without Knock," Lee explains.

Now, Nellis is communicating with far more users, driving record engagement, and doing it all more cost-effectively than their legacy system could have supported at any scale.

## An adaptable messaging layer for future growth

Nellis set out to solve a notification problem. What they gained was cost efficiency at scale, new communication channels without the engineering burden, and product team autonomy to iterate on messaging strategy without requiring engineering resources.

Most importantly, they transformed their notification system from a constraint into an enabler. As Nellis expands to new markets and continues breaking engagement records, their notification infrastructure scales with them.

For any high-volume operation facing similar decisions, Nellis' story demonstrates how buying from a specialized platform provides the flexibility to experiment without the compounding costs and risks of custom infrastructure.

As Nellis continues expanding with new workflows and channels, they're doing it with a platform designed for growth, rather than a custom system that would have consumed engineering resources better spent on their core auction business.

---

<br />
**About Nellis Auction**

Nellis Auction operates nine warehouse locations selling Amazon returns and overstock items through online auctions. With approximately 140,000 items listed daily and over 1 million registered users, the platform relies on effective communication to drive bidder engagement and competition.

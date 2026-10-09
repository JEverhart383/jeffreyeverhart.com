# How Hiive drives engagement with personalized digests

Source: https://knock.app/blog/customers-hiive
Author: Jeff Everhart
Published: 2026-06-01
Captured: 2026-09-13

---

Hiive chose Knock early to keep engineering focused on marketplace infrastructure. That decision paid off as they scaled to millions of notifications per month and evolved from real-time alerts to intelligent, personalized digests.

---

[Hiive](https://hiivemarkets.com/) connects capital with opportunity in late-stage private markets. The company provides a unified system for primary and secondary investment in private shares and funds, with institutional-grade transparency, liquidity, and execution.

In private capital markets, where investors access and transact in shares of privately held companies, engagement drives activity. Without the continuous price discovery of public markets, Hiive recognized early that clear, timely communication would be critical to helping capital move.

Rather than building messaging infrastructure in-house, Hiive chose to adopt Knock to keep internal engineering resources focused on core marketplace infrastructure. That decision would prove strategic as they scaled to millions of notifications per month and expanded from real-time alerts to offering intelligent, personalized digests.

<Callout2 title="Key takeaways">
  <ul>
    <li>
      Hiive recognized early that email would drive their growth flywheel in
      private markets where price discovery is limited.
    </li>
    <li>
      Hiive moved from real-time notifications to weekly personalized digests
      using a Hightouch integration with Knock handling message assembly and
      delivery.
    </li>
    <li>
      Hiive implemented customizable alerts with price bands and transaction
      type filters so users control their notification experience.
    </li>
    <li>
      Hiive consolidated email, digests, in-app notifications, and in-app
      messaging by migrating from legacy vendors to Knock.
    </li>
  </ul>
</Callout2>

## Building a marketplace for an opaque market

Hiive operates in late-stage private markets, where employees and early investors seek liquidity ahead of traditional IPO timelines. Unlike public markets, participants operate with limited transparency and fragmented information.

<QuoteWithAttribution
  author={{
    name: "Logan Leger",
    picture: "/assets/customers/hiive/logan-leger.jpg",
    role: "SVP of Engineering",
  }}
>
  In the public markets, the sheer trading volume ensures that pricing is
  always available up to the minute. In the private markets, stocks change
  hands with far less frequency, so updating sophisticated participants when
  there is market activity is a real benefit to our users.
</QuoteWithAttribution>

From the start, Hiive recognized that keeping users engaged with marketplace activity would fuel their growth flywheel. The question was whether to build notification infrastructure in-house or adopt a platform.

## Focus on core infrastructure from day one

Unlike most Knock customers who migrate from legacy systems, Hiive made the buy decision early. The reasoning was straightforward: notifications would be critical, complex, and outside their core competency.

<QuoteWithAttribution
  author={{
    name: "Logan Leger",
    picture: "/assets/customers/hiive/logan-leger.jpg",
    role: "SVP of Engineering",
  }}
>
  We knew that communication about the market activity was a key part of our
  flywheel strategy. But with thousands of stocks listed on our platform, we
  needed to ensure that notifications were not only timely, but relevant to
  each individual investor.
</QuoteWithAttribution>

The team also anticipated expanding beyond email into channels like SMS for real-time pricing alerts as the product evolved. Building that infrastructure would divert engineering resources from marketplace features that differentiated Hiive.

The decision to adopt Knock meant the team could export that complexity to a trusted vendor and iterate quickly on core product infrastructure without having to worry about the complexity and nuance of dealing with the email lifecycle implementation, according to Leger.

That early decision would pay dividends as the marketplace scaled and notification requirements evolved.

## From noise to actionable intelligence

Hiive's initial notification strategy was simple: send real-time alerts for key market activity. Users subscribed to companies they were interested in, like Stripe, Discord, or other pre-IPO names, and received instant notifications when new bids were placed, listings appeared, or prices moved.

The approach worked well. But as Hiive scaled, the dynamics changed fast. The vast majority of users received a manageable number of notifications. But for a small set of sophisticated participants who followed dozens of the most active securities, messages scaled geometrically as market activity grew.

The result was a massive volume of notifications for a critical audience that created more noise than insight. Hiive needed to evolve from event-driven notifications to something more intelligent.

### Building digests with Hightouch and Knock

The solution was a weekly digest that aggregated marketplace activity and surfaced actionable insights rather than individual data points. The technical implementation leveraged Hiive's existing infrastructure: their data warehouse tracked all watch lists and company activity, [Hightouch's personalization API](https://hightouch.com/platform/customer-studio/personalization-api) pulled the most relevant information for each user, and [Knock](https://docs.knock.app) handled the message assembly and delivery.

<QuoteWithAttribution
  author={{
    name: "Logan Leger",
    picture: "/assets/customers/hiive/logan-leger.jpg",
    role: "SVP of Engineering",
  }}
>
  It gives you a view into the market rather than individual data points. The
  digest does a better job of surfacing that level of insight.
</QuoteWithAttribution>

Instead of receiving dozens of notifications about individual bids and listings, highly engaged users now get a weekly summary showing how the market is moving for companies they're watching. The digest compresses activity into trends, highlights the most relevant transactions, and provides the context needed to make informed decisions.

Beyond the digest, Hiive also uses Knock across their transaction lifecycle—from bid acceptances and counter offers to progress updates and time-based reminders—keeping both parties informed through each step of their financial transactions.

### Giving users control

With the advent of digests, Hiive didn't abandon real-time notifications. Instead, they made them optional and customizable.

Users can now enable real-time alerts with more granular controls, like setting price bands, filtering by transaction types, and choosing which events warrant immediate notification. Casual users get the weekly digest without noise. Active traders get the real-time feed they need.

<ImageModal
  src="/assets/blog/cross-channel-notifications-for-marketplaces/hiive-preferences.png"
  alt="Hiive's notification preference center"
>
  <img
    src="/assets/blog/cross-channel-notifications-for-marketplaces/hiive-preferences.png"
    alt="Hiive's notification preference center"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>
<figcaption>Hiive's notification preference center</figcaption>

The flexibility reduced notification fatigue while maintaining engagement. According to Leger, the digest approach continues to be a key element of the flywheel effect of bringing people back so they can continue to follow activity on the stocks that matter to them.

### Strong DX and responsive support

The strong relationship with Knock was built on developer experience and responsive support. Leger points to the well-structured API, dashboard observability for troubleshooting workflow executions, and direct access to the team through Slack.

<QuoteWithAttribution
  author={{
    name: "Logan Leger",
    picture: "/assets/customers/hiive/logan-leger.jpg",
    role: "SVP of Engineering",
  }}
>
  The key thing for us has always been how responsive Knock's Slack support is.
  Whenever we need things, we can always go to Knock.
</QuoteWithAttribution>

### Extending the partnership to in-app messaging

Hiive uses in-app messaging to highlight new features and push users toward specific actions within their product.

Prior to Knock, Hiive had tried two vendors for in-app messaging. First, they tried a well-known legacy in-app messaging vendor. Later, they tried a startup who pivoted to AI features that didn't align with Hiive's needs. After the second false start, the team started looking again.

When Knock launched [Guides](https://docs.knock.app/in-app-ui/guides), it made sense for Hiive to test the product. "We like to consolidate with vendors that we like and trust," Leger explains. "We have a great relationship with Knock...whenever this became an option, we wanted to trial it out."

After testing and refinement, they successfully deployed Knock's Guides and sunset both previous in-app messaging vendors, enabling Hiive to work with fewer, more trusted partners instead of managing a sprawling vendor stack.

## Results and impact

The numbers tell the story. Hiive scaled from early-stage to millions of emails per month without having to rebuild their messaging infrastructure. The evolution from real-time alerts to intelligent digests happened without refactoring core systems—just workflow changes in Knock.

Notifications continue to drive the marketplace flywheel. Email digests remain a key engagement driver alongside their broader growth initiatives. More importantly, consolidating email notices, digests, in-app notifications and user messaging with Knock has simplified their stack and given product teams more autonomy. Non-technical team members can modify [workflows](https://docs.knock.app/concepts/workflows) and test changes without engineering resources, speeding up iteration cycles.

## The compound value of early infrastructure decisions

Hiive's story is less about migration and more about strategic decisions compounding over time. By choosing Knock early, they avoided a costly investment that would have consumed engineering resources better spent on marketplace infrastructure. As their messaging requirements evolved—from activity notifications to digests, and from email-only to in-app messaging—the platform evolved with them.

The relationship also enabled them to consolidate vendors, with Hiive actively choosing Knock over competitors for adjacent use cases.

For marketplaces where engagement drives revenue, sometimes the best build versus buy decision is not building at all, instead choosing a partner who'll grow with you as your needs evolve.

## About Hiive

Hiive connects capital with opportunity in late-stage private markets. The company provides a unified system for primary and secondary investment in private shares and funds, with institutional-grade transparency, liquidity, and execution. Hiive has facilitated over $4 billion in transactions across more than 400 private company securities. Headquartered in Vancouver, BC, Hiive operates regulated activities through Hiive Markets Limited, including an SEC-registered broker-dealer and alternative trading system (ATS), and holds exempt market dealer registrations in Canada.

# How Medium turned notifications from an engineering bottleneck into a growth engine

Source: https://knock.app/blog/customers-medium
Author: Jeff Everhart
Published: 2026-02-10
Captured: 2026-09-13

---

Learn how Medium reduced the engineering effort required to introduce new notifications, allowing the marketing team and product leads to experiment with new tactics and channels.

---

[Medium](https://medium.com) is a popular publishing and social media platform that attracts over 100 million monthly readers that engage with content from its writer network.

The platform boasts more than one million _paid_ members, who pay a monthly fee to access a broader set of platform features. These fees are then used to compensate writers.

While this monetization strategy creates an effective feedback loop between readers and writers and has allowed Medium to stay ad-free, it depends heavily on user engagement and retention.

<Callout2 title="Key takeaways">
  <ul>
    <li>
      Medium's custom notification system required 3+ weeks of engineering time
      per email, preventing product leads and marketing teams from running
      growth experiments while compounding technical debt.
    </li>
    <li>
      After implementing Knock, Medium achieved a 90% reduction in the time it
      took to ship new notifications, launched their first unified email design
      system, and gave autonomy to the marketing and product leads.
    </li>
    <li>
      Using Knock's Broadcast feature, Medium sent their first-ever push
      notification marketing campaign during Black Friday of 2025, with higher
      conversion rates than email.
    </li>
    <li>
      Knock's visual workflow builder allowed marketing to turn a transactional
      welcome email into a complex nurture workflow, all without engineering
      bottlenecks.
    </li>
  </ul>
</Callout2>

By 2025, Medium was facing a challenge common to fast-growing platforms: their custom-built notification system had become difficult to scale alongside their growing business needs. Notifications, one of their most powerful growth levers, required significant engineering investment that was increasingly difficult to justify as the company's priorities evolved.

"For basically every feature we're building, notifications were such an anchor that a lot of times they didn't even get brought up in discussion," says Christopher Koenig, Staff Software Engineer on Medium's platform team. "They were pushed to the end or deprioritized because the work required was too much. That was negatively impacting our ability to engage and retain users across all the features we were launching."

## When custom-built systems reach their limits

Like many product and engineering teams, Medium had built their notification system incrementally over time, solving immediate needs as they arose. The system worked well for years, but as Medium's product evolved and their user base grew, the complexity accumulated. The consequences of this complexity were felt across the organization.

**For engineering,** the custom system had layers of interconnected components that required deep knowledge to make changes confidently. "There were so many subsystems within subsystems in that stack," says Nick Webb, a Senior Backend Engineer who helped plan Medium's effort to reimagine their notification system. "It would take upwards of three weeks to build a single new email. Push notifications were a completely separate system, so if you wanted a push notification to go with an email, you're looking at even more engineering work."

**For product teams,** this three-week timeline made it difficult to iterate quickly. Features would sometimes ship without full notification support simply because teams needed to prioritize speed. Maintenance requests for existing notifications also required engineering effort, further stressing the bottleneck.

**For marketing,** the constraints were particularly challenging. Transactional and marketing emails lived in completely separate systems. The marketing team worked directly in Sendgrid for campaigns, but couldn't leverage the dynamic data needed for relevant, personalized messaging. Push notifications hadn't been part of the marketing toolkit, instead relying only on emails despite the advantages of push notifications.

**For design,** maintaining consistency was an ongoing challenge. They used static React rendering for their email templates which provided reasonable consistency, but as Koenig explains, "we'd have one-off customizations that resulted in things being pretty inconsistent across emails." A separate rendering system in their legacy codebase served older notifications that were rarely updated.

This pattern plays out at countless high-growth companies: a system that once solved problems simply becomes harder to evolve as requirements change. Eventually, Medium realized the cost of using it had grown too high relative to the company's goals of driving user engagement and retention.

## Making self-serve a strategic imperative

Rather than continuing to invest in their custom system, Medium's team made a strategic decision: notifications needed to become a capability that product leads and marketing teams could self-serve, not an engineering project requiring constant involvement.

"The number one problem was all these bottlenecks created from trying to add more messaging to bring users in and keep the flow of active users high," Webb says. "So we sat back and said, what is the ideal state? The ideal state is not having an engineer involved at all. When things are humming along, we don't have to be involved as an engineering team."

This framing was deliberate. The team wasn't just trying to reduce engineering workload, they were recognizing that notifications had become a constraint on Medium's growth capabilities.

Product teams couldn't easily experiment with notification-driven features that might improve retention. Marketing couldn't test different messaging cadences or try multi-channel campaigns. Every notification-related hypothesis required weeks of engineering time, making rapid experimentation challenging.

The "engineer hands-off" goal meant building a system where:

- Engineering involvement is reserved mostly for integrating workflow triggers into product events.
- Design could create an email design system that maps brand-compliant assets to Knock partials.
- Marketing could iterate on messaging sequences without code deploys.
- Product managers could test notification copy and timing independently.
- The entire organization could treat notifications as a lever they could pull, not a scarce resource they had to ration.

The team evaluated Knock, Courier, Novu, and Pingram (formerly NotificationAPI), along with marketing-focused platforms like Iterable and Braze. They created a comprehensive research document comparing features across all vendors.

"The number one thing I wanted was flexibility," Webb says. "What I love about Knock is all the different ways I can do the exact same thing. That's the kind of flexibility we needed to make it work with any situation we could throw at it. Many platforms had great workflows for audience capture, but they were too rigid for the diverse conditions we needed across all our different use cases."

The team needed a platform that could handle both sophisticated product notifications and marketing campaigns, with the same level of control and targeting across both.

Most marketing-focused platforms, like Braze and Iterable, couldn't deliver the technical depth Medium needed. Most developer-focused platforms couldn't provide the no-code interfaces that would truly make them "hands-off" for non-technical teams.

Knock struck the right balance.

## The transformation: from 3 weeks to 3 days

After migrating several high-priority and complex workflows, all new email and push notifications at Medium are now built in Knock. The legacy system continues to serve existing notifications while new capabilities get built on the modern platform.

<QuoteWithAttribution
  author={{
    name: "Nick Webb",
    picture: "/assets/customers/medium/nick-webb.png",
    role: "Senior Backend Engineer",
  }}
>
  Before, there was more than three weeks of total time including PM time,
  design time, and engineering time. Now with Knock, there's virtually no
  engineering time for most of our messaging. It's about three days for a
  non-engineer to get in, build an email, test it, and make sure it does what
  they want. That's a radical change.
</QuoteWithAttribution>

The time savings were dramatic, but the organizational shift was even more significant. Product managers and marketers could now build, test, and iterate on notifications independently. Engineering involvement was reduced to the initial setup of data integrations and workflow triggers. After that, product leads and marketing teams could manage their own notification strategies.

But as a part of this transformation, Medium's emails also got an important UX upgrade. Koenig partnered with Medium's design team to create something they'd never had before: a unified email design system.

"We didn't have an email design system prior to Knock. That was a huge gain for us," he says. "I paired closely with one of our designers who defined an email design system in Figma for Knock, and I implemented it via partials and layouts."

<ImageWithCaption
  alt="Medium's unified email design system built with Knock"
  caption="Medium's unified email design system, implemented via Knock partials and layouts"
  src="/assets/customers/medium/email-design-system.png"
  width={768}
  height={512}
/>

A unified design system meant that as Medium's brand evolved, updates could be made once and propagated across all notifications. Marketing campaigns and product notifications would maintain visual coherence. New team members could build on-brand notifications without needing to understand the previous system's architecture.

## Unlocking sophisticated growth workflows

With engineering no longer a bottleneck, Medium's marketing team began evolving simple transactional emails into sophisticated growth tools.

Their account creation email is a prime example. What started as a basic welcome message now uses Knock's advanced workflow functions, such as delays and branching, to power smarter lifecycle use cases.

"One of our most complex workflows is the new user welcome flow that marketing turned into a nurturing workflow," Koenig explains. "Marketing has been working on that workflow to make it more sophisticated, with several follow-up emails over three days—unique emails to users with .edu addresses, prompts to follow topics, and more."

<ImageWithCaption
  alt="Medium's welcome nurture workflow in Knock"
  caption="Medium's welcome nurture sequence, crafted by the marketing team in Knock"
  src="/assets/customers/medium/welcome-nuture-flow.png"
  width={768}
  height={512}
/>

The evolution from welcome email to nurture sequence was led by the marketing team. No engineering sprints were required to test different messaging cadences, and no code deploys were needed to add new conditional branches based on user attributes. Marketing could experiment, measure results, and iterate, all within the same system.

The team also implemented sophisticated batching for activity notifications, rendering up to 10 different comments and responses in a single message. This wasn't just about reducing notification volume. It was about creating a more engaging experience that surfaced the most relevant activity without overwhelming users.

Behind the scenes, Medium built a smart preference management system that marketing teams could leverage without understanding the technical implementation. By organizing preferences into categories, the team made it "almost drag-and-drop" for marketers to apply the right targeting conditions to each campaign.

## Medium's first marketing push campaign outperforms email

In November 2025, Medium used Knock's Broadcast feature to do something they'd never done before: send a marketing push notification campaign.

<ImageWithCaption
  alt="Medium's Black Friday push notification campaign"
  caption="Medium's first marketing push notification, sent during Black Friday 2025"
  src="/assets/customers/medium/black-friday-push.png"
  width={768}
  height={512}
/>

This Black Friday campaign demonstrated both a new capability Knock unlocked and the autonomy marketing teams now had. "It was mostly hands-off for engineering—we needed to make sure we had the right users loaded into Knock," Webb recalls. "But the marketing team was able to put everything together themselves. That's a testament to how easy it was for them to use Knock."

The legacy system would have required a campaign like this to be planned _months_ in advance, with dedicated engineering resources committed. Instead, marketing built the campaign in only a week, with limited engineering involvement.

The results validated both the channel expansion and the speed of execution. "The push notification Black Friday campaign had a higher conversion rate than the email campaign," Koenig says, "which reflects higher intention users on mobile devices."

This successful campaign was proof of concept for an entirely new growth channel that Medium plans to use. More importantly, it demonstrated that marketing could move at the speed of opportunity, not the speed of engineering sprints.

## The multiplier effect: what's now possible

Now, Medium has migrated nearly all of its major push notifications to Knock, and the team is now exploring more multi-channel growth workflows that would have been difficult to build before.

"Notifications were such a drag before," Koenig says. "Now that it's cheap in terms of time and resources, it's a whole new world of opportunity for our teams to take advantage of."

The shift from "notifications as engineering burden" to "notifications as growth lever" has created a multiplier effect across Medium's organization:

- **Product teams** can now ship features with proper notification support from day one, improving adoption and engagement for new capabilities. Features that might have launched quietly now have built-in activation campaigns.
- **Marketing teams** can run sophisticated experiments across email and push, testing everything from send times to message frequency to creative approaches. The three-day build time means they can iterate weekly instead of quarterly.
- **Growth teams** can build complex user journeys that span multiple channels and touchpoints, creating cohesive experiences that guide users from signup to engagement to retention.
- **Engineering** can focus on core product features instead of maintaining notification infrastructure. The dozens of hours previously spent on notification requests each quarter are now redirected to building Medium's product.

The transformation is complete: notifications have gone from an organizational bottleneck that limited growth experiments to a capability that product leads and marketing teams can leverage independently, at the speed their strategies require.

<QuoteWithAttribution
  author={{
    name: "Christopher Koenig",
    picture: "/assets/customers/medium/christopher-koenig.png",
    role: "Staff Software Engineer",
  }}
>
  We wanted to level up our entire organization's ability to send and maintain
  high-quality notifications, with the ultimate end goal of engaging and
  retaining users more effectively.
</QuoteWithAttribution>

With Knock, they've done exactly that—and opened up a whole new world of growth opportunities in the process.

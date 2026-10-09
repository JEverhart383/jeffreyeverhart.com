# Building the future of in-app messaging with Webflow

Source: https://knock.app/blog/building-the-future-of-in-app-messaging-with-webflow
Author: Jeff Everhart (Developer Advocate)
Published: 2025-10-08
Captured: 2026-09-13

---

How Webflow's feedback informed the development of Knock Guides, a component-first approach to in-app messaging.

---

Webflow is the leading visual development platform to go from an idea to a ready-to-use website. Thousands of organizations, from Dropbox to The New York Times, use Webflow to visually design, build, and launch responsive websites.

Since 2023, Webflow has used Knock to ship in-app messaging. What started as an infrastructure decision evolved into a design collaboration that led to Knock Guides, the only component-first approach to in-app messaging.

<Callout2
  title="Here's how the partnership has developed:"
  items={[
    "Webflow initially adopted Knock's real-time messaging infrastructure in 2023 to enable non-technical teams to ship in-app messaging experiences without engineering resources.",
    "As the Webflow team pushed the boundaries of what was possible with general-purpose notification infrastructure, Knock began developing Guides as a purpose-built solution for their lifecycle marketing needs.",
    "Through this partnership, Webflow's needs helped inform critical Guides features like intelligent message ordering, sophisticated targeting rules, and performance-optimized delivery.",
    "With Guides 1.0, Webflow is aiming to improve user engagement through faster iteration, more precise targeting, and a composable approach to in-app messaging.",
  ]}
/>

## The original challenge and Knock adoption

The Webflow growth team has long been responsible for two primary metrics: Annual Recurring Revenue (ARR) and Net Revenue Retention (NRR). Since 2023, their primary goal has been increasing NRR, which means a combination of retaining and expanding existing customers by helping them find more value in Webflow.

But Webflow quickly faced a classic growth infrastructure challenge. Their messaging initiatives, like product announcements, lifecycle campaigns, and billing notifications, all required engineering resources, creating bottlenecks across multiple teams.

<QuoteWithAttribution
author={{
name: "Utkarsh Sengar",
picture: "/assets/customers/webflow/utkarsh-sengar.jpeg",
role: "VP of Engineering at Webflow",
}}

>

"We wanted to increase our agility and be able to say yes more often to product and marketing teams who wanted to introduce new messaging to our customers. We also wanted to eliminate the technical debt that kept us from doing that quickly while enabling future customer engagement work."

</QuoteWithAttribution>

At first, Webflow tried to build a solution. "We had a half-dozen different approaches to showing in-app notifications to users,” said Joe M., Staff Software Engineer at Webflow, “but none of them quite matched what we needed to do."

After evaluating build-vs-buy options, Webflow chose Knock's notification infrastructure. Within four weeks, they had eliminated their engineering bottleneck and achieved their initial goals:

<Callout emoji="❌">

**Before Knock:** Engineering dependency for every messaging campaign

</Callout>

<Callout emoji="✅">
  **After Knock:** Self-service messaging that shipped in hours instead of weeks
</Callout>

The early wins were substantial. "We had all of our messaging ready and in three days it was live," Utkarsh reports about their localization add-on launch. "It was a big success and ARR driver."

The organizational transformation was exactly what they'd hoped for.

<QuoteWithAttribution
author={{
name: "Utkarsh Sengar",
picture: "/assets/customers/webflow/utkarsh-sengar.jpeg",
role: "VP of Engineering at Webflow",
}}

>

"Before you'd point an engineer at our in-house repo and say figure it out. Now we can just point our team to Knock. Every engineer at Webflow has a clear path to introducing product notifications."

</QuoteWithAttribution>

## The component-first advantage

As Webflow's growth team became more sophisticated in their messaging strategy, they began pushing Knock's general-purpose infrastructure in new directions.

During their initial evaluation, they had emphasized quality standards, noting, "We wanted something that felt native to our product and didn't feel like a widget we dropped in with an SDK."

<ImageModal
  src="/assets/blog/webflow-guides/in-product-marketing.png"
  alt="In-product marketing"
>
  <img
    src="/assets/blog/webflow-guides/in-product-marketing.png"
    alt="In-product marketing"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

Using Knock’s flexible real-time feed infrastructure, they were able to deliver targeted messaging that felt native to their product and reached the quality bar they required.

It was clear that using native components provided a number of benefits over many of the existing vendors, who use external scripts that bloat performance or styling systems that lead to layout shift and CSS conflicts.

## Pushing the boundaries of notification infrastructure

Webflow was essentially building a sophisticated in-app messaging system on top of notification infrastructure. But as they scaled this messaging, there were limitations that emerged as their needs became more complex.

Rather than accept these limitations, Knock saw an opportunity.

Webflow's usage patterns revealed a gap in the market: no vendor offered component-first in-app messaging with the sophistication that modern growth teams needed.

Knock’s product team dug in to better understand the types of motions that growth teams at modern SaaS companies and collected critical feedback from the teams at Webflow and other leading SaaS companies. This feedback helped define requirements for what would become Knock Guides.

The result was several generalized features built specifically for modern growth teams:

- **Message orchestration:** Instead of managing complex targeting logic in their application, growth teams need a system that can handle sophisticated audience rules and delivery optimization.
- **Intelligent throttling:** Rather than overwhelming users with multiple messages, teams want smart ordering and prioritization built into the platform.
- **Component flexibility:** They needed to maintain high experience standards while enabling non-technical teams to create and manage campaign messaging.
- **Performance optimization:** Unlike legacy in-app messaging vendors, modern teams need a solution that enhanced rather than degraded their user experience.

## Component-first in-app messaging

When Knock Guides launched in beta in 2025, it incorporated everything Webflow had learned from two years of pushing notification infrastructure to its limits.

<QuoteWithAttribution
author={{
name: "Joe M.",
picture: "/assets/customers/webflow/joe-m.jpeg",
role: "Staff Software Engineer",
}}

>

"We had a half-dozen different approaches to showing in-app notifications to users, and none of them quite matched what we needed to do. [Knock] Guides targeting rules offered a good solution for what we needed."

</QuoteWithAttribution>

They built complex messaging experiences that went far beyond typical notifications, including multi-layout changelog modals that adapted based on user state and sophisticated targeting rules for lifecycle campaigns.

Webflow's "Since You've Been Gone" modal showcases this sophistication perfectly. Using Knock’s React SDK, they created a custom abstraction that balances the custom analytics behavior they need with the self-serve needs of product and marketing:

```jsx showLineNumbers
export const SYBGModalSlot = createKnockGuideMulti({
  analytics: {
    surface: IPN_SURFACE.DASHBOARD,
    slot: IPN_SLOT.CENTER,
    position: "1/1",
    category: IPN_CATEGORY.MARKETING,
    feature: IPN_FEATURE.SYBG,
    ipn_type: IPN_TYPE.MODAL,
  },
  guideMessageType: GUIDE_MESSAGE_TYPE.SINCE_YOUVE_BEEN_GONE,
  components: {
    MultipleItems: SYBGMultiModalIpn,
    SingleItem: SYBGSingleModalIpn,
  },
});
```

They publish each changelog to their users as a Knock guide. In their component, they call the `useGuides` hook to fetch any changelog cards the user has missed since their last session and then use that count to determine which layout to render.

```jsx {6, 17, 26} showLineNumbers
export function createKnockGuideMulti({
  analytics,
  guideMessageType,
  components,
}) {
  const { guides } = useGuides({ guideMessageType });

  if (!guides?.length) {
    return null;
  }

  // If single item
  if (guides.length === 1 && components.SingleItem) {
    const { SingleItem } = components;
    return (
      <KnockGuideMultiItemWrapper analytics={analytics}>
        <SingleItem guide={guides[0]} />
      </KnockGuideMultiItemWrapper>
    );
  }

  // If multiple items
  const { MultipleItems } = components;
  return (
    <KnockGuideMultiItemWrapper analytics={analytics}>
      <MultipleItems guides={guides} />
    </KnockGuideMultiItemWrapper>
  );
}
```

When users have one unread changelog item, the system renders a focused single-card layout:

<ImageModal
  src="/assets/blog/webflow-guides/single-changelog-modal.png"
  alt="Single changelog modal"
>
  <img
    src="/assets/blog/webflow-guides/single-changelog-modal.png"
    alt="Single changelog modal"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

When users have multiple updates, it automatically switches to a multi-item list view within the same modal:

<ImageModal
  src="/assets/blog/webflow-guides/multi-changelog-modal.png"
  alt="Multi changelog modal"
>
  <img
    src="/assets/blog/webflow-guides/multi-changelog-modal.png"
    alt="Multi changelog modal"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

This dynamic behavior—adjusting messaging based on user state—wouldn’t be possible with traditional in-app messaging vendors. With Guides, the product team manages it independently.

From there, Guides' targeting rules solved the complex audience segmentation that Webflow's growth team needed.

The platform handles guide ordering automatically, ensuring users see the highest priority messages first without overwhelming them. Built-in rate limiting prevents notification fatigue while maximizing engagement across multiple campaigns.

## Production-ready in-app messaging components

With the launch of Guides 1.0, Webflow expects to see measurable improvements in their growth metrics through enhanced user engagement, precise targeting, faster iteration cycles, and improved page performance.

<QuoteWithAttribution
author={{
name: "Utkarsh Sengar",
picture: "/assets/customers/webflow/utkarsh-sengar.jpeg",
role: "VP of Engineering at Webflow",
}}

>

"We are not wasting our time figuring out infra. We are just able to focus on driving adoption of new features."

</QuoteWithAttribution>

This partnership shows how customer-driven development can spark entirely new use cases. What began as notification infrastructure grew into the future of in-app messaging.

Webflow’s bar was clear — “everything in the Webflow experience needs to feel pro-centric.” By meeting that standard, Knock built what Webflow needed most, and in the process created a solution now powering teams everywhere.

---

<br />

Ready to see how purpose-built in-app messaging can transform your growth strategy? [Get started with Knock Guides](https://docs.knock.app/in-app-ui/guides/overview) or [chat with our team](https://knock.app/contact-sales) about becoming a design partner.

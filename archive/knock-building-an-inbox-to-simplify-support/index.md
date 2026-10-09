# Building an inbox to simplify support

Source: https://knock.app/blog/building-an-inbox-to-simplify-support
Author: Jeff Everhart (Developer Advocate)
Published: 2024-09-19
Captured: 2026-09-13

---

An interview with Mike Molinet from Thena.ai on how they built an inbox feature using Knock to simplify support

---

In modern software, customer support is no longer limited to traditional email-based systems. With tools like Slack, Teams, and in-app chat becoming standard, companies are faced with the challenge of managing communication across multiple platforms. Enter [Thena, a customer support solution](https://www.thena.ai/) designed to seamlessly integrate Slack and other channels, streamlining support workflows and enhancing productivity.

In a recent interview, Mike Molinet, the founder of Thena, joined Jeff Everhart, Knock’s Developer Advocate, to discuss Thena’s new inbox feature, which is powered by Knock’s in-app messaging primitives.

<iframe
  style={{ aspectRatio: "16/9", width: "100%" }}
  src="https://www.youtube.com/embed/HlwE3zZceFQ?si=9oxUK-S5h9YF0_lK"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>

## Streamlining support flow for faster response times

Customer support teams often experience cognitive overload when managing hundreds of tickets and conversations across various platforms. Mike shared how Thena’s inbox feature was built to tackle this issue by providing a centralized view of support tasks, notifications, and ticket updates.

<ImageModal
  src="/assets/blog/building-an-inbox-to-simplify-support/inbox.png"
  alt="Thena's inbox feature"
>
  <img
    src="/assets/blog/building-an-inbox-to-simplify-support/inbox.png"
    alt="Thena's inbox feature"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

Before the inbox feature, support teams with high volume of requests struggled with a lack of clarity on task prioritization. With support coming in from multiple channels—Slack, email, in-app chat, and even Microsoft Teams—support agents could easily lose track of ongoing conversations. Thena’s inbox feature addresses this challenge by consolidating all interactions into a single interface. This streamlines the support workflow, reduces response time, and ultimately improves customer satisfaction.

<QuoteWithAttribution
  author={{
    name: "Rachael Thomas",
    picture: "/assets/blog/authors/rachael.png",
    role: "Developer Success Engineer, Knock",
  }}
>
  Thena's notification inbox has been a game changer for staying on top of
  customer requests, especially during those extra busy days where I find myself
  having to jump around. Having a consolidated view of these updates makes me
  feel more in control of the day.
</QuoteWithAttribution>

Mike also highlighted a key finding from user feedback and research: speed of response is one of the most critical factors in determining customer satisfaction. Even if a support team isn’t able to resolve a customer’s issue right away, simply acknowledging the problem quickly can lead to higher customer satisfaction. This insight underscores the importance of tools like Thena’s inbox feature, which enables teams to respond promptly and effectively.

## The role of Slack in customer engagement

A key insight from the interview was Thena’s focus on integrating with Slack, a platform that has become central to many companies’ internal and external communications. Mike emphasized that engagement on Slack is significantly higher than on traditional platforms like email, making it the ideal communication hub for customer interactions.

Slack’s real-time nature means customers are more likely to engage with notifications and messages as they happen. As Mike shared, Thena initially focused on Slack because it was clear that modern companies preferred it over email for day-to-day interactions. By managing customer support directly in Slack, Thena helps businesses respond quickly, providing the fast responses that are crucial to customer satisfaction.

## Building Thena’s inbox using Knock

The inbox feature in Thena was developed as a direct response to feedback from users struggling with cognitive overload. By consolidating multiple communication channels into a single view, the inbox allows support agents to prioritize tasks, respond to urgent tickets, and collaborate more efficiently.

By using Knock’s real-time infrastructure to power the inbox feature, Thena was able to launch this feature in weeks versus a much longer timeline if they built it in-house. Using Knock’s built-in message statuses, SDKs, and realtime in-app infrastructure, Thena was able to launch a beta version the inbox that didn’t compromise on product functionality.

The inbox isn’t just about reducing noise. It’s about helping teams work smarter. With features like proactive notifications, SLA breach alerts, and internal collaboration tools, support agents can stay on top of all customer interactions, ensuring nothing slips through the cracks.

Mike drew an interesting analogy to early Facebook, which initially required users to actively visit profiles to stay updated. When Facebook introduced the news feed, it changed the way people interacted with content. Similarly, Thena’s inbox brings the most important support tasks and updates directly to the forefront, without users needing to hunt for them.

## Configurability: a key to user-centered design

One of the highlights of the inbox feature is its configurability. Thena users can customize their experience to suit their specific workflow needs, whether it’s focusing on urgent customer replies, filtering out non-essential updates, or sorting tickets by priority. This flexibility ensures that users can tailor their support experience, making them more efficient and effective in managing customer issues.

Mike stressed that giving users more control over how they view and interact with their inbox was a key part of Thena’s approach. Different teams have different workflows, and the inbox’s configurability ensures it can adapt to various needs.

## Building your own inbox

Thena’s new inbox feature is designed to make support teams more productive and responsive. By consolidating notifications across channels and offering a customizable workflow, Thena is helping businesses scale their customer support operations while maintaining a high standard of user satisfaction.

If you’re looking to create an inbox feature for your product, Knock provides both the real-time infrastructure and frontend tools required to create a feature-rich [in-app notification experience.](https://knock.app/channels/in-app-notifications) Whether you’re looking for a drop-in solution or want to bring your own components, Knock provides abstractions that work at any layer of your technical stack across mobile and web. You can read more about creating [in-app UI in documentation](https://docs.knock.app/in-app-ui/overview) or you can [start prototyping on our free tier](https://dashboard.knock.app/signup) with 10K monthly notifications.

# How to send in-app notifications with Next.js

Source: https://knock.app/blog/how-to-send-in-app-notifications-nextjs13
Author: Jeff Everhart (Developer Advocate)
Published: 2023-12-19
Captured: 2026-09-13

---

A step-by-step guide to sending in-app feed notifications with Next.js using the app directory and React Server Components

---

[Next.js](https://nextjs.org/) continues to be one of the most widely-used frameworks to build full-stack web applications. In version 13, Next.js introduced the [App Router](https://nextjs.org/docs/app/building-your-application/routing), a new routing paradigm built on top of [React Server Components](https://nextjs.org/docs/app/building-your-application/routing) that works alongside the existing Pages Router. These changes offer developers a lot of benefits around data fetching and reduced bundle size, but also present a fundamental change to how you work in Next.js.

In this guide you'll learn how to:

- create a notification workflow with an in-app feed step in Knock
- identify users and trigger workflows with the Knock Node.js SDK and Server Actions
- integrate the `KnockFeedProvider` with React Server Components
- secure your application for production

Typically, real-time notification feeds are time-intensive features to create. First, you need to manage the infrastructure for WebSockets and Publish/Subscribe messaging patterns. Second, you need to deal with user preferences, user presence detection, storage and logging. And finally, you need to build out the frontend UI and underlying APIs to display the notifications. Luckily, Knock comes with all of that out of the box.

The [in-app feed](https://knock.app/features/in-app-notifications) channel in Knock manages all of the backend infrastructure for you. The `@knocklabs/react-notification-feed` library is [highly customizable](https://docs.knock.app/in-app-ui/react/feed#common-recipes), with advanced features like expirimental cross-browser feed synchronization. If you need a higher level of control, the `@knocklabs/client` library is a low-level JavaScript SDK that you can use to build your [own custom client-side experience](https://docs.knock.app/in-app-ui/javascript/quick-start).

## Video walkthrough

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/yN0A_wjaWmc?si=Cs3wGhvy_S-_1vtJ"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>

## Resources

- [React in-app feed UI](https://docs.knock.app/in-app-ui/react/feed)
- [Knock Node.js SDK](https://github.com/knocklabs/knock-node)
- [Knock in-app feed channel details](https://docs.knock.app/integrations/in-app/knock)

If you want to try out Knock to power your notifications, you can [sign up for free here](https://dashboard.knock.app/signup).

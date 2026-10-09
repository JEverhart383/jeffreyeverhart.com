# Chrome's new web push spam detection: What developers need to know

Source: https://knock.app/blog/chrome-new-web-push-spam-detection
Author: Jeff Everhart (Developer Advocate)
Published: 2025-06-20
Captured: 2026-09-13

---

We take a deep-dive into the top in-app messaging tools available today.

---

Recently, Google made a significant change to Chrome on Android that could impact your web push notifications. Here's what you need to know.

## The change explained: How Google is fighting unwanted notifications

On May 8, 2025, the [Chromium Blog announced](https://blog.chromium.org/2025/05/fighting-unwanted-notifications-with.html) that Chrome is introducing on-device machine learning to automatically determine if web push messages are potential spam and categorize them as such. If your message gets flagged, users will see a spam warning and an easy unsubscribe link.

<ImageModal
  src="/assets/blog/chrome-new-web-push-spam-detection/chrome-web-push-flagged-example.png"
  alt="An example Chrome web push notification flagged as possibly spam"
>
  <img
    src="/assets/blog/chrome-new-web-push-spam-detection/chrome-web-push-flagged-example.png"
    alt="An example Chrome web push notification flagged as possibly spam"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>
  <figcaption className="mt-0 text-sm text-gray-500">  
    An example of a notification flagged as possibly spam.  
  </figcaption>

Even if the user marks the message as not spam, that unsubscribe option remains visible. This, of course, increases the likelihood that users opt out of web push notifications, reducing the reach of this channel.

<ImageModal
  src="/assets/blog/chrome-new-web-push-spam-detection/chrome-web-push-approved-example.png"
  alt="An example Chrome web push notification flagged as possibly spam that you've approved"
>
  <img
    src="/assets/blog/chrome-new-web-push-spam-detection/chrome-web-push-approved-example.png"
    alt="An example Chrome web push notification flagged as possibly spam that you've approved"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>
  <figcaption className="mt-0 text-sm text-gray-500">  
    What you see when viewing a flagged notification you've approved.  
  </figcaption>

## What others think about the change

This change has sparked debate across developer communities. There are several Reddit threads, like [this one](https://www.reddit.com/r/webdev/comments/1m2a7ry/this_new_google_chrome_filter_may_kill_web_push/) or [this one](https://www.reddit.com/r/webdev/comments/1marekd/successfully_built_push_notification_system_but/), discussing whether or not this change is good or bad for users and good and bad for developers. 

On the one hand, some argue that sending spam through web push notifications is inherently difficult, since users must explicitly grant permission through a series of approvals.

Many others support this change in the spirit of reducing noisy notifications from businesses that use them ineffectively. 

<ImageModal
  src="/assets/blog/chrome-new-web-push-spam-detection/chrome-web-push-reddit-comment.png"
  alt="A Reddit comment about opting in to web push notifications"
>
  <img
    src="/assets/blog/chrome-new-web-push-spam-detection/chrome-web-push-reddit-comment.png"
    alt="A Reddit comment about opting in to web push notifications"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal> 

## The future of web push notifications

Web push notifications are, in my opinion, really helpful. I'm a huge supporter of the open web and would love to see more web apps just because I feel like the web as a platform is just by default more open than the native apps like Android or iOS would allow you to be.

But there's a pattern here. Over the past decade, we've seen web push consistently deprioritized. Safari made PWA notifications difficult to implement on iOS, and now Chrome is adding friction. Web push remains the most open notification channel, but it's becoming the 'black sheep' of the notification family.

For now, this feature is limited to Chrome on Android devices, but don't be surprised if it expands further.

## How to prevent web push notifications from being marked as spam

If your web app currently sends web push notifications to Chrome/Android users, you should prepare to see an impact on this channel. While there aren’t many technical workarounds, there are a few strategies you can review to protect your notifications from getting flagged by these new spam detection methods.

### Ensure good domain hygiene

Make sure you serve your web push notifications from legitimate domains with HTTPS and proper TLDs. Sending these notifications from development URLs (i.e. Vercel or CloudFlare) with random characters could trigger spam filters.

### Audit your notification content

The biggest spam trigger may be the notification content itself. Using clear, transparent language that tells users exactly what action you want them to take is your best bet to prevent your notification from getting flagged.

Make sure to use correct grammar and punctuation, as a spam filter could flag incorrect grammar. Avoid using words like "free" or "urgent" or terms related to crypto and gambling.

## Send web push notifications with Knock

As this change rolls out, take it as an opportunity to improve your notification system. Knock offers a flexible, multi-channel platform that helps developers prioritize notification quality over quantity. [If you'd like to try it out, you can sign up for a free account](https://dashboard.knock.app/signup) today.

The most effective defense against spam detection is sending relevant, timely messages your users actually want to receive.

# How push notifications work on Apple and Android

Source: https://knock.app/blog/how-push-notifications-work-on-apple-and-android
Author: Jeff Everhart (Developer Advocate)
Published: 2024-04-11
Captured: 2026-09-13

---

An overview of how push notifications work on Apple and Android operating systems.

---

Push notifications are an essential component of many mobile apps, helping developers engage users, improve retention, personalize experiences, and drive action. However, it's crucial for developers to use push notifications responsibly and respectfully to avoid overwhelming or alienating users.

But how do those notifications work? How does an application get direct access to your mobile OS and put itself at the forefront of your attention? In this post, we’ll walk you through the key concepts behind push notifications to better understand how this process works.

## The basic framework of push notifications

Push notifications consist of interactions between the mobile device, your app, server, and the operating system push notification service (OSPNS).

When the app is launched, it requests the user's permission to receive push notifications.

<ImageModal
  src="/assets/blog/how-push-notifications-work-on-apple-and-android/apple-consent-popup.png"
  alt="An iOS consent popup"
>
  <img
    src="/assets/blog/how-push-notifications-work-on-apple-and-android/apple-consent-popup.png"
    alt="An iOS consent popup"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

_(Source: [Apple Developer](https://developer.apple.com/documentation/usernotifications/asking_permission_to_use_notifications))_

With consent, the app communicates with the push notification service provided by the operating system, which is Apple Push Notification Service (APNS) for iOS devices or Firebase Cloud Messaging (FCM) for Android devices. The consent interaction generates a device token specific to the app on that device. The app sends this device token to the application server, registering the device for future notifications.

The application server stores and manages the device tokens, associating them with user profiles or app installs. When an event in the app needs to trigger a notification, the server creates the message, and then sends this message and the device tokens to the push notification service.

The push notification service processes the requests from the application server, verifying the messages. Using the device tokens, the push notification service identifies the associated devices and routes the notifications to them. The push notification service manages network conditions and device availability, as devices may be offline or in a do-not-disturb mode when the notification is sent. The service might queue the notifications or attempt redelivery later in such cases.

Once the notification reaches the user's device, the OS displays the notification according to the user's settings and the app's parameters.

This all seems straightforward. But the interaction that needs to happen between your app and backend, a user’s mobile device, and Apple/Firebase requires a lot of moving parts that you don’t have to consider if you are building email or in-app notifications. Let’s investigate some of these critical components of push notifications to understand how they work.

## Device tokens: the core of push notifications

The journey begins when the user first launches the app. The app requests permission to send push notifications. This step is crucial, as the app cannot send notifications without the user's consent.

iOS mandates the explicit permission prompt above. Up until Android 13, apps didn’t have to require permission from a user to send push notifications explicitly. Instead, they could be managed via the Android settings page.

<ImageModal
  src="/assets/blog/how-push-notifications-work-on-apple-and-android/android-settings.png"
  alt="An Android settings screen"
>
  <img
    src="/assets/blog/how-push-notifications-work-on-apple-and-android/android-settings.png"
    alt="An Android settings screen"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

_(Source: [Android Developers](https://developer.android.com/develop/ui/views/notifications/channels))_

From [Android 13 onwards](https://source.android.com/docs/core/display/notification-perm), the OS requires developers to use an opt-in model, like Apple. However, developers have more flexibility to design their permission modals in Android.

Once permission is granted, the device establishes communication with either APNS or FCM. This generates a unique identifier known as the device token.

The device token is the core part of push notifications. It is a globally unique identifier for the user’s device and that specific app installation on that device. If the user has your application installed on another device, they’ll be granted a separate token. If they uninstall and reinstall your app on that device, they’ll get another device token.

On Apple devices, you generate a device token using the [registerForRemoteNotifications()](https://developer.apple.com/documentation/uikit/uiapplication/1623078-registerforremotenotifications) method. On Android, developers declare their intent to send notifications in their [manifest](https://developer.android.com/about/versions/13/changes/notification-permission), and then the SDK asks FCM to generate the token.

The app then transmits this device token to its server, registering the device for future notifications. This registration signals to the server that the device can receive notifications.

When your server sends a push notification, it must always include this device token in the request.

## APNS and FCM: the routing system for push notifications

The application (or your servers) doesn’t send push notifications itself. Instead, each operating system has a push notification service, which routes your request to your user's device.

For Apple, this is the Apple Push Notification Service (APNS). For Android, it is Firebase Cloud Messaging (FCM). The two are mostly similar, with a key difference being that APNS only works with Apple devices, whereas FCM works with Google and Apple devices.

Here's an overview of how this routing typically works:

1. **Triggering the notification**. An event on the application server triggers a notification. This event could be anything from a new message in a chat app to a price drop alert in a shopping app. The server prepares the notification, which includes setting its content (like the message body and title) and any additional data or commands.

2. **Sending the notification to the push notification service**. The application server sends the notification to APNS or FCM. The server includes the unique device tokens of the target devices in the request.
3. **Processing by the push notification service**. Upon receiving the notification request, the PNS verifies it. This includes checking the sender's credentials and the validity of the device tokens. The PNS may queue the notification for delivery. Depending on the service and the message's priority, it might be delivered immediately or delayed.
4. **Delivering to the target device**. Using the device token, the PNS locates the correct device. If the device is offline or unavailable, the PNS may retry delivery later based on the service’s retry policy. Once the device is reachable, the PNS delivers the notification. The operating system receives the notification on the device and passes it to the appropriate app. The notification is then displayed to the user.

APNS allows for varying [notification priorities](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns), providing immediate delivery or delivery options at the next opportunity. FCM, on the other hand, offers features like [topic subscription](https://firebase.google.com/docs/cloud-messaging/android/topic-messaging), where devices can subscribe to specific topics for notifications, and message collapses to prevent similar notification overload.

## Your app and server: push notification creation and management

With routing and delivering the push notification handled by the push notification services, your application and servers are responsible for creating the notification and managing device tokens. First, the server must craft the notification payload. The payload needs to be structured in a JSON format that complies with the specifications of the target push notification service.

For APNS, a payload looks like this:

```javascript
{
  "aps": {
    "alert": {
      "title": "New Message",
      "body": "You have a new message from John."
    },
    "badge": 1,
    "sound": "default"
  },
  "customData": {
    "conversationId": "12345abcde",
    "messageType": "text"
  }
}
```

`aps` is the Apple-defined key for the payload. The `alert` object contains the notification's title and body. The `badge` tells the OS the number to display on the app icon and `sound` which sound to play when the notification is received. `customData` is a custom key-value pair (optional) for additional data the app might use.

An FCM payload has a similar, with the naming different:

```javascript
{
  "to": "device_token_here",
  "notification": {
    "title": "New Message",
    "body": "You have a new message from John."
  },
  "data": {
    "conversationId": "12345abcde",
    "messageType": "text"
  },
  "priority": "high"
}
```

`to` is the target device token (this is in the HTTP headers for APNS). `notification` contains the notification's title and body, `data` is the custom key-value pairs for additional data, and `priority` sets the priority of the message.

Each push notification service has a limit on the size of the notification payload (4KB for APNS and FCM). Your server should ensure that the payload size does not exceed these limits.

Your server also has to manage a stateful connection to the push notification service to send each notification request. This request includes the payload and a list of device tokens to which the notification should be delivered. The request is made using server credentials like APNS certificates or FCM API keys for authentication. After sending the notification, your app server should handle the response from the push notification service, such as processing success or error messages and implementing retry logic.

Your server also has to manage and store device tokens. Usually, these are stored in your user database alongside other user information. These tokens must be stored securely to prevent unauthorized access, as they represent a direct line of access to the user's device.

Device tokens can change over time, such as when users reinstall the app or update their device's operating system. The mobile app must be designed to detect these changes and resend the updated token to the server. The server, in turn, must update its database with the new token.

Regularly validating and cleaning up the tokens in the database is essential. This can be done by processing feedback from the push notification service, which may inform the server about invalid or expired tokens that need to be removed or updated.

<Callout emoji="✨">
  Knock provides [mobiles
  SDKs](https://docs.knock.app/developer-tools/sdks#mobile-sdks) for iOS,
  Andriod, Flutter, and React Native that can help you manage the user token
  lifecycle.
</Callout>

## Lean On Services for Push Notifications

Apple and Google have built extensive push notification services to help developers use their devices and integrate push notifications into their apps. These services do a lot of the heavy lifting associated with push notifications. As long as you use their SDKs and have a way to store tokens, using push notifications with these services securely is seamless.

At [Knock](https://docs.knock.app/integrations/push/overview), we remove this burden even further. You don’t have to manage the stateful connection with each push notification service. You also don’t need to work with two different JSON payload structures–you can send the same templated message to multiple providers.

Check out how to integrate [Apple devices with Knock](https://docs.knock.app/integrations/push/apns), as well as how to integrate [FCM with Knock](https://docs.knock.app/integrations/push/firebase). If you need help, [reach out to us in Slack](https://knock.app/join-slack) or set up a time to [talk with our team](https://knock.app/contact-sales) today.

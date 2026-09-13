# How to OAuth with Slack using Node.js and Express

Source: https://www.youtube.com/watch?v=o6k51xE1qBg
Captured: 2026-09-13

---

In this video, you’ll learn how to implement an OAuth flow from scratch to connect a Node.js/Express application to Slack. All of the code samples from this video can be found in this blog post on the same topic:

https://knock.app/blog/how-to-authenticate-users-in-slack-using-oauth

Knock also has provides a set of UIs and APIs that allow you to manage Slack integrations easily: https://docs.knock.app/integrations/chat/slack-kit/overview

If you’re looking for more content on how to integrate Slack with your application, check out these resources:

https://knock.app/blog/the-guide-to-slack-markdown

https://knock.app/blog/how-to-think-about-slack-as-a-notification-channel

Chapters 
0:00 - Intro
0:16 - Scaffold the app
1:16 - Import dependencies and bootstrap
3:45 - Explaining step one of OAuth flow
4:40 - Implementing step one of OAuth flow
5:20 - Redirecting the user to Slack
7:55 - Creating our redirect_uri route
8:30 - Getting the code from Slack
8:50 - Explaining step two of OAuth flow
9:40 - Adding error handling
10:45 - Fetching the access token
14:29 - Explaining step three of OAuth flow
15:00 - Using access token to make Slack API requests
15:35 - Storing access token in session
16:55 - Using access token in Authorization header
17:34 - API request error handling
18:25 - Send user channels to browser
19:42 - Start Express server
20:30 - Configuring our Slack app
20:50 - Env variables setup
21:20 - Create Slack app
21:45 - Setting client id and client secret
22:20 - Add OAuth scopes
22:30 - Adding redirect URL
22:42 - Using NGROK
23:35 - Updating redirect URL in .env and Slack
24:15 - Start Express server
24:30 - Test OAuth flow in browser
25:08 - Outro

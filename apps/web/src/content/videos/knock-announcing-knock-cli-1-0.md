---
title: "Announcing Knock CLI 1.0 | Develop product messaging in your code base"
date: 2026-01-06
summary: "Since we launched our CLI back in May 2023, teams have used it to work with their Knock-powered notifications in code and to programmatically manage their messaging infrastructure, making Knock an…"
url: "https://www.youtube.com/watch?v=HKYu-u4pPs4"
platform: youtube
videoId: "HKYu-u4pPs4"
durationSeconds: 476
org: knock
publisher: "Knock"
tags: ["microsoft-teams", "ai", "developer-tools"]
archive:
  slug: knock-announcing-knock-cli-1-0
  capturedAt: 2026-09-13
  linkStatus: live
draft: true
---

Since we launched our CLI back in May 2023, teams have used it to work with
their Knock-powered notifications in code and to programmatically manage their
messaging infrastructure, making Knock an extension of their development
workflow.

Today, we're thrilled to launch the 1.0 release of the CLI, with a whole host of
new features and improvements to make working with Knock locally and in your
CI/CD pipeline even easier.

With the 1.0 release of the CLI you can now:

- Login to the CLI using your Knock account, without needing a service token via
`knock login`
- Initialize a central `knock.json` file for your project, and use that for all
pull and push commands without specifying where your Knock directory is located
- Work with all versioned resources in Knock (workflows, templates, guides,
layouts, translations), commit and promote changes, list environments and
channels, and much more
- Create new resources directly without going to the Knock dashboard, or from
our new template repository via `knock workflow new`

We've also included JSON schemas for all of your resource definitions, providing
an editing assist and type hints in your IDE for you and your favorite coding
agent like Cursor, Copilot, or Claude Code.

CLI 1.0 is also fully compatible with our new branching beta Using the CLI you
can create branches, push and pull changes on those branches, and merge changes
from your branch back into main when complete.

If you're interested in trying out the 1.0 release of the CLI, you can get
started by running `npm install -g @knocklabs/cli` or `brew install
knocklabs/tap/knock`. You can also read the documentation to get started.

## Resources

- [docs.knock.app: cli overview](https://docs.knock.app/cli/overview)

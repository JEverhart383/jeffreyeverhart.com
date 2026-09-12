---
title: "Atlas Docs on Astro Starlight"
date: 2023-08-01    # APPROXIMATE — Starlight launched that month; set the real start date
endDate: 2023-12-01 # APPROXIMATE — the case study ran in December 2023
summary: "Moved WP Engine's Atlas documentation off a bespoke Next.js/MDX setup and onto Astro's Starlight, cutting development costs by more than half and handing the docs back to the people who write them."
status: completed
role: "Developer Advocate"
org: wp-engine
tech: ["Astro", "Starlight", "MDX"]
url: "https://developers.wpengine.com/docs/headless-platform"
links:
  - label: "Astro case study: Slashing Development Costs"
    href: "https://astro.build/case-studies/wp-engine/"
tags: ["astro", "starlight", "documentation", "developer-experience", "wordpress"]
---

The Atlas docs — WP Engine's headless WordPress hosting product — lived as ~100
MDX files in one GitHub repo, ingested by a Next.js shell in another. Editing the
content didn't trigger a rebuild or a preview, so every change went through a
dedicated environment and a round of branch management. Visual changes took
sprints. And because the whole thing bottomed out in React, only developers could
contribute: the PMs and support folks who knew the product best couldn't touch
the page that described it.

Starlight had launched on Product Hunt in August 2023 with the entire repeatable
surface already built — navigation, search, i18n, syntax highlighting, dark mode,
logo theming. The migration was to copy the existing MDX folder into the Starlight
template, at which point there was a live site. What was left was a config file
and a stylesheet.

The numbers Astro published afterward: development costs down more than 50%,
content operations more than twice as fast, and a time split that went from
roughly 30:70 content-to-maintenance to 95:5. The dependency surface collapsed
from a pile of individually-versioned UI components to one framework, which took
the open Dependabot queue to zero.

The part that mattered most isn't in the numbers. Shipping only HTML meant a
contributor no longer had to know JavaScript or React to fix a docs page, so the
people with the most product context stopped needing a developer as an
intermediary.

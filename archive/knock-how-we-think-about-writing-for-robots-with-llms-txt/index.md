# How we think about writing for robots with llms.txt

Source: https://knock.app/blog/how-we-think-about-writing-for-robots-with-llms-txt
Author: Jeff Everhart (Developer Advocate)
Published: 2025-03-28
Captured: 2026-09-13

---

A deep dive into how we built our llms.txt file for our docs.

---

If you’re in the marketing or content game, you’ve probably heard people claim traditional SEO is dead. SEO traffic is being eaten by either generative AI answers in Google or replaced entirely with searches conducted in a large language model based application.

Even at Knock we're not immune to these trends. So we've spent a lot of time thinking about what the future of information discovery looks like in the age of LLMs.

## A brief history of writing for robots

For years, we've provided structural metadata about our websites to search engines through files like `sitemaps.xml` and `robots.txt`. These formats needed to be highly specific because they were designed for deterministic systems with rigid parsing requirements.

Tools like `sitemap.xml` and `robots.txt` files existed to tell search engines where they could find additional information about our site. It also enabled us to annotate important URLs with things like priority, change frequency, and their last modified date.

```xml
# robots.txt
# *
User-agent: *
Allow: /

# Host
Host: https://knock.app/

# Sitemaps
Sitemap: https://knock.app/sitemap.xml

# sitemap.xml

<url>
    <loc>https://knock.app</loc>
    <lastmod>2025-03-27T17:15:50.366Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
</url>
<url>
<loc>https://knock.app/about</loc>
    <lastmod>2025-03-27T17:15:50.366Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
</url>
<url>
    <loc>https://knock.app/blog</loc>
    <lastmod>2025-03-27T17:15:50.366Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
</url>
```

<br />

But LLMs work differently. They’re more flexible in understanding content than traditional search engines, but still face challenges when trying to comprehend websites. While HTML and CSS are great at creating a web that humans can navigate, most web pages end up containing code that is more structural than semantic. Beyond that, content hidden behind JavaScript might not render properly during evaluation, and complex site structures can exceed crawling budgets—just as with traditional search.

The `llms.txt` file is [an emerging specification](https://llmstxt.org/) designed to make website content more accessible and understandable to LLM-powered search tools like ChatGPT, Claude, and Gemini. The specification proposes several solutions:

1. A primary `llms.txt` file at your website's root, using Markdown format with headings, descriptive text, and links to outline your site structure
2. An `llms-full.txt` file containing your site's content rendered in Markdown for more efficient ingestion
3. Individual Markdown versions of each page linked from the index-style `llms.txt`, so a page like [https://docs.knock.app/getting-started/what-is-knock](https://docs.knock.app/getting-started/what-is-knock) would also be available at [https://docs.knock.app/getting-started/what-is-knock.md](https://docs.knock.app/getting-started/what-is-knock.md)

## Implementing llms.txt at Knock

We recently implemented an `llms.txt` pipeline for our documentation site. The process was relatively straightforward because:

- We already had a structured data representation of our docs in our repository that we used to create our navigation sidebar.
- Our docs-as-code approach meant we had Markdown source files ready to expose directly.
- We could write these files to the public directory of our Next.js project.
- As we processed each file, we appended it to the `llms-full.txt` version.

We used–you guessed it–an LLM and Cursor to create this pipeline. We created some simple Node scripts that run on the `predev` and `prebuild` commands to generate these files. And they don't get checked into source control so that we don't have a bunch of extra Markdown files. This `llm.txt` file and its accompanying requirements are generated fresh each time we deploy our docs.

I won't walk through this entire process in detail, but since our docs are open source, you can see [this script in our GitHub repository](https://github.com/knocklabs/docs/blob/main/scripts/generateLlmsTxt.mjs).

However, we encountered some challenges. Since we use MDX, many interactive elements on our site are React components—from visual step-by-step guides to accordion components for FAQs. These components require special handling when converting to plain Markdown.

While LLMs are quite good at understanding XML-like structures, with React components being somewhat similar, some components carry more semantic meaning than others. A `<Steps/>` component clearly indicates a sequence of instructions, but an `<AccordionGroup />` component might need alternative representation to preserve its meaning.

## Creating a specification for non-deterministic systems

Unlike `robots.txt` and `sitemap.xml`, which were designed for deterministic systems requiring specific formats, LLMs can understand content in various forms with remarkable flexibility. Given a standard HTML page, an LLM can likely comprehend it pretty well—even a sitemap would be understandable without special formatting.

This raises the question, at least in my mind: how closely should we follow a specification when dealing with systems that are 1) non-deterministic, 2) have far greater understanding potential, and 3) are likely to only get more capable?

In my opinion, `llms.txt` creates opportunities to provide additional context while following a general format. And here are just a few things I considered while creating this pipeline:

### Context windows

One argument for creating an `llms.txt` file is efficiency: HTML wastes tokens on structural elements that carry little semantic meaning (like nested divs for styling). However, for complex products like Knock, which is a notification infrastructure platform, even our optimized `llms-full.txt` file exceeds the context windows of many current models. when I paste the contents of our full docs into [OpenAPI's tokenizer](https://platform.openai.com/tokenizer), we're sitting at about 350,000 tokens.

<ImageModal
  src="/assets/blog/how-we-think-about-writing-for-robots-with-llms-txt/knock-total-tokens.png"
  alt="Knock"
>
  <img
    src="/assets/blog/how-we-think-about-writing-for-robots-with-llms-txt/knock-total-tokens.png"
    alt="Knock"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>
<figcaption>Total token count of Knock's docs</figcaption>

When I started writing this article, [Claude's posted context limit](https://docs.anthropic.com/en/docs/build-with-claude/context-windows) for Claude Pro is around 200,000 tokens, which also includes prompts and its output as you continue to chat with it.

Given how rapidly language models are advancing—with increasingly larger context windows—today's limitations may soon disappear. It's likely not worth dramatically reducing documentation scope just to fit current context windows.

<Callout emoji="💡">
  I was right. By the time I finished drafting this article, [Gemini 2.5 had
  released](https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/),
  which has a whopping 1M token context window, with 2M reportedly coming soon.
</Callout>

### Hierarchy and annotations

As part of the research process for creating our own llms.txt files, I looked at existing files from other popular technology providers (like [MCP](https://modelcontextprotocol.io/llms.txt), [Resend](https://resend.com/docs/llms.txt), [Anthropic](https://docs.anthropic.com/llms.txt), and [Stripe](https://docs.stripe.com/llms.txt)) to see what they were already doing. What I found was that there is wide variation in how people are approaching this and more or less variation in how closely people adhere to the spec.

While some companies treat `llms.txt` like another version of sitemap, Stripe in particular added a lot of additional context to this index-style page that I think is important for LLMs, and I decided to replicate in our own structure at Knock.

```markdown
## Checkout

Build a low-code payment form and embed it on your site or host it on Stripe. Checkout creates a customizable form for collecting payments. You can redirect customers to a Stripe-hosted payment page, embed Checkout directly in your website, or create a customized checkout page with Stripe Elements. It supports one-time payments and subscriptions and accepts over 40 local payment methods. For a full list of Checkout features.

- [Stripe Checkout](https://docs.stripe.com/payments/checkout.md): Build a low-code payment form and embed it on your site or host it on Stripe.
- [Stripe-hosted page](https://docs.stripe.com/checkout/quickstart.md)
- [Embedded form](https://docs.stripe.com/checkout/embedded/quickstart.md)
- [How Checkout works](https://docs.stripe.com/payments/checkout/how-checkout-works.md): Learn how to use Checkout to collect payments on your website.
```

For us, this was easy because we had already encoded the hierarchy of our docs and several descriptive textual elements into a JSON structure to create our sidebar navigation. Initially we asked [Devin](https://devin.ai/) to implement, and it iterated through our markdown directories to construct this list of links that lacked both hierarchy and annotations.

I used that JSON file as the basis of our `llms.txt` file to first encode the hierarchy of our docs for the LLM and then to also provide each section of the docs with a little bit of additional context so the LLM knows what links it’s approaching when it gets to a particular section.

I also decided to use some indentation to represent nested pages within this navigational structure. I'm not certain of whether or not this is something that the LLM will pick up on, but I figured since this is a flexible machine that we're targeting, it was worth a try.

```markdown
## Designing workflows

Learn how to design notifications using Knock's workflow builder, then explore advanced features such as batching, delays, and more.

- [Overview](/designing-workflows/overview.md): Learn more about how to design and create powerful cross-channel notification workflows in Knock.
- [Delay function](/designing-workflows/delay-function.md): Learn more about the delay workflow function within Knock's notification engine.
- [Batch function](/designing-workflows/batch-function.md): Learn more about the batch workflow function within Knock's notification engine.
- [Branch function](/designing-workflows/branch-function.md): Learn more about the branch workflow function within Knock's notification engine.
- [Fetch function](/designing-workflows/fetch-function.md): Learn more about the fetch workflow function within Knock's notification engine.
- [Throttle function](/designing-workflows/throttle-function.md): Learn more about the throttle workflow function within Knock's notification engine.
- [Trigger workflow function (Beta)](/designing-workflows/trigger-workflow-function.md): Learn more about the trigger workflow function within Knock's notification engine.
- [Step conditions](/designing-workflows/step-conditions.md): Learn more about how to use step conditions within the Knock workflow builder.
- [Channel steps](/designing-workflows/channel-step.md): Learn more about channel steps within Knock's notification engine.
- [Send windows](/designing-workflows/send-windows.md): Learn how to control when notifications are delivered using send windows.
- [Partials](/designing-workflows/partials.md): Learn how to create reusable pieces of content using partials.
- [Template editor](/designing-workflows/template-editor.md)
  - [Overview](/designing-workflows/template-editor/overview.md): Learn how to use the Knock template editor to design notifications for your product.
  - [Variables](/designing-workflows/template-editor/variables.md): A reference guide for the variables available in the Knock template editor.
  - [Referencing data](/designing-workflows/template-editor/referencing-data.md): A guide for working with data in your templates.
  - [Liquid helpers](/designing-workflows/template-editor/reference-liquid-helpers.md): A reference guide to help you work with the Liquid templating language in Knock.
```

## Where this technology is headed

We're witnessing the emergence of an industry around LLM search visibility, with tools like [Profound](https://www.tryprofound.com/) offering analytics distinct from traditional SEO tools like Ahrefs, SEM Rush, or Google Search Console. This shift will be crucial for businesses, especially in the developer tools space since LLM adoption is more widespread among this profession.

What's becoming clear is that writing for humans differs significantly from writing for LLMs. Humans—particularly developers—tend to be skeptical consumers of information. LLMs lack these same biases and often struggle with nuanced content.

This difference creates an opportunity: we can continue writing content optimized for human consumption while using the `llms.txt` format to provide additional context that helps language models better understand our products. I’m not sure anyone really knows _how_ to do that just yet, but we’ll continue to report back

## The uncharted territory of LLM-based search

The truth is, we're all exploring uncharted territory. The `llms.txt` spec and the ecosystem around LLM-based search are nascent developments in a rapidly evolving landscape. These technologies currently matter more for technologists and creators of technical tools than for the general public, but their importance will only grow.

As we navigate this new space, creating separate optimization paths for human readers and machine comprehension might prove to be the most effective approach—allowing us to deliver the best experience for both audiences without compromising.

At Knock, we've implemented `llms.txt` for our documentation and will continue refining our approach as best practices emerge. If you're interested in learning more about how we've implemented this specification or want to discuss notification infrastructure for your application, [get in touch](https://knock.app/contact-sales).

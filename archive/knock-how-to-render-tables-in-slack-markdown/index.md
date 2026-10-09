# How to render tables in Slack markdown

Source: https://knock.app/blog/how-to-render-tables-in-slack-markdown
Author: Jeff Everhart (Developer Advocate)
Published: 2024-05-15
Captured: 2026-09-13

---

A quick guide that covers a few ways to create table layouts in Slack markdown

---

If you’re reading this post, you probably came looking for support in rendering a table in Slack’s markdown formatting. Sadly, Slack doesn’t support the traditional markdown table syntax, but we can get creative and come pretty close.

In this post, we’ll demonstrate several workarounds to rendering a table in Slack, including using basic Block Kit layouts as well as rendering an ASCII table inside of a code block.

## Video walkthrough

If you prefer to learn with video, watch it here.

<iframe
  style={{ aspectRatio: "16/9", width: "100%" }}
  src="https://www.youtube.com/embed/UhW4zZJOFtM?si=AITMk0tjCnlk9uw_"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>
## Using traditional markdown tables

First, let’s take a quick look at what a traditional markdown table would look like:

```markdown
| Month    | Savings |
| -------- | ------- |
| January  | $250    |
| February | $80     |
| March    | $420    |
```

Markdown tables are handy for many reasons, and there are lots of potential use cases for displaying them in Slack apps. Unfortunately, we’ll need to get a little creative to use them in Slack.

For the rest of the examples in this post, let’s assume that we have a JSON object like this one that we’ll use as the data source for our tables:

```javascript
const data = [
  { Month: "January", Savings: "$250" },
  { Month: "February", Savings: "$80" },
  { Month: "March", Savings: "$420" },
];
```

## Basic table layout with Block Kit

When you break down what a table does, it displays some data using a combination of rows and columns. In most cases, each cell has a border to create some visual separation from the rest of the elements.

Using Slack’s Block Kit, you can approximate a table layout using a `heading` block, `field` blocks, and a series of `dividers`:

<ImageModal
  src="/assets/blog/how-to-render-tables-in-slack-markdown/slack-fields-table.png"
  alt="A Slack table layout with section and field blocks"
>
  <img
    src="/assets/blog/how-to-render-tables-in-slack-markdown/slack-fields-table.png"
    alt="A Slack table layout with section and field blocks"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

While not exactly a table, this gets pretty close and looks great when rendered with Slack, and we did it all with Slack-native formatting options.

The resulting Block Kit JSON looks like this:

```javascript
{
	"blocks": [
		{
			"text": {
				"emoji": true,
				"text": "💰 Our Savings",
				"type": "plain_text"
			},
			"type": "header"
		},
		{
			"fields": [
				{
					"text": "*Month*",
					"type": "mrkdwn"
				},
				{
					"text": "*Savings*",
					"type": "mrkdwn"
				}
			],
			"type": "section"
		},
		{
			"type": "divider"
		},
		{
			"fields": [
				{
					"text": "January",
					"type": "mrkdwn"
				},
				{
					"text": "$250",
					"type": "mrkdwn"
				}
			],
			"type": "section"
		},
		{
			"type": "divider"
		},
		{
			"fields": [
				{
					"text": "February",
					"type": "mrkdwn"
				},
				{
					"text": "$80",
					"type": "mrkdwn"
				}
			],
			"type": "section"
		},
		{
			"type": "divider"
		},
		{
			"fields": [
				{
					"text": "March",
					"type": "mrkdwn"
				},
				{
					"text": "$420",
					"type": "mrkdwn"
				}
			],
			"type": "section"
		},
		{
			"type": "divider"
		}
	]
}
```

### Limitations of Block Kit JSON for tables

The main limitation with Block Kit JSON `fields` is that you can only display two columns of compact text. If you need to support more columns in your table, you may want to consider the next method using an ASCII table.

## Render ASCII table in Slack code block

This approach borders on hacky, but for some applications, it will actually create a pretty good result. Since Slack `field` blocks can’t accept more than two columns, we can use a function inside your application to create an ASCII text table from your JSON data and then include that text inside a multiline code block, which should preserve its formatting.

To start, you’ll need a function that turns a JSON array into an ASCII table in whatever programming language you’re working with. The example below is written in JavaScript and takes a JSON object as a parameter and uses the keys as headers for the table columns:

```javascript
function createAsciiTable(data) {
  if (!data || data.length === 0) {
    return "No data provided";
  }

  // Extract headers from the first object's keys
  const headers = Object.keys(data[0]);

  // Calculate the maximum width for each column
  const columnWidths = headers.map((header) =>
    Math.max(
      ...data.map((row) => row[header].toString().length),
      header.length,
    ),
  );

  // Create the divider
  const divider =
    "+" +
    headers.map((header, i) => "-".repeat(columnWidths[i] + 2)).join("+") +
    "+";

  // Create the header row
  const headerRow =
    "|" +
    headers
      .map((header, i) => ` ${header.padEnd(columnWidths[i])} `)
      .join("|") +
    "|";

  // Generate each row of data
  const rows = data.map(
    (row) =>
      "|" +
      headers
        .map(
          (header, i) => ` ${row[header].toString().padEnd(columnWidths[i])} `,
        )
        .join("|") +
      "|",
  );

  // Assemble the full table
  return [divider, headerRow, divider, ...rows, divider].join("\n");
}

// Example usage
const data = [
  { Month: "January", Savings: "$250" },
  { Month: "February", Savings: "$80" },
  { Month: "March", Savings: "$420" },
];

console.log(createAsciiTable(data));
```

If you run this function with the data provided, you should receive the output that looks like this:

```
+----------+---------+
| Month    | Savings |
+----------+---------+
| January  | $250    |
| February | $80     |
| March    | $420    |
+----------+---------+
```

From there, you can include that text inside of a multiline code block and send the Block Kit payload using the `postMessage` API endpoint.

The result looks like this when the table is rendered in Slack:

<ImageModal
  src="/assets/blog/how-to-render-tables-in-slack-markdown/slack-ascii-table.png"
  alt="A Slack table rendered with ASCII characters"
>
  <img
    src="/assets/blog/how-to-render-tables-in-slack-markdown/slack-ascii-table.png"
    alt="A Slack table rendered with ASCII characters"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

Here’s an example of how this all gets used together in a Next.js server action:

````javascript
"use server";

import { postMessage } from "../../lib/slack/postMessage";

function createAsciiTable(data) {
  if (!data || data.length === 0) {
    return "No data provided";
  }

  // Extract headers from the first object's keys
  const headers = Object.keys(data[0]);

  // Calculate the maximum width for each column
  const columnWidths = headers.map((header) =>
    Math.max(
      ...data.map((row) => row[header].toString().length),
      header.length,
    ),
  );

  // Create the divider
  const divider =
    "+" +
    headers.map((header, i) => "-".repeat(columnWidths[i] + 2)).join("+") +
    "+";

  // Create the header row
  const headerRow =
    "|" +
    headers
      .map((header, i) => ` ${header.padEnd(columnWidths[i])} `)
      .join("|") +
    "|";

  // Generate each row of data
  const rows = data.map(
    (row) =>
      "|" +
      headers
        .map(
          (header, i) => ` ${row[header].toString().padEnd(columnWidths[i])} `,
        )
        .join("|") +
      "|",
  );

  // Assemble the full table
  return [divider, headerRow, divider, ...rows, divider].join("\n");
}

// Example usage
const data = [
  { Month: "January", Savings: "$250" },
  { Month: "February", Savings: "$80" },
  { Month: "March", Savings: "$420" },
];

export async function sendTableMessage(channel) {
  const tableString = createAsciiTable(data);
  const codeBlock = "```$table```".replace("$table", tableString);
  const blocks = [
    {
      text: {
        emoji: true,
        text: "💰 Our Savings",
        type: "plain_text",
      },
      type: "header",
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: codeBlock,
        },
      ],
    },
  ];
  const res = await postMessage(channel, blocks);
  return res;
}
````

Since the `createAsciiTable` function automatically appends new line characters to each table row, all we need to do is store that value in a variable called `tableString`. From there, we construct a string that will wrap the `tableString` value in backticks: ` "```$table```" `

<Callout emoji="💡">
  Since the `codeBlock` string contains backticks, I decided not to use a
  template literal here, opting for the more generalized `String.replace` method
  you see in the example.
</Callout>

Since this is just a code block, we have a lot more flexibility regarding the size of the table you can upload.

### Limitations of ASCII tables in Slack

One thing to be aware of is readability. As you resize the Slack app, view the message on mobile, or if a user views your table in a thread, the table layout may strain against the width of its container.

There is also a character limit for `text` fields in Block Kit that is set at 3000 characters, so be aware of that as you develop your applications.

Anecdotally, I also found it difficult to work with the ASCII table in the BlockKit preview environment, since many output methods, like `console.log` will render the new line characters.

For most applications that require more than two columns of data, this approach makes the most sense.

## Table image as file upload

There’s one more way to render tables in Slack, but it takes a bit more effort.

A few of the other StackOverflow threads on this issue callout uploading the table as an image using the `files.upload` endpoint, which is in the process of being deprecated. Slack has introduced a new API endpoint to replace it called <code>[files.getUploadURLExternal](https://api.slack.com/methods/files.getUploadURLExternal)</code> that will handle this functionality now.

For certain applications, this may be the best path, but given the changes to the API endpoints, I won’t cover this in detail in this article.

## Knock helps simplify building Slack apps

If you're looking to create a Slack app for your product, Knock created [SlackKit](/blog/getting-started-with-slack-kit) to help developers simplify the process of creating these integrations.

SlackKit provides you with drop-in components to handle Slack OAuth and channel selection. Those Slack connections are stored in Knock and can be used as a part of multi-channel notification workflows to reach you users where they work.

If you want to add Slack notifications to your application, you can [sign up for Knock](https://dashboard.knock.app/signup) or reach out to us in our [Slack community to chat](https://knock.app/join-slack).

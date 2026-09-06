---
title: "String Interpolation in PHP"
date: 2019-11-21
excerpt: "Most of what I write about on the site exists to save someone else from having to learn the painful lessons I've spent time, energy, or emotion solving. This is one of those times where I'm sharing so"
heroImage: "/media/php_PNG26.png"
categories: ["PHP"]
wpId: 2123
---

Most of what I write about on the site exists to save someone else from having to learn the painful lessons I've spent time, energy, or emotion solving. This is one of those times where I'm sharing something uber useful that many people familiar with PHP may already know.

As JavaScript has evolved, one of the most useful new features of ES6 syntax is the template literal, which lets you interpolate variables into strings instead of concatenating them together. Functionally, that looks like this in JavaScript:

```js
const firstName = "Jeff";
const lastName = "Everhart";

const fullNameConcat = firstName + " " + lastName;
//output: Jeff Everhart

const fullNameInterpolate = `${firstName} ${lastName}`;
//output: Jeff Everhart
```

For a simple example like this, maybe the difference between concatenation and interpolation isn't a big deal, but for longer strings or multiline strings, string interpolation is a super helpful technique that helps keep your code clean and readable. Before template literals, it would not be uncommon to see line after line of string concatenation building some part of an interface.

Even though I write a fair amount of PHP, I haven't put nearly as much time into learning the features of that language as I have JavaScript or even C# when I was working with it regularly.

I can, for the most part, make stuff work with the tools I already have, so my PHP tends to level up when I wonder if I can do X with PHP, X usually being some construct from another language.

Today I had that huh type of moment and started to look at the PHP docs. As it turns out, I've been concatenating where I would have preferred to be interpolating all along. [When you create string literals with double quotes, PHP does some automatic expansion of variables for you.](https://developer.wordpress.org/reference/classes/wpdb/prepare/) This is different from JavaScript, where template literals can execute arbitrary JS expressions, but saves you from the long and winding string concatenation monster nonetheless:

```php
$first_name = "Jeff";
$last_name = "Everhart";

$full_name_concat = $first_name . " " . $last_name;
//output: Jeff Everhart

$full_name_interpolate = "{$first_name} {$last_name}";
//output: Jeff Everhart

$full_name_interpolate_v2 = "$first_name $last_name";
//output: Jeff Everhart
```

There are several ways that you can expand variables in PHP, and if you are using a string literal with double quotes, the curly brackets are optional in some cases. Hopefully this is new to some folks, even though it may be totally basic to others.

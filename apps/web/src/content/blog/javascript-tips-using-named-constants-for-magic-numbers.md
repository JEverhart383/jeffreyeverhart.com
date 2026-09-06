---
title: "JavaScript Tips: Using Named Constants for Magic Numbers"
date: 2020-09-28
excerpt: "Sometimes when you are coding and you need to make calculations, we introduce values into our programs that are called '[magic numbers.](https://en.wikipedia.org/wiki/Magic_number_\\(programming\\)#:~:t"
heroImage: "/media/512px-Unofficial_JavaScript_logo_2.svg.png"
categories: ["JavaScript", "Web Development"]
wpId: 2491
---

Sometimes when you are coding and you need to make calculations, we introduce values into our programs that are called '[magic numbers.](https://en.wikipedia.org/wiki/Magic_number_\(programming\)#:~:text=7%20References-,Unnamed%20numerical%20constants,1%20manuals%20of%20the%201960s.)' Magic numbers make it harder for someone else reading your code to understand its meaning and intent.

## What Are Magic Numbers?

Magic numbers are unique values, typically numerical, with unexplained meaning in your program that could be replaced by a named constant.

Let's look at a particular example using JavaScript dates. To do some common calculations with dates, we typically convert the date into [the number of milliseconds since the Unix epoch using a method like `Date.getTime()`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime)

However, this can leave us with some complicated calculations if we want to know how many days have passed since two dates, or we want to schedule an action for 20 days in the future. It's easy for values like the below to creep into our code:

```generic
1000 * 60 * 60 * 24
// 1000 milliseconds times 60 seconds times 60 minutes times 24 hours

1000 * 60 * 60 * 24 * 20
// 1000 milliseconds times 60 seconds times 60 minutes times 24 hours time 20 days
```

If this is a one off calculation, then you might be ok with an abstract number like this appearing somewhere in your code, but if you need to make several calculations like this creating a named constant for these values can increase the readability of your code.

## Introducing Named Constants

In practice, we do this by creating a variable, and ideally a constant variable, to store that information with a descriptive name about the value and why it is important to the domain of your program.

```generic
const now = Date.now()
const dateSubmitted = new Date(submission.submitted_at).getTime()
const DAY_IN_MS = 1000 * 60 * 60 * 24
const daysSinceSubmission = Math.round((now - dateSubmitted) / DAY_IN_MS)
```

While not required, some conventions suggest naming these types of constants in all uppercase letters so that you can distinguish between your regular variables and those that store magic numbers.

If we look at this same example without using the named constant, hopefully it looks a little out of place. While it is one line shorter, the last line is much more complex to understand at a quick glance.

```js
const now = Date.now()
const dateSubmitted = new Date(submission.submitted_at).getTime()
const daysSinceSubmission = Math.round((now - dateSubmitted) / 1000 * 60 * 60 * 24)
```

Again, in the above example the magic number might not seem overwhelming, but imagine if we had a class or object where five or six of these same types of calculations are made. Everything is made much clearer when we replace these values with descriptive names since it makes the code easier to read, but also makes it more maintainable since we can update the value of the magic number by changing its variable assignment.

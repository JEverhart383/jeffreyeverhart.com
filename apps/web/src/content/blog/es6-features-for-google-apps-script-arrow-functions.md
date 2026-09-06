---
title: "ES6 Features for Google Apps Script: Arrow Functions"
date: 2020-02-12
excerpt: "In the second part of this series, we're going to take a look at arrow functions, how they are used, and how they can be helpful in the context of Google Apps Script. In part one, we looked at [ES6 te"
heroImage: "/media/es6-and-google-apps-script.png"
categories: ["Google Apps Script", "JavaScript"]
wpId: 2182
---

In the second part of this series, we're going to take a look at arrow functions, how they are used, and how they can be helpful in the context of Google Apps Script. In part one, we looked at [ES6 template literals](https://jeffreyeverhart.com/2020/02/07/es-6-features-for-google-apps-script-template-literals/) and how they can be used to create elegant and dynamic strings of text. ![](/media/es6-and-google-apps-script.png) When I first started trying to learn ES6 features and incorporate them into my practice, arrow functions were perhaps the oddest looking part about modern JavaScript. Without the comforting `function` keyword or curly braces around a function body, it took me awhile to parse through what was happening in source code. However, after you understand this new syntax, you do start to see some of the claims about readability realized, not so much because the syntax of the arrow function is more clear, but because its brevity makes it easier to understand what a chunk of code does if used appropriately. Let's dive in and take a look at some of the features of arrow functions.

## Arrow Functions

Before getting into the features of arrow functions, let's talk for a second about their syntax. Just like regular anonymous functions, there are two main parts to arrow functions: the parameters and the statements or expressions that make up the function body.  

```js
const regularFunction = function(parameter1, parameter2) {
  // function body
  return parameter1 + parameter2;
}

//concise body with implicit return
const conciseArrowFunction = (parameter1, parameter2) => parameter1 + parameter2;

//block body with explicit return
const blockArrowFunction = (parameter1, parameter2) => {
  parameter1++;
  return parameter1 + parameter2;
}
```

Based on the examples above, two of the key differences between anonymous functions and arrow functions are that arrow functions omit the `function` keyword and there is an arrow `=>`, equals sign + right caret, in between the parameters and the function body. However, in the example above you can also see that there are two different types of function bodies used with arrow functions, as well as different requirements based on the number of parameters passed to a function that we haven't talked about yet.

### Arrow Function Body

According to [the arrow function docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), function bodies can be either concise or block. While the block function body performs exactly like any other type of function, the concise body allows us to implicitly return the value of an expression. If you look at the first example without the curly braces, you can see there is no `return` statement because we _implicitly_ return the value of `parameter1 + parameter2` by leaving off the block curly braces. However, it is worth noting that the implicit return only works if there is **only one expression** in the function body. If we need to evaluate multiple expressions, or include control flow statements like if, else, while, etc., then you must use the block body syntax, which has no implicit return feature.

```js
//concise body with implicit return 
const conciseArrowFunction = (parameter1, parameter2) => parameter1 + parameter2; 

//block body with explicit return 
const blockArrowFunction = (parameter1, parameter2) => { 

  return parameter1 + parameter2; 
}
```

Later on, we'll look at places where using the implicit return feature of the concise syntax can be helpful, but we also need to talk about the syntax regarding parameters before we do that.

### Arrow Function Parameters

Much like with function bodies, there are lots of caveats when it comes to passing in parameters to an arrow function. Depending on the number of parameters you pass to an arrow function, you may or may not be required to enclose them with parentheses `( )`. If using only one parameter, the parentheses are optional.

```js
//one parameter 
const oneParamArrowFunction = parameter => parameter++;
```

If using two or more parameters, the parentheses are required.

```null
//two or more parameters 
const twoParamArrowFunction = (parameter1, parameter2) => return parameter1 + parameter2;
```

If using no parameters, the parentheses are required.

```null
//no parameters
const noParameters = () => return callNoParamFunction();
```

### Benefits of Implicit Return

Now that we have a pretty good understanding of the basic syntax of arrow functions, let's take a look at how we might use these features in our code. One of the places I like using arrow functions the most are in combination with methods like `Array.map & Array.filter` since it really helps to keep the code short and concise. [These methods can be used to transform and filter array data, and they are very powerful when used on spreadsheet data from Google Sheets.](https://jeffreyeverhart.com/2019/03/01/retrieve-rows-from-google-spreadsheet-with-google-apps-script/)

See the Pen [Arrow Functions | Implicit Return](https://codepen.io/JEverhart383/pen/XWbJKjq) by Jeff Everhart ([@JEverhart383](https://codepen.io/JEverhart383)) on [CodePen](https://codepen.io).

### Handling 'this' with Arrow Function

When I was first learning JavaScript, the concept of the ['this' keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) was one of the most confusing things to wrap my head around since the value of 'this' can change based on where and how a function is called. After learning and working in C# for a previous job, I can say that other languages, particularly those with object-orientation at their core, handle this is a much less confusing way. Arrow functions offer use some tools that can help smooth over this quirk in JavaScript and help us build cleaner, more modular code. Let's take a look at a few examples below. My recommendation would be to copy each snippet and paste it in the browser console as we walk through them. I also created [a CodePen demo](https://codepen.io/JEverhart383/pen/qBdOdRq) here, but you might be better served using the browser console.  

```js
function ES5Numbers () {
  this.numbers = [8,3,5,6,7]
  this.addMultiples = function () {
    this.numbers.forEach(function(number){
      this.numbers.push(number * 2)
    })
    console.log(this.numbers)
  } 
}

const es5Numbers = new ES5Numbers()
es5Numbers.addMultiples()
//Uncaught TypeError: Cannot read property 'push' of undefined
```

The procedure above represents a fairly common pattern of object orientation. We declare an object, add a property with `this.numbers` and create a method to alter that property using the `this.addMultiples` function. But, once we nest another anonymous function inside of  `this.addMultiples` as a callback to the `forEach` loop, the reference to `this` no longer points to the `ES5Numbers` object. Instead, `this` now references the context of the anonymous function, which has no idea what `this.numbers` is, so when we try to modify the array we cause a TypeError because the object property is not defined.

#### Assigning 'this' to a Variable

One of the popular workarounds for this issue is to assign the value of `this` to a variable that we can use throughout or methods as a placeholder.  

```null
function ES5NumbersAssignedThis () {
  this.numbers = [8,3,5,6,7]
  var self = this;
  this.addMultiples = function () {
    this.numbers.forEach(function(number){
      self.numbers.push(number * 2)
    })
    console.log(self.numbers)
  } 
}

const es5NumbersAssignedThis = new ES5NumbersAssignedThis()
es5NumbersAssignedThis.addMultiples()
// [8, 3, 5, 6, 7, 16, 6, 10, 12, 14]
```

In this example, right after assigning `this.numbers` to the array of numbers, we declare another variable, most commonly called `self`, and assign it the value of `this` in the current execution context. This allows us to later reference `self.numbers` inside of our loop without causing any type errors, and we get the expected result. To may people, myself included, this seems messy, and can get tricker to manage as your programs get more complex. Arrow functions help us out here because they do not create their own `this` when they are called. Instead they inherit the `this` binding of their enclosing lexical content. Let's look at an example:  

```null
function ES6Numbers () {
  this.numbers = [8,3,5,6,7]
  this.addMultiples = () => {
    this.numbers.forEach(number => {
      this.numbers.push(number * 2)
    })
    console.log(this.numbers)
  } 
}

const es6Numbers = new ES6Numbers()
es6Numbers.addMultiples()
// [8, 3, 5, 6, 7, 16, 6, 10, 12, 14]
```

By passing an arrow function into the `forEach` loop, we're able to maintain consistent references to `this` even as we begin nesting functions. We are able to do this because arrow functions do not create their own `this` binding and instead inherit it from the enclosing context. While there are numerous place this behavior would be helpful, there are also a few gotchas to be aware of. I'd recommend reading [the MDN docs on arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) as a follow up to this article. If you're interested in reading some of the other articles in the ES6 for Google Apps Script series, take a look here:

*   [Part 1: Template Literals](https://jeffreyeverhart.com/2020/02/07/es-6-features-for-google-apps-script-template-literals/)

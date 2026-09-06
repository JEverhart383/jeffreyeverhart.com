---
title: "Adding Custom Routes to WordPress REST API"
date: 2019-10-10
excerpt: "Over the last several years I've had the opportunity to do a lot more work within the WordPress ecosystem here at VCU. Writing themes and plugins for WordPress was what really got me started in web de"
heroImage: "/media/wordpress-logo.png"
categories: ["PHP", "WordPress"]
wpId: 2108
---

Over the last several years I've had the opportunity to do a lot more work within the WordPress ecosystem here at VCU. Writing themes and plugins for WordPress was what really got me started in web development, but after years of working in other frameworks like Node/Express and .NET MVC/C#, a lot of WordPress architectural standards started to seem a little dated. However, in most cases, the WordPress REST API offers developers a clean and modern way to build functionality for WordPress while still having access to all of the core functions of WordPress. In this post, I'll walkthrough how I built an API-focused plugin framework for a recent project. I've written in the past about [how to extend existing API responses to add custom fields,](https://jeffreyeverhart.com/2017/06/14/adding-custom-fields-wordpress-json-api/) but this post will focus on creating our own set of endpoints under a new namespace.

## The Project

This project is really a continuation of something that I've been working on for a little while now, a chatbot for our website built using the Lex service on Amazon Web Services. I started documenting my explorations with Lex beginning with [the basics of creating a bot using the Lex interface](https://jeffreyeverhart.com/2017/12/11/making-chatbot-amazon-lex/), and then wrote about how [I created a custom chat interface and exposed the bot via HTTP using AWS Lambda and API Gateway](https://jeffreyeverhart.com/2018/08/29/creating-a-virtual-assistant-with-amazon-lex-and-lambda/). This newest version relies pretty much entirely on the WordPress REST API and the AWS SDK for PHP to bring all of the power of creating Lex models into the WordPress admin area. You can find [the working plugin available on Github](https://github.com/JEverhart383/lex-chatbot) if you want to take a look. At a very high level, the plugin consists of a frontend single page application powered by Vue and a series of WordPress REST API endpoints that provide CRUD access to the underlying bots and intents stored in an AWS account. My end goal is for this to be a plug and play type of plugin, that anyone can install and use to create a Lex bot easily from the WP admin area.

## Understanding Route Controllers for WordPress REST API

The WordPress docs related to the REST API have [some great information on creating controller classes](https://developer.wordpress.org/rest-api/extending-the-rest-api/controller-classes/) to handle adding functionality to the API. Since most REST endpoints deal mainly with CRUD operations, and perhaps invoke other services when resources are created or updated, I think most projects can adopt this general structure when adding endpoints to the wp-json API. Here is an example of a class that I wrote to handle all of the API interactions around reading, writing, and updating intents via the AWS Lex Model Building SDK.

```php
class AWS_Lex_Model_Intent_Controller {
  public $LEX_MODEL;
  public function __construct($LEX_MODEL) {
    $this->LEX_MODEL = $LEX_MODEL;
    $this->namespace = '/aws-workbench/v1';
    $this->resource = 'lex/intents';
  }

  public function init() {
    add_action('rest_api_init', array($this, 'register_routes'));
  }

  public function register_routes() {
    register_rest_route($this->namespace, '/' . $this->resource, array(
      'methods' => 'GET',
      // 'permission_callback' => array($this, 'check_is_admin'),
      'callback' => array($this, 'get_items')
    ));

    register_rest_route($this->namespace, '/' . $this->resource . '/(?P<name>[a-zA-Z0-9._-]+)', array(
      'methods' => 'GET',
      // 'permission_callback' => array($this, 'check_is_admin'),
      'callback' => array($this, 'get_item')
    ));

    register_rest_route($this->namespace, '/' . $this->resource, array(
      'methods' => 'PUT',
      // 'permission_callback' => array($this, 'check_is_admin'),
      'callback' => array($this, 'update_item')
    ));

  }

  public function get_items (WP_REST_Request $request) {
    try {
      $intents = $this->LEX_MODEL->getIntents();
      return $intents;
    } catch (Exception $exc) {
      return $exc;
    }
  }

  public function get_item (WP_REST_Request $request) {
    try {
      $name = $request['name'];
      $intent = $this->LEX_MODEL->getIntent($name);
      return $intent;
    } catch (Exception $exc) {
      return $exc;
    }
  }

  public function update_item (WP_REST_Request $request) {
    try {
      $intentToPut = $request->get_body();
      $intent = $this->LEX_MODEL->putIntent($intentToPut);
      return $intent;
    } catch (Exception $exc) {
      return $exc;
    }
  }

}
```

There are two important parts to extending the API in this way. The first important piece is using the `register_rest_route` function to actually register each route we want to add to the API.

### Taking a Closer Look at Register Rest Route Function

The `register_rest_route` function is where we'll actually define an endpoint and how it should behave. Let's take a close look:

```null
register_rest_route($this->namespace, '/' . $this->resource . '/(?P<name>[a-zA-Z0-9._-]+)', array(
      'methods' => 'GET',
      // 'permission_callback' => array($this, 'check_is_admin'),
      'callback' => array($this, 'get_item')
    ));
```

The first argument that this function takes is a string that represents the route at which this resource will be made available. In my example class, I defined these as fields that are specific to the class which get set in the `__construct` method:

```php
public function __construct($LEX_MODEL) {
    $this->LEX_MODEL = $LEX_MODEL;
    $this->namespace = '/aws-workbench/v1';
    $this->resource = 'lex/intents';
  }
```

In this case, since I'm getting the details on a specific intent, I define a route parameter in the following format: `/(?P<name>[a-zA-Z0-9._-]+)` Overall, I found [guidance on writing this part of the controller, i.e. path variable,](https://developer.wordpress.org/rest-api/extending-the-rest-api/routes-and-endpoints/#path-variables)  to be somewhat spotty at best. However, from the examples I was able to reverse engineer a path variable called 'name' that was a run of alphanumeric or specific characters like so. From there, we define the behaviors on that endpoint by passing an array of values that include the method, a callback, and a few other optional callbacks to check permissions or validate input. For this example, the call back retrieves a specific named intent from AWS Lex by reading the 'name' parameter on the API request:

```null
public function get_item (WP_REST_Request $request) {
    try {
      $name = $request['name'];
      $intent = $this->LEX_MODEL->getIntent($name);
      return $intent;
    } catch (Exception $exc) {
      return $exc;
    }
  }
```

Overall, I need to work on better exception handling, but this method is fairly simple as far as functions go. We take in a request, read the name, and then get that intent from the Lex model building service. Similarly to how we defined a callback for this endpoint, we can also define `permission_callback` and `validate_callback`, which check whether the calling application has permissions to access the resource and whether or not the parameters meet certain validation requirements. Both of these are executed before executing the actual callback responsible for CRUD operations. As you can see in the example class, I call `register_rest_route` for each endpoint I want to create and specify a CRUD callback using the WordPress nomenclature for naming CRUD methods on a REST controller.

## Attaching Endpoints to WP JSON API

Now that we have our endpoints defined and registered, we need to actually attach them to the REST API as it is created. Like many other things in WordPress, there is a specific hook that allows us to attach functionality to the REST API before it is considered 'ready.' In my controller class, I decided to add this hook in a method called `init` that calls a function that registers all of the routes associated with this controller:

```php
public function init() { 
add_action('rest_api_init', array($this, 'register_routes')); 
}
```

This init method is called in my main plugin file, where I also pass in the Lex SDK as a dependency:

```null
$LEX_MODEL_INTENTS = new Lex_Model_Intent($AWSWorkbench_Main->AWS_LEX_MODEL);
$LEX_MODEL_INTENTS_CONTROLLER = new AWS_Lex_Model_Intent_Controller($LEX_MODEL_INTENTS);
$LEX_MODEL_INTENTS_CONTROLLER->init();
```

This leads to a nice separation of concerns in which my main plugin file stays relatively clean, while all of the functionality to perform CRUD operations on Lex intents is contained within the respective service and controller classes.

## Wrapping Up

In my mind there are lots of reasons why someone might want to extend the WordPress API, but when doing so it's smart to realize that the controller class pattern exists in WordPress for a reason. It gives us a clean design on how to add endpoints for application-specific resources without needing to reinvent the wheel. While sometimes I like to design things on my own, I tend to appreciate more opinionated frameworks because the design of the controller is likely secondary to the business logic I want to implement using it. The less I have to think about to write good applications, the better : )

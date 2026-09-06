---
title: "Extending WP REST API Index Route Response"
date: 2017-10-25
excerpt: "This should be a fairly quick blog post, but it should help some folks out if they are looking to extend the WP Rest API index route to include some additional fields. First, let's clear up what I mea"
heroImage: "/media/wordpress-logo.png"
categories: ["Web Development", "WordPress"]
wpId: 1425
---

This should be a fairly quick blog post, but it should help some folks out if they are looking to extend the WP Rest API index route to include some additional fields. First, let's clear up what I mean by index route. 

For the purpose of this post, we are considering the index route to be whatever is returned when you request the /wp-json/ endpoint, not the fully qualified namespace /wp-json/wp/v2, which returns route information about the site. The /wp-json endpoint returns some of that information as well, but it also includes some details about the site itself. 

![](/media/Screen-Shot-2017-10-25-at-9.42.34-AM.png)

We're prototyping some additional ways to aggregate student portfolio pages/posts through the API, and we need to eventually develop a plugin to add some additional site-level settings that will help to structure the various portfolio views. 

Either way, we needed to add some additional fields to the index response, but the WP docs aren't that specific for this endpoint. Most of [the existing resources on modifying responses](https://developer.wordpress.org/rest-api/extending-the-rest-api/modifying-responses/) out there deal with adding fields to existing objects like posts, pages, or comments. 

However, there isn't an Index object that we can pass through, which lead us to some available filter options using [the 'rest\_index' filter](https://developer.wordpress.org/reference/hooks/rest_index/). From there, we get access to the [WP\_REST\_Response](https://developer.wordpress.org/reference/classes/wp_rest_response/) object and can modify it from there. As it turns out, most of the important stuff going on happens on the [WP\_HTTP\_Response](https://developer.wordpress.org/reference/classes/wp_http_response/) object, so that is a better place to start if you're looking to modify the response object in a meaningful way.  

At the end of the day, the data on the response object is just an associative array, and you can modify it as you would any other 2D array. Here is the code that should go in functions.php: 

```php
<?php

function filterResponse($response){
   $data = $response->data;
   $data['extra_field'] = 'some data';
   $response->set_data($data);
   return $response;
}

add_filter('rest_index', 'filterResponse');

?>
```

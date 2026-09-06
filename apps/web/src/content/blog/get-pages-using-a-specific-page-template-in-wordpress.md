---
title: "Get Pages Using a Specific Page Template in WordPress"
date: 2020-01-27
excerpt: "In a recent project, I had the need to get an array of all of the pages on a site that were using a particular page template. It turns out that this is really just an extension of any other type of me"
heroImage: "/media/wordpress-logo.png"
categories: ["WordPress"]
wpId: 2165
---

In a recent project, I had the need to get an array of all of the pages on a site that were using a particular page template. It turns out that this is really just an extension of any other type of meta query I could run, but you need to know that the meta field storing the info for the page template is in `_wp_page_template.` I found a few examples of this using [WP Query](https://wordpress.stackexchange.com/questions/29918/page-template-query-with-wp-query), but decided to write a quick little function using the [get\_pages function](https://developer.wordpress.org/reference/functions/get_pages/) instead because it seemed cleaner for this use case then having to cleanup WP Query. The function looks like this:

```php
function get_page_by_template($template = '') {
  $args = array(
    'meta_key' => '_wp_page_template',
    'meta_value' => $template
  );
  return get_pages($args); 
}
```

  In my case, using `get_pages` instead of the `WP_Query` class make sense because of what I've trying to find, but I'd recommend checking out this [article on the difference between WP\_Query, get\_posts, and get\_pages](https://www.digitalreachagency.com/blog/wp_query-vs-get_pages-vs-get_posts/) for further reading on when you might want to use a specific strategy.

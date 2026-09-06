---
title: "Adding Custom Fields to WordPress JSON API"
date: 2017-06-14
excerpt: "I'm working on building out some cool annotations tools for different types of audio, mostly music, which you can see [an example of here](http://audiovideo.jeffreyeverhart.com/audio-annotation/peaks."
heroImage: "/media/wordpress-logo.png"
categories: ["Web Development", "WordPress"]
wpId: 1232
---

I'm working on building out some cool annotations tools for different types of audio, mostly music, which you can see [an example of here](http://audiovideo.jeffreyeverhart.com/audio-annotation/peaks.html). Although this is a good step, to really make this app/plugin/tool extensible and reusable, there needs to be some sort of back end layer to store some meta data about each one of the audio segments. Since VCU uses WordPress a lot, and the WP REST API has grown much more sophisticated over the years, I thought it would be a good option to create a custom post type for these types of audio annotations and store the metadata using some custom fields. It was easy enough to make the custom post type available through the API using the Custom Post Type UI plugin, but there was more involved to get the custom fields to show up in the JSON response for each post. There was a lot of outdated stuff out there, and even [the official docs](https://developer.wordpress.org/rest-api/extending-the-rest-api/modifying-responses/) don't really offer a whole lot of clarity, so here is the code I added to functions.php to get the custom fields in the JSON response:

```php
function song_get_post_meta_cb($object, $field_name, $request){
        return get_post_meta($object['id'], $field_name, true); 
}

function song_update_post_meta_cb($value, $object, $field_name){
  return update_post_meta($object['id'], $field_name, $value); 
}

add_action('rest_api_init', function(){

  register_rest_field('song', 'song_segments', 
    array(
    'get_callback' => 'song_get_post_meta_cb', 
    'update_callback' => 'song_update_post_meta_cb', 
    'schema' => null

    )
  ); 
});
```

You can just modify this and drop it into whatever part of the code is called when WP is bootstrapped. First we define two functions that return the result of calls to the WP methods to get/update post metadata. Then we add an action on the 'rest\_api\_init' hook that uses the method 'register\_rest\_field' to link our post type with the custom field key and the callbacks for reading/updating. Beware that other examples out there are using the older and now deprecated method 'register\_api\_field' instead of 'register\_rest\_field.'

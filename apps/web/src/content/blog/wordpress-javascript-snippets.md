---
title: "WordPress JavaScript Snippets"
date: 2018-01-30
excerpt: "This post is really just a placeholder for some new JavaScript tricks I've learned for WordPress over some of my latest projects. I'm sure these won't be groundbreaking, but it's worth it to document "
heroImage: "/media/wordpress-logo.png"
categories: ["JavaScript", "WordPress"]
wpId: 1478
---

This post is really just a placeholder for some new JavaScript tricks I've learned for WordPress over some of my latest projects. I'm sure these won't be groundbreaking, but it's worth it to document them here, at least for myself.  

## Working with REST API on Multisite

The first snippet deals with using the REST API on a multisite installation. There are tons of use cases where you might want to have a JavaScript component that interacts with the WP API, but since the multisite sites are all stored in a subdirectory of the main domain, you can't just include relative links. For example, if we are working with https://rampages.us/map-test then making a request to just /wp-json/wp/v2/posts wouldn't get routed to the right site. So, a quick and dirty fix is to inject the site URL from WordPress into a global JavaScript variable that your script can reference. The first step is using wp\_localize\_script to inject a JavaScript variable. I included this line in functions.php in the enqueue block for the pages I needed to load it on:

```php
wp_localize_script('theme_js', 'WPURLS', array( 'siteurl' => get_option('siteurl') ));
```

Once we've done this, WordPress injects a JavaScript object called WPURLS and will create properties on that object that match the 2D array we pass to wp\_localize\_script. From here, we can just reference that global variable when we need it using JS:

```js
this.siteURL = WPURLS.siteurl.replace('http', 'https');
```

This helps use immensely when constructing the URLs for API endpoints in various methods:

```js
this.getMapPoints = function ( ) {
        return new Promise( (resolve, reject) => {
            $.get( self.siteURL + '/wp-json/wp/v2/map-point?_embed&per_page=100')
            .done(data => resolve(data))
            .fail(error => reject(error))
        })
    }
```

I've used lots of other methods to pass data from WordPress into JavaScript, but since some things are just not available through the API, and echoing a PHP variable into a script tag seems even dirtier, this will now be my preferred method over accomplishing this type of task.

## Using the WordPress Media Library as Image Picker

For another project, I had a first foray into using the wp.media JavaScript API, which was relatively easy to integrate into the rest of my code. In a nutshell, if you click a button, it opens the media library, lets you select an image or not, then sets the value of a URL text input equal to the url of the selected piece of media:

```null
jQuery('button.btn-default').click(function(e) {

        e.preventDefault();
        var image_frame;

  //If this has already been initialized, just open it
        if(image_frame){
            image_frame.open();
        }
        // Define image_frame as wp.media object
       image_frame = wp.media({
           title: 'Select Media',
           multiple : false,
           library : {
               type : 'image',
           }
       });

 image_frame.on('close',function() {
   // On close, get selections and save to the hidden input
   // plus other AJAX stuff to refresh the image preview
   var selection =  image_frame.state().get('selection');
   if (selection.length > 0){
     //This code is here because I've got two url inputs
     //that are being served by the same picker essentially
     //so it sets the input value based on the button that 
     //was clickd to open
     //You could just do $('input').val(selection.toJSON()[0].url)
     $(e.currentTarget).parents('.input-group').find('input').val(selection.toJSON()[0].url);
   }
 });

 image_frame.open();
});
```

I'm going to play around more with some of this stuff in the future to see what other cools uses we might have for using the media library in this way. This example sure made it easier to pick/upload images for the content we were creating.

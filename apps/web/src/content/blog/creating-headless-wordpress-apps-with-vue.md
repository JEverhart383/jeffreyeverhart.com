---
title: "Creating Headless WordPress Apps with Vue"
date: 2020-04-24
excerpt: "Over the past several years, I've been prying more and more at the limits of the WordPress REST API as they apply to creating ['headless' sites and applications](https://www.smashingmagazine.com/2018/"
heroImage: "/media/Vue-Wordpress.png"
categories: ["Vue", "WordPress"]
wpId: 2333
---

Over the past several years, I've been prying more and more at the limits of the WordPress REST API as they apply to creating ['headless' sites and applications](https://www.smashingmagazine.com/2018/10/headless-wordpress-decoupled/). Using the 'headless' methodology we can side-step server side rendering (SSR) in favor of JavaScript applications that request data as needed to re-render different views for the site. But it also allows us to decouple the storage of data from the presentation of it, which means that we could have lots of different apps or sites using the same data store in different ways. At [ALT Lab](https://altlab.vcu.edu/), we tend to bias towards speed over complexity, but one of the biggest challenges I see Indie Makers face when creating web apps is the need for some kind of persistent data storage that is secure, easy to access, and easy to initiate. In fact, I believe one of the reasons that the idea of [a Spreadsheet as a Database](https://jeffreyeverhart.com/2017/08/12/creating-crud-web-app-google-sheets/) has taken off is BECAUSE these things are difficult to initiate for many people who deal with projects of a smaller scope or with questionable life cycles. No one wants to npm install Mongoose ORM (Object Relational Mapper) and create a new MongoDB instance for a site, app, or project that may never take off. I think most other Indie Hackers are with me here that the act of making is more important than the technical wizardry we can incant. In the following blog post, I'll attempt to describe a pattern of headless web app development using Vue and WordPress that most people who have experience doing basic PHP work in WordPress and front end web development can readily implement.

## The Application Use Case

The application we created was meant to help people crowd source Wi-Fi hot spots, so the app has a tight integration with the Google Maps and Google Places APIs to help with the geospatial aspects of this. You can see one of the example screens below: ![a screenshot of an application using Google Maps](/media/Screen-Shot-2020-04-20-at-3.20.37-PM.png) In terms of the data model, that is also fairly standard with only a few fields. We store some basic info about the particular place, including the longitude and latitude, and then have the API endpoint calculate a distance from the user based on query string parameters. The resulting object that gets saved looks like this:

```js
{
  "id":19,
  "name":"Virginia Commonwealth University",
  "description":"You can get on this and that network",
  "formatted_address":"907 Floyd Ave, Richmond, VA 23284, USA",
  "latitude":37.54831219999999802894308231770992279052734375,
  "longitude":-77.4526804999999995970938471145927906036376953125,
  "distance":53.37837850223349533962391433306038379669189453125
}
```

There are a lot of interesting aspects to this project, so I'm not going to breakdown all the nuts and bolts of this app and will instead focus on the 'headless' aspects of this project. If you're interested in looking at the source code, you can find it [here on GitHub](https://github.com/RVA-ALT-Lab/crowd-fi). In the future, I'll break this out a more specialized starter theme.

## Application Architecture

A lot of the [examples of Headless WordPress sites](https://www.smashingmagazine.com/2020/02/headless-wordpress-site-jamstack/) out there involve using a separate application stack, like Nuxt or Gatsby for example, to pull from the WordPress API as solely a data store. However, the pattern I've chosen to use here allows that same kind of access, but instead of using another stack to pull from WordPress, I developed the guts of a WordPress theme into a flexible SPA (single page application) that reads from and writes to the WordPress API.

### Rendering and Routing

To do this, I pared down all of the PHP templates in the theme directory to just the `index.php` file, so that no matter what route gets hit on the web server, the SPA container gets loaded. There entire content of the `index.php` look like this:

```php
<?php get_header(); ?>
  <div class="container-fluid" id="app">
  </div>
<?php get_footer(); ?>
```

This loads a basically blank HTML page with a single div that wraps the SPA. Later, in the root file of our JavaScript application, we target that div and render all of our Vue components inside of it:

```js
import Vue from 'vue'
import router from './router/index'
Vue.config.devtools = true
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import * as VueGoogleMaps from "vue2-google-maps"
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.use(VueGoogleMaps, {
  load: {
    key: window.WP_OPTIONS.google_api_key,
    libraries: "places" // necessary for places input
  }
});



import App from './App.vue'

const app = new Vue({
  el:'#app',
  router,
  render: h => h(App)
})
```

This allows me to do a few different things. First, using the `window.WP_OPTIONS` object I can pass data from my WordPress install into the JavaScript application, which allows me to set particular pieces of sensitive data, like the Google API key, in a way that is friendly to WP conventions. I'll talk about where this comes from in the section about the app's JavaScript. Second, since this index file gets rendered every page load, it allows me to use the [Vue Router](https://router.vuejs.org/) package to define the routes of the application. Since this was a fairly simple application, I only had four total routes with only one of them being dynamic:

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import IndexPage from '../pages/IndexPage.vue'
import AddPointPage from '../pages/AddPointPage.vue'
import SearchPage from '../pages/SearchPage.vue'
import PointDetailsPage from '../pages/PointDetailsPage.vue'
Vue.use(VueRouter)
const routes = [
  {path: '/', component: IndexPage },
  {path: '/add-point', component: AddPointPage },
  {path: '/search', component: SearchPage },
  {path: '/access-point/:id', component: PointDetailsPage }
]
const router = new VueRouter({
  routes
})

export default router
```

It's worth noting that I only tried this with the router configured to hash mode, which makes URLs that look like this: /#/search I may play around with [HTML5 History Mode](https://router.vuejs.org/guide/essentials/history-mode.html), at a later date to see if that would work as well.

### Creating APIs

One of the nice things about using the WordPress API is that there is already a commonly used controller pattern for [extending the WordPress API with your own routes](https://jeffreyeverhart.com/2019/10/10/adding-custom-routes-to-wordpress-rest-api/). The total API work for this project consisted of one controller file that had three functions that required some actual business logic.

```php
class MapPointController {
  // Instance of AWS client used by this particular controller
  public function __construct() {
    $this->namespace = '/crowd-fi/v1';
    $this->resource_endpoint = 'map-point';
  }

  public function init() {
    add_action('rest_api_init', array($this, 'register_routes'));
  }

  public function register_routes() {
    register_rest_route($this->namespace, '/' . $this->resource_endpoint, array(
      'methods' => 'GET',
      'callback' => array($this, 'get_items')
    ));

    register_rest_route($this->namespace, '/' . $this->resource_endpoint . '/(?P<id>[a-zA-Z0-9._-]+)', array(
      'methods' => 'GET',
      'callback' => array($this, 'get_item'),
      'args' => array(
        'id' => array(
          'required' => true
        )
      )
    ));

    register_rest_route($this->namespace, '/' . $this->resource_endpoint, array(
      'methods' => 'POST',
      'permission_callback' => array($this, 'check_can_post'),
      'callback' => array($this, 'create_item')
    ));
  }

  public function get_items (WP_REST_Request $request) {
    try{
      $query = new WP_Query([
        'post_type' => 'map-point',
        'posts_per_page' => -1,
        'post_status' => 'publish'
      ]);

      $query_params = $request->get_query_params();
      $geolocation_query = false;
      if ($query_params['latitude'] && $query_params['longitude']) {
        $geolocation_query = true;
        $user_position = [
          'latitude' => floatval($query_params['latitude']),
          'longitude' => floatval($query_params['longitude'])
        ];
      }

      if ($query->have_posts()) {
        $posts = $query->posts;
        $map_points = [];
        foreach($posts as $post ) {

          $map_point = [
            'id' => intval($post->ID),
            'name' => $post->post_title,
            'description' => $post->post_content,
            'formatted_address' => get_post_meta($post->ID, 'formatted_address', true),
            'latitude' => floatval(get_post_meta($post->ID, 'latitude', true)),
            'longitude' => floatval(get_post_meta($post->ID, 'longitude', true)),
          ];

          if($geolocation_query) {
            $map_point['distance'] = MapPointController::distance($user_position['latitude'], $user_position['longitude'], $map_point['latitude'], $map_point['longitude'], 'M');
          }

          array_push($map_points, $map_point);

        }

        function compareDistance($a, $b) {
          return $a['distance'] > $b['distance'];
        }
        usort($map_points, 'compareDistance');

        return $map_points;
      } else {
        return [];
      }
    } catch (Exception $exc) {
      return $exc;
    }
  }

  public function get_item (WP_REST_Request $request) {
    try{
      $query = new WP_Query([
        'p' => $request['id'],
        'post_type' => 'map-point'
      ]);

      if ($query->have_posts()) {
        $posts = $query->posts;
        $map_points = [];
        foreach($posts as $post ) {
          $map_point = [
            'name' => $post->title,
            'formatted_address' => get_post_meta($post->ID, 'formatted_address', true),
            'latitude' => floatval(get_post_meta($post->ID, 'latitude', true)),
            'longitude' => floatval(get_post_meta($post->ID, 'longitude', true)),
          ];
          array_push($map_points, $map_point);
        }

        return $map_points;
      } else {
        return [];
      }
    } catch (Exception $exc) {
      return $exc;
    }
  }

  public function create_item (WP_REST_Request $request) {
    try {
      $post_body = json_decode($request->get_body(), TRUE);
      $post_id = wp_insert_post([
        'post_type' => 'map-point',
        'post_title' => $post_body['name'],
        'post_status' => 'publish',
        'post_content' => $post_body['description'],
        'meta_input' => [
          'latitude' => $post_body['latitude'],
          'longitude' => $post_body['longitude'],
          'formatted_address' => $post_body['formatted_address'],
        ]
      ]);
      $post_body['id'] = $post_id;
      return $post_body;
    } catch (Exception $exc) {
      return $exc;
    }
  }
  public static function distance($lat1, $lon1, $lat2, $lon2, $unit) {
    if (($lat1 == $lat2) && ($lon1 == $lon2)) {
      return 0;
    }
    else {
      $theta = $lon1 - $lon2;
      $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
      $dist = acos($dist);
      $dist = rad2deg($dist);
      $miles = $dist * 60 * 1.1515;
      $unit = strtoupper($unit);

      if ($unit == "K") {
        return ($miles * 1.609344);
      } else if ($unit == "N") {
        return ($miles * 0.8684);
      } else {
        return $miles;
      }
    }
  }

  public function check_can_post() {
    return true;
  }


}
```

The particular endpoints that I needed to create for this project involve getting a list of items, getting a single item by id, and creating a new item. Thus, you can see functions in this file tied to those specific routes that execute logic based on the desired outcome. To activate these routes, all I need to do is require the controller, create a new instance, and initialize it from the theme's `functions.php` file:

```php
require_once dirname(__FILE__) . '/api/MapPointController.php';
$map_point_controller = new MapPointController();
$map_point_controller->init();
```

Doing this makes those routes accessible via the API, but also adds a new namespace to the /wp-json response that documents the routes and their parameters: ![a screenshot of a WordPress API response with new namespaces added](/media/Screen-Shot-2020-04-22-at-12.59.37-PM.png) To round off the data model for this project, I went ahead and created a custom post type called `map-points` where we will store this data using certain WP post conventions. This allows us to segregate our data in an understandable way while still allowing people to do some editing of the objects from the WordPress admin area, which is key for less technical users. Since we're storing each map-point as a post object, here is a basic mapping of the JSON keys with how they are stored in the database:

```null
{ 
 "id": wp_posts.ID, 
 "name": wp_posts.post_title, 
 "description": wp_post_content, 
 "formatted_address": post_meta['formatted_address'], 
 "latitude": post_meta['latitude'], 
 "longitude": post_meta['longitude'], 
 "distance": dynamic value calculated at runtime 
}
```

Looking at any of the get/create\_items function in the API controller should give you an example of how to map your own custom objects onto the WP Post abstraction fairly painlessly.

### Front End Code

Since the front end is created using a SPA approach, all of the application UI is authored using [Vue single file components](https://vuejs.org/v2/guide/single-file-components.html), which allow us to create loosely coupled components with scoped styles and functionality. However, to compile all of these Vue templates into JavaScript that we can execute, we need to introduce a build step using Webpack. The JavaScript structure for the project looks like this: ![a screenshot of a VS Code file explorer window with src, dist, and build folders](/media/Screen-Shot-2020-04-22-at-2.59.23-PM.png)   As I develop, Webpack watches for changes in the front end templates and and compiles down to a single JS file in the `dist`directory. From there I include the `main.js`file in the WordPress `wp_enqueue_scripts`hook while also injecting any additional needed data, like site url or a nonce, using the `wp_localize_script`function:

```php
function map_tool_add_scripts () {

    wp_enqueue_style( 'style', get_stylesheet_uri() );
    wp_register_script('vue_js', get_template_directory_uri() . '/dist/main.js', null, null, true );
    wp_enqueue_script('vue_js');
    wp_localize_script('vue_js', 'WP_OPTIONS', array(
      'google_api_key' => get_option('map_general_options')['google_maps_api_key'],
      'siteurl' => get_option('siteurl'),
      'rest_nonce' => wp_create_nonce( 'wp_rest' )
  ));

}

add_action( 'wp_enqueue_scripts', 'map_tool_add_scripts' );
```

Using `wp_localize_script` we can pass along data that can be helpful to constructing the front end of the application, but we need to create [a nonce to authenticate with the REST API](https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/) for all requests that would require authentication. If you look at the following example method used when sending a POST request to create a new place in the database, you can see how these global variables get utilized within the Vue component methods:

```null
export default {
  name: 'CurrentPlace',
  props: {
    place: {
      type: Object,
      required:true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    addNewLocation: function () {
      this.loading = true
      axios({
        url:`${window.WP_OPTIONS.siteurl}/wp-json/crowd-fi/v1/map-point`,
        method: 'POST',
        headers:{
          'X-WP-Nonce': window.WP_OPTIONS.rest_nonce
        },
        data: {
          name: this.place.name,
          formatted_address: this.place.formatted_address,
          latitude: this.place.location.lat,
          longitude: this.place.location.lng,
          description: this.place.description
        }
      })
      .then(res => {
        this.loading = false
        this.$emit('place-add-success', res.data)
      })
      .catch(error => {
        this.loading = false
        this.onError(error)
      })
    },
    onError (error) {
      this.$bvToast.toast(`Error: ${error.message}`, {
        title: 'Error Adding Location',
        variant: 'danger',
        solid: true
      })
    },
    removePlaceSelection () {
      console.log('calling emit')
      this.$emit('remove-place-selection', false)
    }

  }
}
```

In the above example, the `addNewLocation` method invokes the `create_item` method of `MapPointController` to add a new map point to the database, mapping the JSON data model we have here to WP post and meta fields. But since we control all of the logic behind each endpoint, we can add in patterns that allow us to do some expressive querying with GET APIs as well. In the following example, the front end code relies on the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) in the browser to get the user's current position, which is then used for a contextual search if available.

```js
export default {
  name: 'SearchPage',
  components: {
    Places
  },
  data () {
    return {
      center: { lat: 37.541290, lng: -77.434769 },
      markers: [],
      places: [],
      currentPlace: {
        name: 'Your Location',
        formatted_address: '',
        location: { lat: 37.541290, lng: -77.434769 }
      }
    }
  },
  computed: {
    formattedPlaces () {
      return this.places.map(place => {
        return {location: {lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) }}
      })
    },
    google: gmapApi
  },
  mounted () {
    this.geolocate()
  },
  methods: {
    getPlaces(lat, lng) {
      const url =
        lat && lng
        ? `${window.WP_OPTIONS.siteurl}/wp-json/crowd-fi/v1/map-point?latitude=${lat}&longitude=${lng}`
        : `${window.WP_OPTIONS.siteurl}/wp-json/crowd-fi/v1/map-point?latitude=${37.541290}&longitude=${-77.434769}`

      axios.get(url)
      .then(res => {
        res.data.forEach(point => {
          this.places.push(point)
        })
      })
    },
    onGeolocateSuccess (position) {
      this.center.lat = position.coords.latitude
      this.center.lng = position.coords.longitude
      this.getPlaces(this.center.lat, this.center.lng)
    },
    onGeolocateError (error) {
      const message = `Your experience will be degraded because we couldn't locate you. Plase enable geolocation services in your browser for this website and try again.\n\nError: ${error.message}`
      this.$bvToast.toast(message, {
        title: 'Error Getting Your Location',
        variant: 'danger',
        solid: true
      })
      this.getPlaces()
    },
    geolocate () {
      try {
        navigator.geolocation.getCurrentPosition(
          this.onGeolocateSuccess,
          this.onGeolocateError,
          {
            enableHighAccuracy: true,
            timeout: 10000
          }
          );
      } catch (error) {
        this.onGeolocateError(error)
      }
    }
  }
}
```

When the `SearchPage` component get mounted, it call the `geolocate` method, which gets pass a set of success and failure callbacks that both eventually call the `getPlaces` method with varying parameters. Inside of `getPlaces` we can see an example of calling the API with an optional set or query parameters. Within the `get_items` method of the `MapPointController` those query parameters are examined and influence how the results are returned by ordering the resultant places by distance from the user if provided.

### Building a UI with Speed

In addition to the backend parts of this project that helped me get moving quickly, I also employed a few frameworks that helped me speed things along. The first of which is [BootstrapVue](https://bootstrap-vue.org/), which is really comprehensive collection of Bootstrap 4 components and plugins. Using this, I was able to create what I felt like was a very usable interface for all devices with minimal coding. I also use the [vue2-google-maps](https://www.npmjs.com/package/vue2-google-maps) package throughout the project to render maps, activate the Google places autocomplete input, and render driving directions. I'll more than likely write a whole post on this at some point because there are a ton of useful ways to use this particular set of APIs.

## Final Thoughts

As yet another iteration of my playing with Vue and the WordPress API, I felt like things have coalesced here in a way that I'm really starting to dig. Part of that for me is identifying clear patterns for wiring the guts of these systems together in a way that provides some meaningful benefit. Using some fairly simple API controller conventions for WordPress and somewhat breaking the mold for what a theme could be, we arrive at some interesting possibilities for creating powerful things quickly and easily using tools that are widely available.

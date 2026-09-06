---
title: "Simple is Always Better"
date: 2018-04-18
excerpt: "One of the hardest things to do as a developer is to resist the urge to add additional complexity where it does not add value to the overall solution. As technologists, we tend to think this stuff is "
heroImage: "/media/wordpress-logo.png"
categories: ["WordPress"]
wpId: 1626
---

One of the hardest things to do as a developer is to resist the urge to add additional complexity where it does not add value to the overall solution. As technologists, we tend to think this stuff is cool, and so sometimes we fall victim to this trap. Let me illustrate with a recent example. We have two environments for our large WordPress multisite installation, a production environment and a development environment, with dev being an exact clone of production. However, the problem we've been struggling with for some time is that WordPress uses that database to generate links for the individual sites using the siteurl and home options in the wp\_options table. Since dev is a copy of prod, it leads to links that point back to our production environment, which is not great when you are testing things. In most cases, a simple search and replace plugin would help solve this issue, but none of them are set-up to work across a sharded database, and our multisite installation is spread across 256 separate MySQL databases.

## Possible Solutions

As [Tom](http://bionicteaching.com/) and I talked about different ways to handle this, most of the solutions we could think of involved pretty complex and low-level solutions. We talked about writing a pure PHP script, outside of the WordPress environment, to loop through the databases and their tables, updating all of the options fields. We talked about writing something similar just using SQL, but eventually I settled on writing a small plugin to use the WordPress functionality to loop through and update all of the site options. Initially, I tried one loop with all 30K sites, but it promptly crashed the dev environment. From there I implemented some pagination to update 100 sites at a time. You can see the entirety of the plugin code below:

```php
add_action('network_admin_menu', 'add_rampages_dev_url_replace_menu');
function add_rampages_dev_url_replace_menu() {
    add_menu_page(
        "Rampages Dev URL Replace",
        "Rampages Dev URL Replace",
        'manage_network',
        'rampages-dev-url-replace',
        'rampages_dev_url_replace_render_menu'
    );
}


function rampages_dev_url_replace_render_menu(){
    $offset = isset($_GET['offset']) ? $_GET['offset'] : 0;
    echo 'Rampages Dev Replace URL';
    $sites = rampages_dev_url_get_sites($offset * 100);

    //Check to make sure we are not at the end of the sites list
    if (sizeof($sites)> 0){

        foreach($sites as $site){
            $blog_id = $site->blog_id;
            switch_to_blog($blog_id);
            $siteurl = '';
            $home = '';
            if(get_option('siteurl')){
                $siteurl = get_option('siteurl');
                update_option('siteurl', preg_replace('/rampages.us/', 'rampagesdev.reclaimhosting.com', $siteurl));
                $newsiteurl = get_option('siteurl');
            }
            if (get_option('home')){
                $home = get_option('home');
                update_option('home', preg_replace('/rampages.us/', 'rampagesdev.reclaimhosting.com', $home));
                $newhome = get_option('home');
            }
            echo "</br>". $blog_id . " " . $siteurl . " " . $home;
            restore_current_blog();
        }
        $offset++;
        var_dump($offset);
        echo "<script type='text/javascript'>window.location.href='https://rampagesdev.reclaimhosting.com/wp-admin/network/admin.php?page=rampages-dev-url-replace". "&offset=". $offset ."';</script>";
    } else {
        echo "Youre all done!";
    }
    //redirect to ?offset=2
}


function rampages_dev_url_get_sites($offset){
    $args = array(
        'offset' => $offset,
    );
    $sites = get_sites($args);
    return $sites;

}
```

Overall, still pretty simple as far as plugins go, but right about the time I got this working, Tom came up with an even simpler solution using filters:

```null
function replace_siteurl($val) {
  $clean = preg_replace('/rampages.us/', 'rampagesdev.reclaimhosting.com', $val);
    return $clean;
}
add_filter('option_siteurl', 'replace_siteurl');
add_filter('option_home', 'replace_siteurl');
```

Both technically work and do the same thing, but it's worth talking about their approach to addressing the underlying problem. The first and longer plugin attempts to address the issue from a really technical perspective. The data in the database in incorrect and we need to change it, so we make a solution that does just that. In fact, all of the other possible early solutions we came up with involved manipulating the underlying data. However, since this is a dev environment that we mainly use to test updates in production, we didn't need for the data to be perfect. Really we were just looking for a way to navigate around the dev environment without accidentally ending up in production, which the filters address in ~6 lines of code.

## The Lesson

In the development world, simpler is generally better. Full stop. It also helps if you take some time to break down the problem into it's simplest possible variation. Had we phrased things differently in our initial conversations around solutions, maybe we would have realized that the real problem wasn't that the data was wrong, but that we needed a way to change the links being echoed in the dev environment. It's hard to say whether these linguistic nuances would have lead us any sooner to WordPress filters, but I'd like to think that a thorough reframing of the problem helps us access different paths forward.

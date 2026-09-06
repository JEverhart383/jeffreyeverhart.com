---
title: "WordPress NGINX Proxy Server Subdomain to Subdirectory"
date: 2016-12-11
excerpt: "For a recent project, I implemented an NGINX proxy server to proxy requests from a WordPress installation on a subdomain so that they appear to come from a subdirectory of the main domain."
heroImage: "/media/Proxy-Server.jpg"
categories: ["AWS", "Linux", "WordPress"]
wpId: 1093
---

For a recent project, I implemented an NGINX proxy server to proxy requests from a WordPress installation on a subdomain so that they appear to come from a subdirectory of the main domain.

```null
Good 
http://maindomain.com/blog
Bad 
http://blog.maindomain.com
```

There a lots of SEO and technical benefits to setting up a proxy server like this, a few of which I'll go over in this post. However, this was not as straightforward of a task as I hoped, and I consulted numerous other resources out there, but none of them seemed to cover 100% of my use case, so I decided to write up this blog post. Here is a quick preview of the resulting architecture: ![](/media/Proxy-Server.jpg)  

### Why to install a proxy server

Proxy servers are basically the traffic cops of the internet. They act as a gateway to other parts of your application and shuttle requests to and from other servers so that you have the ability to really dial in you architecture. There are also lots of reasons to use a proxy server from an SEO perspective, which is the main reason I decided to use one for this project. This [infographic from Moz](https://moz.com/blog/what-is-a-reverse-proxy-and-how-can-it-help-my-seo) sums up the arguments for using a proxy server nicely.

##### Initial Setup

In this case, there is a NodeJS application sitting on the main server, with the DNS records for the main domain pointing at it in Amazon Web Services. It seemed in bad taste to put the WordPress installation on the same server as the Node app since they have slightly different requirements and use cases. Instead, the simplest route was to spin up another server and point a subdomain at it. The resulting architecture looked like this: www.maindomain.com --> NGINX proxy --> Node app blog.maindomain.com --> Apache --> WordPress At first, everything was great. All of the servers were easy to manage since they each had a specific purpose. I could optimize the performance of each on independently, think heavy caching on WordPress server and quick response time for Node API. Then, the results of SEO indexing started to roll in. Since Google treats subdomains as almost separate domains, none of the SEO juice from the blog subdomain was trickling up to the main domain. Since the primary reason for the blog in the first place was content marketing, this seemed like a major defeat. To get the desired results, I needed to serve all of the WP content from the main domain. This is the ideal structure: www.maindomain.com/blog Since putting both applications on the same server still seemed out of the question, I decided to explore the proxy server route. This allowed me to keep the blog on its own server on a subdomain, but also get the SEO benefits of having the blog served as a subdirectory. **Setting Up the NGINX Proxy Server**  As it turns out, NGINX, which also acts as a proxy for the Node app, is great a being a proxy, so I'll talk a little bit about how to set that up below.

```null
server {

location /blog {
     proxy_pass  http://blog.maindomain.com
}

location / {
     proxy_pass http://nodeapp
}

}
```

Inside of the main NGINX server block, you can set up a separate location directive for a particular path, in this case anything pointing at /blog. Using proxy\_pass, you can hand off that traffic to another server, in this case the blog subdomain, to get the results, and then NGINX will pass the results back to the browser. It would have been great if things were that simple for me. In many of the examples I saw, this is where the directives stop. Oh, just proxy all requests to the /blog path, and you're good. To get all of my stuff working right, I had to add in a few other location directives to get to the right folders on the WP site. They ended up looking like this:

```null
location /blog/wp-content {
    proxy_pass  http://blog.maindomain.com/wp-content;
} 

location /blog/wp-includes {
    proxy_pass http://blog.maindomain.com/wp-includes;
}

location /blog/wp-login.php {
    proxy_pass http://blog.maindomain.com/login.php
}

location /blog/wp-admin {
   proxy_pass http://blog.maindomain.com/wp-admin
}
```

These directives handled the remaining things that were getting returned with a 404 error with just the initial directive. I'm sure this was due to some Apache rewrite rules, but those proved more illusive to track down. There was still a lot of configuration to do in WordPress itself and on its Apache server, but I recommend setting up the NGINX proxy\_pass rules first to test them out before you change the address of you WordPress site and shut off outside traffic to the subdomain. **Configuring WordPress and Apache to Handle the Proxy** In addition to getting all of the server rules in place, there are a couple of things you need to do within WordPress itself to get everything ready to go. The first step is changing the Site Address and Home URL. There are a couple of ways to do this: through the WP-Admin interface, the wp-options table in the database, or in the wp-config.php file. My recommendation would be to use either the first or second option. I was able to use the first. If log into WP, and go to Settings > General, you will see a few items that look like this: [![wp-settings-general-proxy-server](http://ec2-34-198-113-124.compute-1.amazonaws.com/wp-content/uploads/2016/12/Screen-Shot-2016-12-06-at-2.57.02-PM-1-1024x164.png)](http://ec2-34-198-113-124.compute-1.amazonaws.com/wp-content/uploads/2016/12/Screen-Shot-2016-12-06-at-2.57.02-PM-1.png) The WordPress address is the address of the WP installation, this is where other files go looking for files, images, etc. The Site Address is what WordPress uses to set the address in the address bar and write out links to posts, pages, etc. In my case, I ended up changing both of these to http://maindomain/blog so that all URLs were written relative to that path, but also so that all traffic for scripts, stylesheets, and images came through the proxy server. Some examples I saw had the Site Address set to http://maindomain/blog and the WP Address set to http://blog.maindomain.com.

##### Controlling Traffic to Subdomain

I actually tried that as well, and from a technical perspective everything worked fine with the proxy server. All of the URLs were http://maindomain.com/blog, but all of the include and content requests were still made to the subdomain. For some implementations, that would have been fine, but since the goal was to not have the subdomain indexed at all, I decided to route all traffic through the proxy server so that I could prepare for the next step. **Shutting Off External Traffic to Apache and WP** With all of the files coming in correctly using the proxy traffic rules, it was time to shut off traffic from the sources I didn't want, namely Google, its spiders, and the rest of the internet. I muddled with a few options to do this. One option I considered was passing a header value from the proxy server to Apache to check against, which might have been a better decision for a group of proxy servers, but since there was just the one machine, checking its IP address seemed like a good solution.

```null
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
# RewriteCond %{HTTP:Proxy-Forward} !^True$
RewriteCond %{REMOTE_ADDR} !=11.111.11.111
RewriteRule ^(.*)$ - [L,R=404]
</IfModule>
```

To get this working, you can add a rewrite rule in your .htaccess file. I kept the custom header example in the comments in case that idea might help someone. Make sure to put this before any default configuration added by WordPress. I had some debate here about what HTTP status to return for traffic from the wild, but I finally settled on 404. 403 Forbidden made it sound interesting, and I want the search engines and everyone else to ignore it. Had the initial blog content been out there for a long time, I might have tried to get a 301 redirect to work. With so many failed redirect loops early in the process, it seemed only fitting to start fresh and squash the old content.

### Cleaning Up WP and the WP Database

It's up to you whether to do this step before or after cutting off Apache traffic, but you can't forget this step if you expect a good user experience. There are two things to look out for here:

1.  Hardcoded theme references
2.  Database references

If your WordPress theme is pretty stock, or if you haven't made a lot of modification on your own, you might not need to look for these. However, with a project of any decent size, there is a good chance that someone left a link to an old resources or hardcoded something into a stylesheet or src attribute. An easy way to look at this is by just browsing the site. Usually, this can spot most issues, but its also worth a go to search the files quickly for any references to the site. You can do this with a Linux command like this one:

```null
find /html -type f -exec grep -H 'text-to-find-here' {} \;
```

There are a few other variations of commands you could use, and I got that from [this post on StackOverflow.](http://stackoverflow.com/questions/16956810/how-to-find-all-files-containing-specific-text-on-linux)  I ended up having to edit a few theme files on the server to swap out an absolute URL with a relative URL. Hopefully, you don't find anything hardcoded, but if you do update it, and let's move on. Lastly, you need to update the WordPress Database for references to the old site address. I chose to use a plugin for this, and I'm thankful I did. It took about 7 minutes to run, so I'm only sure how long it would have taken me to script that whole process for all of the WP tables! I opted for a really simple [plugin called Find and Replace All](https://wordpress.org/plugins/find-and-replace-all/). It's not fancy, but it does the one thing I needed it to do. Not a lot of ratings, but a ton of installs. Even though this plugin generates an SQL backup for you, I'd recommend creating one yourself as well.

### Resources

Like I said, I consulted a bunch of resources to get this set up working. Here they are in no specific order: [https://codex.wordpress.org/Moving\_WordPress](https://codex.wordpress.org/Moving_WordPress) https://yuji.wordpress.com/2010/03/08/nginx-wordpress-proxy-subdirectory-to-wordpress-subdomain/ https://yuji.wordpress.com/2010/10/04/unix-setup-wordpress-on-apache-php5-through-nginx-reverse-proxy/ [https://www.digitalocean.com/community/questions/nginx-as-proxy-to-wordpress](https://www.digitalocean.com/community/questions/nginx-as-proxy-to-wordpress) [https://www.digitalocean.com/community/questions/nginx-proxy\_pass-to-wordpress-on-remote-server](https://www.digitalocean.com/community/questions/nginx-proxy_pass-to-wordpress-on-remote-server)

---
title: "Automate Deployments with GitHub Webhooks"
date: 2017-09-22
excerpt: "This post is the second post in my new fangled Weekly Workflows section. I took a few requests on Twitter as to what people would like to see here, and [Paul Williams](https://twitter.com/cyclopslabs)"
heroImage: "/media/github-octocat-ninja.jpeg"
categories: ["Productivity", "Web Development", "Workflow"]
wpId: 1364
---

This post is the second post in my new fangled Weekly Workflows section. I took a few requests on Twitter as to what people would like to see here, and [Paul Williams](https://twitter.com/cyclopslabs), a developer from Texas, expressed some interest in how people use GitHub and workflows around that key technology. ![creating github webhooks](/media/github-octocat-ninja-300x300.jpeg) As luck would have it, I've been working on building out some tools and workflows using GitHub Webhooks and other parts of our knowledge infrastructure. So, here we go.

## Getting Started with GitHub

Although the ALT Lab has been around for a few years, our development group is really in its infancy in a lot of ways. As such, we are trying to figure out how GitHub fits within the larger goals of our organization. Most of the items in our [ALT Lab RVA organizational account](https://github.com/RVA-ALT-Lab) are custom WordPress themes or plugins, with a few one-off tools we've built for other environments. As far as context goes, we are not a typically software development shop for a lot of reasons. First, we are typically working with short timelines (think days or weeks, not months), and second, for most projects, there is one person as the lead that might do the bulk of the work. When we started talking about how GitHub fit into our workflow, it seemed like the main benefit of the service would be the idea of public source control. In other words, although we might not "collaborate" on a project, we all needed access to it in a public way in case something broke in production. In order to get started without overburdening ourselves with unnecessary structure, we decided to start using only the Master branch of the project in GitHub. We aren't yet at the level of sophistication where we'd see a ton of benefit from creating new branches, submitting pull requests, or performing code reviews. However, there is some possibility of a collision when two people create conflicts on the master branch. We have yet to experience that, but to keep everyone in the loop, I integrated our GitHub organization into Slack: ![github commit in slack channel | github webhook](/media/Screen-Shot-2017-09-19-at-3.25.47-PM-1024x199.png) Overall, this has worked so far for us as a cue to perform a fresh pull from master before you start working on a project someone else has touched. [The integration was provided in Slack](https://get.slack.help/hc/en-us/articles/232289568-Use-GitHub-with-Slack) out of the box, and took me all of two minutes to create and test. In the future, we might decide that additional process can produce additional benefits, but I'd love to hear from other people, particularly on small, non-standard dev teams to see how they structure this type of workflow.

## Continuous Deployment with GitHub Webhooks

Once we started using GitHub to store the latest and greatest versions of whatever we were working on, we ran into issues where the deployed projects in production started to get out of sync with what was in source control. Before, we had a pretty manual process of using SFTP or SCP to overwrite the old with the new, but that was a manual process and one that is fraught with the potential for human error. After all, there is always [the potential for someone to run the wrong command and wipe out the internet](https://gizmodo.com/amazon-says-one-engineers-simple-mistake-brought-the-in-1792907038). After looking into a few options, it seemed like the simplest path forward for this was to use [GitHub webhooks to trigger an update process on our server](https://developer.github.com/webhooks/). The GitHub docs here are pretty clear, and there is a GUI in GitHub that will let you specify your endpoint and send test pings to practice parsing the payload. Basically, a webhook is something that just sends out an HTTP POST request to an endpoint you specify when certain conditions are met. At that point, it is up to you to script out the rest of the process. Here are some code snippets below to get you started: config.json This is the file that stores some of the data for the repos you want to be automatically updated. Be sure to check the name of the repo against the "official" name in GitHub. Also note that the commands property should contain all of the commands you want to execute. I imagine this will vary based on your application.

```json
{
  "configurations": [
    {
      "name": "name-of-your-repo", 
      "command": " cd /folder/plugins/your-repo && git pull"
    }

  ]

}
```

deployment.php This is the script that does the bulk of the heavy lifting. I tried to add sufficient comments in the code, but if you Google "GitHub Webhooks <your-app-stack>" there will be tons of examples out there. I'm getting more interested in how to use server logs in an intelligent way, so you can see I spend a lot of code logging info from the GitHub request. This was also very helpful when debugging as I wrote the setup.

```php
<?php 

//Pull in the config file which contains the configuration data
//for each repo and the shell commands to excecute when that repo is changed 
$config_file = file_get_contents('config.json');
$config_json = json_decode($config_file, true);  

//First check to see if is a POST, here will will also
//want to incorporate the 
if(isset($_POST)){

  $json = json_decode($_POST['payload'], true); 

  if ($json['action'] == 'published'){
  
//Here I'm setting up a bunch of stuff for some logging. This is helpful as you 
//get started for debuggin, but should also be a good idea so that you can see what kind of 
//traffic is hitting that endpoint 		
    $log = ""; 	
    $github_delivery = $_SERVER['HTTP_X_GITHUB_DELIVERY']; 
    $github_event = $_SERVER['HTTP_X_GITHUB_EVENT']; 
    $user_agent = $_SERVER['HTTP_USER_AGENT']; 
    $repository_name = $json['repository']['name']; 
    $repository_sender = $json['sender']['login'];
    $date = date('l jS \of F Y h:i:s A'); 


    $log .= "\n";
    $log .= "Date: " . $date; 
    $log .= "\n";
    $log .= "Event: ". $github_event;
    $log .= "\n";
    $log .= "Delivery: ". $github_delivery;
    $log .= "\n";
    $log .= "User Agent: ". $user_agent; 
    $log .= "\n"; 
    $log .= "Repoistory Name: ". $repository_name;  
    $log .= "\n"; 
    $log .= "Sender Name: ". $repository_sender;  
    $log .= "\n"; 

    file_put_contents('deploy-log.txt', $log, FILE_APPEND);

//Once we've parsed the payload, loop through the available environments and use shell_exec to 
//execute the shell commands you've associated with the environment 		
    foreach ($config_json['configurations'] as $config) {
      if ($config['name'] == $repository_name){

        shell_exec($config['command']); 


      }
    }


  }

}



?>
```

That's about all she wrote for this one. After struggling with some PHP nuance I'm not familiar with, this was a fairly straightforward thing to do. There is still some manual process here because we have to add another record to config.json, but I can deal with one manual step for an automated future.

## Things to Ponder

While this is going to do wonders for our workflow, there are lots of spaces for you to make this process your own and lots of other things that might need to be tweaked to fit in other architectures. First, we had to make decisions about what GitHub events would trigger the webhook. In the end, we decided to rebuild our stuff anytime a new release is tagged in GitHub. Part of that reasoning is that individual commits seemed too aggressive, while the semantic versioning enforced by the release structure would actually help us better track down bugs as things in the app change. However, it's not an all or nothing. GitHub will let you specify the events that trigger a webhook, or you can listen for everything and have your app react based on events that you defined. In our setup, we might have one script listen for changes on dozens of repos all in different stages of development. It might be cool to have a few listen for the 'release' or 'publish' event, but also have some work in progress stuff listen for just commits. The world is your oyster. Another thing to think about is how this pattern would fit in if we were using something like Node/Express or Flask/Python, or any other number of frameworks or runtimes. People give PHP a lot of crap, but even [Slack's engineering team uses it for their backend code](https://slack.engineering/taking-php-seriously-cf7a60065329), citing developer productivity as a benefit. As someone who's worked extensively in the Node ecosystem, where server restarts are required, and in C# .NET, where all code is complied at runtime, I could see the process including some additional steps. Replacing a PHP file then making a new request is a pretty sweet pattern in comparison. I'm really interested in hearing what workflows like this look like for other people, especially if you are on a small team or doing non-standard (meaning not consumer software) work.

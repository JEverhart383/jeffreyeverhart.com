---
title: "Making a Chatbot with Amazon LEX"
date: 2017-12-11
excerpt: "What follows here is an exploration of an evolving project I'm working on to provide some additional touch points for current and prospective students in online courses at VCU. ![example chatbot conve"
heroImage: "/media/Chatbot.jpg"
categories: ["AWS"]
wpId: 1459
---

What follows here is an exploration of an evolving project I'm working on to provide some additional touch points for current and prospective students in online courses at VCU. ![example chatbot conversation](/media/Screen-Shot-2017-12-11-at-1.50.20-PM.png) Chatbots, AI, Machine Learning, and other terms with similar connotations seem to be all the rage nowadays, but using publicly available cloud services, we can get pretty close to creating some powerful new tools.

## What is a Chatbot?

First, let's get this definition out of the way. Amazon bills [its Lex service](https://aws.amazon.com/lex/) as "a service for building conversational interfaces into any application using voice and text." And this is a pretty good way of thinking about what a chatbot really is, an interface. At the end of the day, most of us don't talk or write just for our own enjoyment, we do so to produce results, get information, or make something happen. With a chatbot, or conversational interface, we can allow people to arrive at those ends using natural language instead of an interface that I might construct out of buttons and form fields. However, the metaphor of the interface is pretty apt here, as we are still essentially inputing data by talking or typing and getting data back from some backend service. ![diagram of how a chatbot interacts with other services](/media/Chatbot.jpg) While the chatbot becomes our interface, we can interact with that chatbot over a number of different channels using (almost) turn key integrations into Amazon Lex. For example, I was able to make our chatbot available through Twilio SMS and Slack in a few hours. We can also easily have our chatbot interact with any backend services that we want to provide people with the answers they want. On the other end of the spectrum, there are also mechanisms for the human to oversee the bot's responses, enabling the humans the bot is meant to replace to further train the bot.

## Getting Started with a Chatbot using Amazon Lex

This post isn't going to give a step-by-step guide, as [Amazon has produced one of those](http://docs.aws.amazon.com/lex/latest/dg/gs-bp-create-bot.html) that is pretty sufficient to get you going. Rather, I'd like to start at a high level with what types of workflows and vocabulary you need to understand to build your own chatbot to solve whatever issues you are facing. First, let's start with the idea of intent.

### What do we want to do?

For Amazon Lex, an intent is a specific building block, but at a more philosophical level, most of our language has a specific intent associated with it, either implicitly carried in the utterance (linguist speak for some act of language production, e.g. writing, speaking) itself or explicitly stated. To start building a chatbot, you need to settle on some intents and then decide what types of utterances people would use to express such an intent. For example, maybe we have an intent where someone wants information about online courses: ![example intent and utterances for a chatbot](/media/Screen-Shot-2017-12-11-at-11.47.10-AM.png) Once we decide on the broad stroke of an intent, we need to then add some sample utterances that might express that intent in various ways. This is where the AI takes over and then creates models based on your samples so that any similar phrases trigger the same intent. It's worth noting here that there is an ongoing process to refine these prototype utterances. People always interact with systems in unexpected ways, and conversation is perhaps more fraught with those ambiguities. AWS allows you to look at the actual utterances people have used with your bot and add them to intents if they made your bot go WTF!? the first time around.

### What do we need to know to help you fulfill intent?

From here we can start by talking about Types, or as Amazon Lex calls them, Slot Types. Slot types are the nouns or adjectives that we need to begin to fulfill the user's intent. For example, there are 100's of online courses at VCU offered each semester, so we need to get some additional information using some prompts meant to elicit specific information. ![menu items for slot types amazon lex](/media/Screen-Shot-2017-12-11-at-11.57.31-AM-1024x168.png) In my example, we need to know something about the course type, e.g. title, subject, discipline, and what level the student is studying at, e.g. undergraduate, graduate. Here we can mark certain slots as required and provide some prompts for the chatbot to use as it negotiates with the user to get this additional information. Here we have the option of letting Lex intuit the nouns or adjectives necessary for our slots, or we can specify values that the bot will accept, i.e. only allow large, medium, and small as possible values for a PizzaSize slot. Once all of the required slots are filled into the chatbot session, we can write some additional backend logic to fulfill the users intent.

## Give the People What they Want

For each intent you create for your chatbot, you can choose what it means to fulfill a request and how exactly that might fit into the flow of your other systems. For example, if each request will get the same response, we can write canned messages that get shown when certain intents are fulfilled. But we can also use the chatbot as an interface to a larger system that might get additional information, create an appointment, or order a pizza. For that reason, the conversational interface that chatbots represent will continue to grow in usefulness. For AWS Lex, this typically means using a Lambda function to connect to these other systems. While risking over-hype here, talking about chatbots and serverless code in the same blog post, this was something I got running in an hour or so:

```js
const AWS = require('aws-sdk')
const S3 = new AWS.S3({
    maxRetries: 0,
    region: 'us-east-1',
})

const getCourses = () => {
    return new Promise( (resolve, reject) => {
        S3.getObject({
            Bucket: 'your-bucket-here',
            Key: 'your-file.json'
        }, function (err, data){
            if (err !== null){
                reject(err)
            }
            resolve(JSON.parse(data.Body.toString('utf-8')))
        })
    })
}

const processRequest = (request, callback) => {

    const CourseType = request.currentIntent.slots.CourseType
    const StudentLevel = request.currentIntent.slots.StudentLevel


    getCourses().
    then( data => {
        let message
        let courses = data.data.filter(course => {
            return (course.subject_desc.toLowerCase().includes(CourseType))
        })

        if (!courses.length > 0){
            message = "Sorry, we couldn't find any courses in that discipline or at that level. Let me know if want me to look again for something else."
        } else {
            message = `We found ${courses.length} courses: \n
                ${courses.map(course => `${course.subject} ${course.course_number}-${course.section}: ${course.title}`).join('\n')}
            `
        }

        let response = {
            "dialogAction": {
                "type": "Close",
                "fulfillmentState": "Fulfilled",
                "message": {
                    "contentType": "PlainText",
                    "content": message
                }
            }
        }

        callback(null, response)


    }).catch(err => callback(err))

}
```

This is some example backend logic currently running on our chatbot. When a particular intent is ready to be fulfilled, the chatbot passes a message to this Lambda function written in JavaScript. The script analyzes the course information stored in the chat slots, pulls in a huge array of course data from a JSON file stored in S3, then looks for areas where the course data matches the user input. The Lambda function then creates a JSON response with a message to the user that it passes back off to the chatbot. While this is a pretty simple MVP for this concept, hopefully you can see that there really isn't a limit to the sophistication of the types of tasks we can complete using the conversational interface. At the same time, while the Natural Language Processing used by the chat bot is impressive to someone who's spent years studying syntax and semantics, bots are not some magical box that will make things happen on their own. All of the examples created by Amazon exhibit complex application logic that tells the chatbot how to respond based on user input. The chatbot does a good job of analyzing human utterances and saying "Hey, it sounds like they want to do X." However, even getting this right requires a lot of human intervention throughout the process. ![example conversation between myself and online course bot](/media/Screen-Shot-2017-12-11-at-1.29.40-PM.png) Hopefully, this post will be a helpful introduction for some folks interested in the latest chatbot craze, but at the same time I also hope that this will underscore the limits of the 'AI' products being touted at present. Creating even a moderately functional chatbot requires much more human involvement than anyone proclaiming wizardry will want to admit, so don't ignore the man behind the curtain.

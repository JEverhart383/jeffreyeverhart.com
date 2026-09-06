---
title: "Creating a traffic light with Raspberry Pi and Python"
date: 2016-08-27
excerpt: "There are endless projects you can make with Python, the Raspberry Pi, and just a few LEDs. One obvious and really fun project is a button operated traffic light. This post will build on an earlier pr"
heroImage: "/media/IMG_0307-1.jpg"
categories: ["Maker Ed", "Python", "Raspberry Pi"]
wpId: 1072
---

There are endless projects you can make with Python, the Raspberry Pi, and just a few LEDs. One obvious and really fun project is a button operated traffic light. This post will build on an earlier project about connecting [a button using a breadboard and the RPi.GPIO library](http://www.jeffreyeverhart.com/2016/08/21/using-cleanup-method-rpi-gpio-raspberry-pi-tutorial/), so if you have any questions about the initial setup of the electronics, check out that post. [![Raspberry Pi Traffic Light with Python](/media/IMG_0301-1.gif)](/media/IMG_0301-1.gif) In this post, I want to take a little bit more time to write out a good Python program to handle our traffic light. If you want to get the code, you can [check out the GitHub repo here](https://github.com/JEverhart383/raspberry-pi-gpio) or run this command in a terminal:

```shell
$ git clone https://github.com/JEverhart383/raspberry-pi-gpio.git
```

## Breadboard Settings

Here is the wiring configuration I used for the electronic components of the Pi traffic light project. [![python traffic light breadboard](http://ec2-34-198-113-124.compute-1.amazonaws.com/wp-content/uploads/2016/08/IMG_0307-1-1024x768.jpg)](http://ec2-34-198-113-124.compute-1.amazonaws.com/wp-content/uploads/2016/08/IMG_0307-1.jpg) GPIO 19 -> Button + -> Button - -> Ground GPIO 23 -> Resistor -> Red LED -> Ground GPIO 12 -> Resistor -> Yellow LED -> Ground GPIO 16 -> Resistor -> Green LED -> Ground The GPIO naming convention is not physical pins, so be sure to keep those naming conventions in mind when setting up your circuits.

## Writing Our Python Script

The Python code for this project will be using the same basic structure we looked at in [my post on using the cleanup method of the RPi.GPIO library](http://www.jeffreyeverhart.com/2016/08/21/using-cleanup-method-rpi-gpio-raspberry-pi-tutorial/). Up until now, we've been writing pretty spaghetti string code, but as our Raspberry Pi programs become more complex, we'll want to start writing lasagna or ravioli code instead.

### What is the difference between spaghetti code and ravioli code?

Spaghetti code is what it suggests, a big, tangled ball of different code statements put together to make a meal. Each line stands on its own and is responsible for doing something while there is little attempt at structuring the code into reusable components. Let's take a look at an example:

```python
if input_state == False:
      print('Button Pressed')
      time.sleep(0.2)
      GPIO.output(ledGreen, 1)
      time.sleep(1)
      GPIO.output(ledGreen, 0)
      GPIO.output(ledYellow, 1)
      time.sleep(1)
      GPIO.output(ledYellow, 0)
      GPIO.output(ledRed, 1)
    else: 
      GPIO.output(ledGreen, 0)
      GPIO.output(ledYellow, 0)
      GPIO.output(ledRed, 0)
```

First, let's look at the first piece of code I wrote to make the traffic light. For the most part, it worked the way that I wanted it to. However, if we look at the guts of the program that sets the GPIO output on the pins, it reeks of spaghetti code. For example, say I wanted to change from a one second delay between lights to two seconds, or half a second. Using this method, I'd have to update every instance of time.sleep() with the delay that I wanted. One of the ways you can combat spaghetti code is to organize your code into functions, which are reusable code blocks that can make your programs more flexible. Let's look at an example of how I organized this code into a function called lightTraffic():

```python
def lightTraffic(led1, led2, led3, delay ):
    GPIO.output(led1, 1)
    time.sleep(delay)
    GPIO.output(led1, 0)
    GPIO.output(led2, 1)
    time.sleep(delay)
    GPIO.output(led2, 0)
    GPIO.output(led3, 1)	
    time.sleep(delay)
    GPIO.output(led3, 0)

lightTraffic(ledGreen, ledYellow, ledRed, delay)
```

This function is one small step toward optimizing the code and its reusability. First, I define and name the function and then specify four parameters that I pass into the function: led1, led2, led3, delay. Later, when we call that function, we pass in the values we want the function to use to replace our parameter placeholders.

### Technical Aside: Explaining Function Parameters

It's good to think of a parameter as a placeholder for a value you specify later when calling the function. Within the function you can use that parameter as a placeholder. For example, I pass a parameter called delay into the lightTraffic() function. Inside of the function, anywhere I want to use that delay value, I simply put delay: time.sleep(delay). When I run the function and pass it actual values, in this case 1, the function replaces all instances of the delay parameter with the value of 1 that I passed in.

## Calling Our Function

Finally, now that we have all of our traffic light code organized into a function, we need to call or execute that function when the button is pressed. Check out the finished script here:

```python
import RPi.GPIO as GPIO
import time
  
try:
  def lightTraffic(led1, led2, led3, delay ):
    GPIO.output(led1, 1)
    time.sleep(delay)
    GPIO.output(led1, 0)
    GPIO.output(led2, 1)
    time.sleep(delay)
    GPIO.output(led2, 0)
    GPIO.output(led3, 1)	
    time.sleep(delay)
    GPIO.output(led3, 0)	
  GPIO.setmode(GPIO.BCM)
  button = 19
  GPIO.setup(button, GPIO.IN, pull_up_down=GPIO.PUD_UP)
  ledGreen = 16
  ledYellow = 12
  ledRed = 23
  GPIO.setup(ledGreen, GPIO.OUT)
  GPIO.setup(ledYellow, GPIO.OUT)
  GPIO.setup(ledRed, GPIO.OUT)
  while True:
    input_state = GPIO.input(button)
    if input_state == False:
      print('Button Pressed')
      lightTraffic(ledGreen, ledYellow, ledRed, 1)
    else: 
      GPIO.output(ledGreen, 0)
      GPIO.output(ledYellow, 0)
      GPIO.output(ledRed, 0)
except KeyboardInterrupt:
  print "You've exited the program"
finally:
  GPIO.cleanup()
```

Now, we are starting to reap the benefits of ravioli code. Our lightTraffic function is a nice self-contained piece of code, while our while loop that reacts to input is another ravioli. There are tons of other way I could have made this code more reusable, so if you have a cool idea or solid suggestion, leave a comment below.

---
title: "Using cleanup method RPi.GPIO | Raspberry Pi Tutorial"
date: 2016-08-21
excerpt: "# Getting Started with Raspberry Pi"
heroImage: "/media/IMG_0285-1.jpg"
categories: ["Maker Ed", "Python", "Raspberry Pi"]
wpId: 1057
---

# Getting Started with Raspberry Pi

After several months of deliberating, I finally gave in a bought a Raspberry Pi to start playing around with. Once I found out that it is a tiny Linux machine, I was sold. I opted to a pretty standard starter kit that I found for what I thought was a good price: [CanaKit Raspberry Pi 3 Kit](https://www.amazon.com/CanaKit-Raspberry-Complete-Starter-Kit/dp/B01C6Q2GSY/ref=pd_sim_147_2?ie=UTF8&psc=1&refRID=VN4F60DPZAJDJFG0VNDQ) This kit came with everything I needed to get started using the Linux OS on Raspberry Pi, but also came with a breadboard, some LEDs, and a few other electronic components. I've used Linux for other things, and have some experience with 3D printers, so I was eager to break into the hardware and start making physical stuff. What follows is a pretty barebones set up using the input/output pins on the Raspberry Pi to have some fun with LEDs, buttons, and Python code. [![Raspberry Pi LEDs](http://ec2-34-198-113-124.compute-1.amazonaws.com/wp-content/uploads/2016/08/IMG_0281-1-1024x768.jpg)](http://ec2-34-198-113-124.compute-1.amazonaws.com/wp-content/uploads/2016/08/IMG_0281-1.jpg)

### Setting Up the Breadboard

One of the reasons I decided to get a Pi was to learn some new things, and since I haven't had any real experience with circuits and wires since shop class, this was a challenging piece for me to get started. But once I dug in, I realized that there are plenty of docs, blogs posts and YouTube videos. I consulted the university of YouTube, and found a pretty [good video that walks you through the initial Pi set up](https://www.youtube.com/watch?v=OJn44OjGJ_w) of the breadboard, a simple circuit with an LED, and a Python program to light up the LED. The guy is a bit goofy at times, but he does a good job in five minutes. I ended up piecing together my own little Python program using the GPIO library, but I made some variations on what is shown in the video based on some other tutorials that I found. Here is my breadboard setup: [![Raspberry Pi Breadboard](http://ec2-34-198-113-124.compute-1.amazonaws.com/wp-content/uploads/2016/08/IMG_0285-1-1024x768.jpg)](http://ec2-34-198-113-124.compute-1.amazonaws.com/wp-content/uploads/2016/08/IMG_0285-1.jpg) For those of you not familiar with breadboards and the pin system of the Pi, let me give you a quick diagram of what's going on: Pin 17 -> Resistor -> LED -> Ground Pin 20 -> Resistor -> LED -> Ground Pin 19 -> Button positive leg -> Button negative leg -> Ground I'm sure there is a more technical way to map this stuff out, but that is on my list of things to learn as I start building more projects. If you have any questions or suggestions of better wiring techniques, post them in the comments or look for a YouTube tutorial with someone more knowledgeable than I am.

#### Quick Electronics Aside

At first I was worried about where to put the resistors, but since we're creating a circuit, it seems [like they can be on either side of the LED, as long as they are there](http://electronics.stackexchange.com/questions/13746/why-does-a-resistor-need-to-be-on-the-anode-of-an-led). Also, remember that everything needs be grounded somehow. That, at least, I recall from shop class.

### Lighting Up LEDs with a Python Program

Once I moved from wiring up the electronics to writing the software the trigger the LEDs, I started to feel more comfortable. Python is familiar to me, as is the Linux system running on the Pi, so this was my time to shine (excuse the cheesy LED humor)! I started a GitHub repo for all of the Python code I'm going to write for the Pi, so take a look at that if you want: [https://github.com/JEverhart383/raspberry-pi-gpio](https://github.com/JEverhart383/raspberry-pi-gpio) I'll include the code in full below and talk through a few important pieces of it, including my most important takeaway: error handling and cleaning up the I/O pins after we're done.

```python
#import all of the libraries here 
import RPi.GPIO as GPIO
import time

#wrap our code in a try block for error handling
try:

  #set mode for GPIO
  GPIO.setmode(GPIO.BCM)
  #create variable for button
  button = 19
  #setup button as input
  GPIO.setup(button, GPIO.IN, pull_up_down=GPIO.PUD_UP)
  #create variables for LEDs and set them to out
  led = 17
  led2 = 23
  GPIO.setup(led, GPIO.OUT)
  GPIO.setup(led2, GPIO.OUT)
  #create a loop that checks for button input
  while True:
    input_state = GPIO.input(button)
    #if button pressed, light up timed LEDs
    if input_state == False:
      print('Button Pressed')
      time.sleep(0.2)
      GPIO.output(led, 1)
      time.sleep(0.5)
      GPIO.output(led2, 1)
    else: 
      GPIO.output(led, 0)
      GPIO.output(led2, 0)
#execute this code if CTRL + C is used to kill python script
except KeyboardInterrupt:
  print "You've exited the program"
#execute code inside this block as the program exits
finally:
  GPIO.cleanup()
```

Ok, so nothing crazy going on here programming wise. Since this is more a documentation of setting up the whole LED project and not a coding tutorial, I won't go into too much detail here, as the code is commented up pretty well.

#### Quick Code Aside

First, I import the RPi.GPIO library, which lets me interact with the pins on the board, and also include the time library, which helps me time out something later as we trigger LEDs. There are just a few things I'll point out here. First, when I setup the GPIO program, I call `GPIO.setmode(BCM)` which let's me choose the method I use to reference pins. BCM stands for the Broadcom naming conventions, so pin 17 in BCM is actually pin 11 on the physical board. I'm not sure why I picked this naming convention, but it works, so why mess with success. After that, I setup the various pins and their components (LEDs, button) to either input or output pins. Then, inside of a while loop we continually check the state of the button input, and if it is false, we trigger some timing functions, print something to the screen, and then turn on the LEDs in sequence. Here is another pretty [good tutorial on using buttons and switches with the Pi](https://www.cl.cam.ac.uk/projects/raspberrypi/tutorials/robot/buttons_and_switches/).

### Cleaning Up Our Program

After the first times I ran this program in the terminal, I started to get an error message each time I turned it on, something along these lines: `RuntimeWarning: This channel is already in use, continuing anyway. Use GPIO.setwarnings(False) to disable warnings.` After a bit of Googling, it appears that this message gets thrown when you try to set a pin to an input or output when it has already been set before and the Pi remembers this assignment. For what I was doing, since I was just running the same program with the same pin assignments over and over, this wasn't a big deal, but had I changed a pin from input to output without cleaning up, it has the potential to fry that pin or the whole board. Looking through the docs for RPi.GPIO, I found a method called GPIO.cleanup() and another [great blog post with a pretty good error handling pattern](http://raspi.tv/2013/rpi-gpio-basics-3-how-to-exit-gpio-programs-cleanly-avoid-warnings-and-protect-your-pi) that I decided to employ. Error handling is an important part of developing software of all kinds, but has pretty significant implications when a error on the Pi could short out some physical hardware if not handled appropriately.

#### Quick Code Aside

I do want to take just a second and talk about the pattern I used, the [try/except/finally block in Python](https://docs.python.org/2.5/whatsnew/pep-341.html). Check out the annotated code below for what's going on:

```python
try: 
     #execute code in here first 
     #if an exception is raised, continue to check except blocks
except ExceptionType:
     #if the exception is of this type
     #execute this code and continue to finally block
finally: 
     #no matter what has happened previously, 
     #or whether an exception was thrown
     #execute this code as the program ends
```

If you look at the example code above, the finally in this case is calling the cleanup method on the GPIO object to make sure all of the pins are reset every time you end a Python script. Not only does it make your code better to have some type of error checking implemented, it could also save you a pin or some boards down the line. I'll be posting more frequently on the Raspberry Pi, future projects, and maybe even some Python coding tutorials as I gain more experience with the libraries.

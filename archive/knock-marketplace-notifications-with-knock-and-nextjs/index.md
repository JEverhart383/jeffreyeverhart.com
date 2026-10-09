# Marketplace notifications with Knock and Next.js

Source: https://knock.app/blog/marketplace-notifications-with-knock-and-nextjs
Author: Jeff Everhart (Developer Advocate)
Published: 2025-02-18
Captured: 2026-09-13

---

A guide to creating marketplace notifications patterns in Knock.

---

If you've ever bought something online, you likely know the feeling of being ghosted by a seller or getting all the way through checkout only to find out that there is no inventory left.

This is a common challenge in two-sided marketplaces, which face even more hurdles compared to traditional e-commerce sites. Building these kinds of marketplaces requires making sure buyers and sellers who don't know each other can communicate effectively, and that transactions run smoothly. Notifications play a crucial role in building this trust, and in this post, we'll look at how to create common notification patterns used in marketplaces with Knock and Next.js.

## Video walkthrough

If you prefer to learn with video, watch it here.

<iframe
  style={{ aspectRatio: "16/9", width: "100%" }}
  src="https://www.youtube.com/embed/6h_mIWgjJFU?si=NFBRASFBNtbjRjH_"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>

## Building a global marketplace app

Two-sided marketplaces bridge the gap between buyers and sellers. As the creator, your goal is to streamline buyer/seller interactions and build trust between both parties. We'll explore how you can achieve this by integrating Knock with a sample app called Globe Wander, built on Next.js. In this app, tour operators can list their tours while adventurers can book them.

<ImageModal
  src="/assets/blog/marketplace-notifications-with-knock-and-nextjs/globe-wander-homepage.png"
  alt="A screenshot of the example app homepage."
>
  <img
    src="/assets/blog/marketplace-notifications-with-knock-and-nextjs/globe-wander-homepage.png"
    alt="A screenshot of the example app homepage."
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

Before diving into notification setups, let's get acquainted with the app. Globe Wander facilitates a travel marketplace connecting tour operators with adventerous travelers. Users in the app can be one of two types: travelers or operators. Each tour comes with details such as a name, difficulty level, and climate. Scheduled tour dates and existing bookings help compelete the data model.

You can clone the [demo on GitHub](https://github.com/knocklabs/marketplace-example) and follow the instructions in the README to start the app.

#### Key entities in Globe Wander:

- **Users**: Can be travelers or operators.
- **Tours**: Information includes name, difficulty, climate.
- **Tour Dates**: Start dates and available seats.
- **Tour Bookings**: Link users to specific tour dates.

### Setting up notifications with Knock

Let's take a look at a basic notification. First, when a user signs up, we trigger the `new-user-signup` workflow in Knock.

```javascript

export async function createUser(data: SignupData) {
  try {
    // 1. Validate form data
    const validatedFields = UserSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.errors[0].message,
      };
    }

    const { name, email, password } = validatedFields.data;

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // 3. Hash the password
    const hashedPassword = await hash(password, 10);

    // 4. Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "TRAVELER",
      },
    });

    // 5. Sign in the user
    const signInResult = await signIn("credentials", {
      email,
      password, // Use unhashed password for sign in
      redirect: false,
    });

    await knock.workflows.trigger("new-user-signup", {
      recipients: [
        {
          id: user.id,
          name: user.name as string,
          email: user.email as string,
          role: user.role as string,
        },
      ],
    });

    if (signInResult?.error) {
      return { error: "Failed to sign in after creation" };
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user" };
  }
  redirect("/dashboard");
}
```

This sends a welcome message via both email and an in-app notification.

<ImageModal
  src="/assets/blog/marketplace-notifications-with-knock-and-nextjs/new-user-signup-workflow.png"
  alt="A workflow diagram showing new user signup communications."
>
  <img
    src="/assets/blog/marketplace-notifications-with-knock-and-nextjs/new-user-signup-workflow.png"
    alt="A workflow diagram showing new user signup communications."
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

### Exploring the booking Flow

Managing communication for both buyers and sellers is essential. Roles in a transaction vary, so notifications should be tailored per role. When we create a new booking in the database, we'll trigger the `tour-booked` workflow with both the traveler and the operator as recipients. We can pass in our `booking` details as a data payload and also include a cancellation key so that if we need to cancel any remaining workflow steps later, we can do so.

```javascript
export async function createNewBooking(formData: FormData) {
  const tourId = formData.get("tourId") as string;
  const dateId = formData.get("dateId") as string;
  const seats = Number(formData.get("seats"));

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const booking = await prisma.tourBooking.create({
    data: {
      tourId,
      tourDateId: dateId,
      bookedSeats: seats,
      userId: session.user.id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
      tour: true,
      tourDate: true,
    },
  });
  console.log(booking);
  //trigger 'tour-booked' workflow
  await knock.workflows.trigger("tour-booked", {
    recipients: [booking.userId, booking.tour.operatorId],
    data: {
      ...booking,
    },
    cancellationKey: booking.id,
  });

  redirect(`/booking-confirmation?bookingId=${booking.id}`);
}
```

In the workflow, we send travelers an immediate in-app and email confirmation, and then use a relative delay to schedule a reminder for 24 hours before their tour starts.

For operators, instead of sending an immediate message, we open up a batch to collect all booking notifications related to this tour date over two hours. Then we send one message containing all of the booking details collected in the batch step. This way, operators can see all bookings at once and not be overwhelmed by individual notifications.

<ImageModal
  src="/assets/blog/marketplace-notifications-with-knock-and-nextjs/tour-booked-workflow.png"
  alt="A workflow diagram showing how to notify travelers and operators when a tour is booked."
>
  <img
    src="/assets/blog/marketplace-notifications-with-knock-and-nextjs/tour-booked-workflow.png"
    alt="A workflow diagram showing how to notify travelers and operators when a tour is booked."
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

### Inventory updates done right

Inventory updates are an important part of marketplaces. They help sellers market their goods or services when there's available inventory, and they make it so that buyers don't need to constantly check back to see if there's an item available for purchase.

For example, when a traveler finds a tour they like but the dates don't work for them, they can subscribe to the tour using Knock's object and subscription features:

```javascript
export async function createNewSubscription(tourId: string, userId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Must be logged in");
  }

  // Create a subscription in Knock for the user to the tour
  await knock.objects.addSubscriptions("tours", tourId, {
    recipients: [userId],
    properties: {}, // Optional custom properties
  });

  revalidatePath(`/tours/${tourId}`);
}
```

When a tour operator adds new tour dates, we can then trigger a workflow with the tour object as a recipient, and Knock will automatically fan out to all of its subscribers. This feature is especially helpful if you have a high volume of objects or subscriptions because you don't have to spend the time to create your own pub/sub system.

```javascript
export async function createNewTourDate(data: CreateTourDateInput) {
  try {
    const tourDate = await prisma.tourDate.create({
      data: {
        tourId: data.tourId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        price: data.price,
        availableSeats: data.availableSeats,
      },
    });

    await knock.workflows.trigger("tour-dates-added", {
      recipients: [{ id: data.tourId, collection: "tours" }],
      data: {
        tourId: data.tourId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: tourDate };
  } catch (error) {
    console.error("Failed to create tour date:", error);
    return { success: false, error: "Failed to create tour date" };
  }
}
```

When we trigger the `tour-dates-added` workflow, subscribers to the tour will get an in-app notification and an email without us having to identify each recipient individually.

<ImageModal
  src="/assets/blog/marketplace-notifications-with-knock-and-nextjs/tour-dates-added-workflow.png"
  alt="A workflow diagram showing how to notify subscribers when new tour dates are added."
>
  <img
    src="/assets/blog/marketplace-notifications-with-knock-and-nextjs/tour-dates-added-workflow.png"
    alt="A workflow diagram showing how to notify subscribers when new tour dates are added."
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

### Recurring Notifications for Consistent Engagement

Growing marketplaces need to keep users engaged, especially if they haven't yet found a balance between supply and demand. A weekly digest can help share new tours or experiences a user might enjoy. But developing a weekly digest typically means creating a system to schedule cron jobs for your user base.

In our application, we can create a `Get Weekly Updates` button that adds a scheduled workflow to a user. Using the `repeats` property, we can pass an object that communicates how frequently this scheduled workflow should execute.

```javascript
export async function scheduleWeeklyUpdates(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await knock.workflows.createSchedules("weekly-tour-updates", {
      recipients: [session?.user?.id],
      repeats: [
        {
          frequency: RepeatFrequency.Weekly,
          days: [DaysOfWeek.Fri],
          hours: 17,
          minutes: 30,
        },
      ],
    });
  } catch (error) {
    console.error("Failed to schedule weekly update:", error);
    throw error;
  }
}
```

Then inside the workflow, we can use a fetch step to query an API in your system so that we can populate this weekly digest email with personalized recommendations for the user.

<ImageModal
  src="/assets/blog/marketplace-notifications-with-knock-and-nextjs/weekly-tour-updates-workflow.png"
  alt="A workflow diagram showing how to send weekly tour updates to users."
>
  <img
    src="/assets/blog/marketplace-notifications-with-knock-and-nextjs/weekly-tour-updates-workflow.png"
    alt="A workflow diagram showing how to send weekly tour updates to users."
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

### Conclusion

Creating a healthy two-sided marketplace involves creating trust between buyers and sellers. By coordinating communication and minimizing friction through effective notifications, you help keep users engaged. Knock simplifies these notification patterns with features like workflow branching, batching notifications, scheduled workflows, and subscription models. If you're ready to dive deep into this setup, clone the code repository linked in the examples and start experimenting!

Check out the [demo on GitHub](https://github.com/knocklabs/marketplace-example) for a firsthand experience of building notifications in two-sided marketplaces.

Feel free to reach out with any questions. Happy coding!

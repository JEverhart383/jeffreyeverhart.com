# How to localize and translate your notifications

Source: https://knock.app/blog/how-to-localize-and-translate-your-notifications
Author: Jeff Everhart (Developer Advocate)
Published: 2025-01-22
Captured: 2026-09-13

---

An in-depth guide that covers several popular localization and translation libraries and how to use them with Knock's translation management features

---

Clear communication across languages and cultures is no longer optional for modern software. Whether you're building a global marketplace, a collaboration tool, or a monitoring platform, supporting multiple languages and adapting content to different cultures is essential for reaching global users.

Notifications in particular are critical because they guide users through your application's most important workflows. If users can't understand these touchpoints, they might miss urgent alerts, drop out of key flows, or lose trust in your platform.

This dynamic is clear in the context of global marketplaces, where clear communication directly impacts business outcomes. When a buyer in Tokyo needs to coordinate with a seller in Milan about a vintage furniture piece, notifications help build the confidence needed to complete the transaction. But the same principles apply across all types of applications, from project management tools connecting distributed teams to financial platforms handling international transactions.

Consider these two notification scenarios:

For a marketplace, the notification for a new inquiry on a listing,
`New inquiry for your listing - Authentic 1960s Zanotta chair`
needs to become
`出品商品への新規お問い合わせ - 1960 年代本物の Zanotta チェア`.

For a project management tool, a mention notification,
`@sarah has requested your review on the Q4 roadmap`
should display as
`@sarah ha richiesto la tua revisione della roadmap Q4`.

The ability to deliver these messages in a user's preferred language isn't just about translation. It's about ensuring your application can scale to users worldwide without friction. Whether your app is about facilitating commerce, enabling collaboration, or alerting teams to critical issues, users being able to read your notifications is critical for your product's growth.

Fortunately, implementing robust translation and localization for your notifications is achievable with modern tools and libraries. In this article, we'll explore how to use JavaScript libraries to handle text, dates, currencies, and other locale-specific content to ensure your notifications serve every user effectively, regardless of their location or language.

## Localization vs internationalization

Localization and internationalization are terms often used interchangeably but are different concepts.

Both are phases of a more extensive process called Language Localization. Language Localization refers to adapting a product, service, or content to meet a specific market or audience's linguistic, cultural, and functional requirements. _Localization_ aims to make a product or content feel native to users in a particular region, ensuring it resonates with their language, culture, and preferences. This process involves two phases, internationalization (i18n) and localization (l10n):

- Internationalization (i18n) is designing and developing a product, application, or document content that enables easy localization for target audiences that vary in culture, region, or language. It means a tool, framework, or setup that allows easy translation of our app's content and seamless switching between locales.
- Localization (l10n) adapts an internationalized product to a specific market or audience. This includes translating the text into the local language, adjusting the format of dates, times, and currencies, and modifying content to align with local customs, regulations, and cultural sensitivities. Localization ensures the product speaks the user's language and feels culturally relevant and connected to their everyday experiences, making it genuinely resonate within each market.

Here, we’re concentrating primarily on libraries that help translate language, often the most common need in notifications. Still, developers need to understand how their applications and notifications work within the broader cultural context of a different country and user base.

## i18n libraries

There are a ton of JavaScript i18n libraries. When choosing the right one for your project, you should consider many factors:

- **Framework support or integration (React, Vue, Angular, etc.)**: If the library supports the framework your project is using, using the library will be simple and straightforward.
- **Documentation quality**: Good documentation is essential for troubleshooting, configuration capabilities, integration with other services, etc.
- **Updates**: Knowing how often a library gets updated or if it still receives updates is relevant. A lack of updates could lead to security or compatibility issues. If too much time passes without updates, it may get deprecated and need to be replaced with another library.
- **Features**: One of the most important factors to consider is the features. Does the library have all the features you need for your project and the features you plan to implement in the future? If not, there may be better choices.
- **Learning curve**: How hard is it to learn or use the library? If the learning curve is steep, it means that the library is complex to install or use or has too many features that are difficult to use.
- **Community support**: If the community supports a library or tool, it makes several tasks easier.

Let’s go through a few. All these are open source so that you can use them easily in your applications without associated costs.

### i18next

<ImageModal
  src="/assets/blog/how-to-localize-and-translate-your-notifications/i18next.png"
  alt="i18Next logo"
>
  <img
    src="/assets/blog/how-to-localize-and-translate-your-notifications/i18next.png"
    alt="i18Next logo"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

[i18next](https://www.i18next.com/) is an open-source internationalization framework for JavaScript designed to simplify translating web applications into multiple languages. Developed by Jan Mühlemann, the library has gained widespread adoption due to its flexibility, ease of use, and robust feature set.

#### Features

- **Wide adoption**: Popular and widely adopted in the industry.
- **Modular architecture**: Modular and pluggable, allowing developers to extend functionality.
- **Framework-agnostic**: Supports various frameworks, including React, Angular, and Vue.

#### Pros

- **Industry acceptance**: Proven reliability and acceptance in diverse projects.
- **Modular structure**: Flexibility in choosing and configuring features.
- **Multi-framework support**: Suitable for projects across different frameworks.

#### Cons

- **Configuration complexity**: Extensive configuration may be overwhelming for more straightforward projects.
- **Documentation challenges**: Comprehensive but may require improvement for accessibility.

#### Usage

i18next can be added to your project using npm or yarn:

```bash
npm install i18next --save

yarn add i18next
```

To showcase i18next's capability to dynamically switch languages and highlight its ease of use in real-world applications, we'll also add the i18next-browser-languagedetector plugin, which automatically detects the user's language settings from the browser:

```bash
npm install i18next-browser-languagedetector --save
```

We would initialize this plugin in our code and add the languages we want to support (here, English and Spanish) to the resources. This demonstrates how i18next can serve a global user base by supporting multiple languages seamlessly:

```javascript
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18next.use(LanguageDetector).init({
  // Removed lng: 'en', as the LanguageDetector will automatically set this
  debug: true,
  fallbackLng: "en", // Fallback language if detection fails
  resources: {
    en: {
      translation: {
        key: "hello world",
        greeting: "Welcome, user!",
      },
    },
    es: {
      translation: {
        key: "hola mundo",
        greeting: "¡Bienvenido, usuario!",
      },
    },
  },
});

document.getElementById("output").innerHTML = i18next.t("greeting");
```

Whenever you want a new language, you add it to resources. The same goes for new key-value pairs. For each one you support in the initial language, you can create a key-value pair for the translation. The `LanguageDetector` plugin enables the application to detect and apply the user's preferred language automatically.

i18next's flexibility and modular architecture mean developers can create more inclusive and user-friendly applications that cater to a global audience.

### React Intl/FormatJS

<ImageModal
  src="/assets/blog/how-to-localize-and-translate-your-notifications/formatjs.png"
  alt="formatJS logo"
>
  <img
    src="/assets/blog/how-to-localize-and-translate-your-notifications/formatjs.png"
    alt="formatJS logo"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

[React Intl](https://formatjs.io/docs/getting-started/installation/) stands as a powerhouse in internationalization and localization for React applications. React Intl simplifies adapting your React applications for a global audience, providing a seamless experience across languages and regions. React Intl is built on top of the FormatJS set of libraries, which provide functionality to non-React clients.

#### Features

- **React integration**: Tailored for React applications, offering seamless integration.
- **Formatting options**: Extensive options for formatting dates, numbers, and strings.
- **Community support**: Maintained by Airbnb, benefiting from an active community.

#### Pros

- **Efficient React support**: Optimized for React projects, providing efficient i18n capabilities.
- **Comprehensive formatting**: Precise locale-specific formatting for accurate localization.
- **Active community**: A sizable and engaged community ensures ongoing support.

#### Cons

- **React dependency**: Tightly bound to React, limiting its applicability to non-React projects.
- **Learning curve**: A steeper learning curve exists for beginners, especially those unfamiliar with React.

#### Usage

It can be installed using npm or yarn:

```bash
npm i -S react react-intl

yarn add react react-intl
```

Let’s create an example that includes support for multiple locales. We’ll have French and English translations and demonstrate how to switch between French and English based on user preference or a runtime condition:

```javascript
import * as React from "react";
import {
  IntlProvider,
  FormattedMessage,
  FormattedNumber,
  FormattedPlural,
} from "react-intl";

// Translated messages in French and English
const messages = {
  fr: {
    myMessage: "Aujourd'hui, nous sommes le {ts, date, ::yyyyMMdd}",
    photo: "{numPhotos, plural, one {# photo} other {# photos}}",
  },
  en: {
    myMessage: "Today is {ts, date, ::yyyyMMdd}",
    photo: "{numPhotos, plural, one {# photo} other {# photos}}",
  },
};

const locale = "en"; // Assume dynamic setting based on user preference

export default function App() {
  return (
    <IntlProvider
      messages={messages[locale]}
      locale={locale}
      defaultLocale="en"
    >
      <p>
        <FormattedMessage
          id="myMessage"
          defaultMessage="Today is {ts, date, ::yyyyMMdd}"
          values={{ ts: Date.now() }}
        />
        <br />
        <FormattedNumber
          value={19}
          style="currency"
          currency={locale === "fr" ? "EUR" : "USD"}
        />
        <br />
        <FormattedMessage id="photo" values={{ numPhotos: 1 }} />
      </p>
    </IntlProvider>
  );
}
```

Here, we have:

- **Multiple locales support (French and English)**: React Intl can dynamically switch between locales, showcasing its ability to localize content based on user preferences or application settings.
- **Pluralization**: Using FormattedPlural (via FormattedMessage for simplicity) to handle plural forms based on the number of items is crucial for accurate localization across languages with different rules for pluralization.
- **Currency formatting**: The FormattedNumber component formats numbers as currency, adjusting the currency type based on the locale (EUR for French and USD for English).

React Intl's comprehensive formatting capabilities and ease of integration into React applications for handling internationalization and localization make it a powerful tool for developers targeting a global audience with React-based projects.

### Polyglot.js

<ImageModal
  src="/assets/blog/how-to-localize-and-translate-your-notifications/polyglotjs.png"
  alt="polyglotjs logo"
>
  <img
    src="/assets/blog/how-to-localize-and-translate-your-notifications/polyglotjs.png"
    alt="polyglotjs logo"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

[Polyglot.js](https://airbnb.io/polyglot.js/) is a lightweight i18n library that empowers developers to integrate multilingual support into their web applications. It provides a straightforward approach to managing translations, pluralization, and other language-specific features while maintaining a minimal footprint.

#### Features

- **Simple API**: Polyglot.js provides a straightforward API for managing translations, making it accessible to beginners and experienced developers.
- **Pluralization support**: The library supports pluralization rules, allowing developers to handle variations in language constructs based on numerical values.
- **Variable substitution**: Polyglot.js facilitates variable substitution within translated strings, enhancing flexibility in content generation.
- **Compact size**: With a small file size, Polyglot.js is efficient and doesn't add unnecessary bulk to your project.
- **Versatile usage**: It can be used both on the client-side and server-side, providing flexibility in various web development environments.

#### Pros

- **Lightweight**: Polyglot.js is designed to be lightweight, making it an ideal choice for projects where minimizing resource impact is crucial.
- **Ease of use**: The library's simplicity ensures a smooth learning curve for developers, simplifying integrating internationalization features.
- **Customization**: Developers have the flexibility to customize pluralization rules and language constructs according to specific project requirements.
- **Active community**: Despite its compact size, Polyglot.js has an active community that contributes to ongoing development and support.

#### Cons

- **Limited ecosystem**: Polyglot.js, while effective, may not offer the extensive ecosystem of plugins and integrations found in larger i18n frameworks.
- **Less feature-rich**: Compared to some comprehensive i18n solutions, Polyglot.js may lack certain advanced features, which could be a consideration for complex projects.

#### Usage

```bash
npm install node-polyglot
```

Let's illustrate how Polyglot.js can handle pluralization and variable substitution to demonstrate the library's flexibility and practical application.

First, we'll create a greeting message that includes variable substitution for a user's name and pluralization to handle different numbers of unread messages:

```javascript
var Polyglot = require("node-polyglot");

var polyglot = new Polyglot({ locale: "en" });

polyglot.extend({
  greeting: "Hello, %{name}!",
  unread_messages:
    "You have %{count} unread message |||| You have %{count} unread messages",
});

console.log(polyglot.t("greeting", { name: "Alice" }));
// => "Hello, Alice!"

console.log(polyglot.t("unread_messages", { count: 1 }));
// => "You have 1 unread message"

console.log(polyglot.t("unread_messages", { count: 5 }));
// => "You have 5 unread messages"
```

The greeting message demonstrates how variables (in this case, `%{name}`) can be dynamically replaced within the translated string, allowing for personalized content. The example also uses Polyglot.js's pluralization feature to correctly handle singular and plural forms of the word "message" based on the count variable. Polyglot.js uses `||||` as a delimiter to separate singular and plural forms, making providing accurate translations for different quantities straightforward.

Polyglot.js has a straightforward and efficient approach to internationalization, making it an excellent choice for projects of various sizes looking to support multiple languages without compromising on performance or ease of development.

### LinguiJS

<ImageModal
  src="/assets/blog/how-to-localize-and-translate-your-notifications/lingui.png"
  alt="lingui logo"
>
  <img
    src="/assets/blog/how-to-localize-and-translate-your-notifications/lingui.png"
    alt="lingui logo"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

[LinguiJS](https://github.com/lingui/js-lingui) is an open-source JavaScript library designed for web application internationalization (i18n) and localization (l10n). It provides developers with robust tools to create applications that cater to users worldwide, regardless of language or regional preferences.

#### Features

- **Minimal bundle size**: Emphasizes minimal impact on bundle size.
- **Pluralization support**: Strong support for pluralization in various languages.
- **Vue compatibility**: Good support for Vue.js in addition to React.

#### Pros

- **Efficient performance**: Suitable for performance-conscious projects.
- **Pluralization excellence**: Robust support for pluralization is crucial in multilingual applications.
- **Vue integration**: Compatible with Vue.js, showcasing versatility.

#### Cons

- **Lower popularity**: Smaller community compared to more established libraries.
- **Documentation gaps**: Some users report gaps in documentation, requiring additional effort.

#### Usage

It can be done using npm or yarn:

```bash
npm install --save-dev @lingui/cli @lingui/macro
npm install --save @lingui/react

yarn add --dev @lingui/cli @lingui/macro
yarn add @lingui/react
```

Let’s configure LinguiJS for multiple languages, demonstrating pluralization, and illustrating how to dynamically switch languages in a React application. First, we'll support both English and Spanish languages, including pluralization and dynamic language switching:

```javascript
// Installation steps remain the same as provided

// Configuring LinguiJS for multiple languages
import React, { useState } from "react";
import { render } from "react-dom";
import { i18n } from "@lingui/core";
import { I18nProvider, Trans } from "@lingui/react";
import { enMessages, esMessages } from "./locales"; // Assume these are imported correctly

// Initialize LinguiJS with English and Spanish messages
i18n.load("en", enMessages);
i18n.load("es", esMessages);
i18n.activate("en"); // Default to English

const App = () => {
  const [locale, setLocale] = useState("en");

  const switchLanguage = (language) => {
    i18n.activate(language);
    setLocale(language);
  };

  return (
    <I18nProvider i18n={i18n}>
      <div>
        <button onClick={() => switchLanguage("en")}>English</button>
        <button onClick={() => switchLanguage("es")}>Español</button>
        <p>
          <Trans>Hello {name}</Trans>
          {/* Example of pluralization */}
          <Trans
            id="unreadMessages"
            values={{ count: 1 }}
            plural={{ one: "# unread message", other: "# unread messages" }}
          />
        </p>
      </div>
    </I18nProvider>
  );
};

render(<App />, document.getElementById("root"));
```

This shows how LinguiJS can be used in a React application to support internationalization across multiple languages. It includes:

- **Dynamic language switching**: By using a state hook (`useState`) to keep track of the current locale and a function (`switchLanguage`) to change it, users can dynamically switch between English and Spanish within the application.
- **Pluralization**: The example also demonstrates pluralization, a key feature of LinguiJS, by handling different plural forms for a message based on the number of unread messages. This showcases LinguiJS's ability to handle complex language-specific rules.
- **I18nProvider and trans**: The `I18nProvider` component wraps the application's component tree to provide the current i18n context, while the `Trans` component is used for translating text, including variable substitutions and handling plural forms.

### jQuery.i18n

<ImageModal
  src="/assets/blog/how-to-localize-and-translate-your-notifications/jquery.i18n.png"
  alt="jQuery i18n logo"
>
  <img
    src="/assets/blog/how-to-localize-and-translate-your-notifications/jquery.i18n.png"
    alt="jQuery i18n logo"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

[jQuery.i18n](https://github.com/wikimedia/jquery.i18n) is an extension to the jQuery library, specifically designed to simplify the internationalization process within web projects. Leveraging jQuery.i18n allows developers to easily manage translations and handle language-specific content, making their applications accessible to a global audience.

#### Features

- **Lightweight integration**: Being an extension of jQuery, jQuery.i18n seamlessly integrates with existing jQuery-based projects, requiring minimal adjustments.
- **Pluralization support**: jQuery.i18n provides built-in support for pluralization, a critical feature when adapting content based on numerical values.
- **Dynamic content loading**: Translations can be loaded dynamically, enabling developers to fetch language resources as needed, reducing initial load times.
- **Variable substitution**: Like other i18n libraries, jQuery.i18n allows for variable substitution within translated strings, enhancing flexibility in content generation.

#### Pros

- **jQuery integration**: Ideal for projects already utilizing jQuery, as it extends the library's capabilities for internationalization.
- **Community support**: Benefiting from jQuery's widespread use, jQuery.i18n enjoys community support and potential contributions from the broader jQuery ecosystem.
- **Simplified implementation**: Developers familiar with jQuery can quickly adapt to jQuery.i18n, as it leverages the familiar syntax and conventions of jQuery.
- **Pluralization handling**: The built-in pluralization support simplifies the process of adapting content based on numeric values, a common requirement in multilingual applications

#### Cons

- **jQuery dependency**: The reliance on jQuery might be a limitation for projects that do not use or intend to use jQuery in their stack.
- **Limited ecosystem**: While suitable for jQuery-based projects, jQuery.i18n may lack the extensive ecosystem of plugins and integrations found in standalone i18n libraries.

#### Usage

```bash
git clone https://github.com/wikimedia/jquery.i18n.git
cd jquery.i18n
git submodule update --init
npm install
```

Let's consider a scenario where a web application needs to support multiple languages and dynamically switch between them based on user interaction or preferences.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>jQuery.i18n Example</title>
    <script src="<https://code.jquery.com/jquery-3.6.0.min.js>"></script>
    <!-- Assuming jQuery.i18n has been installed and set up as shown in the instructions -->
    <script src="path/to/jquery.i18n/src/jquery.i18n.js"></script>
    <script src="path/to/jquery.i18n/src/jquery.i18n.messagestore.js"></script>
  </head>
  <body>
    <script>
      $(document).ready(function () {
        $.i18n()
          .load({
            en: "locales/en.json",
            es: "locales/es.json",
          })
          .done(function () {
            $.i18n().locale = "en"; // Default language
            updateTranslations();
          });

        function updateTranslations() {
          $("body").i18n();
        }

        // Switching languages
        $("#switch-lang").on("click", function () {
          var newLocale = $(this).data("locale");
          $.i18n().locale = newLocale;
          updateTranslations();
        });
      });
    </script>

    <button id="switch-lang" data-locale="es">Switch to Spanish</button>

    <!-- Example content -->
    <p data-i18n="greeting">This is a default greeting message.</p>
  </body>
</html>
```

Here, we demonstrate how to load translation files dynamically for English (`en`) and Spanish (`es`) using the `$.i18n().load()` method. This allows for fetching translations as needed, optimizing resource loading.

The `updateTranslations()` function utilizes jQuery's `.i18n()` method to apply the current locale's translations throughout the document, showcasing how translations can be dynamically updated in response to changes. A button is used to demonstrate dynamic language switching. Clicking the button changes the application's current locale and updates the page content to reflect the translations for the new language, illustrating a practical use case for multi-language support.

By leveraging jQuery's ecosystem, jQuery.i18n provides a straightforward and effective solution for developers looking to internationalize their jQuery-based projects.

## Localizing Knock notifications

While all of these libraries are amazing solutions that help app developers localize and internationalize their user interfaces and notifications sent from their codebase, there are still drawbacks to tightly coupling notifications to code: product managers, marketers, and support staff can’t access them.

<ImageModal
  src="/assets/blog/customers-bounce/translations.png"
  alt="Knock"
>
  <img
    src="/assets/blog/customers-bounce/translations.png"
    alt="Knock"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>
<figcaption>Knock's translations management dashboard</figcaption>

For this reason Knock has built-in [translation management](https://docs.knock.app/concepts/translations), allowing you to translate and pluralize any message in your notifications in a single platform. In many cases, developers can upload the translation files they already use to provide translatable strings for whoever needs to create and edit notifications.

<ImageModal
  src="/assets/blog/customers-discogs/translations.png"
  alt="Translation templates in Knock"
>
  <img
    src="/assets/blog/customers-discogs/translations.png"
    alt="Translation templates in Knock"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>
<figcaption>Translation templates in Knock</figcaption>

Let’s assume we have a notification that uses the messages “OrderReady” and "OrderDelayed," and we want to enable them for two locales, en and fr.

```javascript
{
  "OrderReady": "Your order is ready.",
  "OrderDelayed": "Your order is delayed."
}

{
  "OrderReady": "Votre commande est prête.",
  "OrderDelayed": "Votre commande est retardée."
}
```

With those translations created, we can do the following inside the notification template files.

```html
<p>{{ "OrderReady" | t }}</p>
```

Knock will look up the locale of the notification recipient and use the corresponding `OrderReady` value for their language. All you need to do is create the translation files for the languages and key-value pairs you need for all your notifications across all channels.

Knock also provides a more automated way to generate source language translation files to use with an automated translation system or API. Large global marketplaces like [Bounce](/blog/customers-bounce) and [Discogs](/blog/customers-discogs) use this method to automatically generate translations for multiple locales directly from their CI/CD pipelines.

<ImageModal
  src="/assets/blog/customers-bounce/pipeline.png"
  alt="Bounce"
>
  <img
    src="/assets/blog/customers-bounce/pipeline.png"
    alt="Bounce"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>
<figcaption>Bounce's translation pipeline</figcaption>

Check out the video below for a quick overview of how translations work in Knock.

<iframe
  style={{ aspectRatio: "16/9", width: "100%" }}
  src="https://www.youtube.com/embed/8VAFqj5qqPI?si=EjWYxMuci39NlEy6"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>
<br />

Knock provides [a generous free tier for developers](https://dashboard.knock.app/signup) with basic notification needs, and a enterprise tier for companies with complex requirements, like translation management. If you are interested in i18n support in Knock, [chat with our team](https://knock.app/contact-sales) about how we can help you reach a global audience.

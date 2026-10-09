# Building a translation CI/CD pipeline with Lingo.dev

Source: https://knock.app/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev
Author: Jeff Everhart (Developer Advocate)
Published: 2025-03-04
Captured: 2026-09-13

---

A step-by-step guide to building a translation CI/CD pipeline using Lingo.dev and Knock to automate localization for your app's notifications.

---

A common challenge for applications serving a global user base is providing content and notifications in multiple languages. Manual translation is not only time-consuming but prone to errors and inconsistencies in style and tone of voice.

In this post, I'll walk you through how to build an automated CI/CD translation pipeline using [Lingo.dev](https://lingo.dev/) and Knock that will handle localized notifications for your app without requiring any manual translation work from your team. We’ll introduce some tools that can help you scale your application to a global audience, automate translations locally using Lingo.dev's CLI, and finally integrate that CLI into a CI/CD pipeline so that translations are automatically created when developers open a pull request.

## Video walkthrough

If you prefer to learn with video, watch it here.

<iframe
  style={{ aspectRatio: "16/9", width: "100%" }}
  src="https://www.youtube.com/embed/qQgoGLsdbJY?si=dVmtgD7rsnwMaN1U"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>

## Tools for scaling your application to a global audience

[Lingo.dev](https://lingo.dev/) is an AI-powered translation service that's relatively new but incredibly powerful. It allows you to specify a particular brand voice for your translations, which we've done for our sample application called Globe Wander, an adventure marketplace.

<ImageModal
  src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/lingo-dev-brand-voice.png"
  alt="Lingo.dev brand voice settings"
>
  <img
    src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/lingo-dev-brand-voice.png"
    alt="Lingo.dev brand voice settings"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

You can fine-tune translations for your specific context and add custom words to your glossary to ensure consistent translations across your application.

Knock is a notification infrastructure platform with built-in localization support. When you attach a locale to a user object, Knock automatically handles localizing your notification templates when provided with the appropriate translation files. It uses translation tags in message templates to display the right content based on the user's preferred language.

<ImageModal
  src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/knock-translation-detail.png"
  alt="Details of a Knock translation file"
>
  <img
    src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/knock-translation-detail.png"
    alt="Details of a Knock translation file"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

## How localization works in Knock

Let's take a closer look at how localization works in Knock. In our Knock dashboard, I've created a "New User Signup" workflow with a Postmark email template that uses translation filters in Liquid. If we look at our Postmark email template, you'll see I'm using these translation filters that reference translated strings stored in our translation files.

<ImageModal
  src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/knock-translation-detail.png"
  alt="Knock translation tags"
>
  <img
    src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/knock-translation-detail.png"
    alt="Knock translation tags"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

If you preview this template and switch between locales you can see how the message automatically changes to the appropriate language.

<ImageModal
  src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/translation-preview.gif"
  alt="Knock translation preview"
>
  <img
    src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/translation-preview.gif"
    alt="Knock translation preview"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

When you pull translation files into your codebase with the [Knock CLI](https://docs.knock.app/cli), they’re organized in a specific folder structure. We have a main "translations" folder with subfolders for each locale like "en-US", "es" for Spanish, and "fr" for French. Inside each locale folder are JSON files containing translation keys and values.

```bash
translations/
├── en-US/
│   ├── cancellation.en-US.json
│   ├── en-US.json
│   ├── payments.en-US.json
│   └── shipping.en-US.json
├── es/
│   ├── cancellation.es.json
│   ├── es.json
│   ├── payments.es.json
│   └── shipping.es.json
└── fr/
    ├── cancellation.fr.json
    ├── fr.json
    ├── payments.fr.json
    └── shipping.fr.json
```

We can also use namespacing to organize our translations by feature or notification type. This makes it easier to manage translations for different parts of your application, such as separating payment notifications from cancellation updates.

## Translating files locally

To set up our pipeline, we first need to install and authenticate with Lingo.dev, which you can do by running this auth command in your terminal.

```bash
npx lingo.dev@latest auth --login
```

After installing the package, we run the initialization command which creates an "i18n.json" configuration file.

```bash
npx lingo.dev@latest init
```

In this configuration file, we can specify our source locale as English and define our target locales as Spanish and French. We also configure the file paths for our translation buckets, pointing to our Knock translations directory.

```json
{
  "version": 1.3,
  "locale": {
    "source": "en-US",
    "targets": ["es", "fr"]
  },
  "buckets": {
    "json": {
      "include": [
        "./knock/translations/[locale]/[locale].json",
        "./knock/translations/[locale]/*.[locale].json"
      ]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

Because Knock requires a specific file naming convention, I've created two include paths to target both the top-level translation file and any namespaced files. This `locale` placeholder can be used to extract a locale from a file path name that can be used in the newly produced files.

This helps ensure compatibility with Knock's expected structure and gives you flexibility if your translation files are stored differently.

You can test Lingo.dev by running the `i18n` command.

```bash
npx lingo.dev@latest i18n
```

In the terminal you should be able to see the output. The CLI connects to Lingo.dev, translates all the files, and writes them to the paths specified in the config object. Lingo uses the `i18n.lock` file to create checksums, so that it only translates files that have changed.

## Creating a CI/CD pipeline

For production use, we want this process to run automatically whenever changes are made to our translation files, and ideally we’d push those updated translations back into Knock. I've created two GitHub Action workflows to handle different parts of this.

The first workflow triggers when a pull request is opened to the main branch. It checks out the repository, installs dependencies, runs our translation process on any changed files, and then commits the translated files back to the PR branch. This way, reviewers can see both the original changes and the resulting translations before merging.

```yaml
name: i18n Knock Automation

on:
  pull_request:
    branches:
      - main

jobs:
  prepare_translations:
    name: Prepare Translation Files
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          ref: ${{ github.ref }}
          fetch-depth: 0 # Ensure full branch history

      - name: Install Dependencies
        run: npm ci # Ensures a clean install using package-lock.json

      - name: Process Translations
        run: npx lingo.dev@latest i18n # Adjust to your relevant command
        env:
          LINGODOTDEV_API_KEY: ${{ secrets.LINGODOTDEV_API_KEY }}

      - name: Commit and Push Changes
        env:
          BRANCH_NAME: ${{ github.head_ref || github.ref_name }}
        run: |
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"
          git checkout "${BRANCH_NAME}"
          git add .
          git diff --quiet && git diff --staged --quiet || git commit -m "chore: rename translation files"
          git push origin "${BRANCH_NAME}"
        continue-on-error: true
```

The second workflow runs when a PR is merged to main. It uses the [Knock CLI](https://docs.knock.app/cli) to upload all translation files to your Knock development environment and commit them, making them immediately available for use in testing.

```yaml
name: Push Translations to Knock

on:
  pull_request:
    types:
      - closed
    branches:
      - main

jobs:
  push_translations:
    if: github.event.pull_request.merged == true
    name: Push Translations to Knock
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Install Knock CLI
        run: npm install -g @knocklabs/cli

      - name: Push Translations to Knock
        run: knock translation push --commit --all --translations-dir=./knock/translations --service-token=$KNOCK_SERVICE_TOKEN
        env:
          KNOCK_SERVICE_TOKEN: ${{ secrets.KNOCK_SERVICE_TOKEN }}
```

Let's see this in action. I'll add a new translation key for payment reasons to `payments.en-US.json` with options like "no payment," "insufficient funds," and "invalid method."

```json
{
  "update": "Hey, your payment was successful!",
  "issue": "Sorry, your payment didn't go through. Please contact support.",
  "reasoning": {
    "no_payment": "We couldn't process your payment.",
    "insufficient_funds": "You don't have enough funds in your account.",
    "invalid_payment_method": "The payment method you provided is invalid.",
    "cancelled_by_customer": "You cancelled the order yourself.",
    "cancelled_by_seller": "The seller cancelled the order."
  }
}
```

After committing these changes to a new branch and opening a PR, we can watch the automated translation process happen. Our GitHub Action starts running, connecting to Lingo.dev to translate our new content into Spanish and French.

<ImageModal
  src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/github-action-translate.png"
  alt="Translation GitHub action translate"
>
  <img
    src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/github-action-translate.png"
    alt="Translation GitHub action translate"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

Once complete, it commits these files back to our PR branch. Notice how it only updates files that have actually changed, thanks to the checksum system in the `i18n.lock` file.

<ImageModal
  src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/github-action-commit.png"
  alt="Translation GitHub action commit"
>
  <img
    src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/github-action-commit.png"
    alt="Translation GitHub action commit"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

## Pushing translations back to Knock

After merging the PR, our second workflow automatically uploads the translations to Knock. In the `Actions` tab of GitHub you can open up the Knock translations workflow and see that output.

<ImageModal
  src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/github-action-knock.png"
  alt="Knock translation CLI workflow"
>
  <img
    src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/github-action-knock.png"
    alt="Knock translation CLI workflow"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

Now if we check our Knock dashboard under `Translations,` we can confirm that our new payment reason translations have been uploaded in all three languages: our original English content, plus the AI-translated Spanish and French versions.

<ImageModal
  src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/knock-translation-complete.png"
  alt="Knock translation AI generated"
>
  <img
    src="/assets/blog/building-a-translation-ci-cd-pipeline-with-lingo-dev/knock-translation-complete.png"
    alt="Knock translation AI generated"
    className="rounded-md mx-auto border border-gray-200"
  />
</ImageModal>

## Conclusion

This pipeline provides significant benefits for your development workflow. Developers can focus on adding content in one language, with translations handled automatically through CI/CD. You're able maintain a single template in Knock with dynamic content that changes based on the user's language preference. All changes are version-controlled alongside your code, providing a clear history of translations.

While the setup I've shown is somewhat opinionated, you can adapt it to fit your specific workflow. Lingo.dev also offers their own GitHub Action, and one of the major advantages of using Knock for notifications is that you're not creating separate templates for each language. Instead, you scale through translation files in a much more manageable way than what many other notification providers offer.

I encourage you to check out Lingo.dev for AI-based translations and Knock for notification infrastructure that makes localization straightforward and efficient.

Thanks for reading! Happy coding!

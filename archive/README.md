# Archive

Captured copies of published work. **Nothing in here is part of the site build.**

Astro only looks at `apps/web/src/`, so this directory costs nothing at build
time and can't accidentally ship. It exists for one reason: links rot. Companies
rebrand, kill their blogs, migrate CMSes and drop the back catalog. When that
happens the work is gone unless a copy was made first.

## The model

A content entry in `apps/web/src/content/` is a **pointer** — title, date, and a
URL to where the thing lives. An archive folder here is a **snapshot** of what
was actually at that URL. The two are linked by slug.

```
apps/web/src/content/writing/knock-designing-webhooks.md   ← the pointer
archive/knock-designing-webhooks/                          ← the snapshot
```

The pointer names its snapshot explicitly in frontmatter, so the folder name can
drift from the entry slug if it needs to:

```yaml
archive:
  slug: knock-designing-webhooks
  capturedAt: 2024-02-02
  linkStatus: live
```

## When a link dies

Set `linkStatus: dead` on the entry. The site stops linking out and says the
original is no longer online — the entry stays as a record of the work instead of
sending people to a 404. The captured copy is still here if you ever want to
republish it on the site directly.

`linkStatus: moved` plus `movedTo:` covers the gentler case where a post just
changed URLs.

## Folder layout

```
archive/
  knock-designing-webhooks/
    meta.json        # provenance — see below
    index.md         # readable text extraction, the thing worth keeping
    original.html    # raw response, in case the extraction lost something
    assets/          # images referenced by the capture
```

Videos swap `index.md` for `transcript.txt` and `description.md`. Podcasts keep
show notes. Adapt per medium — `meta.json` is the only required file.

### meta.json

```json
{
  "url": "https://example.com/blog/designing-webhooks",
  "capturedAt": "2024-02-02T15:04:05Z",
  "httpStatus": 200,
  "contentType": "text/html; charset=utf-8",
  "title": "Designing Webhooks Developers Actually Want to Consume",
  "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

`sha256` is over `original.html`. Re-capturing and finding a different hash tells
you the page changed since last time.

## What gets archived

Everything published, including this site's own posts. The markdown for those
already lives in git under `apps/web/src/content/blog/`, so a snapshot here is
about the *rendered* result — the page as it actually looked, with the images and
embeds that may not survive on their own.

Order of priority, most fragile first:

1. Guest posts and articles on other people's sites
2. Videos made for other organizations' channels
3. Podcast appearances and conference recordings
4. Your own YouTube uploads
5. Your own blog posts (rendered HTML)

## What's committed

Text and small images go in git — that's what keeps this durable and greppable.
Large binaries (video files, high-res source renders, STLs over a few MB) are
gitignored; keep those in whatever backup you already trust and note the location
in `meta.json`. See `.gitignore` in this directory.

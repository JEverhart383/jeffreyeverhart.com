#!/usr/bin/env node
/**
 * WordPress XML → Astro Content Collection migrator
 *
 * Usage:
 *   node scripts/migrate-wp.js <path-to-wordpress-export.xml>
 *
 * How to get the export file:
 *   WordPress Admin → Tools → Export → All content → Download Export File
 *
 * What it does:
 *   1. Parses the WP XML export
 *   2. Converts each published post AND page's HTML body to Markdown
 *   3. Downloads all referenced media (images, etc.) to public/media/
 *   4. Rewrites media URLs in the Markdown to point to /media/...
 *   5. Writes posts → apps/web/src/content/blog/
 *      Writes pages → apps/web/src/content/pages/
 *
 * Dependencies (install once):
 *   pnpm add -g fast-xml-parser turndown
 *   OR  npm install fast-xml-parser turndown  (in this scripts/ dir)
 */

import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BLOG_DIR = join(ROOT, 'apps/web/src/content/blog');
const PAGES_DIR = join(ROOT, 'apps/web/src/content/pages');
const MEDIA_DIR = join(ROOT, 'apps/web/public/media');
const VERCEL_CONFIG = join(ROOT, 'apps/web/vercel.json');

// ─── Helpers ────────────────────────────────────────────────────────────────

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

// Pull <pre> blocks out of HTML before Turndown sees them, restore as fenced
// code blocks afterward. This prevents Turndown from escaping code content.
function extractCodeBlocks(html) {
  const blocks = [];
  const processed = html.replace(
    /<pre([^>]*)>([\s\S]*?)<\/pre>/gi,
    (_, attrs, content) => {
      const langMatch = attrs.match(/data-enlighter-language="([^"]*)"/i);
      const lang = langMatch ? langMatch[1].trim() : '';
      const code = decodeHtmlEntities(content).trim();
      const idx = blocks.length;
      blocks.push({ lang, code });
      // Wrap in <div> so Turndown treats it as block-level (not inline text).
      // Alphanumeric-only — Turndown escapes underscores in plain text.
      return `<div>CODEBLOCKHOLDER${idx}END</div>`;
    }
  );
  return { processed, blocks };
}

function restoreCodeBlocks(markdown, blocks) {
  return blocks.reduce(
    (md, { lang, code }, idx) =>
      md.replace(`CODEBLOCKHOLDER${idx}END`, `\`\`\`${lang}\n${code}\n\`\`\``),
    markdown
  );
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = { data: [] };
    const req = proto.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      res.on('data', (chunk) => file.data.push(chunk));
      res.on('end', () => {
        writeFileSync(destPath, Buffer.concat(file.data));
        resolve(destPath);
      });
    });
    req.on('timeout', () => { req.destroy(new Error('Request timed out after 10s')); });
    req.on('error', reject);
  });
}

async function downloadMedia(url, mediaDir) {
  const urlObj = new URL(url);
  const filename = basename(urlObj.pathname);
  const destPath = join(mediaDir, filename);
  if (existsSync(destPath)) return `/media/${filename}`;
  try {
    await downloadFile(url, destPath);
    console.log(`  Downloaded: ${filename}`);
    return `/media/${filename}`;
  } catch (err) {
    console.warn(`  Failed to download ${url}: ${err.message}`);
    return url;
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const xmlPath = process.argv[2];
  if (!xmlPath) {
    console.error('Usage: node scripts/migrate-wp.js <wordpress-export.xml>');
    process.exit(1);
  }

  const xml = readFileSync(xmlPath, 'utf-8');

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    cdataPropName: '__cdata',
    isArray: (name) => ['item', 'category'].includes(name),
  });

  const result = parser.parse(xml);
  const channel = result?.rss?.channel;
  if (!channel) {
    console.error('Could not parse WordPress export XML — is this the right file?');
    process.exit(1);
  }

  const items = channel.item ?? [];
  const isPublished = (item) => item['wp:status']?.__cdata === 'publish';

  const posts = items.filter((item) => item['wp:post_type']?.__cdata === 'post' && isPublished(item));
  const pages = items.filter((item) => item['wp:post_type']?.__cdata === 'page' && isPublished(item));

  console.log(`Found ${posts.length} published posts, ${pages.length} published pages.`);

  mkdirSync(BLOG_DIR, { recursive: true });
  mkdirSync(PAGES_DIR, { recursive: true });
  mkdirSync(MEDIA_DIR, { recursive: true });

  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

  // Download media items (attachments) from the WP library
  const attachments = items.filter(
    (item) => item['wp:post_type']?.__cdata === 'attachment'
  );
  console.log(`\nDownloading ${attachments.length} media attachments...`);
  const mediaMap = new Map();
  for (const att of attachments) {
    const url = att['wp:attachment_url']?.__cdata;
    if (url) {
      const localPath = await downloadMedia(url, MEDIA_DIR);
      mediaMap.set(url, localPath);
    }
  }

  // ── Shared conversion logic ─────────────────────────────────────────────────

  async function convertItem(item, destDir, type) {
    const title = item.title?.__cdata ?? item.title ?? 'Untitled';
    const wpId = item['wp:post_id'] ?? null;
    const htmlContent = String(item['content:encoded']?.__cdata ?? '');
    const slug = slugify(item['wp:post_name']?.__cdata ?? title);

    // Rewrite known media URLs and download any unknown inline images
    let processedHtml = htmlContent;
    for (const [wpUrl, localPath] of mediaMap) {
      processedHtml = processedHtml.replaceAll(wpUrl, localPath);
    }
    const imgSrcRegex = /<img[^>]+src=["']([^"']+)["']/g;
    let match;
    while ((match = imgSrcRegex.exec(processedHtml)) !== null) {
      const imgUrl = match[1];
      if (imgUrl.startsWith('http') && !mediaMap.has(imgUrl)) {
        const localPath = await downloadMedia(imgUrl, MEDIA_DIR);
        mediaMap.set(imgUrl, localPath);
        processedHtml = processedHtml.replaceAll(imgUrl, localPath);
      }
    }

    const { processed: htmlNoCode, blocks } = extractCodeBlocks(processedHtml);
    const markdown = restoreCodeBlocks(td.turndown(htmlNoCode), blocks);

    // Featured image via _thumbnail_id post meta
    const postmeta = item['wp:postmeta']
      ? (Array.isArray(item['wp:postmeta']) ? item['wp:postmeta'] : [item['wp:postmeta']])
      : [];
    const thumbnailId = postmeta
      .find((m) => m['wp:meta_key']?.__cdata === '_thumbnail_id')
      ?.['wp:meta_value']?.__cdata;
    const heroAttachment = thumbnailId
      ? attachments.find((a) => String(a['wp:post_id']) === String(thumbnailId))
      : null;
    const heroImage = heroAttachment
      ? (mediaMap.get(heroAttachment['wp:attachment_url']?.__cdata) ?? null)
      : null;

    let frontmatterLines;

    if (type === 'post') {
      const date = item['wp:post_date']?.__cdata?.split(' ')[0] ?? new Date().toISOString().split('T')[0];
      const rawExcerpt = item['excerpt:encoded']?.__cdata ?? '';
      const excerpt = rawExcerpt
        ? td.turndown(rawExcerpt).replace(/\n/g, ' ').slice(0, 200)
        : markdown.split('\n')[0].slice(0, 200);

      const rawCategories = Array.isArray(item.category)
        ? item.category
        : item.category ? [item.category] : [];
      const categories = rawCategories
        .filter((c) => c?.['@_domain'] === 'category')
        .map((c) => c.__cdata ?? c);

      frontmatterLines = [
        `title: ${JSON.stringify(title)}`,
        `date: ${date}`,
        excerpt ? `excerpt: ${JSON.stringify(excerpt)}` : null,
        heroImage ? `heroImage: ${JSON.stringify(heroImage)}` : null,
        categories.length ? `categories: [${categories.map((c) => JSON.stringify(c)).join(', ')}]` : null,
        wpId ? `wpId: ${wpId}` : null,
      ];
    } else {
      // page
      frontmatterLines = [
        `title: ${JSON.stringify(title)}`,
        heroImage ? `heroImage: ${JSON.stringify(heroImage)}` : null,
        wpId ? `wpId: ${wpId}` : null,
      ];
    }

    const frontmatter = ['---', ...frontmatterLines.filter(Boolean), '---'].join('\n');
    const filename = join(destDir, `${slug}.md`);
    writeFileSync(filename, `${frontmatter}\n\n${markdown}\n`);
    console.log(`  Wrote: ${slug}.md`);
    return slug;
  }

  // ── Posts ────────────────────────────────────────────────────────────────────
  console.log('\nConverting posts to Markdown...');
  const redirects = {};
  for (const post of posts) {
    const slug = await convertItem(post, BLOG_DIR, 'post');
    // Build redirect from old WP date-based URL to new /blog/{slug}
    const oldLink = post.link?.__cdata ?? post.link ?? '';
    if (oldLink) {
      try {
        const oldPath = new URL(oldLink).pathname.replace(/\/$/, '');
        if (oldPath && oldPath !== `/blog/${slug}`) {
          redirects[oldPath] = `/blog/${slug}`;
          // Also cover the trailing-slash variant
          redirects[`${oldPath}/`] = `/blog/${slug}`;
        }
      } catch { /* skip malformed URLs */ }
    }
  }

  // Write vercel.json with permanent redirects
  const vercelRedirects = Object.entries(redirects).map(([source, destination]) => ({
    source,
    destination,
    permanent: true,
  }));

  // Merge with any existing vercel.json so we don't clobber other settings
  let existing = {};
  try { existing = JSON.parse(readFileSync(VERCEL_CONFIG, 'utf-8')); } catch { /* new file */ }
  const vercelConfig = { ...existing, redirects: vercelRedirects };
  writeFileSync(VERCEL_CONFIG, JSON.stringify(vercelConfig, null, 2) + '\n');
  console.log(`\nWrote ${vercelRedirects.length} redirects → ${VERCEL_CONFIG}`);

  // ── Pages ────────────────────────────────────────────────────────────────────
  console.log('\nConverting pages to Markdown...');
  for (const page of pages) {
    await convertItem(page, PAGES_DIR, 'page');
  }

  console.log('\nMigration complete!');
  console.log(`Posts    : ${BLOG_DIR}`);
  console.log(`Pages    : ${PAGES_DIR}`);
  console.log(`Media    : ${MEDIA_DIR}`);
  console.log(`Redirects: ${VERCEL_CONFIG}`);
  console.log('\nNext steps:');
  console.log('  1. Review the generated .md files for formatting issues');
  console.log('  2. Add any new pages to navLinks in apps/web/src/config/nav.ts');
  console.log('  3. Run: pnpm build');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

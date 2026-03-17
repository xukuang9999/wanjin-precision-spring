<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1S61T2YLAoLx8o80shVMQ3qu1Ldr1bz1G

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. (Optional) Set `VITE_API_BASE_URL` in `.env.local` if your API runs on a different origin.
3. Provide backend endpoints for AI features:
   - `POST /api/chat` -> `{ text: string }`
   - `POST /api/image` -> `{ image: string }` (base64 data URL)
4. Run the app:
   `npm run dev`

## Publish Blog Content

Blog content lives in [data/blog/content.ts](/Users/michaelxu/Library/Mobile%20Documents/com~apple~CloudDocs/Wanjin%20Website/wanjin-precision-spring/data/blog/content.ts).

To publish a new article or news item:

1. Add a new object to `BLOG_POSTS`.
2. Set `slug`, `category`, `publishedAt`, `updatedAt`, `featured`, `coverImage`, and `readingMinutes`.
3. Fill `title`, `excerpt`, `seoTitle`, `seoDescription`, and `content` for at least `en` and `zh`.
4. Run `npm run build`.

Build output now includes:

- localized blog pages in `dist/blog/...`
- `dist/sitemap.xml`
- `dist/blog-feed.xml`
- `dist/blog-feed.json`

## One-Command GoDaddy Deploy

Run:

`GODADDY_PASS='your-password' npm run deploy:godaddy`

Optional environment variables:

- `GODADDY_HOST`
- `GODADDY_USER`
- `GODADDY_REMOTE_DIR`
- `GODADDY_HOME_DIR`
- `GODADDY_SITE_URL`

The deploy script will:

- run `npm run build`
- create a remote backup of the current static site
- upload the new `dist/` package
- replace only the static site files under the target directory
- clean macOS `._*` artifacts
- run a basic remote and public URL check

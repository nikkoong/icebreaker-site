# Icebreaker Energy

Static website and blog for Icebreaker Energy — ice batteries (ice thermal storage) for commercial cooling. The idea: a building makes and stores cold when electricity is cheap and the grid is under less strain, then cools from storage during expensive peak hours instead of running its chillers flat-out.

The home page walks through the demand-charge problem, an interactive load chart with a charge/discharge toggle, a financial simulator, and the blog. Everything is plain static files — no build step, no package.json. Libraries (Tailwind, Chart.js, marked, and the fonts) load from CDNs at runtime.

## Structure

- `index.html` — the entire home page: markup, styles, and all JavaScript in one file.
- `blog/index.html` — blog listing page. Fetches `blog/posts.json` and links to each post.
- `blog/post.html` — post renderer. Reads `?slug=<slug>` from the URL, fetches the matching file from `posts/`, and renders it with marked.
- `blog/posts.json` — generated manifest of all posts (slug, title, date, excerpt, cover image), newest first.
- `blog/generate-manifest.js` — Node script that regenerates `posts.json` from the post frontmatter.
- `posts/` — blog posts as Markdown files with frontmatter.
- `images/` — site and post images.
- `docs/site-walkthrough.md` — a longer walkthrough of the site.

## Running locally

Open `index.html` in a browser for the home page. The blog pages fetch JSON and Markdown files, so serve the repo root over HTTP to use them:

```bash
python3 -m http.server
```

Then open `http://localhost:8000/` and `http://localhost:8000/blog/`.

## Adding a blog post

1. Create a Markdown file in `posts/`. The filename minus `.md` becomes the slug, and the post's URL is `blog/post.html?slug=<slug>`.
2. Start the file with frontmatter. The manifest reads `title`, `date`, and `excerpt`; `coverImage` and `coverAlt` are optional (if `title` is missing, the slug is used instead):

   ```markdown
   ---
   title: Your post title
   date: 2026-01-31
   excerpt: One or two sentences shown on the blog index.
   coverImage: ../images/your-image.png
   coverAlt: Alt text for the cover image
   ---
   ```

3. Regenerate the manifest. The script scans `posts/` for `.md` files, parses each file's frontmatter, sorts by date descending, and rewrites `blog/posts.json`:

   ```bash
   node blog/generate-manifest.js
   ```

4. Commit the new post and the updated `blog/posts.json` together.

Reference images in the post body with normal Markdown image syntax, using paths relative to the post file, e.g. `![Alt text](../images/rtu.png)`.

## Deployment

No deployment configuration or hosting setup is documented in this repo — it is just static files.

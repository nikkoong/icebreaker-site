# Agent Notes

- This repo is a single static page: all app code lives in root `index.html`. There is no `package.json`, lockfile, build config, test config, or CI workflow to rely on.
- Runtime dependencies are loaded from CDNs inside `index.html`: Tailwind (`cdn.tailwindcss.com`), Chart.js (`cdn.jsdelivr.net`), and the Inter font (`fonts.googleapis.com`). The blog pages also use `marked` from `cdn.jsdelivr.net`. Do not assume `npm install` or a bundler exists.
- The inline `<script>` at the bottom of `index.html` owns all behavior: smooth-scroll nav, the hero load chart, the charge/discharge toggle, and the financial simulator. When editing markup, keep every referenced `id` in sync or the page will silently break.
- Styling is mostly Tailwind utility classes in the HTML plus a small inline `<style>` block for `body` and `.chart-container`. Keep changes in `index.html` unless you are intentionally introducing a fuller asset pipeline.
- Verification is manual. Open or serve `index.html` from the repo root; a zero-config option is `python3 -m http.server`. Check that both charts render and that the mode toggle and range sliders update the UI.
- Blog workflow:
  - Write posts as Markdown files in `posts/*.md`
  - Add frontmatter keys: `title`, `date`, `excerpt`, optional `coverImage`, optional `coverAlt`
  - Embedded images can be referenced with normal Markdown paths relative to the Markdown file, for example `![Alt text](../nikko_profile_pic.jpg)`
  - Regenerate the blog manifest with `node blog/generate-manifest.js`
  - Blog index is `blog/index.html` and individual posts render through `blog/post.html?slug=<post-slug>`
- If you add tooling later, document the exact commands here instead of leaving future agents to guess.

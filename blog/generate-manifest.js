#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const postsDir = path.join(root, 'posts');
const outputPath = path.join(root, 'blog', 'posts.json');

function parseFrontmatter(markdown) {
    if (!markdown.startsWith('---')) {
        return {};
    }

    const end = markdown.indexOf('\n---', 3);
    if (end === -1) {
        return {};
    }

    const raw = markdown.slice(3, end).trim();
    const meta = {};

    raw.split('\n').forEach((line) => {
        const separator = line.indexOf(':');
        if (separator === -1) {
            return;
        }

        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim();
        meta[key] = value;
    });

    return meta;
}

const posts = fs.readdirSync(postsDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
        const slug = file.replace(/\.md$/, '');
        const markdown = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const meta = parseFrontmatter(markdown);

        return {
            slug,
            title: meta.title || slug,
            date: meta.date || '',
            excerpt: meta.excerpt || '',
            coverImage: meta.coverImage || '',
            coverAlt: meta.coverAlt || ''
        };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

fs.writeFileSync(outputPath, `${JSON.stringify(posts, null, 2)}\n`);
console.log(`Wrote ${posts.length} posts to ${outputPath}`);

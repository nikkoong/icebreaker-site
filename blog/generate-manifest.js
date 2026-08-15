#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const postsDir = path.join(root, 'posts');
const outputPath = path.join(root, 'blog', 'posts.json');

function parseFrontmatter(markdown) {
    // Simple but more robust frontmatter parser.
    // Supports single-line `key: value`, quoted values, and block scalars using `|`.
    if (!markdown.startsWith('---')) {
        return {};
    }

    const end = markdown.indexOf('\n---', 3);
    if (end === -1) {
        return {};
    }

    const raw = markdown.slice(3, end).trim();
    const lines = raw.split('\n');
    const meta = {};

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const separator = line.indexOf(':');
        if (separator === -1) {
            continue;
        }

        const key = line.slice(0, separator).trim();
        let value = line.slice(separator + 1).trim();

        // Block scalar (|) — collect subsequent indented lines
        if (value === '|') {
            const block = [];
            i++;
            while (i < lines.length) {
                const next = lines[i];
                // Stop if we encounter another top-level key
                if (/^[^\s].*:\s*/.test(next)) {
                    i--; // back up so outer loop handles this line
                    break;
                }
                // Remove a single leading space if present (common in YAML blocks)
                block.push(next.replace(/^\s?/, ''));
                i++;
            }
            value = block.join('\n').trim();
        }

        // Strip surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        meta[key] = value;
    }

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

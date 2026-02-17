import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const mdDir = path.join(process.cwd(), 'public/md');

const cleanSlug = (s: string) => s.replace(/^(#?\d+-)/, '');
const cleanTitle = (s: string) => s.replace('.md', '').replace(/^(#?\d+-)/, '').replace(/-/g, ' ').trim();

function getAllArticles(dir: string, baseSlug: string[] = []): any[] {
    const files = fs.readdirSync(dir);
    let articles: any[] = [];

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            articles = articles.concat(getAllArticles(fullPath, [...baseSlug, cleanSlug(file)]));
        } else if (file.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(content);
            const slug = [...baseSlug, cleanSlug(file.replace('.md', ''))];
            articles.push({
                title: data.title || cleanTitle(file),
                slug: `/${slug.join('/')}`,
                description: data.description || '',
                tags: data.tags || []
            });
        }
    });

    return articles;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
        return res.status(200).json([]);
    }

    const articles = getAllArticles(mdDir);
    const search = q.toLowerCase();

    const results = articles.filter(a =>
        a.title.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search) ||
        a.tags.some((t: string) => t.toLowerCase().includes(search))
    ).slice(0, 10);

    res.status(200).json(results);
}

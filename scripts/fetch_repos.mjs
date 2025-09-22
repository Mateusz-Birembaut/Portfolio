// Fetch public repos for a user and output data/projects.auto.json
// Uses GITHUB_TOKEN if present to raise rate limits.

import fs from 'node:fs/promises';

const GH_USER = process.env.GH_USER || 'Mateusz-Birembaut';
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

const headers = {
	'Accept': 'application/vnd.github+json',
	'X-GitHub-Api-Version': '2022-11-28',
};
if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;

async function fetchPage(page = 1, per_page = 100) {
	const url = `https://api.github.com/users/${encodeURIComponent(GH_USER)}/repos?per_page=${per_page}&page=${page}&sort=updated`;
	const res = await fetch(url, { headers });
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub API error ${res.status}: ${text}`);
	}
	return res.json();
}

async function fetchAllRepos() {
	const all = [];
	for (let page = 1; page < 20; page++) {
		const items = await fetchPage(page);
		if (!items || items.length === 0) break;
		all.push(...items);
		if (items.length < 100) break;
	}
	return all.filter(r => !r.fork); // ignore forks by default
}

function toProject(repo) {
	return {
		slug: repo.name,
		title: repo.name.replace(/[-_]/g, ' '),
		summary: repo.description || '',
		description: repo.description || '',
		status: repo.archived ? 'Archivé' : 'Actif',
		tags: [],
		tech: [],
		period: new Date(repo.updated_at).getFullYear().toString(),
		role: 'Auteur',
		github: repo.html_url,
		demo: repo.homepage || undefined,
		media: [],
		source: 'auto'
	};
}

async function main() {
	console.log(`Fetching repos for ${GH_USER}...`);
	const repos = await fetchAllRepos();
	const projects = repos.map(toProject);
	const out = { projects };
	await fs.mkdir('data', { recursive: true });
	await fs.writeFile('data/projects.auto.json', JSON.stringify(out, null, 2), 'utf-8');
	console.log(`Wrote data/projects.auto.json with ${projects.length} projects`);
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});

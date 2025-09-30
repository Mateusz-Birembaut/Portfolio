const state = { projects: [], tps: [], loaded: false, tpsLoaded: false };

const byId = (id) => document.getElementById(id);
const appEl = byId('app');
const yearEl = byId('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Construction banner dismiss
const banner = document.getElementById('constructionBanner');
const closeBtn = document.getElementById('constructionClose');
if (banner && closeBtn) {
	const key = 'hide-construction';
	if (sessionStorage.getItem(key) === '1') banner.style.display = 'none';
	closeBtn.addEventListener('click', () => { banner.style.display = 'none'; sessionStorage.setItem(key, '1'); });
}

async function loadData() {
	if (state.loaded) return state.projects;
	try {
		// Prefer generated data if present
		let res = await fetch('data/projects.final.json', { cache: 'no-store' });
		if (!res.ok) {
			res = await fetch('data/projects.json', { cache: 'no-store' });
		}
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const data = await res.json();
		state.projects = data.projects || [];
		state.loaded = true;
		return state.projects;
	} catch (err) {
		console.error('Failed to load projects.json', err);
		appEl.innerHTML = `<div class="error">Impossible de charger les projets. Vérifiez data/projects.json.</div>`;
		return [];
	}
}

async function loadTPs() {
	if (state.tpsLoaded) return state.tps;
	try {
		const res = await fetch('data/tps.json', { cache: 'no-store' });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const data = await res.json();
		state.tps = data.tps || [];
		state.tpsLoaded = true;
		return state.tps;
	} catch (err) {
		console.error('Failed to load tps.json', err);
		return [];
	}
}

function escapeHtml(s) {
	return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function renderProjectCard(p, base = 'project') {
	const cover = p.cover || (p.media && p.media.find(m => m.type === 'image')?.src);
	const coverEl = cover ? `<img class="thumb" src="${cover}" alt="${escapeHtml(p.title)}" loading="lazy">`
		: `<div class="thumb" aria-hidden="true"></div>`;
	const tags = (p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join(' ');
	const link = `#/${base}/${encodeURIComponent(p.slug)}`;
	return `
  <article class="card">
    <a href="${link}" aria-label="Ouvrir ${escapeHtml(p.title)}">${coverEl}</a>
    <div class="content">
      <h3 class="title"><a href="${link}">${escapeHtml(p.title)}</a></h3>
      <p class="muted clamp-2">${escapeHtml(p.summary || '')}</p>
      <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:8px">${tags}</div>
    </div>
  </article>`;
}

function renderMediaItem(m) {
	if (m.type === 'image') {
		const alt = escapeHtml(m.caption || 'Aperçu');
		return `<img src="${m.src}" alt="${alt}" data-caption="${alt}" class="media" loading="lazy" onerror="this.onerror=null;this.src='assets/img/placeholder.svg'">`;
	}
	if (m.type === 'pdf') {
		const cap = escapeHtml(m.caption || 'Document PDF');
		return `<a class="pdf" href="${m.src}" target="_blank" rel="noopener" title="Ouvrir le PDF: ${cap}">📄 ${cap}</a>`;
	}
	if (m.type === 'link') {
		const cap = escapeHtml(m.caption || m.href);
		return `<a class="btn secondary" href="${m.href}" target="_blank" rel="noopener">🔗 ${cap}</a>`;
	}
	return '';
}

function findProjectBySlug(slug) {
	for (const p of state.projects) {
		if (p.slug === slug) return { project: p, path: [p] };
		if (p.subprojects) {
			for (const sp of p.subprojects) {
				if (sp.slug === slug) return { project: sp, parent: p, path: [p, sp] };
			}
		}
	}
	return null;
}

function breadcrumbs(path, base = 'project') {
	if (!path || !path.length) return '';
	const rootLabel = base === 'tp' ? 'TP' : 'Projets';
	const rootHref = base === 'tp' ? '#/tps' : '#/';
	const detailBase = base === 'tp' ? 'tp' : 'project';
	const parts = [`<a href="${rootHref}">${rootLabel}</a>`];
	if (path.length === 1) {
		parts.push(`<span>›</span><span>${escapeHtml(path[0].title)}</span>`);
	} else {
		parts.push(`<span>›</span><a href="#/${detailBase}/${encodeURIComponent(path[0].slug)}">${escapeHtml(path[0].title)}</a>`);
		parts.push(`<span>›</span><span>${escapeHtml(path[1].title)}</span>`);
	}
	return `<div class="breadcrumbs">${parts.join(' ')}</div>`;
}

function renderProjectDetail(p, parent, base = 'project') {
	const tags = (p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join(' ');
	const gh = p.github ? `<a class="btn" href="${p.github}" target="_blank" rel="noopener">Voir sur GitHub</a>` : '';
	const live = p.demo ? `<a class="btn" href="${p.demo}" target="_blank" rel="noopener">Démo</a>` : '';
	const media = (p.media || []).map(renderMediaItem).join('');
	const subBase = base === 'tp' ? 'tp' : 'project';
	const subs = (p.subprojects || []).map(sp => `<li><a href="#/${subBase}/${encodeURIComponent(sp.slug)}">${escapeHtml(sp.title)}</a> — <span class="muted">${escapeHtml(sp.summary || '')}</span></li>`).join('');
	return `
    ${breadcrumbs(parent ? [parent, p] : [p], base)}
    <h1>${escapeHtml(p.title)}</h1>
    <div class="project-hero">
      <section>
        <p>${escapeHtml(p.description || p.summary || '')}</p>
        <div style="margin:12px 0;display:flex;gap:8px;flex-wrap:wrap">${tags}</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">${gh}${live}</div>
      </section>
      <aside class="meta">
        <div><strong>Statut:</strong> <span class="muted">${escapeHtml(p.status || 'Actif')}</span></div>
        ${p.tech ? `<div style="margin-top:8px"><strong>Tech:</strong> <span class="muted">${escapeHtml(p.tech.join(', '))}</span></div>` : ''}
        ${p.period ? `<div style="margin-top:8px"><strong>Période:</strong> <span class="muted">${escapeHtml(p.period)}</span></div>` : ''}
        ${p.role ? `<div style="margin-top:8px"><strong>Rôle:</strong> <span class="muted">${escapeHtml(p.role)}</span></div>` : ''}
      </aside>
    </div>
    ${media ? `<h3>Médias</h3><div class="media-grid">${media}</div>` : ''}
    ${subs ? `<div class="subprojects"><h3>Travaux / sous-projets</h3><ul>${subs}</ul></div>` : ''}
  `;
}

function renderList(projects, base = 'project', includeAbout = true) {
	const pinned = projects.filter(p => p.pinned);
	const rest = projects.filter(p => !p.pinned);
	const pinnedBlock = pinned.length ? `
    <section>
      <h1>Projets épinglés</h1>
      <div class="grid projects">${pinned.map(p => renderProjectCard(p, base)).join('')}</div>
    </section>
  ` : '';
	const allBlock = `
    <section>
      <h1>Tous les projets</h1>
      <div class="grid projects">${[...pinned, ...rest].map(p => renderProjectCard(p, base)).join('')}</div>
    </section>`;
	const aboutBlock = `
    <section>
      <h1>À propos</h1>
      <p>Étudiant en master 2 informatique, je suis à la recherche d'un stage en programmation C++ 3D. Retrouvez mes projets, TP, et repositories. Contact: <a href="mailto:mateusz.birembaut@etu.umontpellier.fr">mateusz.birembaut@etu.umontpellier.fr</a>.</p>
    </section>
  `;
	return `${pinnedBlock}${allBlock}${includeAbout ? aboutBlock : ''}`;
}

function setActiveNav(pathRoot) {
	document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
	const map = {
		'': 'Accueil',
		'projets': 'Projets',
		'tps': 'TP',
		'repos': 'Repos'
	};
	const label = map[pathRoot] || 'Accueil';
	const link = Array.from(document.querySelectorAll('.nav-link')).find(a => a.textContent.trim() === label);
	if (link) link.classList.add('active');
}

async function router() {
	await loadData();
	const hash = location.hash || '#/';
	const parts = hash.slice(2).split('/');
	setActiveNav(parts[0] || '');

	// Home
	if (!parts[0]) {
		const manual = state.projects.filter(p => (p.source || 'manual') === 'manual');
		appEl.innerHTML = renderList(manual, 'project', true);
		return;
	}

	// TP list
	if (parts[0] === 'tps') {
		await loadTPs();
		appEl.innerHTML = `
      <section>
        <h1>TP</h1>
      </section>
      ${renderList(state.tps, 'tp', false)}
    `;
		return;
	}

	// Projets list
	if (parts[0] === 'projets') {
		const manual = state.projects.filter(p => (p.source || 'manual') === 'manual');
		appEl.innerHTML = `
      <section>
        <h1>Projets</h1>
      </section>
      ${renderList(manual, 'project', false)}
    `;
		return;
	}

	// Repos list
	if (parts[0] === 'repos') {
		const repos = state.projects.filter(p => p.source === 'auto');
		appEl.innerHTML = `
      <section>
        <h1>Repos</h1>
        <p class="muted">Liste générée automatiquement depuis GitHub. Aucun appel API côté client.</p>
      </section>
      ${renderList(repos, 'project', false)}
    `;
		return;
	}

	// Project detail
	if (parts[0] === 'project' && parts[1]) {
		const slug = decodeURIComponent(parts[1]);
		const res = findProjectBySlug(slug);
		if (!res) { appEl.innerHTML = `<p>Projet introuvable.</p>`; return; }
		appEl.innerHTML = renderProjectDetail(res.project, res.parent, 'project');
		bindMediaLightbox();
		return;
	}

	// TP detail
	if (parts[0] === 'tp' && parts[1]) {
		await loadTPs();
		const slug = decodeURIComponent(parts[1]);
		const tp = state.tps.find(t => t.slug === slug);
		if (!tp) { appEl.innerHTML = `<p>TP introuvable.</p>`; return; }
		appEl.innerHTML = renderProjectDetail(tp, undefined, 'tp');
		bindMediaLightbox();
		return;
	}

	// Fallback to home
	const manual = state.projects.filter(p => (p.source || 'manual') === 'manual');
	appEl.innerHTML = renderList(manual, 'project', true);
}
function bindMediaLightbox() {
	const lb = document.getElementById('lightbox');
	const lbImg = document.getElementById('lightboxImg');
	const lbCap = document.getElementById('lightboxCaption');
	const lbClose = document.getElementById('lightboxClose');
	const open = (src, cap = '') => {
		lbImg.src = src; lbCap.textContent = cap; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
	};
	const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); lbImg.src = ''; lbCap.textContent = ''; };
	document.querySelectorAll('.media-grid img.media').forEach(img => {
		img.addEventListener('click', () => open(img.src, img.dataset.caption || ''));
	});
	lbClose.onclick = close;
	lb.onclick = (e) => { if (e.target === lb) close(); };
	window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

window.addEventListener('hashchange', router);
router();

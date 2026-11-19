import { t, loc, locCaption } from './i18n.js';

const state = { projects: [], tps: [], loaded: false, tpsLoaded: false };

const byId = (id) => document.getElementById(id);
const appEl = byId('app');
const yearEl = byId('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

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
		appEl.innerHTML = `<div class="error">${t('err.load')}</div>`;
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
	return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

const pad = (n, w = 2) => String(n).padStart(w, '0');

/* ---------- Petits composants ---------- */

// Statut → pastille colorée (vert = terminé, orange = en cours). Le JSON garde le statut en français.
function statusBadge(status) {
	const s = status || 'Actif';
	const lower = s.toLowerCase();
	const key = lower.includes('termin') ? 'done' : lower.includes('cours') ? 'wip' : lower.includes('actif') ? 'active' : '';
	const cls = key === 'done' ? 'done' : key ? 'wip' : '';
	return `<span class="status ${cls}">${escapeHtml(key ? t('status.' + key) : s)}</span>`;
}

// Remplace les tags en bulles par une ligne de specs « C++ / OpenGL / ImGui »
function specLine(p, max = 4) {
	const items = (p.tech && p.tech.length ? p.tech : (p.tags || [])).slice(0, max);
	if (!items.length) return '';
	return `<div class="spec">${items.map(escapeHtml).join('<span class="sep">/</span>')}</div>`;
}

function sectionHead(label, count, unit = t('unit.objects')) {
	const c = typeof count === 'number' ? `<span class="count">${pad(count)} ${unit}</span>` : '';
	return `<h2 class="section-head"><span>${escapeHtml(label)}</span><span class="rule"></span>${c}</h2>`;
}

/* ---------- Cartes ---------- */

function renderProjectCard(p, base = 'project', index = 0) {
	const cover = p.cover || (p.media && p.media.find(m => m.type === 'image')?.src);
	const empty = `<div class="thumb-empty"><span>${t('card.noPreview')}</span></div>`;
	// Si l'image ne charge pas, on affiche le motif wireframe
	const coverEl = cover
		? `<img class="thumb" src="${cover}" alt="" loading="lazy" onerror="this.outerHTML='${empty.replaceAll('"', '&quot;')}'">`
		: empty;
	const link = `#/${base}/${encodeURIComponent(p.slug)}`;
	const prefix = base === 'tp' ? 'TP' : 'OBJ';
	return `
  <article class="card">
    <div class="card-head"><span class="id">${prefix}_${pad(index + 1)}</span>${statusBadge(p.status)}</div>
    <div class="thumb-wrap">${coverEl}</div>
    <div class="content">
      <h3 class="title"><a class="stretched" href="${link}">${escapeHtml(loc(p, 'title'))}</a></h3>
      <p class="muted clamp-2">${escapeHtml(loc(p, 'summary') || '')}</p>
      ${specLine(p)}
    </div>
  </article>`;
}

function renderGrid(items, base = 'project') {
	return `<div class="grid projects">${items.map((p, i) => renderProjectCard(p, base, i)).join('')}</div>`;
}

/* ---------- Médias ---------- */

function renderMediaItem(m, i) {
	const label = `${m.type.toUpperCase()}_${pad(i + 1)}`;
	const caption = locCaption(m);
	if (m.type === 'image') {
		const alt = escapeHtml(caption || t('media.preview'));
		return `<figure class="media-item${m.wide ? ' wide' : ''}"><img src="${m.src}" alt="${alt}" data-caption="${alt}" class="media" loading="lazy"><figcaption>${label}${caption ? ' · ' + alt : ''}</figcaption></figure>`;
	}
	if (m.type === 'video') {
		const cap = escapeHtml(caption || t('media.video'));
		// Clip court : lecture auto en boucle. Vidéo longue ("autoplay": false) : poster + lecture au clic.
		const auto = m.autoplay !== false;
		const attrs = auto ? 'autoplay muted loop playsinline preload="metadata"' : 'muted playsinline preload="none"';
		const poster = m.poster ? ` poster="${m.poster}"` : '';
		return `<figure class="media-item${m.wide ? ' wide' : ''}"><video src="${m.src}"${poster} ${attrs} controls aria-label="${cap}"></video><figcaption>${label}${caption ? ' · ' + cap : ''}</figcaption></figure>`;
	}
	if (m.type === 'pdf') {
		const cap = escapeHtml(caption || t('media.pdf'));
		return `<a class="pdf" href="${m.src}" target="_blank" rel="noopener" title="${t('media.openPdf')} : ${cap}"><span class="ext">.pdf</span><span>${cap} ↗</span></a>`;
	}
	if (m.type === 'link') {
		const cap = escapeHtml(caption || m.href);
		return `<a class="btn secondary" href="${m.href}" target="_blank" rel="noopener">${cap} ↗</a>`;
	}
	return '';
}

/* ---------- Détail ---------- */

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
	const rootLabel = base === 'tp' ? t('crumb.tps') : t('crumb.projects');
	const rootHref = base === 'tp' ? '#/tps' : '#/projets';
	const detailBase = base === 'tp' ? 'tp' : 'project';
	const sep = `<span class="sep">/</span>`;
	const parts = [`<a href="#/">scene</a>`, `<a href="${rootHref}">${rootLabel}</a>`];
	if (path.length === 1) {
		parts.push(`<span>${escapeHtml(path[0].slug)}</span>`);
	} else {
		parts.push(`<a href="#/${detailBase}/${encodeURIComponent(path[0].slug)}">${escapeHtml(path[0].slug)}</a>`);
		parts.push(`<span>${escapeHtml(path[1].slug)}</span>`);
	}
	return `<nav class="breadcrumbs" aria-label="${t('detail.breadcrumb')}">${parts.join(sep)}</nav>`;
}

function renderProjectDetail(p, parent, base = 'project') {
	const gh = p.github ? `<a class="btn" href="${p.github}" target="_blank" rel="noopener">${t('detail.github')} ↗</a>` : '';
	const live = p.demo ? `<a class="btn secondary" href="${p.demo}" target="_blank" rel="noopener">${t('detail.demo')} ↗</a>` : '';
	const media = (p.media || []).map(renderMediaItem).join('');
	const subBase = base === 'tp' ? 'tp' : 'project';
	const subs = (p.subprojects || []).map(sp => `<li><a href="#/${subBase}/${encodeURIComponent(sp.slug)}">${escapeHtml(loc(sp, 'title'))}</a> — <span class="muted">${escapeHtml(loc(sp, 'summary') || '')}</span></li>`).join('');
	const row = (k, v) => v ? `<dt>${k}</dt><dd>${v}</dd>` : '';
	const tagList = loc(p, 'tags') || [];
	const tags = tagList.length ? `<span class="tag-list">${tagList.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</span>` : '';
	const period = loc(p, 'period');
	const role = loc(p, 'role');
	return `
    ${breadcrumbs(parent ? [parent, p] : [p], base)}
    <h1 class="detail-title">${escapeHtml(loc(p, 'title'))}</h1>
    <div class="project-hero">
      <section class="desc">
        <p>${escapeHtml(loc(p, 'description') || loc(p, 'summary') || '')}</p>
        <div class="actions">${gh}${live}</div>
      </section>
      <aside class="inspector" aria-label="${t('detail.infoLabel')}">
        <div class="inspector-head"><span>${t('detail.inspector')}</span><span>${escapeHtml(p.slug)}</span></div>
        <dl>
          ${row(t('detail.status'), statusBadge(p.status))}
          ${row(t('detail.period'), period ? escapeHtml(period) : '')}
          ${row(t('detail.role'), role ? escapeHtml(role) : '')}
          ${row(t('detail.stack'), p.tech ? escapeHtml(p.tech.join(', ')) : '')}
          ${row(t('detail.tags'), tags)}
        </dl>
      </aside>
    </div>
    ${media ? `${sectionHead(t('section.media'), (p.media || []).length, t('unit.files'))}<div class="media-grid">${media}</div>` : ''}
    ${subs ? `<div class="subprojects">${sectionHead(t('section.subprojects'), (p.subprojects || []).length)}<ul>${subs}</ul></div>` : ''}
  `;
}

/* ---------- Listes ---------- */

function renderHero() {
	return `
    <section class="hero">
      <p class="scene-label"><span>●</span> scene://portfolio — loaded</p>
      <h1>Mateusz<br><span class="last">Birembaut</span></h1>
      <p class="lead">${t('hero.lead')}</p>
      <ul class="hero-specs">
        <li><span class="dot"></span>${t('hero.available')}</li>
        <li><span class="k">LOC</span>Montpellier</li>
        <li><span class="k">STACK</span>C++ · Qt · OpenGL · Vulkan</li>
      </ul>
      <svg class="gizmo" viewBox="0 0 100 100" aria-hidden="true">
        <line x1="50" y1="50" x2="88" y2="62" stroke="var(--axis-x)" stroke-width="2"/>
        <line x1="50" y1="50" x2="50" y2="10" stroke="var(--axis-y)" stroke-width="2"/>
        <line x1="50" y1="50" x2="16" y2="68" stroke="var(--axis-z)" stroke-width="2"/>
        <circle cx="88" cy="62" r="7" fill="var(--axis-x)"/><circle cx="50" cy="10" r="7" fill="var(--axis-y)"/><circle cx="16" cy="68" r="7" fill="var(--axis-z)"/>
        <text x="88" y="65" font-size="8" text-anchor="middle" fill="#0c0d0f" font-family="monospace" font-weight="700">X</text>
        <text x="50" y="13" font-size="8" text-anchor="middle" fill="#0c0d0f" font-family="monospace" font-weight="700">Y</text>
        <text x="16" y="71" font-size="8" text-anchor="middle" fill="#0c0d0f" font-family="monospace" font-weight="700">Z</text>
        <circle cx="50" cy="50" r="3" fill="var(--text)"/>
      </svg>
    </section>`;
}

function renderAbout() {
	return `
    <section>
      ${sectionHead(t('about.title'))}
      <div class="about">
        <p>${t('about.text')}</p>
        <p class="contact"><a href="mailto:mateusz.birembaut.pro@gmail.com">mateusz.birembaut.pro@gmail.com</a><span class="sep">/</span><a href="https://github.com/Mateusz-Birembaut" target="_blank" rel="noopener">GitHub ↗</a></p>
      </div>
    </section>`;
}

function renderList(projects, base = 'project') {
	const pinned = projects.filter(p => p.pinned);
	const rest = projects.filter(p => !p.pinned);
	const pinnedBlock = pinned.length ? `
    <section>
      ${sectionHead(t('section.pinned'), pinned.length)}
      ${renderGrid(pinned, base)}
    </section>` : '';
	const allBlock = `
    <section>
      ${sectionHead(pinned.length ? t('section.allProjects') : t('section.projects'), projects.length)}
      ${renderGrid([...pinned, ...rest], base)}
    </section>`;
	return `${pinnedBlock}${allBlock}`;
}

function setActiveNav(pathRoot) {
	document.querySelectorAll('.nav-link').forEach(a => {
		a.classList.toggle('active', a.dataset.route === pathRoot);
	});
}

/* ---------- Routeur ---------- */

async function router({ keepScroll = false } = {}) {
	await loadData();
	const hash = location.hash || '#/';
	const parts = hash.slice(2).split('/');
	const root = parts[0] || '';
	setActiveNav(['', 'projets', 'tps'].includes(root) ? root : (root === 'tp' ? 'tps' : root === 'project' ? 'projets' : ''));
	setHudScene(root ? parts.map(decodeURIComponent).join('/') : t('hud.home'));
	if (!keepScroll) window.scrollTo(0, 0);

	// Accueil
	if (!root) {
		const manual = state.projects.filter(p => (p.source || 'manual') === 'manual');
		await loadTPs();
		const previewTps = (state.tps || []).slice(0, 2);
		const tpBlock = previewTps.length ? `
      <section>
        ${sectionHead(t('section.tps'), state.tps.length)}
        ${renderGrid(previewTps, 'tp')}
      </section>` : '';
		appEl.innerHTML = renderHero() + renderList(manual, 'project') + tpBlock + renderAbout();
		bindMediaLightbox();
		return;
	}

	// Liste des TP
	if (root === 'tps') {
		await loadTPs();
		appEl.innerHTML = `
      <h1 class="page-title">${t('page.tps')}</h1>
      <section>
        ${sectionHead(t('section.tp'), state.tps.length)}
        ${renderGrid(state.tps, 'tp')}
      </section>`;
		return;
	}

	// Liste des projets
	if (root === 'projets') {
		const manual = state.projects.filter(p => (p.source || 'manual') === 'manual');
		appEl.innerHTML = `<h1 class="page-title">${t('page.projects')}</h1>${renderList(manual, 'project')}`;
		return;
	}


	// Détail projet
	if (root === 'project' && parts[1]) {
		const slug = decodeURIComponent(parts[1]);
		const res = findProjectBySlug(slug);
		if (!res) { appEl.innerHTML = `<div class="error">${t('err.project404')}</div>`; return; }
		appEl.innerHTML = renderProjectDetail(res.project, res.parent, 'project');
		bindMediaLightbox();
		return;
	}

	// Détail TP
	if (root === 'tp' && parts[1]) {
		await loadTPs();
		const slug = decodeURIComponent(parts[1]);
		const tp = state.tps.find(t => t.slug === slug);
		if (!tp) { appEl.innerHTML = `<div class="error">${t('err.tp404')}</div>`; return; }
		appEl.innerHTML = renderProjectDetail(tp, undefined, 'tp');
		bindMediaLightbox();
		return;
	}

	// Sinon : accueil
	location.hash = '#/';
}

/* ---------- Lightbox ---------- */

const lb = byId('lightbox');
const lbImg = byId('lightboxImg');
const lbCap = byId('lightboxCaption');
const closeLightbox = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); lbImg.src = ''; lbCap.textContent = ''; };
byId('lightboxClose').onclick = closeLightbox;
lb.onclick = (e) => { if (e.target === lb) closeLightbox(); };

function bindMediaLightbox() {
	document.querySelectorAll('.media-grid img.media').forEach(img => {
		img.addEventListener('click', () => {
			lbImg.src = img.src; lbCap.textContent = img.dataset.caption || '';
			lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
		});
	});
}

/* ---------- HUD : FPS + position du curseur ---------- */

const hudFps = byId('hudFps');
const hudX = byId('hudX');
const hudY = byId('hudY');
const hudScene = byId('hudScene');

function setHudScene(name) {
	if (hudScene) hudScene.textContent = name.length > 28 ? name.slice(0, 27) + '…' : name;
}

if (hudFps) {
	let frames = 0;
	let last = performance.now();
	const tick = (now) => {
		frames++;
		if (now - last >= 500) {
			hudFps.textContent = Math.round(frames * 1000 / (now - last));
			frames = 0;
			last = now;
		}
		requestAnimationFrame(tick); // le navigateur met la boucle en pause quand l'onglet est caché
	};
	requestAnimationFrame(tick);
}

window.addEventListener('pointermove', (e) => {
	if (hudX) hudX.textContent = pad(Math.round(e.clientX), 4);
	if (hudY) hudY.textContent = pad(Math.round(e.clientY), 4);
}, { passive: true });

/* ---------- Raccourcis clavier : 1-4 pour changer d'onglet, Échap pour fermer ---------- */

window.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') { closeLightbox(); return; }
	if (e.ctrlKey || e.metaKey || e.altKey) return;
	const t = e.target;
	if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
	const routes = { '1': '#/', '2': '#/projets', '3': '#/tps' };
	if (routes[e.key]) location.hash = routes[e.key];
});

window.addEventListener('hashchange', () => router());
// Changement de langue : on re-rend la page courante sans remonter en haut
window.addEventListener('langchange', () => router({ keepScroll: true }));
router();

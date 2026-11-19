// i18n.js — français / anglais.
// - Langue choisie : ?lang=en|fr dans l'URL (lien partageable), sinon choix mémorisé, sinon langue du navigateur.
// - L'URL affiche toujours la langue courante (?lang=fr / ?lang=en) : on peut la copier et l'envoyer telle quelle.
// - Textes de l'interface : dictionnaire ci-dessous.
// - Contenu des projets : bloc "en" dans projects.json / tps.json (+ "caption_en" sur les médias).

const STRINGS = {
	fr: {
		'meta.title': 'Portfolio — Mateusz Birembaut',
		'meta.description': 'Portfolio de Mateusz Birembaut, développeur C++ : rendu 3D temps réel, moteurs, simulation et applications Qt.',
		'nav.home': 'Accueil',
		'nav.projects': 'Projets',
		'nav.tps': 'TP',
		'nav.label': 'Navigation principale',
		'shading.label': 'Mode de rendu',
		'shading.shaded': 'Rendu normal',
		'shading.wire': 'Fil de fer',
		'shading.normals': 'Normales',
		'theme.toLight': 'Passer en thème clair',
		'theme.toDark': 'Passer en thème sombre',
		'theme.title': 'Thème clair / sombre',
		'lang.label': 'Langue',
		'theme.light': 'Clair',
		'theme.dark': 'Sombre',
		'lightbox.label': "Agrandir l'image",
		'lightbox.close': 'Fermer',
		'footer.tagline': 'C++ · Qt · OpenGL · Vulkan · Montpellier',

		'hero.lead': 'Développeur <strong>C++</strong>, des applications de bureau (Qt) au rendu 3D temps réel&nbsp;: moteurs, ray tracing, simulation sur GPU, traitement de maillages et de vidéo. Diplômé d\'un <strong>Master Informatique Image &amp; 3D</strong> (Montpellier, 2026).',
		'hero.available': 'Disponible · recherche un poste en C++',
		'about.title': 'À propos',
		'about.text': 'Diplômé en 2026 d\'un Master Informatique spécialité Image &amp; 3D à la Faculté des Sciences de Montpellier, je recherche un poste de développeur C++ : applications de bureau, outils, moteurs ou rendu 3D. Dernière expérience : stage à l\'Université Paul Valéry sur <a href="#/project/slv">SLV</a>, une application d\'analyse vidéo multivue en C++ / Qt (libVLC, FFmpeg, OpenCV).',

		'section.projects': 'Projets',
		'section.pinned': 'Projets épinglés',
		'section.allProjects': 'Tous les projets',
		'section.tps': 'Travaux pratiques',
		'section.tp': 'TP',
		'section.media': 'Médias',
		'section.subprojects': 'Sous-projets',
		'unit.objects': 'objets',
		'unit.files': 'fichiers',
		'page.projects': 'Projets',
		'page.tps': 'Travaux pratiques',

		'card.noPreview': 'NO PREVIEW',
		'detail.github': 'Voir sur GitHub',
		'detail.demo': 'Démo',
		'detail.inspector': 'Inspecteur',
		'detail.infoLabel': 'Informations du projet',
		'detail.breadcrumb': "Fil d'Ariane",
		'detail.status': 'Statut',
		'detail.period': 'Période',
		'detail.role': 'Rôle',
		'detail.stack': 'Stack',
		'detail.tags': 'Tags',
		'crumb.projects': 'projets',
		'crumb.tps': 'tp',

		'media.preview': 'Aperçu',
		'media.video': 'Vidéo',
		'media.pdf': 'Document PDF',
		'media.openPdf': 'Ouvrir le PDF',

		'status.done': 'Terminé',
		'status.wip': 'En cours',
		'status.active': 'Actif',

		'err.load': 'ERR · Impossible de charger les projets. Vérifiez data/projects.json.',
		'err.project404': '404 · Projet introuvable.',
		'err.tp404': '404 · TP introuvable.',
		'hud.home': 'accueil',
	},
	en: {
		'meta.title': 'Portfolio — Mateusz Birembaut',
		'meta.description': 'Portfolio of Mateusz Birembaut, C++ developer: real-time 3D rendering, engines, simulation and Qt applications.',
		'nav.home': 'Home',
		'nav.projects': 'Projects',
		'nav.tps': 'Labs',
		'nav.label': 'Main navigation',
		'shading.label': 'Shading mode',
		'shading.shaded': 'Normal rendering',
		'shading.wire': 'Wireframe',
		'shading.normals': 'Normals',
		'theme.toLight': 'Switch to light theme',
		'theme.toDark': 'Switch to dark theme',
		'theme.title': 'Light / dark theme',
		'lang.label': 'Language',
		'theme.light': 'Light',
		'theme.dark': 'Dark',
		'lightbox.label': 'Enlarge image',
		'lightbox.close': 'Close',
		'footer.tagline': 'C++ · Qt · OpenGL · Vulkan · Montpellier, France',

		'hero.lead': '<strong>C++</strong> developer, from desktop applications (Qt) to real-time 3D rendering: engines, ray tracing, GPU simulation, mesh and video processing. <strong>MSc in Computer Science, Image &amp; 3D</strong> (Montpellier, France, 2026).',
		'hero.available': 'Available · looking for a C++ position',
		'about.title': 'About',
		'about.text': 'I graduated in 2026 with an MSc in Computer Science (Image &amp; 3D track) from the Faculty of Science of Montpellier, and I am looking for a C++ developer position: desktop applications, tools, engines or 3D rendering. Most recent experience: an internship at Université Paul Valéry working on <a href="#/project/slv">SLV</a>, a multi-view video analysis application in C++ / Qt (libVLC, FFmpeg, OpenCV).',

		'section.projects': 'Projects',
		'section.pinned': 'Pinned projects',
		'section.allProjects': 'All projects',
		'section.tps': 'Lab assignments',
		'section.tp': 'Labs',
		'section.media': 'Media',
		'section.subprojects': 'Subprojects',
		'unit.objects': 'objects',
		'unit.files': 'files',
		'page.projects': 'Projects',
		'page.tps': 'Lab assignments',

		'card.noPreview': 'NO PREVIEW',
		'detail.github': 'View on GitHub',
		'detail.demo': 'Demo',
		'detail.inspector': 'Inspector',
		'detail.infoLabel': 'Project details',
		'detail.breadcrumb': 'Breadcrumb',
		'detail.status': 'Status',
		'detail.period': 'Period',
		'detail.role': 'Role',
		'detail.stack': 'Stack',
		'detail.tags': 'Tags',
		'crumb.projects': 'projects',
		'crumb.tps': 'labs',

		'media.preview': 'Preview',
		'media.video': 'Video',
		'media.pdf': 'PDF document',
		'media.openPdf': 'Open PDF',

		'status.done': 'Completed',
		'status.wip': 'In progress',
		'status.active': 'Active',

		'err.load': 'ERR · Could not load projects. Check data/projects.json.',
		'err.project404': '404 · Project not found.',
		'err.tp404': '404 · Lab not found.',
		'hud.home': 'home',
	},
};

const LANGS = ['fr', 'en'];

function detectLang() {
	try {
		const q = new URLSearchParams(location.search).get('lang');
		if (LANGS.includes(q)) {
			localStorage.setItem('lang', q);
			return q;
		}
	} catch { }
	try {
		const s = localStorage.getItem('lang');
		if (LANGS.includes(s)) return s;
	} catch { }
	return (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

let lang = detectLang();

// Écrit ?lang=xx dans l'adresse sans recharger la page (garde le #/projet éventuel)
function syncUrl() {
	try {
		const url = new URL(location.href);
		if (url.searchParams.get('lang') === lang) return;
		url.searchParams.set('lang', lang);
		history.replaceState(history.state, '', url.pathname + url.search + url.hash);
	} catch { }
}

export const getLang = () => lang;

// Texte d'interface
export function t(key) {
	return STRINGS[lang][key] ?? STRINGS.fr[key] ?? key;
}

// Champ d'un projet dans la langue courante (repli sur le français si pas traduit)
export function loc(obj, field) {
	if (!obj) return '';
	if (lang === 'en' && obj.en && obj.en[field] != null && obj.en[field] !== '') return obj.en[field];
	return obj[field];
}

// Légende d'un média
export function locCaption(m) {
	if (lang === 'en' && m.caption_en) return m.caption_en;
	return m.caption;
}

// Applique les textes statiques de index.html (attributs data-i18n*)
export function applyStatic() {
	document.documentElement.lang = lang;
	document.title = t('meta.title');
	document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
	document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
	document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
	document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
	document.querySelectorAll('.lang-switch button').forEach(b => {
		b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
	});
}

export function setLang(next) {
	if (!LANGS.includes(next) || next === lang) return;
	lang = next;
	try { localStorage.setItem('lang', next); } catch { }
	syncUrl();
	applyStatic();
	window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

syncUrl();
// Navigation (clic sur un projet, retour arrière…) : l'adresse garde la langue affichée
window.addEventListener('hashchange', syncUrl);
window.addEventListener('popstate', syncUrl);
applyStatic();
document.querySelectorAll('.lang-switch button').forEach(b => {
	b.addEventListener('click', () => setLang(b.dataset.lang));
});

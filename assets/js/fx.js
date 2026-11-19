// fx.js — modes de rendu du viewport : shaded / wire / normals.
// Les filtres SVG (#fx-edges, #fx-normals) sont dans index.html, les styles dans styles.css.

const root = document.documentElement;

/* ==========================================================================
   1. Modes de rendu : shaded / wire / normals
   ========================================================================== */

const MODES = ['shaded', 'wire', 'normals'];

function setShading(mode) {
	if (!MODES.includes(mode)) return false;
	root.dataset.shading = mode;
	document.querySelectorAll('.shading button').forEach(b => {
		b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
	});
	try { sessionStorage.setItem('shading', mode); } catch { }
	return true;
}

document.querySelectorAll('.shading button').forEach(b => {
	b.addEventListener('click', () => setShading(b.dataset.mode));
});
try { setShading(sessionStorage.getItem('shading') || 'shaded'); } catch { setShading('shaded'); }

/* ==========================================================================
   Thème clair / sombre
   (le thème initial est déjà posé par le petit script dans <head>)
   ========================================================================== */

const themeBtn = document.getElementById('themeToggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const systemLight = window.matchMedia('(prefers-color-scheme: light)');

function applyTheme(theme) {
	root.dataset.theme = theme;
	if (themeMeta) themeMeta.content = theme === 'light' ? '#ffffff' : '#141619';
	if (themeBtn) themeBtn.setAttribute('aria-label', theme === 'light' ? 'Passer en thème sombre' : 'Passer en thème clair');
}

function storedTheme() {
	try { return localStorage.getItem('theme'); } catch { return null; }
}

applyTheme(root.dataset.theme === 'light' ? 'light' : 'dark');

themeBtn?.addEventListener('click', () => {
	const next = root.dataset.theme === 'light' ? 'dark' : 'light';
	applyTheme(next);
	try { localStorage.setItem('theme', next); } catch { }
});

// Si le visiteur n'a rien choisi, on suit les changements du système (ex. passage auto en mode sombre le soir)
systemLight.addEventListener?.('change', (e) => {
	if (!storedTheme()) applyTheme(e.matches ? 'light' : 'dark');
});

export { setShading, applyTheme };

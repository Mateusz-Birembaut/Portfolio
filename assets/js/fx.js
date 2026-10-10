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

export { setShading };

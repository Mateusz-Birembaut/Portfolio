# Portfolio (GitHub Pages)

Site portfolio statique pour Mateusz Birembaut, sans appels à l'API GitHub côté client (pas de limites API). Les projets sont déclarés dans `data/projects.json` et les médias (images/PDF) sont stockés localement dans `assets/projects/...`.

## Ajouter/éditer des projets
- Modifiez `data/projects.json`.
- Champs utiles par projet:
  - `slug` (obligatoire): identifiant d'URL.
  - `title`, `summary`, `description`, `status`, `period`, `role`.
  - `tags`: ["JS", "TP"], `tech`: ["Python", "React"].
  - `github` (URL), `demo` (URL), `cover` (image optionnelle affichée sur la carte).
  - `media`: liste d'objets
    - image: `{ "type": "image", "src": "assets/.../image.png", "caption": "Texte" }`
    - pdf: `{ "type": "pdf", "src": "assets/.../doc.pdf", "caption": "Texte" }`
    - link: `{ "type": "link", "href": "https://...", "caption": "Texte" }`
  - `subprojects`: liste de sous-projets (mêmes champs que projet, sauf `subprojects`).

Astuce: placez les fichiers de chaque projet dans `assets/projects/<slug>/` pour rester organisé.

## Déploiement GitHub Pages
- Le repo inclut un workflow `.github/workflows/deploy-pages.yml`.
- Activez Pages: Repository Settings → Pages → Source: GitHub Actions.
- À chaque push sur `main`, le site est publié.
- Fichier `.nojekyll` inclus pour servir les dossiers commençant par `_` si besoin.

URL:
- Projet Pages: https://Mateusz-Birembaut.github.io/Portfolio
- Si vous souhaitez un site utilisateur (racine): créez un repo `Mateusz-Birembaut.github.io` et copiez-y ce site.

## Développement local
- Servez le dossier via un serveur local pour éviter les soucis CORS.

Exemples (optionnels):
```bash
# Python
python3 -m http.server 8000
# Node
npx serve -l 8000
```
Puis allez sur http://localhost:8000

## Personnalisation
- Styles: `assets/css/styles.css`
- JS (router + rendu): `assets/js/app.js`
- Données: `data/projects.json`

## Pourquoi sans API GitHub ?
- Vous avez demandé d'éviter les limites d'appels API. En intégrant les données statiquement (JSON), il n'y a aucun appel à l'API GitHub sur le client. Vous contrôlez totalement le contenu et vous pouvez lier vos dépôts via `github`.

## TODO suggérés
- Formulaire d'édition hors-ligne (génération du JSON via script).
- Sitemap et metadonnées SEO de base.
- Tests visuels (Playwright) si besoin.

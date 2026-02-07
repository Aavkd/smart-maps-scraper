# Smart Maps Scraper — Plan d’amélioration (Apify)

## ✅ Audit rapide (état actuel)
- Build Apify OK
- Scraping Google Maps OK
- Enrichissement tech stack OK (WordPress, GA détectés)

**Problèmes observés :**
1) Lenteur importante (≈9 min pour 5 résultats)
2) Warnings mémoire constants (≈95%)
3) Timeouts sur certains sites (ex: poponveneers.com)
4) Concurrence non optimisée (Playwright partout)

---

## 🧩 Plan d’amélioration (sans dev maintenant)

### Phase 1 — Quick Wins (1–2h)
- Augmenter la mémoire de l’actor dans Apify settings
- Réduire le timeout website (30–45s)
- Limiter les retries d’enrichissement (max 1)

### Phase 2 — Performance (3–4h)
- Séparer le crawl :
  - Maps → Playwright
  - Enrichissement website → HTTP (axios + cheerio)
- Ajouter un flag `enrichWebsite: true/false`
- Ajouter un paramètre `maxEnrich` pour limiter les enrichissements

### Phase 3 — Robustesse (2–3h)
- Sélecteurs Maps plus solides (fallbacks par texte)
- Cookies multi-langues (FR/DE/ES)
- Détection de blocage Google → fallback proxy / retry

### Phase 4 — UX / Produit (1–2h)
- `maxResults` plus stable
- `onlyWithWebsite` (filtre)
- `outputFormat: simple | full`

---

## ✅ Résultat attendu
- Run 3–4x plus rapide
- Moins de RAM, moins de timeouts
- Plus stable pour publication Store

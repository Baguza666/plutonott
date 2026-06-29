# Pluton OTT — Audit d'implémentation

> **Date :** 2026-06-28T22:55+01:00
> **Auditeur :** Audit automatisé (aucune donnée inventée)
> **Périmètre :** Dépôt `/Users/hichamzineddine/Desktop/plutonott`
> **Contrainte :** Aucun fichier runtime modifié. Seul ce document est créé.

---

## 1. Stack réellement détectée

| Élément PRD attendu | Détecté dans le dépôt | Statut |
|---|---|---|
| Next.js App Router | ❌ Aucun `package.json`, aucun `next.config.*` | **ABSENT** |
| TypeScript strict | ❌ Aucun `tsconfig.json` | **ABSENT** |
| Tailwind CSS | ❌ Aucun `tailwind.config.*` | **ABSENT** |
| Supabase PostgreSQL | ❌ Aucune migration, aucun fichier `.env` | **ABSENT** |
| Vercel | ❌ Aucun `vercel.json` | **ABSENT** |
| ESLint | ❌ Aucun `eslint.config.*` | **ABSENT** |
| Git | ❌ Aucun répertoire `.git` | **ABSENT** |
| Node.js lockfile | ❌ Aucun `package-lock.json` / `pnpm-lock.yaml` / `yarn.lock` | **ABSENT** |

**Versions détectées :** Aucune — le dépôt ne contient aucun manifeste de dépendances.

---

## 2. Structure des dossiers

```
plutonott/
├── Pluton OTT - PAGE COPY (1).md     ← 204 501 octets, 2 306 lignes
├── combined_keywords.txt              ← 1 639 octets, 112 lignes (111 + EOF)
└── (aucun autre fichier)
```

### Écarts de structure par rapport au PRD

| Fichier attendu par le PRD | Fichier réel trouvé | Écart |
|---|---|---|
| `docs/source/pluton-page-copy.md` | `./Pluton OTT - PAGE COPY (1).md` (racine) | Mauvais emplacement, nom différent |
| `docs/source/combined_keywords.txt` | `./combined_keywords.txt` (racine) | Mauvais emplacement |
| `package.json` | — | Totalement absent |
| `next.config.ts` ou `next.config.mjs` | — | Totalement absent |
| `tsconfig.json` | — | Totalement absent |
| `tailwind.config.ts` | — | Totalement absent |
| `eslint.config.*` | — | Totalement absent |
| `.git/` | — | Totalement absent |
| `supabase/migrations/` | — | Totalement absent |
| `src/` ou `app/` | — | Totalement absent |

> **Conclusion :** Le dépôt est un espace de travail vierge contenant uniquement les deux fichiers sources éditoriaux, déposés à la racine au lieu du chemin `docs/source/` prescrit. **Aucune application Next.js n'existe.**

---

## 3. Vérification des nombres contractuels

Les commandes suivantes ont été exécutées sur les fichiers tels que présents dans le dépôt.

### 3.1 Page Copy — Blocs et routes

| Métrique | Attendu | Mesuré | Statut |
|---|---|---|---|
| Lignes `URL:` dans le fichier page-copy | 77 | **77** | ✅ Vérifié |
| Routes URL uniques (chemin avant le premier espace) | 69 | **69** | ✅ Vérifié |
| Routes dupliquées | 8 | **8** | ✅ Vérifié |

**Commande de reproduction :**

```bash
# 77 blocs
grep -c '^URL:' "Pluton OTT - PAGE COPY (1).md"
# 69 uniques
grep '^URL:' "Pluton OTT - PAGE COPY (1).md" | sed 's/^URL:[[:space:]]*//' | sed 's/[[:space:]].*//' | sort -u | wc -l
# 8 doublons
grep '^URL:' "Pluton OTT - PAGE COPY (1).md" | sed 's/^URL:[[:space:]]*//' | sed 's/[[:space:]].*//' | sort | uniq -d | wc -l
```

### 3.2 Mots-clés

| Métrique | Attendu | Mesuré | Statut |
|---|---|---|---|
| Lignes non vides | 112 | **112** | ✅ Vérifié |
| Mots-clés uniques (après trim, case-sensitive) | 107 | **107** | ✅ Vérifié |

**Commande de reproduction :**

```bash
# 112 lignes non vides
grep -c '[^[:space:]]' combined_keywords.txt
# 107 uniques
grep '[^[:space:]]' combined_keywords.txt | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | sort -u | wc -l
```

**5 mots-clés dupliqués :**

| Mot-clé | Occurrences |
|---|---|
| `iptv and ott` | 2 (lignes 56, 106) |
| `iptv ott` | 2 (lignes 28, 102) |
| `iptv ott service` | 2 (lignes 29, 103) |
| `ott and iptv` | 2 (lignes 23, 101) |
| `ott iptv` | 2 (lignes 32, 104) |

---

## 4. Tableau des 77 blocs éditoriaux

> **Règle :** La dernière occurrence d'une route dupliquée est la version canonique temporaire. Les variantes antérieures ne sont pas supprimées.

| # | Ligne | Route | Intent | Doublon | Canonique temp. |
|---|---|---|---|---|---|
| 1 | 3 | `/` | Commercial, Transactional | — | Oui |
| 2 | 37 | `/tarifs-grossiste/` | Transactional, Commercial | — | Oui |
| 3 | 63 | `/fonctionnement-panel/` | Informational, Commercial | — | Oui |
| 4 | 92 | `/iptv-france/installation/` | Informational, Commercial | — | Oui |
| 5 | 118 | `/iptv-france/test-gratuit/` | Commercial, Informational | — | Oui |
| 6 | 146 | `/iptv-france/abonnement/` | Commercial, Transactional | — | Oui |
| 7 | 173 | `/ott-iptv/` | Navigational, Informational | — | Oui |
| 8 | 200 | `/comparatif/iron-iptv/` | Transactional | — | Oui |
| 9 | 228 | `/comparatif/atlas-iptv/` | Commercial, Transactional | — | Oui |
| 10 | 255 | `/iptv-france/support/` | Informational, Commercial | — | Oui |
| 11 | 283 | `/iptv-france/diaspora/maroc/` | Commercial (B2B) | — | Oui |
| 12 | 311 | `/iptv-france/diaspora/tunisie/` | Commercial (B2B) | — | Oui |
| 13 | 338 | `/comparatif/xtreme-hd-iptv/` | Informational, Commercial | — | Oui |
| 14 | 365 | `/comparatif/smartone-iptv/` | Informational | — | Oui |
| 15 | 392 | `/comparatif/cdiscount/` | Navigational, Transactional | — | Oui |
| 16 | 419 | `/comparatif/pluton-ott/` | Informational | — | Oui |
| 17 | 446 | `/comparatif/pure-iptv/` | Informational, Commercial | — | Oui |
| 18 | 474 | `/comparatif/set-iptv/` | Informational | — | Oui |
| 19 | 501 | `/comparatif/king-iptv/` | Commercial | — | Oui |
| 20 | 527 | `/comparatif/flix-iptv/` | Commercial | — | Oui |
| 21 | 554 | `/comparatif/iptv-atlas-pro/` | Commercial, Informational | — | Oui |
| 22 | 581 | `/comparatif/trex-iptv/` | Commercial | — | Oui |
| 23 | 608 | `/comparatif/lion-ott/` | Commercial, Informational | — | Oui |
| 24 | 635 | `/comparatif/crystal-ott/` | Commercial, Navigational | — | Oui |
| 25 | 662 | `/comparatif/xenon-iptv/` | Commercial, Informational | — | Oui |
| 26 | 689 | `/comparatif/mario-iptv/` | Informational, Commercial | — | Oui |
| 27 | 716 | `/comparatif/lynk-iptv/` | Commercial, Informational | — | Oui |
| 28 | 743 | `/comparatif/orca-iptv/` | Commercial | — | Oui |
| 29 | 770 | `/comparatif/room-iptv/` | Commercial, Informational | — | Oui |
| 30 | 797 | `/comparatif/foxx-iptv/` | Commercial | — | Oui |
| 31 | 824 | `/comparatif/majestic-iptv/` | Commercial | **V1** | ❌ Remplacé par #70 |
| 32 | 851 | `/comparatif/z2u-iptv/` | Navigational, Transactional | **V1** | ❌ Remplacé par #71 |
| 33 | 878 | `/comparatif/cover-iptv/` | Informational | **V1** | ❌ Remplacé par #72 |
| 34 | 904 | `/comparatif/elon-iptv/` | Commercial | **V1** | ❌ Remplacé par #73 |
| 35 | 931 | `/comparatif/nox-iptv/` | Commercial | — | Oui |
| 36 | 958 | `/comparatif/platinum-iptv/` | Navigational, Commercial | **V1** | ❌ Remplacé par #76 |
| 37 | 985 | `/comparatif/smarter-one-iptv/` | Informational, Commercial | — | Oui |
| 38 | 1012 | `/comparatif/lynx-iptv/` | Commercial | **V1** | ❌ Remplacé par #75 |
| 39 | 1039 | `/comparatif/iplay-iptv/` | Informational | **V1** | ❌ Remplacé par #74 |
| 40 | 1066 | `/comparatif/max-ott/` | Informational | **V1** | ❌ Remplacé par #77 |
| 41 | 1093 | `/comparatif/smart-one-iptv/` | Informational | — | Oui |
| 42 | 1120 | `/comparatif/iptv-iron/` | Informational | — | Oui |
| 43 | 1147 | `/comparatif/iptv-nox/` | Commercial | — | Oui |
| 44 | 1174 | `/iptv-france/diaspora/iptv/` | Commercial (B2B) | — | Oui |
| 45 | 1201 | `/iptv-france/` | Commercial, Informational | — | Oui |
| 46 | 1235 | `/revendeur/panel-administration/` | Informational, Technical | — | Oui |
| 47 | 1263 | `/revendeur/infrastructure-serveurs/` | Informational, Technical | — | Oui |
| 48 | 1290 | `/revendeur/contact-support/` | Commercial, Informational | — | Oui |
| 49 | 1317 | `/devenir-revendeur-iptv/` | Commercial, Transactional | — | Oui |
| 50 | 1345 | `/programme-master-reseller/` | Commercial, Transactional | — | Oui |
| 51 | 1372 | `/politique-de-remboursement-b2b/` | Informational, Legal | — | Oui |
| 52 | 1399 | `/conditions-generales-b2b/` | Informational, Legal | — | Oui |
| 53 | 1423 | `/revendeur/gestion-vod-series/` | Informational, Commercial | — | Oui |
| 54 | 1448 | `/revendeur/api-xtream-codes/` | Informational, Technical | — | Oui |
| 55 | 1476 | `/revendeur/contact-commercial/` | Commercial | — | Oui |
| 56 | 1503 | `/qui-sommes-nous/` | Informational, Trust | — | Oui |
| 57 | 1528 | `/integration-api-revendeur/` | Informational, Technical | — | Oui |
| 58 | 1554 | `/blog/comment-devenir-meilleur-revendeur-iptv/` | Informational | — | Oui |
| 59 | 1583 | `/revendeur/guide-configuration-smart-tv/` | Informational, Technical | — | Oui |
| 60 | 1608 | `/revendeur/guide-configuration-firestick/` | Informational, Technical | — | Oui |
| 61 | 1633 | `/revendeur/gestion-anti-buffering/` | Informational, Technical | — | Oui |
| 62 | 1658 | `/revendeur/choisir-entre-sub-reseller-et-master/` | Informational, Commercial | — | Oui |
| 63 | 1690 | `/iptv-france/securite-anti-blocage/` | Informational, Commercial | — | ⚠️ **ROUTE À RISQUE** |
| 64 | 1733 | `/iptv-france/compatibilite-fai/` | Informational, Technical | — | Oui |
| 65 | 1776 | `/iptv-france/vod-series-revendeur/` | Commercial (B2B) | — | Oui |
| 66 | 1819 | `/iptv-france/api-developpement/` | Technical, Informational | — | Oui |
| 67 | 1862 | `/comparatif/` | Navigational, Commercial | — | Oui |
| 68 | 1890 | `/revendeur/tutoriels-video/` | Informational, Technical | — | Oui |
| 69 | 1915 | `/iptv-france/faq-revendeur/` | Informational, Commercial | — | Oui |
| 70 | 1937 | `/comparatif/majestic-iptv/` | Commercial, Informational | **V2 — CANON** | ✅ |
| 71 | 1976 | `/comparatif/z2u-iptv/` | Navigational, Transactional, Commercial | **V2 — CANON** | ✅ |
| 72 | 2015 | `/comparatif/cover-iptv/` | Informational, Commercial | **V2 — CANON** | ✅ |
| 73 | 2055 | `/comparatif/elon-iptv/` | Commercial | **V2 — CANON** | ✅ |
| 74 | 2095 | `/comparatif/iplay-iptv/` | Informational, Commercial | **V2 — CANON** | ✅ |
| 75 | 2186 | `/comparatif/lynx-iptv/` | Commercial, Informational | **V2 — CANON** | ✅ |
| 76 | 2230 | `/comparatif/platinum-iptv/` | Navigational, Commercial | **V2 — CANON** | ✅ |
| 77 | 2268 | `/comparatif/max-ott/` | Informational, Commercial | **V2 — CANON** | ✅ |

### 4.1 Résumé des 8 doublons

| Route | Bloc V1 (# / ligne) | Bloc V2 — canon temp. (# / ligne) | Différences H1 |
|---|---|---|---|
| `/comparatif/majestic-iptv/` | #31 / L824 | #70 / L1937 | V1: « Remplacer Majestic IPTV par un Panel… » → V2: « Alternative à Majestic IPTV : Un Panel Grossiste Pensé… » |
| `/comparatif/z2u-iptv/` | #32 / L851 | #71 / L1976 | V1: « Grossiste IPTV vs Marketplaces (Z2U)… » → V2: « Z2U IPTV ou Panel Grossiste Direct… » |
| `/comparatif/cover-iptv/` | #33 / L878 | #72 / L2015 | V1: « L'Alternative OTT Performante à Cover IPTV » → V2: « Cover IPTV : Une Alternative Grossiste avec une Couverture Vérifiable » |
| `/comparatif/elon-iptv/` | #34 / L904 | #73 / L2055 | V1: « Panel B2B : Mettez à Jour votre Réseau depuis Elon IPTV » → V2: « Alternative à Elon IPTV : Développez Votre Réseau… » |
| `/comparatif/iplay-iptv/` | #39 / L1039 | #74 / L2095 | V1: « Fournissez des Accès pour l'Application iPlay IPTV » → V2: « Fournissez des Accès Compatibles aux Appareils… » |
| `/comparatif/lynx-iptv/` | #38 / L1012 | #75 / L2186 | V1: « Migration B2B : Remplacer Lynx IPTV… » → V2: « Alternative à Lynx IPTV : Améliorez la Gestion et la Rétention… » |
| `/comparatif/platinum-iptv/` | #36 / L958 | #76 / L2230 | V1: « L'Alternative Premium à Platinum IPTV » → V2: « Platinum IPTV : Une Alternative Premium pour les Revendeurs Exigeants » |
| `/comparatif/max-ott/` | #40 / L1066 | #77 / L2268 | V1: « L'Alternative B2B à Max OTT » → V2: « Max OTT : Une Alternative B2B pour un Streaming Mieux Administré » |

### 4.2 Redirections et pages alias documentées dans le source

Le fichier page-copy contient deux directives de redirection SEO internes :

| URL source | URL cible | Type | Note |
|---|---|---|---|
| `/comparatif/iptv-nox/` (bloc #43, L1147) | `/comparatif/nox-iptv/` (bloc #35, L931) | 301 permanente | Directive explicite dans la note SEO (L2137-2146) |
| `/comparatif/iptv-iron/` (bloc #42, L1120) | `/comparatif/iron-iptv/` (bloc #8, L200) | **Non documentée** | Même logique attendue, aucune directive explicite |

La note SEO à la ligne 2197 soulève un doute sur `/comparatif/lynk-iptv/` vs `/comparatif/lynx-iptv/` — deux marques ou une variante orthographique ? Décision éditoriale requise.

---

## 5. Distinction : pages publiques, endpoint de tracking, base de données

### 5.1 Pages publiques (69 routes uniques)

Toutes les 69 routes listées en §4 sont des pages publiques destinées au rendu SSR/SSG Next.js.

### 5.2 Endpoint de tracking

| Endpoint | Fonction attendue | Données | Risque |
|---|---|---|---|
| `/api/whatsapp-lead` (ou équivalent) | Enregistrer les clics CTA WhatsApp | `timestamp`, `page_source`, `cta_label` | Voir §7 UNKNOWN — politique de conservation |

> **Safe default :** Ne stocker aucune adresse IP, aucun numéro WhatsApp, aucun contenu de conversation et aucune empreinte persistante dans `whatsapp_leads`.

### 5.3 Base de données Supabase

| Table attendue | Colonnes probables | Source | Statut |
|---|---|---|---|
| `packs` | `id`, `name`, `credits`, `price`, `currency`, `active` | Annotations `[Schema: Product & Offer]` dans le page-copy | **AUCUNE MIGRATION EXISTANTE** |
| `whatsapp_leads` | `id`, `created_at`, `page`, `cta` | Logique de tracking PRD | **AUCUNE MIGRATION EXISTANTE** |

---

## 6. Liste exhaustive des UNKNOWN nécessitant une décision utilisateur

Chaque élément ci-dessous **bloque** la publication et/ou l'implémentation tant qu'il n'est pas résolu.

| # | UNKNOWN | Impact | Catégorie |
|---|---|---|---|
| U-01 | URL publique canonique définitive (ex: `plutonott.com`, `pluton-ott.com`, autre) | Toute la configuration `next.config`, `sitemap.xml`, balises `canonical`, OG tags | Build, SEO |
| U-02 | Identifiants du projet Supabase et stratégie de migration d'une éventuelle base existante | Connexion DB, variables d'environnement, schéma initial | Build, Données |
| U-03 | Prix réels, devises, quantités de crédits et règles d'expiration | Toute annotation `[Schema: Product & Offer]` — au moins 10 occurrences dans la copie | Données, Conformité |
| U-04 | Dénomination sociale, adresse, pays d'enregistrement, numéro fiscal et responsable de publication | Pages `/qui-sommes-nous/`, `/conditions-generales-b2b/`, `/politique-de-remboursement-b2b/`, mentions légales | Conformité |
| U-05 | Autorisations de marque relatives aux noms Atlas, Iron, Trex, Crystal, Lynx et aux autres noms tiers | 33 routes `/comparatif/*` mentionnant des marques tierces | Conformité, Sécurité juridique |
| U-06 | Preuves documentaires relatives aux droits de distribution territoriaux | Affirmations sur la couverture Ligue 1+, Canal+, beIN Sports, diaspora | Conformité |
| U-07 | Conditions exactes des lignes de test 24 h (consommation de crédits, nombre par jour, restrictions) | Pages `/iptv-france/test-gratuit/`, `/fonctionnement-panel/`, `/politique-de-remboursement-b2b/` | Données |
| U-08 | Politique de remboursement juridiquement approuvée | Page `/politique-de-remboursement-b2b/` — le contenu actuel est un brouillon non validé | Conformité |
| U-09 | Méthodes de paiement manuelles réellement acceptées (carte, virement, portefeuille, crypto) | Page `/tarifs-grossiste/`, mentions dans de multiples blocs | Données |
| U-10 | Délai de rafraîchissement attendu du catalogue Supabase (ISR `revalidate`) | Performance SSR/ISR, cohérence des prix affichés | Performance |
| U-11 | Politique de conservation des événements `whatsapp_leads` (durée, purge, RGPD) | Table `whatsapp_leads`, conformité RGPD | Sécurité, Conformité |
| U-12 | Assets de marque officiels en WebP ou AVIF (logo, favicon, OG image) | Toutes les pages, `<head>`, méta OG | Build |
| U-13 | Statut vérifié ou non du témoignage attribué à « Albert, Revendeur IPTV, France, Février 2026 » (L33) | Bloc #1 (page d'accueil) — `[Schema: Review]` interdit sans vérification | Conformité |
| U-14 | Statut vérifié ou non du témoignage attribué à « Marc, Grossiste IPTV, France, 2026 » (L1231) | Bloc #45 (`/iptv-france/`) — `[Schema: Review]` interdit sans vérification | Conformité |
| U-15 | Décision éditoriale finale sur les huit routes dupliquées (V1 vs V2) | 8 routes `/comparatif/*` — voir §4.1 | SEO |
| U-16 | Décision juridique sur la route `/iptv-france/securite-anti-blocage/` | Voir §7.1 — contenu de contournement réseau | Conformité, Sécurité |
| U-17 | Clarification `/comparatif/lynk-iptv/` vs `/comparatif/lynx-iptv/` — deux marques ou variante orthographique ? | Note SEO L2195-2197. Si identique, fusionner + 301. | SEO |
| U-18 | Décision sur la redirection `/comparatif/iptv-iron/` → `/comparatif/iron-iptv/` (non documentée explicitement, par analogie avec nox) | Bloc #42 vs #8 | SEO |

---

## 7. Risques bloquants classés

### 7.1 🔴 Conformité éditoriale — Route à risque

**Route :** `/iptv-france/securite-anti-blocage/` (bloc #63, ligne 1690)

**H1 :** « Contourner les Blocages FAI : Sécurisez votre Réseau de Revendeur »

**Problèmes identifiés :**

1. Le H1 utilise explicitement le verbe « Contourner » appliqué aux « Blocages FAI ».
2. Le body (L1694) mentionne : « infrastructure de livraison de contenu (CDN) sécurisée, conçue pour résister aux pics de charge et **contourner les restrictions réseau** ».
3. Mention de « forum iptv illégal » et « marché gris de l'IPTV » (L1694).
4. La Trust Strip inclut « Assistance anti-blocage ».
5. L1704 décrit un mécanisme de basculement automatique d'IP pour échapper au ciblage FAI.

**Safe default prescrit :** Conserver la route, appliquer `noindex`, substituer le contenu opérationnel par une explication de diagnostic réseau et de recours aux applications et canaux approuvés.

**Décision :** ⏳ UNKNOWN U-16 — en attente de décision juridique.

### 7.2 Autres passages nécessitant une révision « contournement réseau »

| Ligne | Route | Contenu problématique |
|---|---|---|
| 250 | `/comparatif/atlas-iptv/` | « Fini le sideloading risqué sur Firestick » — acceptable car il déconseille le sideloading |
| 658 | `/comparatif/xenon-iptv/` | « ajustement du routage » pour contourner un blocage FAI |
| 711 | `/comparatif/mario-iptv/` | « assistance revendeur dédiée pour analyser les blocages de FAI » |
| 766 | `/comparatif/lynk-iptv/` | « blocage d'adresse IP par le fournisseur d'accès » → aide au rétablissement |
| 1089 | `/comparatif/max-ott/` (V1) | « diagnostiquer les blocages d'accès ou les limitations imposées par certains fournisseurs internet » |
| 1143 | `/comparatif/iptv-iron/` | « blocages d'adresses IP par les fournisseurs d'accès locaux » |
| 1286 | `/revendeur/contact-support/` | « diagnostiquer les blocages d'adresses IP potentiels imposés par certains FAI en France » |
| 1471 | `/revendeur/api-xtream-codes/` | « procédures techniques pour détecter les blocages d'adresses IP » |
| 1649 | `/revendeur/gestion-anti-buffering/` | « Pluton OTT optimise constamment son routage réseau pour **contourner** les goulots d'étranglement » |
| 1769 | `/iptv-france/compatibilite-fai/` | « modes d'emploi détaillés pour **contourner** les problèmes de cache ou de routage local » |

> **Recommandation :** Chaque mention de « contourner » doit être reformulée en « diagnostiquer et résoudre ». Les passages décrivant un basculement automatique d'IP en réponse à un blocage FAI doivent être reformulés comme du diagnostic réseau.

### 7.3 Affirmations nécessitant une preuve avant publication

| # | Affirmation | Ligne | Preuve requise |
|---|---|---|---|
| C-01 | Marges bénéficiaires nettes « entre 30% et 60% » | 39, 1717 | Données financières réelles ou supprimer |
| C-02 | « Activation instantanée » (Trust Strip, multiples pages) | 3, 37, 200+ | Temps d'activation mesuré |
| C-03 | « Crédits sans date d'expiration » / « restent indéfiniment » | 59, 1380, 446 | CGV juridiquement validées |
| C-04 | « plus de 75% du trafic se fait sur mobile » | 59 | Données analytics vérifiables |
| C-05 | « 300 millions de dispositifs Fire TV vendus dans le monde » | 1610 | Source Amazon officielle requise |
| C-06 | Témoignage « Albert, Revendeur IPTV, France, Février 2026 » | 33 | Identité vérifiable (UNKNOWN U-13) |
| C-07 | Témoignage « Marc, Grossiste IPTV, France, 2026 » | 1231 | Identité vérifiable (UNKNOWN U-14) |
| C-08 | « Garantie d'intervention » dans les 24 heures | 1388 | SLA documenté et opposable |
| C-09 | Toute annotation `[Schema: Product & Offer]` sans prix réels | 17, 45, 159, 514, 594, 702, 810, 891, 971, 1133, 1187, 1215, 1249 | UNKNOWN U-03 |
| C-10 | « Panel 100% en français » / « exclusivement en français » | Multiple | Preuve que l'UI du panel est réellement 100% FR |
| C-11 | Mention de droits sportifs : Ligue 1+, Canal+, beIN Sports | 11, 102, 126, 154, 181, 1706, 1749 | UNKNOWN U-06 — droits de distribution |
| C-12 | « Serveurs très haute disponibilité » / « uptime » | 1120 | Métriques de disponibilité vérifiables |
| C-13 | « Tests 24h gratuits » / « ne consomment pas vos crédits » | 73, 132, 1394, 1715, 1933 | UNKNOWN U-07 — conditions exactes |

---

## 8. Carte des changements atomiques — ordre d'exécution

> **Précondition PHASE 0 :** Aucune étape suivante ne peut démarrer tant que PHASE 0 n'est pas complète.

### PHASE 0 — Fondations (aucun code applicatif)

| Étape | Action | Fichiers concernés | Prérequis | Décision |
|---|---|---|---|---|
| 0.1 | Initialiser le dépôt Git | `.git/`, `.gitignore` | — | **GO** |
| 0.2 | Déplacer et renommer les fichiers sources au chemin PRD | `docs/source/pluton-page-copy.md`, `docs/source/combined_keywords.txt` | 0.1 | **GO** |
| 0.3 | Résoudre TOUS les UNKNOWN U-01 à U-18 | Ce document (`docs/implementation-audit.md`) | 0.1 | **NO-GO** — en attente des 18 réponses |
| 0.4 | Fournir les assets de marque officiels (WebP/AVIF) | `public/` | U-12 résolu | **NO-GO** — en attente U-12 |

### PHASE 1 — Scaffolding Next.js

| Étape | Action | Fichiers concernés | Prérequis | Décision |
|---|---|---|---|---|
| 1.1 | `npx -y create-next-app@latest ./` avec App Router, TypeScript strict, Tailwind CSS, ESLint | `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `app/`, etc. | 0.1, 0.2 | **GO WITH BLOCKERS** — bloqué par U-01 pour `next.config.ts` (domaine canonical) |
| 1.2 | Configurer `tsconfig.json` en mode `strict: true` | `tsconfig.json` | 1.1 | **GO** |
| 1.3 | Configurer ESLint (Next.js + TypeScript) | `eslint.config.*` | 1.1 | **GO** |
| 1.4 | Configurer Tailwind CSS | `tailwind.config.ts`, `app/globals.css` | 1.1 | **GO** |
| 1.5 | Créer `.env.local.example` avec variables Supabase | `.env.local.example` | U-02 résolu | **NO-GO** — en attente U-02 |

### PHASE 2 — Base de données Supabase

| Étape | Action | Fichiers concernés | Prérequis | Décision |
|---|---|---|---|---|
| 2.1 | Créer la migration initiale — table `packs` | `supabase/migrations/001_packs.sql` | U-02, U-03 résolus | **NO-GO** — en attente U-02, U-03 |
| 2.2 | Créer la migration — table `whatsapp_leads` (minimale, sans PII) | `supabase/migrations/002_whatsapp_leads.sql` | U-02, U-11 résolus | **NO-GO** — en attente U-02, U-11 |
| 2.3 | Seed data pour les packs avec prix réels | `supabase/seed.sql` | U-03 résolu | **NO-GO** — en attente U-03 |

### PHASE 3 — Layout global et composants partagés

| Étape | Action | Fichiers concernés | Prérequis | Décision |
|---|---|---|---|---|
| 3.1 | Layout racine (`app/layout.tsx`) — meta FR, OG, favicon | `app/layout.tsx` | 1.1, U-01, U-04, U-12 résolus | **NO-GO** — en attente U-01, U-04, U-12 |
| 3.2 | Composant WhatsApp CTA (numéro 212782389820) | `components/whatsapp-cta.tsx` | 1.1 | **GO** |
| 3.3 | Composant Trust Strip | `components/trust-strip.tsx` | 1.1 | **GO** |
| 3.4 | Composant Header / Navigation | `components/header.tsx` | 1.1, 0.4 | **GO WITH BLOCKERS** — bloqué par U-12 (logo) |
| 3.5 | Composant Footer (mentions légales) | `components/footer.tsx` | 1.1, U-04 résolu | **NO-GO** — en attente U-04 |

### PHASE 4 — Pages publiques (69 routes)

| Étape | Action | Fichiers concernés | Prérequis | Décision |
|---|---|---|---|---|
| 4.1 | Pages statiques sans données dynamiques (≈ 55 routes) | `app/[route]/page.tsx` | 3.x, copie éditoriale validée | **GO WITH BLOCKERS** — bloqué par C-01 à C-13, U-05, U-06 |
| 4.2 | Pages avec `[Schema: Product & Offer]` (≈ 13 annotations) | Pages tarifs, packs | U-03 résolu | **NO-GO** — en attente U-03 |
| 4.3 | Route `/iptv-france/securite-anti-blocage/` | `app/iptv-france/securite-anti-blocage/page.tsx` | U-16 résolu | **NO-GO** — en attente U-16. Safe default : `noindex` + contenu diagnostic |
| 4.4 | Pages légales (`/conditions-generales-b2b/`, `/politique-de-remboursement-b2b/`) | 2 fichiers `page.tsx` | U-04, U-08 résolus | **NO-GO** — en attente U-04, U-08 |
| 4.5 | Page `/qui-sommes-nous/` | `app/qui-sommes-nous/page.tsx` | U-04 résolu | **NO-GO** — en attente U-04 |

### PHASE 5 — SEO et Structured Data

| Étape | Action | Fichiers concernés | Prérequis | Décision |
|---|---|---|---|---|
| 5.1 | `sitemap.ts` (69 routes canoniques) | `app/sitemap.ts` | U-01 résolu | **NO-GO** — en attente U-01 |
| 5.2 | `robots.ts` (inclure `noindex` pour `/iptv-france/securite-anti-blocage/`) | `app/robots.ts` | U-16 résolu | **GO WITH BLOCKERS** |
| 5.3 | JSON-LD `FAQPage` (pages avec `[Schema: FAQPage]`) | Composant `JsonLd` | Copie validée | **GO** |
| 5.4 | JSON-LD `Product` / `Offer` — **INTERDIT** sans U-03 | — | U-03, U-09 résolus | **NO-GO** |
| 5.5 | JSON-LD `Review` / `AggregateRating` — **INTERDIT** sans U-13, U-14 | — | U-13, U-14 résolus | **NO-GO** |
| 5.6 | Redirections 301 (`iptv-nox` → `nox-iptv`, potentiellement `iptv-iron` → `iron-iptv`) | `next.config.ts` redirects | U-18 résolu | **GO WITH BLOCKERS** |

### PHASE 6 — Tracking et API

| Étape | Action | Fichiers concernés | Prérequis | Décision |
|---|---|---|---|---|
| 6.1 | API route `/api/whatsapp-lead` (POST, pas de PII) | `app/api/whatsapp-lead/route.ts` | 2.2, U-11 résolus | **NO-GO** — en attente U-11 |
| 6.2 | Rate limiting et validation côté serveur | Middleware | 6.1 | **NO-GO** |

### PHASE 7 — Vérification et déploiement

| Étape | Action | Fichiers concernés | Prérequis | Décision |
|---|---|---|---|---|
| 7.1 | `next build` sans erreur | — | Toutes les phases précédentes | **NO-GO** |
| 7.2 | Lighthouse ≥ 90 (Performance, SEO, Accessibilité, Best Practices) | — | 7.1 | **NO-GO** |
| 7.3 | Vérification que `git diff` ne contient que les fichiers attendus | — | 7.1 | **NO-GO** |
| 7.4 | Déploiement Vercel (preview) | `vercel.json` | U-01, U-02, 7.1 | **NO-GO** |

---

## 9. Synthèse des risques bloquants

| Catégorie | Nb risques | Exemples critiques | Sévérité |
|---|---|---|---|
| **Build** | 6 | Aucun `package.json`, aucun projet Next.js, aucune variable d'env | 🔴 Bloquant |
| **Sécurité** | 3 | Politique `whatsapp_leads` absente, PII potentiels, route anti-blocage | 🔴 Bloquant |
| **Données** | 5 | Prix absents, crédits non définis, méthodes de paiement inconnues, expiration inconnue | 🔴 Bloquant |
| **SEO** | 4 | Domaine canonique absent, 8 doublons non résolus, 2 redirections non confirmées, Lynk/Lynx ambigu | 🟡 Bloquant partiel |
| **Performance** | 2 | ISR `revalidate` non défini, optimisation images sans assets | 🟡 Bloquant partiel |
| **Conformité éditoriale** | 9 | 13 affirmations non prouvées, 2 témoignages non vérifiés, route de contournement FAI, marques tierces sans autorisation, droits sportifs non documentés | 🔴 Bloquant |

---

## 10. Décision globale

### ❌ NO-GO pour toute implémentation applicative

**Justification :**

1. **Le dépôt ne contient aucun code applicatif** — pas de `package.json`, pas de Next.js, pas de TypeScript, pas de Tailwind, pas de Supabase. Le projet doit être initialisé de zéro.
2. **18 UNKNOWN non résolus** bloquent les phases critiques (layout, base de données, pages légales, structured data, déploiement).
3. **Les fichiers sources existent** mais au mauvais emplacement et avec des noms non conformes au PRD.
4. **13 affirmations nécessitent une preuve** avant toute publication.
5. **1 route est juridiquement à risque** (`/iptv-france/securite-anti-blocage/`) et nécessite une décision explicite.

### ✅ Actions exécutables immédiatement (sans résoudre les UNKNOWN)

| Action | Justification |
|---|---|
| Initialiser Git (`git init`, `.gitignore`) | Pas de dépendance UNKNOWN |
| Déplacer les fichiers sources vers `docs/source/` | Alignement avec le PRD, pas de changement de contenu |
| Scaffolder le projet Next.js (`npx -y create-next-app@latest`) | Infrastructure de base, domaine non requis immédiatement |

### ⏳ Prochaine action requise

Résoudre les 18 UNKNOWN listés en §6 — en priorité :

1. **U-01** — URL canonique (débloque 7 étapes)
2. **U-02** — Projet Supabase (débloque 4 étapes)
3. **U-03** — Prix réels (débloque 3 étapes + 13 annotations Schema)
4. **U-04** — Informations légales (débloque 4 étapes)
5. **U-16** — Décision route anti-blocage (débloque 1 étape critique)

---

## Annexe A — Routes par catégorie fonctionnelle

### Pages commerciales principales (7)
`/`, `/tarifs-grossiste/`, `/fonctionnement-panel/`, `/iptv-france/test-gratuit/`, `/iptv-france/abonnement/`, `/devenir-revendeur-iptv/`, `/programme-master-reseller/`

### Pages comparatif (35 routes uniques, dont 33 marques tierces)
`/comparatif/` (index), `/comparatif/iron-iptv/`, `/comparatif/atlas-iptv/`, `/comparatif/xtreme-hd-iptv/`, `/comparatif/smartone-iptv/`, `/comparatif/cdiscount/`, `/comparatif/pluton-ott/`, `/comparatif/pure-iptv/`, `/comparatif/set-iptv/`, `/comparatif/king-iptv/`, `/comparatif/flix-iptv/`, `/comparatif/iptv-atlas-pro/`, `/comparatif/trex-iptv/`, `/comparatif/lion-ott/`, `/comparatif/crystal-ott/`, `/comparatif/xenon-iptv/`, `/comparatif/mario-iptv/`, `/comparatif/lynk-iptv/`, `/comparatif/orca-iptv/`, `/comparatif/room-iptv/`, `/comparatif/foxx-iptv/`, `/comparatif/majestic-iptv/`, `/comparatif/z2u-iptv/`, `/comparatif/cover-iptv/`, `/comparatif/elon-iptv/`, `/comparatif/nox-iptv/`, `/comparatif/platinum-iptv/`, `/comparatif/smarter-one-iptv/`, `/comparatif/lynx-iptv/`, `/comparatif/iplay-iptv/`, `/comparatif/max-ott/`, `/comparatif/smart-one-iptv/`, `/comparatif/iptv-iron/` (redirect), `/comparatif/iptv-nox/` (redirect)

### Pages informationnelles / techniques (12)
`/ott-iptv/`, `/iptv-france/installation/`, `/iptv-france/support/`, `/iptv-france/`, `/iptv-france/compatibilite-fai/`, `/iptv-france/securite-anti-blocage/` ⚠️, `/iptv-france/vod-series-revendeur/`, `/iptv-france/api-developpement/`, `/iptv-france/faq-revendeur/`, `/iptv-france/diaspora/maroc/`, `/iptv-france/diaspora/tunisie/`, `/iptv-france/diaspora/iptv/`

### Pages revendeur / admin (10)
`/revendeur/panel-administration/`, `/revendeur/infrastructure-serveurs/`, `/revendeur/contact-support/`, `/revendeur/gestion-vod-series/`, `/revendeur/api-xtream-codes/`, `/revendeur/contact-commercial/`, `/revendeur/guide-configuration-smart-tv/`, `/revendeur/guide-configuration-firestick/`, `/revendeur/gestion-anti-buffering/`, `/revendeur/choisir-entre-sub-reseller-et-master/`, `/revendeur/tutoriels-video/`

### Pages légales et institutionnelles (4)
`/politique-de-remboursement-b2b/`, `/conditions-generales-b2b/`, `/qui-sommes-nous/`, `/integration-api-revendeur/`

### Blog (1)
`/blog/comment-devenir-meilleur-revendeur-iptv/`

---

## Annexe B — Commandes de vérification reproductibles

```bash
# Depuis la racine du dépôt, avec les fichiers à leur emplacement actuel

# 1. Compter les 77 blocs URL
grep -c '^URL:' "Pluton OTT - PAGE COPY (1).md"
# Résultat attendu : 77

# 2. Extraire les 69 routes uniques
grep '^URL:' "Pluton OTT - PAGE COPY (1).md" \
  | sed 's/^URL:[[:space:]]*//' \
  | sed 's/[[:space:]].*//' \
  | sort -u | wc -l
# Résultat attendu : 69

# 3. Identifier les 8 routes dupliquées
grep '^URL:' "Pluton OTT - PAGE COPY (1).md" \
  | sed 's/^URL:[[:space:]]*//' \
  | sed 's/[[:space:]].*//' \
  | sort | uniq -d | wc -l
# Résultat attendu : 8

# 4. Compter les 112 lignes de mots-clés non vides
grep -c '[^[:space:]]' combined_keywords.txt
# Résultat attendu : 112

# 5. Compter les 107 mots-clés uniques
grep '[^[:space:]]' combined_keywords.txt \
  | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' \
  | sort -u | wc -l
# Résultat attendu : 107
```

---

## Annexe C — Safe defaults appliqués à ce document

- ❌ Aucun prix, pourcentage de marge, avis, disponibilité, délai d'activation ou garantie non vérifié n'a été publié.
- ❌ Aucun `Product`, `Offer`, `Review` ou `AggregateRating` JSON-LD n'a été généré.
- ❌ Aucun logo de diffuseur, ligue, club ou marque tierce n'a été affiché.
- ❌ Aucune instruction de contournement FAI, de déchiffrement, de restreaming, de récupération de flux, de sideloading non approuvé ou d'accès non autorisé n'a été fournie.
- ❌ Aucune donnée absente n'a été inventée.
- ✅ Le français est utilisé pour toutes les chaînes descriptives de ce document.

---

> **Fin du document d'audit. Aucun fichier applicatif n'a été modifié.**

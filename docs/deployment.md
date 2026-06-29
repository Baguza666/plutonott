# Déploiement et Sécurité

Ce document décrit l'architecture de déploiement statique de Pluton OTT. L'objectif est d'assurer une surface d'attaque nulle, sans base de données, sans code exécuté côté serveur (Backend) et sans tracking.

## 1. Architecture Statique (`output: 'export'`)
Le projet Next.js est configuré exclusivement pour un export statique (`next build`). Les pages sont générées sous forme de fichiers HTML/CSS purs dans le dossier `/out`.
- Aucun `middleware.ts` n'est utilisé.
- Aucun Server Action ou API route (`/api/*`) n'est présent.
- Aucun rendu dynamique côté serveur n'est autorisé.

## 2. Déploiement sur Vercel
La plateforme Vercel est utilisée pour héberger les fichiers statiques de manière globale (CDN). 

### Étapes de Build
Lors d'un redéploiement (par exemple, après la modification du catalogue ou des statuts de publication) :
1. Vercel exécute `npm run build`.
2. Le processus d'audit des secrets (`node scripts/audit-secrets.mjs`) est déclenché.
3. Le dossier `out/` est généré.
4. Les fichiers statiques de `out/` sont distribués mondialement sur le CDN de Vercel.

### Configuration du Domaine
Configurez votre nom de domaine personnalisé (ex: `pluton-ott.com`) dans le tableau de bord Vercel. Le DNS gère automatiquement le routage statique.

## 3. Absence de Secrets et Audit
L'application ne s'interface avec aucune base de données (pas de PostgreSQL, Supabase, Firebase) ni aucun système de paiement (pas de Stripe, PayPal). 
- Le seul fichier d'environnement requis est `.env` contenant : `NEXT_PUBLIC_SITE_URL=https://pluton-ott.com`.
- **Aucun** secret serveur (type `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PRIVATE_KEY`) ne doit être présent dans le code.
- Un script d'audit bloque automatiquement le pipeline de build si des secrets sont détectés dans le code source ou les artefacts compilés.

## 4. Politique de Sécurité (Headers)
Puisque Next.js `headers()` ne supporte pas l'export statique, tous les headers sont définis dans `vercel.json` afin qu'ils soient appliqués par le CDN.

- **Content-Security-Policy (CSP)** : Stricte. Empêche le chargement de scripts externes et désactive les requêtes `connect-src` vers des domaines tiers. Les iframes et objets sont bloqués (`frame-ancestors 'none'`, `object-src 'none'`). Note : l'hydratation des scripts Next.js est bloquée pour appliquer `script-src 'self'` strictement.
- **Strict-Transport-Security (HSTS)** : Appliqué en production avec pré-chargement pour forcer HTTPS.
- **X-Content-Type-Options** : Défini sur `nosniff`.
- **Referrer-Policy** : Limite le transfert d'informations lors du clic vers `wa.me` (`strict-origin-when-cross-origin`).
- **Permissions-Policy** : Restrictive (Désactive caméra, micro, géolocalisation).

## 5. Tracking et Mouchards
Par conception :
- Aucun SDK Analytics n'est chargé (Google Analytics, Mixpanel, etc.).
- Aucune donnée utilisateur n'est récoltée ou traitée.
- Toute conversion se fait uniquement par navigation externe vers WhatsApp (`wa.me`), dont les liens sont statiques.

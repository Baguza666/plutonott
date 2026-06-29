# Documentation : Gestion du Catalogue Local (Serveurs)

Le catalogue des serveurs présentés sur les landing pages de Pluton OTT est intégralement **statique** et intégré au code source. Aucune base de données ni système de gestion de contenu (CMS) externe n'est utilisé.

## Emplacement des données
Le fichier unique constituant la source de vérité du catalogue est :  
`src/content/catalog/server-catalog.fr.ts`

## Procédure d'ajout ou de modification d'un serveur
Pour ajouter un nouveau serveur, modifier une description ou changer le statut d'un serveur existant, suivez **exactement** ces trois étapes :

### 1. Modifier le fichier de données
Ouvrez le fichier `src/content/catalog/server-catalog.fr.ts` et ajoutez ou modifiez l'objet correspondant dans le tableau `SERVER_CATALOG`.

**Exemple d'ajout :**
```typescript
{
  slug: "nouveau-serveur",
  serverBrand: "Nouveau Serveur",
  shortDescriptionFr: "Description B2B respectant la ligne éditoriale.",
  targetAudienceFr: "Profil du revendeur cible.",
  marketingFeaturesFr: ["Feature 1", "Feature 2", "Feature 3"],
  whatsappContextFr: "les crédits Nouveau Serveur",
  imagePath: null,
  imageAltFr: null,
  displayOrder: 60, // Doit être unique !
  isActive: true,
  legalStatus: "pending" // ou "approved" si validation juridique obtenue
}
```

> [!WARNING]
> **Règles éditoriales strictes :**
> - Aucun prix, aucune marge, aucun nombre de crédits.
> - Ne pas utiliser les mots interdits : "officiel", "prix", "sans coupure", "toutes les chaînes", "tous les matchs", "instantanée", "uptime", "marge".
> - Les slugs et les valeurs `displayOrder` doivent être **absolument uniques**.
> - Pas d'extensions d'images `.jpg` ou `.png` (privilégiez `.webp` ou `.svg`).

### 2. Exécuter l'audit local
Une fois la modification effectuée, vous devez impérativement lancer l'audit éditorial pour vérifier la conformité des données :

```bash
node scripts/audit-server-catalog.mjs
# et pour les tests TypeScript :
npm run test
```

Si le script retourne une erreur (ex: doublon, mot interdit), corrigez le fichier avant de passer à l'étape suivante.

### 3. Commit et Redéploiement obligatoire
Étant donné que le site est statique, les modifications n'apparaîtront en ligne qu'après une nouvelle compilation (build).
1. `git add src/content/catalog/server-catalog.fr.ts`
2. `git commit -m "Mise à jour du catalogue: ajout de Nouveau Serveur"`
3. `git push`

Ce push déclenchera le pipeline CI/CD (Vercel) qui intégrera la nouvelle version statique du catalogue sur le site public.

# Décision d'architecture : Application sans base de données

## Contexte
Le projet "Pluton OTT" a initialement été conçu avec l'idée d'un catalogue de serveurs stocké dans une base de données (Supabase), avec un suivi persistant des leads générés lors des clics vers WhatsApp.

## Décision
Toute l'architecture liée à la base de données (Supabase, migrations, tables, endpoints d'API, tracking persistant) a été **totalement supprimée**. L'application a été convertie en une architecture de site statique pur (génération de landing pages B2B). 

Il est désormais **strictement interdit** d'ajouter Supabase, Prisma, Drizzle, Firebase, MongoDB ou toute autre base de données sans une nouvelle décision formelle d'architecture.

## Motif
Le site est fondamentalement un tunnel de génération de leads WhatsApp. Il n'y a aucun panier, aucun compte utilisateur, aucun paiement, ni création de ligne IPTV sur le site. Les parcours utilisateurs se terminent toujours sur WhatsApp. Ajouter une base de données pour un catalogue et du tracking introduisait une complexité inutile, des risques de sécurité (stockage IP/données) et des coûts d'infrastructure injustifiés.

## Fonctionnement de la nouvelle architecture
- **Données persistées par le site :** Aucune.
- **Attribution des leads :** Le chemin source (`sourcePath`) et le contexte de navigation sont directement inclus dans le message texte WhatsApp prérempli qui est ouvert sur l'appareil du client.
- **Mise à jour du catalogue :** Les données du catalogue sont gérées via un ou plusieurs fichiers locaux versionnés. Chaque modification nécessite un simple commit et un redéploiement (approche GitOps).
- **Endpoint API :** Aucun endpoint API interne n'est requis au runtime.

## Limites assumées
1. **Pas de modification runtime :** Il n'est pas possible d'éditer le catalogue via une interface d'administration en ligne de type CMS.
2. **Pas de mesure serveur des clics :** Le site ne journalise plus les clics dans une table. Les analytics de type "clics par serveur" ne sont plus mesurés par l'application.
3. **Tracking manuel :** La conversion finale est suivie manuellement (ou via des outils WhatsApp Business) directement dans WhatsApp, lors des conversations commerciales.

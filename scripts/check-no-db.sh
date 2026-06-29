#!/bin/bash

# Configuration
EXIT_CODE=0

# Fonction pour vérifier une expression régulière dans les fichiers
check_pattern() {
  local pattern="$1"
  local description="$2"
  
  # Exclure .git, node_modules, .next, docs/source, scripts (le script lui-même) et docs/implementation-audit.md 
  # car l'audit mentionne l'ancien prompt et les noms de tables.
  local matches=$(git grep -E "$pattern" -- ':(exclude).git' ':(exclude)node_modules' ':(exclude).next' ':(exclude)docs' ':(exclude)scripts' 2>/dev/null)
  
  if [ -n "$matches" ]; then
    echo "❌ Échec: $description trouvée."
    echo "$matches"
    EXIT_CODE=1
  else
    echo "✅ OK: Aucune occurrence de $description."
  fi
}

echo "=== Vérification de l'absence de base de données ==="

check_pattern "@supabase/supabase-js" "dépendance Supabase"
check_pattern "src/server/supabase" "dossier src/server/supabase"
check_pattern "api/whatsapp-intent" "route /api/whatsapp-intent"
check_pattern "server_catalog" "table server_catalog"
check_pattern "server_credit_offers" "table server_credit_offers"
check_pattern "whatsapp_leads" "table whatsapp_leads"
check_pattern "SUPABASE_" "variable SUPABASE_"

if [ -d "supabase" ]; then
  echo "❌ Échec: Le dossier supabase/ existe."
  EXIT_CODE=1
else
  echo "✅ OK: Le dossier supabase/ n'existe pas."
fi

if [ $EXIT_CODE -eq 0 ]; then
  echo "=== SUCCÈS : Aucune référence interdite trouvée. ==="
else
  echo "=== ÉCHEC : Des références à la base de données existent encore. ==="
fi

exit $EXIT_CODE

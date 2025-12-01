#!/bin/bash
PATH=/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin

# Script d'exécution quotidienne - Global Warming API
# Auteur: Alice Massart
# Date: 2024

# Définir le répertoire du projet
PROJECT_DIR="/Users/alice/Documents/GitHub/dad-nfn-alice-massart/JeSuisTerre/chatbot/chatbot__api-global-warming"

# Aller dans le répertoire
cd "$PROJECT_DIR" || exit 1

# Créer un dossier logs s'il n'existe pas
mkdir -p logs

# Définir le fichier de log avec la date
LOG_FILE="logs/execution-$(date +%Y-%m-%d).log"

# Afficher le début d'exécution
echo "========================================" >> "$LOG_FILE"
echo "Début d'exécution: $(date)" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

# Exécuter le script Node.js
/usr/local/bin/node fetch-global-warming.js >> "$LOG_FILE" 2>&1

# Vérifier le code de sortie
if [ $? -eq 0 ]; then
    echo "✅ Exécution réussie: $(date)" >> "$LOG_FILE"
else
    echo "❌ Erreur lors de l'exécution: $(date)" >> "$LOG_FILE"
fi

echo "" >> "$LOG_FILE"

# Nettoyer les logs de plus de 30 jours (optionnel)
find logs -name "execution-*.log" -mtime +30 -delete

exit 0

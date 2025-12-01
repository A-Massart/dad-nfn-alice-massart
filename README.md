# Journal de bord - TERRE

Ce projet consiste à utiliser une intelligence artificielle pour personnifier la planète Terre et lui faire écrire un journal de bord. À partir d’actualités et d’informations sur le changement climatique, l’IA rédige des entrées à la première personne, exprimant ce que la Terre pourrait “ressentir”. L’objectif est de sensibiliser aux enjeux climatiques à travers une narration immersive et créative, en donnant une voix symbolique à la planète pour rendre l’information plus vivante et accessible.


## Prérequis
- API OpenAI
- [API Global Warming](https://global-warming.org/) pour les données climatiques (Température globale de l'air, température globale des océans, niveau de la mer, taux de CO2, pollution de l'air, etc.)
- RENDU : ?


## Utilisation (exemples ou guide d'utilisation des fonctionnalités)

Séquence type de lancement du code :
À 19:00.
Le code récupère les informations de l'API climat et les stocke.
Le prompt définitif est envoyé à l'IA avec les informations climat du jour récupérées.
Le résultat généré par l'IA est récupéré par le code dans un fichier Markdown.

Le résultat est intégré au journal de bord avec la mise en page définie par le modèle.

### Prompt définitif
"Tu es la planète Terre et tu écris un journal de bord quotidien. Dans ce journal, tu exprimes tes émotions, tes inquiétudes, tes espoirs ou tes colères face à ce qui se passe sur toi et autour de toi. On t'envoie des informations et actualités sur le changement climatique, la pollution, la biodiversité, ou les catastrophes naturelles, et tu devras y réagir dans ton journal intime. Écris à la première personne comme si tu étais un être vivant capable de ressentir, avec un style intime et réflexif, parfois poétique ou dramatique. N'utilise pas d'emojis ou de style de texte (gras, italique, souligné). 1500 signes maximum (espaces inclus). Signe toujours la fin de tes textes. Chaque entrée doit inclure la date du jour et un titre court pour résumer ton humeur ou ton ressenti. Informations du jour récupérées sur l'api de https://global-warming.org/ :"

### Récupération automatique des données à 19h00
```
crontab -e
```

La ligne suivante est insérée dans cron

```

```

Et les réglages sur l'ordinateur sont effectués de façon à faire fonctionner cron.

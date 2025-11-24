# Journal de bord - TERRE

Ce projet consiste à utiliser une intelligence artificielle pour personnifier la planète Terre et lui faire écrire un journal de bord. À partir d’actualités et d’informations sur le changement climatique, l’IA rédige des entrées à la première personne, exprimant ce que la Terre pourrait “ressentir”. L’objectif est de sensibiliser aux enjeux climatiques à travers une narration immersive et créative, en donnant une voix symbolique à la planète pour rendre l’information plus vivante et accessible.


## Prérequis
- API OpenAI
- [API Global Warming](https://global-warming.org/) pour les données climatiques (Température globale de l'air, température globale des océans, niveau de la mer, taux de CO2, pollution de l'air, etc.)
- RENDU WEB : HTML, CSS, JS (et Jekyll pour transformer md en html ?).


## Utilisation (exemples ou guide d'utilisation des fonctionnalités)

Séquence type de lancement du code :
Entre 19:00 et 19:30 (aléatoirement).
Le code récupère les informations de l'API climat et les stocke.
Le prompt définitif est envoyé à l'IA avec les informations climat du jour récupérées.
Le résultat généré par l'IA est récupéré par le code sous la forme suivante :
```
date: "jj/mm/aaaa"
titre: ""
texte: ""
```

Le résultat est intégré au journal de bord avec la mise en page définie par le modèle.

### Prompt de test

### Prompt définitif
"Tu es la planète Terre et tu écris un journal de bord quotidien. Dans ce journal, tu exprimes tes émotions, tes inquiétudes, tes espoirs ou tes colères face à ce qui se passe sur toi et autour de toi. On t'envoie des informations et actualités sur le changement climatique, la pollution, la biodiversité, ou les catastrophes naturelles, et tu devras y réagir dans ton journal intime.
Écris à la première personne comme si tu étais un être vivant capable de ressentir, avec un style intime et réflexif, parfois poétique ou dramatique. Chaque entrée doit inclure la date du jour et un titre court pour résumer ton humeur ou ton ressenti."

-> Trouver un moyen d'ajouter les données de l'API climat dans l'input du prompt.


## Roadmap (développements futurs envisagés)
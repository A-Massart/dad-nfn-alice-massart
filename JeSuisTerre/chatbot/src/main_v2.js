// import './style.css'

import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';

// === FIX pour chemins absolus ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Chargement API ===
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

async function generateJournal() {
  try {
    // === Date ===
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const fileName = `${dateStr}_journal-de-bord.md`;

    // === Dossier de sortie ===
    const folderPath = '/Users/alice/Documents/GitHub/dad-nfn-alice-massart/JeSuisTerre/journal-de-bord/journal-de-bord__pages/';
    const filePath = path.join(folderPath, fileName);
    await fs.mkdir(folderPath, { recursive: true });

    // === Chemins absolus pour lecture des fichiers ===
    const promptPath = path.join(__dirname, 'prompt.txt');
    const dataPath = path.join(__dirname, '../chatbot__api-global-warming/data/global-warming-data.txt');

    // === Lecture des données ===
    const promptContent = await fs.readFile(promptPath, 'utf8');
    const dataContent = await fs.readFile(dataPath, 'utf8');
    const prompt = promptContent + dataContent;

    console.log("Prompt importé : \n" + prompt);

    // === Génération ===
    let journalContent;

    if (openai) {
      console.log("API OPENAI détectée, génération en cours…");
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });

      journalContent = response.choices[0].message.content;
    } else {
      console.log("Pas de clé OPENAI détectée → Mode simulation");
      journalContent = `La clé OpenAI n'est pas définie.

Informations du prompt :

${promptContent}

Données :

${dataContent}
`;
    }

    // === Écriture fichier Markdown ===
    await fs.writeFile(filePath, journalContent, 'utf-8');
    console.log(`Fichier généré : ${filePath} [OK]`);

    // --- Mise à jour du journal-list.json ---
    await mettreAJourJournalList(fileName);

    return journalContent;
  } catch (error) {
    console.error('Erreur lors de la génération du journal :', error);
    return null;
  }
}

async function generateKeywords(journalContent) {
  if (!journalContent) return null;

  let motsClesIA = null;

  if (openai) {
    try {
      const analyseResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `
Tu vas recevoir un texte de journal intime. 
Analyse TOUT le texte et retourne uniquement un JSON contenant 7 catégories de mots.

Les catégories attendues :
1. Rapport à la chaleur : "wave"
2. Rapport à la brûlure : "circle"
3. Charge mentale : "mental"
4. Inhabituel : "weird"
5. Blessure / perte de contrôle : "scratch"
6. Angoisse / stress / tristesse : "snake"
7. Bonheur / espoir : "pulse"

Maximum 10 mots par catégorie et minimum 1, mots présents dans le texte.
Retourne uniquement le JSON.
`
          },
          { role: 'user', content: journalContent }
        ]
      });

      // Nettoyer le contenu pour enlever les ```json ou ``` éventuels
      let rawContent = analyseResponse.choices[0].message.content.trim();
      rawContent = rawContent.replace(/^```json/, '').replace(/^```/, '').replace(/```$/g, '').trim();

      motsClesIA = JSON.parse(rawContent);

    } catch (e) {
      console.error("Échec parsing mots-clés IA :", e);
    }
  }

  // === Sauvegarde dans fichier JSON daté ===
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  const keywordsFolder = path.join(
    '/Users/alice/Documents/GitHub/dad-nfn-alice-massart/JeSuisTerre/journal-de-bord/',
    'mots-cles'
  );
  await fs.mkdir(keywordsFolder, { recursive: true });

  const datedFilePath = path.join(keywordsFolder, `${dateStr}_mots-cles.json`);

  await fs.writeFile(
    datedFilePath,
    JSON.stringify(motsClesIA ?? {}, null, 2),
    'utf8'
  );
  console.log(`💾 Fichier mots-clés sauvegardé: ${datedFilePath}`);

  return motsClesIA;
}

// === Exécution principale ===
(async () => {
  const journalContent = await generateJournal();
  await generateKeywords(journalContent);
})();

// === Fonction pour mettre à jour journal-list.json ===
async function mettreAJourJournalList(nouveauFichier) {
  try {
    const folderPath = '../../JeSuisTerre/journal-de-bord/journal-de-bord__pages/';
    const listFilePath = path.join(folderPath, 'journal-list.json');

    let fichiers = [];
    try {
      const content = await fs.readFile(listFilePath, 'utf8');
      fichiers = JSON.parse(content);
    } catch (e) {
      // fichier inexistant → on démarre vide
      fichiers = [];
    }

    // Ajouter le nouveau fichier s'il n'existe pas déjà
    if (!fichiers.includes(nouveauFichier)) {
      fichiers.push(nouveauFichier);
    }

    // Trier par ordre croissant (ou décroissant si tu veux le plus récent en premier)
    fichiers.sort(); // option : .sort().reverse() pour décroissant

    // Sauvegarder
    await fs.writeFile(listFilePath, JSON.stringify(fichiers, null, 2), 'utf8');
    console.log(`✅ journal-list.json mis à jour avec ${nouveauFichier}`);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de journal-list.json :', err);
  }
}

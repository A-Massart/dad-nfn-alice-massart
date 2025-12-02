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

  } catch (error) {
    console.error('Erreur lors de la génération du journal :', error);
  }
}

generateJournal();

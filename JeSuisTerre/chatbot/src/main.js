// import './style.css'

import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

async function generateJournal() {
  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const fileName = `${dateStr}_journal-de-bord.md`;
    const folderPath = '/Users/alice/Documents/GitHub/dad-nfn-alice-massart/JeSuisTerre/journal-de-bord/journal-de-bord__pages/';
    const filePath = path.join(folderPath, fileName);

    await fs.mkdir(folderPath, { recursive: true });

    const promptContent = await fs.readFile('./prompt.txt', 'utf8');
    const dataContent = await fs.readFile(
      '/Users/alice/Documents/GitHub/dad-nfn-alice-massart/JeSuisTerre/chatbot/chatbot__api-global-warming/data/global-warming-data.txt',
      'utf8'
    );
    const prompt = promptContent + dataContent;
    console.log("Prompt importé : \n" + prompt);

    let journalContent;

    if (openai) {
      // Si la clé existe, utiliser l'API OpenAI
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });
      journalContent = response.choices[0].message.content;
    } else {
      // Sinon, contenu simulé pour tester localement
      journalContent = "Simulation : contenu du journal ici. La clé OpenAI n'est pas définie.";
    }

    const markdownContent = `---
date: ${dateStr}
tags: [journal, terre, quotidien]
---

${journalContent}
`;

    await fs.writeFile(filePath, markdownContent, 'utf-8');
    console.log(`Fichier généré : ${filePath} [OK]`);
  } catch (error) {
    console.error('Erreur lors de la génération du journal :', error);
  }
}

generateJournal();

import './style.css'

import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    const prompt = "prompt.txt";

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const journalContent = response.choices[0].message.content;

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

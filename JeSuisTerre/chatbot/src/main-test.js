import fs from 'fs/promises';

const promptContent = await fs.readFile('./prompt.txt', 'utf8');
const dataContent = await fs.readFile('/Users/alice/Documents/GitHub/dad-nfn-alice-massart/JeSuisTerre/chatbot/chatbot__api-global-warming/data/global-warming-data.txt', 'utf8');
const prompt = promptContent + dataContent;
console.log("prompt importé : " + prompt);
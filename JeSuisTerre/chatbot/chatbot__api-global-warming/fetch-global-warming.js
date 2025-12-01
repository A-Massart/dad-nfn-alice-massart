import { promises as fs } from 'fs';
import path from 'path';
import https from 'https';

// Configuration
const OUTPUT_DIR = '/Users/alice/Documents/GitHub/dad-nfn-alice-massart/JeSuisTerre/chatbot/chatbot__api-global-warming/data';
const OUTPUT_FILE = 'global-warming-data.txt';

const endpoints = [
    { name: 'CO₂', url: 'https://global-warming.org/api/co2-api' },
    { name: 'Température', url: 'https://global-warming.org/api/temperature-api' },
    { name: 'Méthane', url: 'https://global-warming.org/api/methane-api' },
    { name: 'Protoxyde d\'azote', url: 'https://global-warming.org/api/nitrous-oxide-api' },
    { name: 'Niveau de la mer', url: 'https://global-warming.org/api/arctic-api' }
];

// Fonction pour faire une requête HTTPS
function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error(`Erreur de parsing JSON: ${e.message}`));
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Fonction pour attendre un délai
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fonction pour extraire la donnée la plus récente
function extractLatestData(data, endpointName) {
    let latestData = null;
    
    if (data.co2) {
        latestData = data.co2[data.co2.length - 1];
    } else if (data.result) {
        latestData = data.result[data.result.length - 1];
    } else if (data.methane) {
        latestData = data.methane[data.methane.length - 1];
    } else if (data.nitrous) {
        latestData = data.nitrous[data.nitrous.length - 1];
    } else if (data.arcticData && data.arcticData.data) {
        // Structure spéciale pour Arctic API
        const dates = Object.keys(data.arcticData.data).sort();
        const latestDate = dates[dates.length - 1];
        latestData = {
            date: latestDate,
            ...data.arcticData.data[latestDate],
            description: data.arcticData.description
        };
    } else if (data.arctic) {
        latestData = data.arctic[data.arctic.length - 1];
    }
    
    return latestData;
}

// Fonction principale
async function fetchAllData() {
    console.log('🌍 Récupération des données Global Warming API...\n');
    
    const collectedData = {};
    let successCount = 0;
    const failedEndpoints = [];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`📡 Récupération de ${endpoint.name}...`);
            
            const data = await fetchData(endpoint.url);
            const latestData = extractLatestData(data, endpoint.name);
            
            if (latestData) {
                collectedData[endpoint.name] = latestData;
                successCount++;
                console.log(`✅ ${endpoint.name} - Succès`);
            } else {
                collectedData[endpoint.name] = { error: 'Structure de données non reconnue', raw: data };
                console.log(`⚠️  ${endpoint.name} - Structure non reconnue`);
            }
            
            // Pause entre les requêtes
            await sleep(500);
            
        } catch (error) {
            console.error(`❌ ${endpoint.name} - Erreur: ${error.message}`);
            collectedData[endpoint.name] = { error: error.message };
            failedEndpoints.push(endpoint.name);
        }
    }
    
    console.log(`\n📊 Résultat: ${successCount}/${endpoints.length} endpoints récupérés`);
    if (failedEndpoints.length > 0) {
        console.log(`⚠️  Échecs: ${failedEndpoints.join(', ')}`);
    }
    
    return collectedData;
}

// Fonction pour générer le texte
function generateText(data) {
    const today = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toLocaleString('fr-FR');
    
    let text = `Données Global Warming - ${today}\n\n`;
    text += `Dernière mise à jour: ${timestamp}\n\n`;
    text += `${'='.repeat(60)}\n\n`;
    
    for (const [name, content] of Object.entries(data)) {
        text += `${name}\n`;
        text += `${'-'.repeat(name.length)}\n\n`;
        
        if (content.error) {
            text += `⚠️ Erreur: ${content.error}\n\n`;
            if (content.raw) {
                text += JSON.stringify(content.raw, null, 2);
                text += '\n\n';
            }
        } else {
            text += JSON.stringify(content, null, 2);
            text += '\n\n';
        }
        
        text += '\n';
    }
    
    return text;
}

// Fonction pour sauvegarder le fichier
async function saveText(text) {
    try {
        // Vérifier si le dossier existe, sinon le créer
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        
        const filePath = path.join(OUTPUT_DIR, OUTPUT_FILE);
        await fs.writeFile(filePath, text, 'utf8');
        
        console.log(`\n💾 Fichier sauvegardé: ${filePath}`);
        return filePath;
        
    } catch (error) {
        console.error(`❌ Erreur lors de la sauvegarde: ${error.message}`);
        throw error;
    }
}

// Fonction pour créer aussi un fichier JSON
async function saveJSON(data) {
    try {
        const jsonPath = path.join(OUTPUT_DIR, 'global-warming-data.json');
        await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`💾 Fichier JSON sauvegardé: ${jsonPath}`);
    } catch (error) {
        console.error(`❌ Erreur lors de la sauvegarde JSON: ${error.message}`);
    }
}

// Exécution principale
async function main() {
    try {
        const startTime = Date.now();
        
        // Récupérer les données
        const data = await fetchAllData();
        
        // Générer le texte
        const text = generateText(data);
        
        // Sauvegarder les fichiers
        await saveText(text);
        await saveJSON(data);
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`\n✨ Terminé en ${duration}s`);
        
    } catch (error) {
        console.error(`\n❌ Erreur fatale: ${error.message}`);
        process.exit(1);
    }
}

// Lancer le script
main();
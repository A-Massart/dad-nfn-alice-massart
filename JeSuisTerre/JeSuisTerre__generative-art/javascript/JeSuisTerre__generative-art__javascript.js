// 1️⃣ Définir les groupes de mots avec styles communs
const motsClesGroups = [
    { mots: ["chaleur", "chaud"], style: "font-family: PicNic;" },
    { mots: ["fondre"], style: "font-family: Melting;" },
    { mots: ["fièvre", "brûl"], style: "font-family: Burn;" },
    { mots: ["lourd", "fatigué", ], style: "font-family: Frijole;" },
    { mots: ["anomalie", "anormal"], style: "font-family: Rubik;" },
    { mots: ["gémi"], style: "font-family: Assassin;" },
    { mots: ["inquièt", "inquiét", "inquiet"], style: "font-family: Sedgwick;" },
    { mots: ["espoir"], style: "font-family: Starstruck;, background-color : white" },
];

// 2️⃣ Créer un objet plat pour lookup rapide
const motsCles = {};
motsClesGroups.forEach(group => {
    group.mots.forEach(mot => {
        motsCles[mot] = group.style;
    });
});

// 3️⃣ Fonction pour colorier le texte
function colorierTexte(texte) {
    const container = document.createElement("div");
    container.style.whiteSpace = "pre-wrap"; // garde les retours à la ligne

    // Séparer texte en mots et espaces
    const morceaux = texte.split(/([\s’]+)/)


    morceaux.forEach(morceau => {
        if (/\S/.test(morceau)) {
            // Séparer mot et ponctuation finale
            const match = morceau.match(/^([^\s,.!?;:]+)([,.!?;:]*)$/);
            if (match) {
                const mot = match[1];
                const ponctuation = match[2];
                const motLower = mot.toLowerCase();
                let styleApplique = "";

                // Chercher si un mot clé correspond au début du mot
                const motClean = motLower.replace(/^[dlmnst]’/i, ''); // enlève d’, l’, m’, etc.
                for (const cle of Object.keys(motsCles)) {
                    if (motClean.startsWith(cle.toLowerCase())) {
                        styleApplique = motsCles[cle];
                        break;
                    }
                }

                if (styleApplique) {
                    const span = document.createElement("span");
                    span.textContent = mot;
                    span.style = styleApplique;
                    container.appendChild(span);
                } else {
                    container.appendChild(document.createTextNode(mot));
                }

                // Ajouter ponctuation séparément
                if (ponctuation) {
                    container.appendChild(document.createTextNode(ponctuation));
                }
            } else {
                container.appendChild(document.createTextNode(morceau));
            }
        } else {
            // espaces ou retour à la ligne
            container.appendChild(document.createTextNode(morceau));
        }
    });

    const currentDiv = document.getElementById("resultat_html") || document.body;
    currentDiv.appendChild(container);

    console.log("Texte affiché avec styles appliqués !");
}

// 4️⃣ Lecture du fichier
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const contenu = e.target.result;
        colorierTexte(contenu);
    };
    reader.readAsText(file, 'UTF-8');
});

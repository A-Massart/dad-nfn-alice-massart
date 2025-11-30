/***********************************************
 * mix-des-idees.js
 * * Keyword highlighting + Paper.js shapes ON keywords
 * * Paper.js generative animations
 ***********************************************/

// ---------------------------
// 1️⃣ Keyword Highlighting + Shape Mapping
// ---------------------------
const motsClesGroups = [
  { mots: ["chaleur", "chaud", "fondre"], style: "font-family: PicNic;", forme: "wave" },
  { mots: ["fièvre", "brûl"], style: "font-family: Burn;", forme: "circle" },
  { mots: ["lourd", "fatigué"], style: "font-family: Frijole;" },
  { mots: ["anomalie", "anormal"], style: "font-family: Rubik;" },
  { mots: ["gémi"], style: "font-family: Assassin;", forme: "scratch" },
  { mots: ["inquièt", "inquiét", "inquiet"], style: "font-family: Sedgwick;", forme: "snake" },
  { mots: ["espoir"], style: "font-family: Starstruck; background-color: white;", forme: "pulse" },
];

const motsCles = {};
motsClesGroups.forEach(group => {
  group.mots.forEach(mot => {
    motsCles[mot] = { style: group.style, forme: group.forme };
  });
});

// Stockage des mots avec formes à dessiner
let motsAvecFormes = [];
let canvasActif = false; // Flag pour savoir si on affiche le canvas

function colorierTexte(texte) {
  motsAvecFormes = []; // Reset
  canvasActif = true; // Activer le canvas
  const canvas = document.getElementById('myCanvas');
  if (canvas) canvas.style.display = 'block';
  
  const container = document.createElement("div");
  container.style.whiteSpace = "pre-wrap";
  const morceaux = texte.split(/([\s']+)/);
  
  morceaux.forEach(morceau => {
    if (/\S/.test(morceau)) {
      const match = morceau.match(/^([^\s,.!?;:]+)([,.!?;:]*)$/);
      if (match) {
        const mot = match[1];
        const ponctuation = match[2];
        const motLower = mot.toLowerCase();
        let configAppliquee = null;
        const motClean = motLower.replace(/^[dlmnst]'/i, '');
        
        for (const cle of Object.keys(motsCles)) {
          if (motClean.startsWith(cle.toLowerCase())) {
            configAppliquee = motsCles[cle];
            break;
          }
        }
        
        if (configAppliquee) {
          const span = document.createElement("span");
          span.textContent = mot;
          span.style = configAppliquee.style;
          span.classList.add("mot-cle");
          span.dataset.forme = configAppliquee.forme;
          container.appendChild(span);
          
          // Enregistrer pour placement ultérieur
          motsAvecFormes.push({ element: span, forme: configAppliquee.forme });
        } else {
          container.appendChild(document.createTextNode(mot));
        }
        
        if (ponctuation) {
          container.appendChild(document.createTextNode(ponctuation));
        }
      } else {
        container.appendChild(document.createTextNode(morceau));
      }
    } else {
      container.appendChild(document.createTextNode(morceau));
    }
  });
  
  const currentDiv = document.getElementById("resultat_html") || document.body;
  currentDiv.innerHTML = ""; // Clear previous
  currentDiv.appendChild(container);
  
  console.log("Texte affiché avec styles appliqués !");
  
  // Attendre que le DOM soit rendu pour placer les formes
  setTimeout(placerFormesSupMots, 100);
}

// File input listener
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

// ---------------------------
// 2️⃣ Paper.js Animations
// ---------------------------
let formesSupMots = []; // Formes Paper.js placées sur les mots

window.onload = function() {
  paper.setup('myCanvas');
  
  // Cacher le canvas au départ
  const canvas = document.getElementById('myCanvas');
  if (canvas) canvas.style.display = 'none';
  
  // --- Paper.js Animation Loop (UNIQUEMENT pour les formes sur mots) ---
  paper.view.onFrame = function(event) {
    // Animer les formes SUR les mots
    animerFormesSupMots(event);
  };
};

// ---------------------------
// 3️⃣ Placement des formes Paper.js SUR les mots
// ---------------------------
function placerFormesSupMots() {
  // Nettoyer les anciennes formes
  formesSupMots.forEach(item => {
    if (item.shape) item.shape.remove();
  });
  formesSupMots = [];
  
  const canvas = document.getElementById('myCanvas');
  const canvasRect = canvas.getBoundingClientRect();
  
  motsAvecFormes.forEach(motData => {
    const rect = motData.element.getBoundingClientRect();
    
    // Convertir en coordonnées Paper.js
    const x = rect.left - canvasRect.left + rect.width / 2;
    const y = rect.top - canvasRect.top + rect.height / 2;
    const width = rect.width;
    const height = rect.height;
    
    let shape = null;
    
    switch(motData.forme) {
      case "flame": // Flamme rouge/orange ondulante
        shape = creerFlamme(x, y, width, height);
        break;
      case "wave": // Vague orange
        shape = creerVague(x, y+20, width);
        break;
      case "scratch": // Griffure brown
        shape = creerGriffure(x, y, width, height);
        break;
      case "snake": // Snake bleu
        shape = creerSnake(x, y, width);
        break;
      case "circle": // Cercles rouges en pointillés
        shape = creerCercles(x, y, Math.max(width, height) / 2);
        break;
      case "pulse": // Lignes pulsantes
        shape = creerPulse(x, y, width, height);
        break;
      case "star": // Étoile
        shape = creerEtoile(x, y, Math.max(width, height) / 2);
        break;
    }
    
    if (shape) {
      formesSupMots.push({
        shape: shape,
        type: motData.forme,
        baseX: x,
        baseY: y,
        time: 0
      });
    }
  });
}

// ---------------------------
// 4️⃣ Fonctions de création de formes
// ---------------------------
function creerFlamme(x, y, width, height) {
  const group = new paper.Group();
  const flamePath = new paper.Path();
  flamePath.strokeColor = 'orange';
  flamePath.strokeWidth = 2;
  
  const points = 8;
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const radius = height / 2 + Math.random() * 5;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    flamePath.add(new paper.Point(px, py));
  }
  flamePath.closePath();
  flamePath.smooth();
  group.addChild(flamePath);
  return group;
}

function creerVague(x, y, width) {
  const path = new paper.Path();
  path.strokeColor = 'orange';
  path.strokeWidth = 2;
  
  const points = 10;
  const basePoints = [];
  for (let i = 0; i <= points; i++) {
    const px = x - width/2 + (i / points) * width;
    const pt = new paper.Point(px, y);
    path.add(pt);
    basePoints.push(pt.clone());
  }
  path.smooth();
  path.data = { basePoints: basePoints };
  return path;
}

function creerGriffure(x, y, width, height) {
  const path = new paper.Path();
  path.strokeColor = 'brown';
  path.strokeWidth = 3;
  
  const start = new paper.Point(x - width/2, y - height/2);
  const end = new paper.Point(x + width/2, y + height/2);
  path.add(start);
  path.add(end);
  return path;
}

function creerSnake(x, y, width) {
  const path = new paper.Path();
  path.strokeColor = '#2a9dc7';
  path.strokeWidth = 2;
  
  const points = 5;
  for (let i = 0; i < points; i++) {
    const px = x - width/2 + (i / points) * width + (Math.random() - 0.5) * 10;
    const py = y + (Math.random() - 0.5) * 10;
    path.add(new paper.Point(px, py));
  }
  path.smooth();
  return path;
}

function creerCercles(x, y, radius) {
  const group = new paper.Group();
  for (let i = 1; i <= 3; i++) {
    const circle = new paper.Path.Circle({
      center: [x, y],
      radius: radius * (i/3)
    });
    circle.strokeColor = 'red';
    circle.dashArray = [2, 7];
    circle.strokeWidth = 2;
    group.addChild(circle);
  }
  return group;
}

function creerPulse(x, y, width, height) {
  const group = new paper.Group();
  const vLine = new paper.Path([
    new paper.Point(x, y - height),
    new paper.Point(x, y + height)
  ]);
  const hLine = new paper.Path([
    new paper.Point(x - width, y),
    new paper.Point(x + width, y)
  ]);
  vLine.strokeColor = hLine.strokeColor = '#fff349ff';
  vLine.strokeWidth = hLine.strokeWidth = 3;
  group.addChild(vLine);
  group.addChild(hLine);
  return group;
}

function creerEtoile(x, y, radius) {
  const points = 5;
  const path = new paper.Path();
  path.strokeColor = 'yellow';
  path.fillColor = 'rgba(255, 255, 100, 0.3)';
  path.strokeWidth = 2;
  
  for (let i = 0; i < points * 2; i++) {
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? radius : radius / 2;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    path.add(new paper.Point(px, py));
  }
  path.closePath();
  return path;
}

// ---------------------------
// 5️⃣ Animation des formes sur les mots
// ---------------------------
function animerFormesSupMots(event) {
  formesSupMots.forEach(item => {
    item.time += event.delta;
    
    switch(item.type) {
      case "flame":
        // Ondulation de la flamme
        if (item.shape.children[0]) {
          const path = item.shape.children[0];
          path.segments.forEach((seg, i) => {
            const angle = item.time * 3 + i;
            seg.point.x = item.baseX + Math.cos(angle) * (10 + Math.sin(item.time * 2) * 3);
            seg.point.y = item.baseY + Math.sin(angle) * (10 + Math.sin(item.time * 2) * 3);
          });
          path.smooth();
        }
        break;
        
      case "wave":
        // Ondulation de la vague
        if (item.shape.data && item.shape.data.basePoints) {
          item.shape.segments.forEach((seg, i) => {
            const base = item.shape.data.basePoints[i];
            seg.point.y = base.y + Math.sin(item.time * 3 + i) * 3;
          });
          item.shape.smooth();
        }
        break;
        
      case "circle":
        // Rotation des cercles
        item.shape.rotate(0.5);
        break;
        
      case "pulse":
        // Pulsation des lignes
        const scale = 1 + Math.sin(item.time * 4) * 0.1;
        item.shape.scaling = scale;
        break;
        
      case "star":
        // Rotation et scintillement
        item.shape.rotate(0.5);
        item.shape.opacity = 0.5 + Math.sin(item.time * 5) * 0.5;
        break;
    }
  });
}

// Recalculer les positions lors du resize ou scroll
window.addEventListener('resize', () => {
  if (motsAvecFormes.length > 0) {
    placerFormesSupMots();
  }
});

window.addEventListener('scroll', () => {
  if (motsAvecFormes.length > 0) {
    placerFormesSupMots();
  }
});
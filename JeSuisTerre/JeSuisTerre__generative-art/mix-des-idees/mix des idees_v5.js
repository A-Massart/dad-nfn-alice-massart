// ---------------------------
// 🔄 AUTO-CHARGEMENT DES MOTS-CLÉS PAR DATE
// ---------------------------

// Configuration dynamique des mots-clés (sera remplie automatiquement)
let motsClesGroups = [];
let motsCles = {};

// Variables globales pour l'animation
let motsAvecFormes = [];
let canvasActif = false;
let scratchesIndependants = [];
let formesSupMots = [];

// Fonction pour charger les mots-clés depuis un fichier JSON
async function chargerMotsClesParDate(dateStr) {
  const cheminJSON = `/dad-nfn-alice-massart/JeSuisTerre/journal-de-bord/mots-cles/${dateStr}_mots-cles.json`;
  
  try {
    const response = await fetch(cheminJSON);
    if (!response.ok) {
      console.warn(`Aucun fichier de mots-clés trouvé pour ${dateStr}`);
      return false;
    }
    
    const data = await response.json();
    
    // Mapper le JSON vers le format attendu
    motsClesGroups = [
      { mots: data.wave || [], style: "font-family: PicNic;", forme: "wave" },
      { mots: data.circle || [], style: "font-family: Burn;", forme: "circle" },
      { mots: data.mental || [], style: "font-family: Frijole;" },
      { mots: data.weird || [], style: "font-family: Rubik;" },
      { mots: data.scratch || [], style: "font-family: Assassin;", forme: "scratch" },
      { mots: data.snake || [], style: "font-family: Sedgwick;", forme: "snake" },
      { mots: data.pulse || [], style: "font-family: Starstruck; background-color: white;", forme: "pulse" }
    ];
    
    // Reconstruire l'objet motsCles
    motsCles = {};
    motsClesGroups.forEach(group => {
      group.mots.forEach(mot => {
        motsCles[mot] = { style: group.style, forme: group.forme };
      });
    });
    
    console.log(`✅ Mots-clés chargés pour ${dateStr}:`, Object.keys(motsCles).length, "mots");
    return true;
    
  } catch (error) {
    console.error(`Erreur lors du chargement des mots-clés:`, error);
    return false;
  }
}

// Fonction pour extraire la date du nom de fichier
function extraireDateDuFichier(nomFichier) {
  // Format attendu: 2025-11-30_journal-de-bord.md
  const match = nomFichier.match(/^(\d{4}-\d{2}-\d{2})_/);
  return match ? match[1] : null;
}

// Fonction pour charger le journal et ses mots-clés
async function chargerDernierJournal() {
  try {
    const res = await fetch('/dad-nfn-alice-massart/JeSuisTerre/journal-de-bord/journal-de-bord__pages/journal-list.json');
    if (!res.ok) throw new Error('Impossible de récupérer la liste des journaux');

    const fichiers = await res.json();
    if (!fichiers.length) return;

    const dernier = fichiers.sort().reverse()[0];
    const contentRes = await fetch(`/dad-nfn-alice-massart/JeSuisTerre/journal-de-bord/journal-de-bord__pages/${dernier}`);
    const contenu = await contentRes.text();

    const dateStr = extraireDateDuFichier(dernier);
    if (dateStr) await chargerMotsClesParDate(dateStr);
    colorierTexte(contenu);

  } catch (e) {
    console.error(e);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  chargerDernierJournal();
});



// ---------------------------
// 1️⃣ Keyword Highlighting + Shape Mapping
// ---------------------------

function colorierTexte(texte) {
  motsAvecFormes = [];
  canvasActif = true;
  const canvas = document.getElementById('myCanvas');
  if (canvas) canvas.style.display = 'block';
  
  const container = document.createElement("div");
  container.style.whiteSpace = "pre-wrap";
  const morceaux = texte.split(/(\s+)/);
  
  morceaux.forEach(morceau => {
    if (/\S/.test(morceau)) {
      // Gérer les mots avec apostrophe (d'espoir, l'espoir, etc.)
      const apostropheMatch = morceau.match(/^([dlmnst]['\u2019])(.+?)([,.!?;:]*)$/i);
      
      if (apostropheMatch) {
        const article = apostropheMatch[1];
        const motPrincipal = apostropheMatch[2];
        const ponctuation = apostropheMatch[3];
        
        container.appendChild(document.createTextNode(article));
        
        const motLower = motPrincipal.toLowerCase();
        let configAppliquee = null;
        
        for (const cle of Object.keys(motsCles)) {
          if (motLower.includes(cle.toLowerCase())) {
            configAppliquee = motsCles[cle];
            break;
          }
        }
        
        if (configAppliquee) {
          const span = document.createElement("span");
          span.textContent = motPrincipal;
          span.style = configAppliquee.style;
          span.classList.add("mot-cle");
          span.dataset.forme = configAppliquee.forme;
          container.appendChild(span);
          
          motsAvecFormes.push({ element: span, forme: configAppliquee.forme });
        } else {
          container.appendChild(document.createTextNode(motPrincipal));
        }
        
        if (ponctuation) {
          container.appendChild(document.createTextNode(ponctuation));
        }
        
      } else {
        const match = morceau.match(/^([^\s,.!?;:]+)([,.!?;:]*)$/);
        if (match) {
          const mot = match[1];
          const ponctuation = match[2];
          const motLower = mot.toLowerCase();
          let configAppliquee = null;
          
          for (const cle of Object.keys(motsCles)) {
            if (motLower.includes(cle.toLowerCase())) {
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
      }
    } else {
      container.appendChild(document.createTextNode(morceau));
    }
  });
  
  const currentDiv = document.getElementById("resultat_html") || document.body;
  currentDiv.innerHTML = "";
  currentDiv.appendChild(container);
  
  console.log("Texte affiché avec", motsAvecFormes.length, "mots-clés stylisés");
  
  setTimeout(placerFormesSupMots, 100);
}

// ---------------------------
// 2️⃣ Paper.js Setup
// ---------------------------

window.onload = function() {
  paper.setup('myCanvas');
  
  const canvas = document.getElementById('myCanvas');
  if (canvas) canvas.style.display = 'none';
  
  paper.view.onFrame = function(event) {
    animerFormesSupMots(event);
  };
};

// ---------------------------
// 3️⃣ Placement des formes Paper.js SUR les mots
// ---------------------------
function placerFormesSupMots() {
  formesSupMots.forEach(item => {
    if (item.shape) item.shape.remove();
  });
  formesSupMots = [];
  
  const canvas = document.getElementById('myCanvas');
  const canvasRect = canvas.getBoundingClientRect();
  
  const backgroundLayer = new paper.Layer();
  backgroundLayer.sendToBack();
  
  motsAvecFormes.forEach(motData => {
    const rect = motData.element.getBoundingClientRect();
    
    const x = rect.left - canvasRect.left + rect.width / 2;
    const y = rect.top - canvasRect.top + rect.height / 2;
    const width = rect.width;
    const height = rect.height;
    
    let shape = null;
    
    switch(motData.forme) {
      case "wave":
        shape = creerVague(x, y + (Math.random() * 25 + 15), width);
        break;
      case "scratch":
        shape = creerGriffure(x, y, width, height);
        break;
      case "snake":
        shape = creerSnake(x, y, width);
        break;
      case "circle":
        shape = creerCercles(x, y, Math.max(width, height) / 2);
        break;
      case "pulse":
        shape = creerPulse(x, y, width, height);
        break;
    }
    
    if (shape) {
      formesSupMots.push({
        shape: shape,
        type: motData.forme,
        baseX: x,
        baseY: y,
        time: 0,
        frameCounter: 0
      });
    }
  });
}

// ---------------------------
// 4️⃣ Fonctions de création de formes
// ---------------------------

function creerVague(x, y, width) {
  const waveAmount = 30;
  const waveHeight = 10;
  const waveWidth = 500;
  
  const wavePath = new paper.Path({
    strokeColor: "orange",
    strokeWidth: 5,
    strokeCap: 'square'
  });
  
  const basePoints = [];
  
  for (let i = 0; i <= waveAmount; i++) {
    const px = x - waveWidth/2 + (i / waveAmount) * waveWidth;
    const py = y;
    const pt = new paper.Point(px, py);
    wavePath.add(pt);
    basePoints.push(pt.clone());
  }
  
  wavePath.smooth();
  wavePath.data = { basePoints: basePoints, waveHeight: waveHeight, waveAmount: waveAmount, timer: 0 };
  
  return wavePath;
}

function creerGriffure(x, y, width, height) {
  const scratch_size = 100 + Math.random() * (300 - 100);
  const start = new paper.Point(x, y);
  const end = new paper.Point(x - scratch_size, y + (scratch_size/2));
  
  const path = new paper.Path({
    strokeColor: 'brown',
    strokeWidth: (Math.random() * (4 - 2) + 2) * 2,
    opacity: 1
  });
  
  const scratchObj = {
    path: path,
    start: start,
    end: end,
    progress: 0,
    fading: false,
    drawDuration: Math.random() * (0.5 - 0.01) + 0.01,
    fadeDuration: 5
  };
  
  scratchesIndependants.push(scratchObj);
  
  return path;
}

function creerSnake(x, y, width) {
  const snakePath = new paper.Path();
  snakePath.strokeColor = '#2a9dc7';
  snakePath.strokeWidth = 3;
  
  const amount = 50;
  const boxSize = 300;
  const stepSize = 500;
  
  for (let i = 0; i < amount; i++) {
    const px = x + Math.random() * boxSize - boxSize / 2;
    const py = y + Math.random() * boxSize - boxSize / 2;
    snakePath.add(new paper.Point(px, py));
  }
  snakePath.smooth();
  
  snakePath.data = {
    sx: x,
    sy: y,
    boxSize: boxSize,
    stepSize: stepSize,
    framesPerMove: 2
  };
  
  return snakePath;
}

function creerCercles(x, y, radius) {
  const radiusFixe = Math.random(3000 - 2000) + 2000;
  const circlePaths = [];
  for (let i = 1; i <= 5; i++) {
    const c = new paper.Path.Circle({
      center: [x, y],
      radius: radiusFixe * (i/10),
    });
    circlePaths.push(c);
  }
  const group = new paper.Group(circlePaths);
  group.style = {
    strokeColor: 'red',
    dashArray: [10, 7],
    strokeWidth: 4,
    strokeCap: 'round'
  };
  
  return group;
}

function creerPulse(x, y, width, height) {
  const common_stroke_color = '#fff349ff';
  const lineLength = 2000;
  
  const verticalLine = new paper.Path([
    new paper.Point(x, y - lineLength),
    new paper.Point(x, y + lineLength)
  ]);
  verticalLine.strokeColor = common_stroke_color;
  verticalLine.strokeWidth = 50;
  
  const horizontalLine = new paper.Path([
    new paper.Point(x - lineLength, y),
    new paper.Point(x + lineLength, y)
  ]);
  horizontalLine.strokeColor = common_stroke_color;
  horizontalLine.strokeWidth = 20;
  
  const group = new paper.Group([verticalLine, horizontalLine]);
  group.data = {
    minWidth: 40,
    maxWidth: 50,
    speed: 0.2,
    increasing: true,
    vLine: verticalLine,
    hLine: horizontalLine,
    pauseTime: 0,
    pauseDuration: 0.5
  };
  
  return group;
}

// ---------------------------
// 5️⃣ Animation des formes
// ---------------------------
function animerScratchesIndependants(event) {
  scratchesIndependants = scratchesIndependants.filter(scratch => {
    if (!scratch.fading) {
      scratch.progress += event.delta / scratch.drawDuration;
      if (scratch.progress >= 1) {
        scratch.progress = 1;
        scratch.fading = true;
      }
      const current = scratch.start.add(scratch.end.subtract(scratch.start).multiply(scratch.progress));
      scratch.path.removeSegments();
      scratch.path.add(scratch.start);
      scratch.path.add(current);
    } else {
      scratch.path.opacity -= event.delta / scratch.fadeDuration;
      if (scratch.path.opacity <= 0) {
        scratch.path.remove();
        return false;
      }
    }
    return true;
  });
}

// Créer des scratches indépendants toutes les 3 secondes
setInterval(() => {
  if (canvasActif && formesSupMots.length > 0) {
    const canvas = document.getElementById('myCanvas');
    const canvasRect = canvas.getBoundingClientRect();
    
    const x = canvasRect.left + Math.random() * canvasRect.width;
    const y = canvasRect.top + Math.random() * canvasRect.height;
    
    const scratch_size = Math.random() * (300 - 100) + 100;
    const start = new paper.Point(x, y);
    const end = new paper.Point(x - scratch_size, y + (scratch_size/2));
    
    const path = new paper.Path({
      strokeColor: 'brown',
      strokeWidth: 5,
      opacity: 1
    });
    
    scratchesIndependants.push({
      path: path,
      start: start,
      end: end,
      progress: 0,
      fading: false,
      drawDuration: 0.5,
      fadeDuration: 5
    });
  }
}, Math.random() * (3000 - 1000) + 1000);

function animerFormesSupMots(event) {
  animerScratchesIndependants(event);
  
  formesSupMots.forEach(item => {
    item.time += event.delta;
    item.frameCounter++;
    
    switch(item.type) {
      case "wave":
        if (item.shape.data && item.shape.data.basePoints) 
          { const waveAmount = item.shape.data.waveAmount;
            const waveHeight = item.shape.data.waveHeight;
            
            for (let i = 0; i <= waveAmount; i++)
              {
                const seg = item.shape.segments[i]; 
                const base = item.shape.data.basePoints[i];
                const sinus = Math.sin(event.time * 2 + i);
                seg.point.y = base.y + sinus * waveHeight;
              } 
              item.shape.smooth();
            }
            break;

        
      case "scratch":
        break;
        
      case "snake":
        const data = item.shape.data;
        if (item.frameCounter % data.framesPerMove === 0) {
          item.shape.removeSegment(0);
          const lastPoint = item.shape.segments[item.shape.segments.length - 1].point;
          let newX = lastPoint.x + (Math.random() - 0.5) * data.stepSize;
          let newY = lastPoint.y + (Math.random() - 0.5) * data.stepSize;
          newX = Math.max(data.sx - data.boxSize/2, Math.min(data.sx + data.boxSize/2, newX));
          newY = Math.max(data.sy - data.boxSize/2, Math.min(data.sy + data.boxSize/2, newY));
          item.shape.add(new paper.Point(newX, newY));
          item.shape.smooth();
        }
        break;
        
      case "circle":
        item.shape.rotate(0.01);
        break;
        
      case "pulse":
        const d = item.shape.data;
        if (d.vLine && d.hLine) {
          // Si on est en pause, on décrémente pauseTime et on ne change pas d'épaisseur
          if (d.pauseTime > 0) {
            d.pauseTime -= event.delta;
          } else {
            if (d.increasing) {
              // Increasing normal
              const newWidth = d.vLine.strokeWidth + d.speed;
              if (newWidth >= d.maxWidth) {
                d.vLine.strokeWidth = d.maxWidth;
                d.hLine.strokeWidth = d.maxWidth;
                d.increasing = false; // commencer decreasing sans pause
              } else {
                d.vLine.strokeWidth = newWidth;
                d.hLine.strokeWidth = newWidth;
              }
            } else {
              // Decreasing
              const newWidth = d.vLine.strokeWidth - d.speed;
              if (newWidth <= d.minWidth) {
                d.vLine.strokeWidth = d.minWidth;
                d.hLine.strokeWidth = d.minWidth;
                // Pause après decreasing
                d.pauseTime = d.pauseDuration;
                d.increasing = true; // préparation pour increasing après la pause
              } else {
                d.vLine.strokeWidth = newWidth;
                d.hLine.strokeWidth = newWidth;
              }
            }
          }
        }
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
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
  { mots: ["lourd", "fatigué", "poids", "faibl", "fragil"], style: "font-family: Frijole;" },
  { mots: ["anomalie", "anormal", "silence"], style: "font-family: Rubik;" },
  { mots: ["gémi", "satur", "bless"], style: "font-family: Assassin;", forme: "scratch" },
  { mots: ["inquièt", "inquiét", "inquiet", "triste", "las"], style: "font-family: Sedgwick;", forme: "snake" },
  { mots: ["espoir", "joie", "joy", "lucid"], style: "font-family: Starstruck; background-color: white;", forme: "pulse" },
];


const motsCles = {};
motsClesGroups.forEach(group => {
  group.mots.forEach(mot => {
    motsCles[mot] = { style: group.style, forme: group.forme };
  });
});

let motsAvecFormes = [];
let canvasActif = false;

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
      // Supporte ' (ASCII 39) et ' (typographique Unicode 8217)
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
// 2️⃣ Paper.js Setup
// ---------------------------
let formesSupMots = [];

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
  const waveAmount = 20;
  const waveHeight = 7;
  const waveWidth = 200;
  
  const wavePath = new paper.Path({
    strokeColor: "orange",
    strokeWidth: 2,
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
  wavePath.data = { basePoints: basePoints, waveHeight: waveHeight, waveAmount: waveAmount };
  
  return wavePath;
}

function creerGriffure(x, y, width, height) {
  const scratch_size = 300;
  const start = new paper.Point(x, y);
  const end = new paper.Point(x - scratch_size, y + (scratch_size/2));
  
  const path = new paper.Path({
    strokeColor: 'brown',
    strokeWidth: 10,
    opacity: 1
  });
  
  path.data = {
    start: start,
    end: end,
    progress: 0,
    fading: false,
    drawDuration: 0.5,
    fadeDuration: 5,
    nextScratchTimer: 0,
    nextScratchDelay: Math.random() * (3 - 0.2) + 0.2,
    hasDrawn: false
  };
  
  return path;
}

function creerSnake(x, y, width) {
  const snakePath = new paper.Path();
  snakePath.strokeColor = '#2a9dc7';
  snakePath.strokeWidth = 3;
  
  const amount = 10;
  const boxSize = 50;
  const stepSize = 15;
  
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
    framesPerMove: 3
  };
  
  return snakePath;
}

function creerCercles(x, y, radius) {
  const radiusFixe = 100;
  const circlePaths = [];
  for (let i = 1; i <= 5; i++) {
    const c = new paper.Path.Circle({
      center: [x, y],
      radius: radiusFixe * (i/5),
    });
    circlePaths.push(c);
  }
  const group = new paper.Group(circlePaths);
  group.style = {
    strokeColor: 'red',
    dashArray: [2, 7],
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
  verticalLine.strokeWidth = 20;
  
  const horizontalLine = new paper.Path([
    new paper.Point(x - lineLength, y),
    new paper.Point(x + lineLength, y)
  ]);
  horizontalLine.strokeColor = common_stroke_color;
  horizontalLine.strokeWidth = 20;
  
  const group = new paper.Group([verticalLine, horizontalLine]);
  group.data = {
    minWidth: 20,
    maxWidth: 30,
    speed: 0.2,
    increasing: true,
    vLine: verticalLine,
    hLine: horizontalLine
  };
  
  return group;
}

// ---------------------------
// 5️⃣ Animation des formes
// ---------------------------
function animerFormesSupMots(event) {
  formesSupMots.forEach(item => {
    item.time += event.delta;
    item.frameCounter++;
    
    switch(item.type) {
      case "wave":
        if (item.shape.data && item.shape.data.basePoints) {
          const waveAmount = item.shape.data.waveAmount;
          const waveHeight = item.shape.data.waveHeight;
          for (let i = 0; i <= waveAmount; i++) {
            const seg = item.shape.segments[i];
            const base = item.shape.data.basePoints[i];
            const sinus = Math.sin(event.time * 3 + i);
            seg.point.y = base.y + sinus * waveHeight;
          }
          item.shape.smooth();
        }
        break;
        
      case "scratch":
        const s = item.shape.data;
        const path = item.shape;
        
        if (!s.hasDrawn) {
          if (!s.fading) {
            s.progress += event.delta / s.drawDuration;
            if (s.progress >= 1) {
              s.progress = 1;
              s.fading = true;
            }
            const current = s.start.add(s.end.subtract(s.start).multiply(s.progress));
            path.removeSegments();
            path.add(s.start);
            path.add(current);
          } else {
            path.opacity -= event.delta / s.fadeDuration;
            if (path.opacity <= 0) {
              path.opacity = 0;
              s.hasDrawn = true;
              s.nextScratchDelay = Math.random() * (3 - 0.2) + 0.2;
              s.nextScratchTimer = 0;
            }
          }
        } else {
          s.nextScratchTimer += event.delta;
          if (s.nextScratchTimer >= s.nextScratchDelay) {
            s.progress = 0;
            s.fading = false;
            path.opacity = 1;
            s.hasDrawn = false;
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 100;
            s.start = new paper.Point(item.baseX + offsetX, item.baseY + offsetY);
            s.end = new paper.Point(s.start.x - 300, s.start.y + 150);
          }
        }
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
        item.shape.rotate(0.2);
        break;
        
      case "pulse":
        const d = item.shape.data;
        if (d.vLine && d.hLine) {
          if (d.increasing) {
            const newWidth = d.vLine.strokeWidth + d.speed;
            if (newWidth >= d.maxWidth) {
              d.increasing = false;
            }
            d.vLine.strokeWidth = newWidth;
            d.hLine.strokeWidth = newWidth;
          } else {
            const newWidth = d.vLine.strokeWidth - d.speed;
            if (newWidth <= d.minWidth) {
              d.increasing = true;
            }
            d.vLine.strokeWidth = newWidth;
            d.hLine.strokeWidth = newWidth;
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
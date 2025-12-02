// MOUVEMENT DES PUPILLES EN FONCTION DE LA POSITION DE LA SOURIS

const earth = document.querySelector('.earth');
const leftPupil = document.getElementById('earth__eyes__left__pupil');
const rightPupil = document.getElementById('earth__eyes__right__pupil');
const mouth = document.getElementById('earth__mouth');
const leftEyeEl = document.getElementById('earth__eyes__left');
const rightEyeEl = document.getElementById('earth__eyes__right');
let isMovingPupils = true;
let isHoveringEye = false;

// Fonction pour réinitialiser les pupilles au centre
function resetPupils() {
    leftPupil.style.transform = 'translate(-50%, -50%)';
    rightPupil.style.transform = 'translate(-50%, -50%)';
}

// Au survol de .earth, les pupilles se remettent au centre
earth.addEventListener('mouseenter', () => {
    resetPupils();
    earth.style.cursor = 'pointer';
});

// Quand on survole un oeil, on arrête le suivi de la souris et on recentre la pupille
if (leftEyeEl) {
    leftEyeEl.addEventListener('mouseenter', () => { isHoveringEye = true; resetPupils(); });
    leftEyeEl.addEventListener('mouseleave', () => { isHoveringEye = false; });
}
if (rightEyeEl) {
    rightEyeEl.addEventListener('mouseenter', () => { isHoveringEye = true; resetPupils(); });
    rightEyeEl.addEventListener('mouseleave', () => { isHoveringEye = false; });
}

// Fonction pour lire le texte avec la Web Speech API
// Version simple : teste les fichiers journaux des derniers N jours
async function readLatestJournal() {
    const maxDays = 30; // ne pas chercher trop loin pour rester simple
    const today = new Date();
    let found = null;

    for (let i = 0; i < maxDays; i++) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const name = `../journal-de-bord/${year}-${month}_${day}_journal-de-bord.md`;
        try {
            const resp = await fetch(name, { method: 'HEAD' });
            if (resp.ok) { found = name; break; }
        } catch (err) {
            // fetch HEAD peut échouer en local; essayer GET en dernier recours
            try {
                const resp2 = await fetch(name);
                if (resp2.ok) { found = name; break; }
            } catch (e) {
                // continuer
            }
        }
    }

    if (!found) {
        console.warn('Aucun fichier journal trouvé dans les', maxDays, 'derniers jours.');
        return;
    }

    try {
        const text = await (await fetch(found)).text();
        const lines = text.split('\n');

        // Extraire le contenu après le bloc délimité par ''' si présent
        const quoteLines = lines.reduce((acc, l, idx) => {
            if (l.trim() === "'''") acc.push(idx);
            return acc;
        }, []);

        let content = '';
        if (quoteLines.length >= 2) {
            content = lines.slice(quoteLines[1] + 1).join('\n').trim();
        } else {
            // fallback: tout après la première ligne vide
            const empty = lines.findIndex(l => l.trim() === '');
            content = empty >= 0 ? lines.slice(empty + 1).join('\n').trim() : text.trim();
        }

        if (!content) { console.warn('Aucun contenu à lire dans', found); return; }

    const utt = new SpeechSynthesisUtterance(content);
    utt.lang = 'fr-FR'; utt.rate = 1; utt.pitch = 1;

    // Animer la bouche pendant la lecture
    utt.onstart = () => { try { mouth.classList.add('speaking'); } catch (e) {} };
    utt.onend = utt.onerror = () => { try { mouth.classList.remove('speaking'); } catch (e) {} };

        function speakWithVoice() {
            const voices = window.speechSynthesis.getVoices();
            const v = voices.find(v => v.name.includes('Google') && v.lang.includes('fr')) ||
                      voices.find(v => v.lang.includes('fr') && v.name.toLowerCase().includes('female')) ||
                      voices.find(v => v.lang.includes('fr')) || voices[0];
            if (v) utt.voice = v;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utt);
        }

        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = speakWithVoice;
        } else speakWithVoice();

    } catch (err) {
        console.error('Erreur pendant la lecture du journal:', err);
    }
}

// Au clic sur .earth, on toggle le mouvement des pupilles ET on lit le journal
earth.addEventListener('click', () => {
    isMovingPupils = !isMovingPupils;
    if (!isMovingPupils) {
        resetPupils();
    }
    
    readLatestJournal();
});

document.addEventListener('mousemove', (e) => {
    // Si le mouvement des pupilles est désactivé ou si on survole un oeil, on ne fait rien
    if (!isMovingPupils || isHoveringEye) return;
    
    const leftEye = document.getElementById('earth__eyes__left');
    const rightEye = document.getElementById('earth__eyes__right');
    
    // Position de la souris
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Fonction pour déplacer la pupille dans l'oeil
    function movePupil(eye, pupil) {
        const eyeRect = eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        
        // Vecteur de la souris vers le centre de l'oeil
        const dx = mouseX - eyeCenterX;
        const dy = mouseY - eyeCenterY;
        
        // Angle vers la souris
        const angle = Math.atan2(dy, dx);
        
        // Rayon de l'oeil (c'est un cercle)
        const eyeRadius = eye.offsetWidth / 2;
        const pupilRadius = pupil.offsetWidth / 2;
        
        // Distance max que la pupille peut parcourir (rayon de l'oeil - rayon de la pupille)
        const maxDistance = eyeRadius - pupilRadius;
        
        // Nouvelle position de la pupille (elle suit la souris mais reste dans l'oeil)
        const pupilX = Math.cos(angle) * maxDistance;
        const pupilY = Math.sin(angle) * maxDistance;
        
        // On applique la transformation directement
        pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
    }
    
    movePupil(leftEye, leftPupil);
    movePupil(rightEye, rightPupil);
});

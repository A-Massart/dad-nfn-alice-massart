// MOUVEMENT DES PUPILLES EN FONCTION DE LA POSITION DE LA SOURIS

const earth = document.querySelector('.earth');
const leftPupil = document.getElementById('earth__eyes__left__pupil');
const rightPupil = document.getElementById('earth__eyes__right__pupil');
let isMovingPupils = true;

// Fonction pour réinitialiser les pupilles au centre
function resetPupils() {
    leftPupil.style.transform = 'translate(-50%, -50%)';
    rightPupil.style.transform = 'translate(-50%, -50%)';
}

// Au survol de .earth, les pupilles se remettent au centre
earth.addEventListener('mouseenter', () => {
    resetPupils();
});

// Au clic sur .earth, on toggle le mouvement des pupilles
earth.addEventListener('click', () => {
    isMovingPupils = !isMovingPupils;
    if (!isMovingPupils) {
        resetPupils();
    }
});

document.addEventListener('mousemove', (e) => {
    // Si le mouvement des pupilles est désactivé, on ne fait rien
    if (!isMovingPupils) return;
    
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

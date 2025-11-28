paper.setup('myCanvas');

var scratches = []; // liste de griffures actives
var x = 1100;
var y = 150;
var scratch_size = 300


function scratch_shape() {
    var start = new paper.Point(x, y);
    var end   = new paper.Point(x - scratch_size, y + (scratch_size/2));

    var path = new paper.Path({
        strokeColor: 'brown',
        strokeWidth: 10,
        opacity: 1
    });

    scratches.push({
        path: path,
        start: start,
        end: end,
        progress: 0,
        fading: false,
        drawDuration: 0.5,
        fadeDuration: 5
    });

    x = 800 + Math.random() * (1100 - 800);
    y = 100 + Math.random() * (200 - 100);
    scratch_size = 100 + Math.random() * (300 - 100);

}

// Appel d'une griffure toutes les 2 secondes
setInterval(scratch_shape, 3000);

paper.view.onFrame = function(event) {
    for (var i = scratches.length - 1; i >= 0; i--) {

        var s = scratches[i];
        var path = s.path;

        // --- Phase 1 : dessin progressif ---
        if (!s.fading) {
            s.progress += event.delta / s.drawDuration;

            if (s.progress >= 1) {
                s.progress = 1;
                s.fading = true;
            }

            var current = s.start.add(s.end.subtract(s.start).multiply(s.progress));
            path.removeSegments();
            path.add(s.start);
            path.add(current);
        }
        // --- Phase 2 : disparition ---
        else {
            path.opacity -= event.delta / s.fadeDuration;

            if (path.opacity <= 0) {
                path.remove();    // supprimer proprement du canvas
                scratches.splice(i, 1); // retirer de la liste
            }
        }
    }
};

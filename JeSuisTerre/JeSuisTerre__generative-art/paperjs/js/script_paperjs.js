// --- Setup Canvas ---
window.onload = function() {
    paper.setup('myCanvas');






    // --- Griffures Brown ---
    var scratches = [];
    var x = 1100;
    var y = 150;
    var scratch_size = 300;

    function scratch_shape() {
        var start = new paper.Point(x, y);
        var end = new paper.Point(x - scratch_size, y + (scratch_size/2));

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

    // Griffure toutes les 3 secondes
    setInterval(scratch_shape, 3000);







    // --- Snake Bleu ---
    var snakePath = new paper.Path();
    snakePath.strokeColor = '#2a9dc7';
    snakePath.strokeWidth = 3;

    var sx = 500;
    var sy = 500;
    var amount = 10;
    var boxSize = 50;
    var stepSize = 15;
    var framesPerMove = 3;

    // Initialize snake points
    for (var i = 0; i < amount; i++) {
        var px = sx + Math.random() * boxSize - boxSize / 2;
        var py = sy + Math.random() * boxSize - boxSize / 2;
        snakePath.add(new paper.Point(px, py));
    }
    snakePath.smooth();

    var frameCounter = 0;






    // --- Orange Wave ---
    var waveAmount = 20;
    var waveWidth = 200;
    var waveHeight = 7;
    var centerX = 600;
    var centerY = 250;

    var wavePath = new paper.Path({
        strokeColor: "orange",
        strokeWidth: 2,
        strokeCap: 'square'
    });

    // Stocke la position de base pour chaque segment
    var basePoints = [];

    for (var i = 0; i <= waveAmount; i++) {
        var px = centerX - waveWidth/2 + (i / waveAmount) * waveWidth;
        var py = centerY;
        var pt = new paper.Point(px, py);
        wavePath.add(pt);
        basePoints.push(pt.clone()); // clone pour garder la valeur de départ
    }

    wavePath.smooth();

    paper.view.onFrame = function(event) {
        for (var i = 0; i <= waveAmount; i++) {
            var segment = wavePath.segments[i];
            var base = basePoints[i];
            var sinus = Math.sin(event.time * 3 + i);
            segment.point.y = base.y + sinus * waveHeight; // variation relative
        }
        wavePath.smooth();
    };








    // --- Red Circle Dotted ---
    var cx = 1000;
    var cy = 600;
    var radius_property = 100;

    var circlePaths = [];
    for (var i = 1; i <= 5; i++) {
        var c = new paper.Path.Circle({
            center: [cx, cy],
            radius: radius_property * (i/5),
        });
        circlePaths.push(c);
    }
    var group_dotted_red = new paper.Group(circlePaths);
    group_dotted_red.style = {
        strokeColor: 'red',
        dashArray: [2,7],
        strokeWidth: 4,
        strokeCap: 'round'
    };







    // --- Pulsing White Lines ---
    var common_stroke_color = '#fff349ff';
    var verticalLine = new paper.Path([new paper.Point(200,0), new paper.Point(200,2000)]);
    verticalLine.strokeColor = common_stroke_color;
    verticalLine.strokeWidth = 20;

    var horizontalLine = new paper.Path([new paper.Point(0,150), new paper.Point(2000,150)]);
    horizontalLine.strokeColor = common_stroke_color;
    horizontalLine.strokeWidth = 20;

    var minWidth = 20, maxWidth = 30, speed = 0.2;
    var increasing = true;










    // --- ON FRAME : Tout animer ici ---
    paper.view.onFrame = function(event) {
        frameCounter++;

        // --- Griffures ---
        for (var i = scratches.length - 1; i >= 0; i--) {
            var s = scratches[i];
            var path = s.path;
            if (!s.fading) {
                s.progress += event.delta / s.drawDuration;
                if (s.progress >= 1) { s.progress = 1; s.fading = true; }
                var current = s.start.add(s.end.subtract(s.start).multiply(s.progress));
                path.removeSegments();
                path.add(s.start);
                path.add(current);
            } else {
                path.opacity -= event.delta / s.fadeDuration;
                if (path.opacity <= 0) {
                    path.remove();
                    scratches.splice(i,1);
                }
            }
        }

        // --- Snake Bleu ---
        if (frameCounter % framesPerMove === 0) {
            snakePath.removeSegment(0);
            var lastPoint = snakePath.segments[snakePath.segments.length-1].point;
            var newX = lastPoint.x + (Math.random() - 0.5) * stepSize;
            var newY = lastPoint.y + (Math.random() - 0.5) * stepSize;
            newX = Math.max(sx - boxSize/2, Math.min(sx + boxSize/2, newX));
            newY = Math.max(sy - boxSize/2, Math.min(sy + boxSize/2, newY));
            snakePath.add(new paper.Point(newX, newY));
            snakePath.smooth();
        }

        // --- Orange Wave ---
        for (var i = 0; i <= waveAmount; i++) {
            var seg = wavePath.segments[i];
            var base = basePoints[i];            // <-- utiliser la base
            var sinus = Math.sin(event.time * 3 + i);
            seg.point.y = base.y + sinus * waveHeight; // variation relative
        }
        wavePath.smooth();


        // --- Red Circle Rotation ---
        group_dotted_red.rotate(0.2);

        // --- Pulsing Lines ---
        if (increasing) {
            verticalLine.strokeWidth += speed;
            horizontalLine.strokeWidth += speed;
            if (verticalLine.strokeWidth >= maxWidth) increasing = false;
        } else {
            verticalLine.strokeWidth -= speed;
            horizontalLine.strokeWidth -= speed;
            if (verticalLine.strokeWidth <= minWidth) increasing = true;
        }
    };
}
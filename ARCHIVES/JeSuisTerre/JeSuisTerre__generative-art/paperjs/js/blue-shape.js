paper.setup('myCanvas');

// Créer un Path
var path = new paper.Path();
path.strokeColor = '#2a9dc7';
path.strokeWidth = 3;

var x = 200; // center x of the box
var y = 200; // center y of the box
var amount = 10; // Max number of points
var boxSize = 50; // Size of the box
var stepSize = 15; // Larger movements
var framesPerMove = 3; // Keep slow animation

// Initialize the path with random points inside the box
for (var i = 0; i < amount; i++) {
    var px = x + Math.random() * boxSize - boxSize / 2;
    var py = y + Math.random() * boxSize - boxSize / 2;
    path.add(new paper.Point(px, py));
}

path.smooth();

var frameCounter = 0;

paper.view.onFrame = function(event) {
    frameCounter++;
    if (frameCounter % framesPerMove !== 0) return; // skip frames for slower animation

    // Remove the first segment
    path.removeSegment(0);

    // Add a new point at the end
    var lastPoint = path.segments[path.segments.length - 1].point;

    // Larger random movement
    var newX = lastPoint.x + (Math.random() - 0.5) * stepSize;
    var newY = lastPoint.y + (Math.random() - 0.5) * stepSize;

    // Clamp inside the 50x50 box
    newX = Math.max(x - boxSize / 2, Math.min(x + boxSize / 2, newX));
    newY = Math.max(y - boxSize / 2, Math.min(y + boxSize / 2, newY));

    path.add(new paper.Point(newX, newY));
    path.smooth();
};

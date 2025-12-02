// The amount of segment points we want to create:
var amount = 20;

// The maximum height of the wave:
var height = 7;

// Create a new path and style it:
var path = new Path({
    strokeColor: "orange",
    strokeWidth: 2,
    strokeCap: 'square'
});

// Add 5 segment points to the path spread out
// over the width of the view:
for (var i = 0; i <= amount; i++) {
    path.add(new Point(i / amount, 1) * 200);
}

function onFrame(event) {
    // Loop through the segments of the path:
    for (var i = 0; i <= amount; i++) {
        var segment = path.segments[i];

        // A cylic value between -1 and 1
        var sinus = Math.sin(event.time * 3 + i);
        
        // Change the y position of the segment point:
        segment.point.y = sinus * height + 100;
    }
    // to smooth the path:
    path.smooth();
}
paper.setup('myCanvas');

var common_stroke_color = '#fff349ff';
var x = 200;
var y = 150;


// Vertical line
var verticalLine = new paper.Path();
verticalLine.strokeColor = common_stroke_color;
verticalLine.strokeWidth = 20;
verticalLine.add(new paper.Point(x, 0));
verticalLine.add(new paper.Point(x, 2000));

// Horizontal line (optional)
var horizontalLine = new paper.Path();
horizontalLine.strokeColor = common_stroke_color;
horizontalLine.strokeWidth = 20;
horizontalLine.add(new paper.Point(0, y));
horizontalLine.add(new paper.Point(2000, y));

// Pulse animation parameters
var minWidth = 20;
var maxWidth = 30;
var speed = 0.2;
var increasing = true;

paper.view.onFrame = function(event) {
    // Update strokeWidth for vertical line
    if (increasing) {
        verticalLine.strokeWidth += speed;
        horizontalLine.strokeWidth += speed; // optional
        if (verticalLine.strokeWidth >= maxWidth) {
            increasing = false;
        }
    } else {
        verticalLine.strokeWidth -= speed;
        horizontalLine.strokeWidth -= speed; // optional
        if (verticalLine.strokeWidth <= minWidth) {
            increasing = true;
        }
    }
};

// Setup directly from canvas id:
paper.setup('myCanvas');
var path = new Path();

var x = 200
var y = 200
var radius_property = 100

var path1 = new Path.Circle({
    center: [x, y],
    radius: radius_property
});
var path2 = new Path.Circle({
    center: [x, y],
    radius: 0.8*radius_property
});
var path3 = new Path.Circle({
    center: [x, y],
    radius: 0.6*radius_property
});
var path4 = new Path.Circle({
    center: [x, y],
    radius: 0.4*radius_property
});
var path5 = new Path.Circle({
    center: [x, y],
    radius: 0.2*radius_property
});

var group_dotted_red = new Group(path1, path2, path3, path4, path5);

group_dotted_red.style = {
    strokeColor: 'red',
    dashArray: [2, 7],
    strokeWidth: 4,
    strokeCap: 'round'
};

function onFrame(event) {
	// Each frame, rotate the path by 3 degrees:
	group_dotted_red.rotate(0.2);
}
view.draw();
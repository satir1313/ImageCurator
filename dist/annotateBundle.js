(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

var coordinates;

var detectButton = document.getElementById('btnDetect').addEventListener('click', () => {
	var filePicker = document.getElementById('fileToDetect');
	var imageName = filePicker.files[0].name;
	var opts = {
		method: 'POST',
		header: 'text',
		body: imageName
	}

	fetch('ml_connection/detect', opts).then(response => {
		console.log(response);
		coordinates = JSON.stringify(response);
	});
});


var img = new Image();
img.src = '../images/image2.jpg';

// var imgName = img.src.replace(/^.*[\\\/]/, '');

// Establish the canvas object when image is loaded
img.onload = function () {
	var canvasElem = document.getElementById('canvas-draw');
	canvasElem.addEventListener("mousemove", mouseMoveHandler, false);
	canvasElem.addEventListener("mousedown", mouseDownHandler, false);
	canvasElem.addEventListener("click", mouseClickHandler, false);
	canvasElem.addEventListener("mousewheel", mouseWheelHandler, { passive: false }); // Support Chromium
	canvasElem.addEventListener("DOMMouseScroll", mouseWheelHandler, false); // Support Firefox
	canvasElem.addEventListener("mouseout", mouseOutHandler, false);
	document.addEventListener("mouseup", mouseUpHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	canvas.ctx = canvasElem.getContext('2d');
	canvas.drawImage();
};

function trytranslate() {
	canvas.translate();
}

// Status of the canvas
var canvasMode = Object.freeze({
	cNone: "none",
	cDragPt: "drag",
	cSelPt: "select",
	cDrawBox: "drawBox",
	cDrawPoly: "drawPoly",
	cdragImage: "dragImage"
});

// Canvas object
var canvas = {
	polygons: [],
	hoverPoly: undefined, 	// polygons[] index of polygon mouse is hovering over
	hoverPt: undefined, 	// polygons[hoverPoly] index of point mouse is hovering over
	selPoly: undefined, 	// polygons[] index of polygon mouse has clicked on
	selPt: undefined, 		// polygons[selPoly] index of point mouse has clicked on
	ctx: undefined, 		// 2D context of canvas element
	zoom: 1, 				// The amount of zoom currently used in the canvas
	offsetX: 0,				// The x and y offset from the original image position
	offsetY: 0,
	startDragX: 0,
	startDragY: 0,
	centerX: 0,				// The x and y offsets adjusted to the zoom level for drawing the canvas
	centerY: 0,
	zoomLimit: false,
	imgRatio: undefined, 	// The value required to adjust the image to fit the canvas
	mode: canvasMode.cNone,

	// Adjust the canvas according to the zoom and offset, and draw the image and annotations
	drawCanvas: function (offsetX, offsetY) {

		// Set focus point for painting the new canvas
		this.centerX = ((this.getWidth() / 2) - ((this.getWidth() / 2) * this.zoom)) - this.offsetX;
		this.centerY = ((this.getHeight() / 2) - ((this.getHeight() / 2) * this.zoom)) - this.offsetY;

		// Add an extra offset if it exists (for when user is dragging the image)
		if (offsetX !== undefined && offsetY !== undefined) {
			this.centerX -= offsetX;
			this.centerY -= offsetY
		}

		clearCanvas(this.ctx, this.getWidth(), this.getHeight()); // Wipe canvas
		this.ctx.save(); // Save the current translation of the canvas
		this.ctx.translate(this.centerX, this.centerY); // Translate the canvas to match the offset or move to center
		this.ctx.scale(this.zoom, this.zoom);
		this.drawImage();
		this.drawAnnotations();
		this.ctx.restore(); // Restore the original translation

		console.log("centerx: " + this.centerX + " centery: " + this.centerY);
		console.log("zoom: " + this.zoom);
	},

	// Wipe and redraw the image, polygons, and points on the canvas
	drawAnnotations: function () {
		if (this.ctx !== undefined) {

			// Draw the grey highlighted circle on the point the mouse is hovering over (if there is one)
			if (this.hoverPoly !== undefined && this.hoverPt !== undefined) {
				drawPt(this.polygons[this.hoverPoly][this.hoverPt], this.ctx, adjustSizeForZoom(5, this.zoom), "gray");
			}

			// Draw the blue highlighted circle on the point the mouse has clicked on (if there is one)
			if ((this.selPoly !== undefined && this.selPt !== undefined) && (this.selPt !== this.hoverPt || this.selPoly !== this.hoverPoly)) {
				drawPt(this.polygons[this.selPoly][this.selPt], this.ctx, adjustSizeForZoom(5, this.zoom), "blue");
			}

			// Draw the polygons on the canvas in black, adjusted to the current zoom level
			for (var i = 0; i < this.polygons.length; ++i) {
				drawPolygon(this.polygons[i].slice(1), this.ctx, "black", this.zoom);;
			}
		}
	},

	// Calculated the amount of zoom for the canvas according to the user's scrollwheel
	zoomCanvas: function (e) {
		e.preventDefault() // Prevent scrolling entire webpage if on Firefox

		// Support different browsers and normalise scrollwheel to single step
		var zoomDelta = (e.deltaY < 0 || e.detail < 0 || e.wheelDelta > 0) ? 1 : -1;
		var newZoom = Math.exp(zoomDelta * 0.05);
		this.zoom = this.zoom * newZoom;

		// Prevent the user from scrolling too far in or out
		if (this.zoom > 32) {
			this.zoom = 32;

			// Prevent changing offset if already at limit
			if (this.zoomLimit) {
				return;
			}
			else this.zoomLimit = true;
		}
		else if (this.zoom < 0.5) {
			this.zoom = 0.5;

			// Prevent changing offset if already at limit
			if (this.zoomLimit) {
				return;
			}
			else this.zoomLimit = true;
		}
		// Not at zoom limit
		else this.zoomLimit = false;

		// Remove the offset to zoom in/out from the center of the image
		this.offsetX *= newZoom;
		this.offsetY *= newZoom;

		//this.drawCanvas();
		this.drawCanvas();
	},

	drawImage: function () {

		// If imgRatio hasn't been set, set it to the value required to fit the image in the canvas
		if (this.imgRatio === undefined) {
			var canvasH = this.getHeight();
			var canvasW = this.getWidth();

			if (img.width / img.height > canvasW / canvasH) {
				this.imgRatio = canvasW / img.width;
			}
			else {
				this.imgRatio = canvasH / img.height;
			}

			// Set the canvas size according to the adjusted image size
			this.ctx.canvas.height = img.height * this.imgRatio;
			this.ctx.canvas.width = img.width * this.imgRatio;
		}

		// Draw the image according to the adjusted dimensions for fitting it in the canvas
		this.ctx.drawImage(img, 0, 0, img.width * this.imgRatio, img.height * this.imgRatio);
	},

	// Wipe all polygons from the canvas
	clearPolygons: function () {
		this.polygons = [];
		this.drawCanvas();
	},

	// Get the height of the canvas in pixels
	getHeight: function () {
		return this.ctx.canvas.height;
	},

	// Get the width of the canvas in pixels
	getWidth: function () {
		return this.ctx.canvas.width;
	},

	// Get the array of polygons
	getPolygons: function () {
		return this.polygons;
	},

	// Start dragging an image
	startDragImage: function (x, y) {
		this.mode = canvasMode.cDragImage;
		this.startDragX = x;
		this.startDragY = y;
		this.selPoly = undefined;
		this.selPt = undefined
	},

	// Drag the image with the select tool
	dragImage: function (x, y) {
		var offsetX = (this.startDragX - x);
		var offsetY = (this.startDragY - y);

		this.drawCanvas(offsetX, offsetY);
	},

	// Finish dragging the image
	finishImageDrag: function (x, y) {

		this.offsetX += (this.startDragX - x);
		this.offsetY += (this.startDragY - y)


		this.drawCanvas();

		canvas.mode = canvasMode.cNone;
	},

	// Start drawing a polygon
	startDrawing: function (x, y, label, type) {

		// Set the canvas mode
		this.mode = (type == "box") ? canvasMode.cDrawBox : canvasMode.cDrawPoly;

		// Adjust mouse coordinates according to canvas page offset and zoom
		x = x / this.zoom + (-this.centerX / this.zoom);
		y = y / this.zoom + (-this.centerY / this.zoom);

		// Keep the point within the image bounds
		x = checkBounds(x, this.getWidth(), 0);
		y = checkBounds(y, this.getHeight(), 0);

		this.polygons.push([label, [x, y]]);
	},

	// Draw a rectangular bounding box
	drawBox: function (x, y, done) {

		// Adjust mouse coordinates according to canvas page offset and zoom
		x = x / this.zoom + (-this.centerX / this.zoom);
		y = y / this.zoom + (-this.centerY / this.zoom);

		// Get index of current polygon
		idx = this.polygons.length - 1;

		// Calculate the x,y for the remaining three points
		point3 = { x: 0, y: 0 };
		point3.x = checkBounds(x, this.getWidth(), 0); // Keep within image bounds
		point3.y = checkBounds(y, this.getHeight(), 0); // Keep within image bounds
		point2 = { x: 0, y: 0 };
		point2.x = point3.x;
		point2.y = this.polygons[idx][1][1];
		point4 = { x: 0, y: 0 };
		point4.x = this.polygons[idx][1][0];
		point4.y = point3.y;

		// Push the remaining three points to the polygons array
		this.polygons[idx].push([point2.x, point2.y]);
		this.polygons[idx].push([point3.x, point3.y]);
		this.polygons[idx].push([point4.x, point4.y]);

		// Draw the bounding box, and remove the three points if the user is still drawing
		this.drawCanvas();

		if (done) {
			this.mode = canvasMode.cNone;
		}
		else {
			this.polygons[idx].pop();
			this.polygons[idx].pop();
			this.polygons[idx].pop();
		}
	},

	// Draw a polygonal bounding box
	drawPoly: function (x, y) {

		// Adjust mouse coordinates according to canvas page offset and zoom
		x = x / this.zoom + (-this.centerX / this.zoom);
		y = y / this.zoom + (-this.centerY / this.zoom);

		// Keep the point within the image bounds
		x = checkBounds(x, this.getWidth(), 0);
		y = checkBounds(y, this.getHeight(), 0);

		// Get index of current polygon
		idx = this.polygons.length - 1;

		// Push the bounding box to the polygons array and draw it on the canvas
		this.polygons[idx].push([x, y]);
		this.drawCanvas();
	},

	// Finish drawing a polygon
	finishPoly: function () {
		this.mode = canvasMode.cNone;
	},

	// Determine which polygon point the mouse is hovering over, if any
	findHoverPt: function (x, y) {

		// Transform mouse coordinates according to canvas zoom and offset
		x = x / this.zoom + (-this.centerX / this.zoom);
		y = y / this.zoom + (-this.centerY / this.zoom);

		var newHoverPt = undefined;
		var newHoverPoly = undefined;
		var pointFound = false;

		// Adjust selection area according to zoom level
		var selectionRadius = adjustSizeForZoom(9, this.zoom);

		// While a point has not been found, continue searching through the polygons and points
		for (var i = 0; i < this.polygons.length && !pointFound; ++i) {
			for (var j = 1; j < this.polygons[i].length; ++j) {
				if (dist(this.polygons[i][j], [x, y]) <= selectionRadius) {
					newHoverPoly = i;
					newHoverPt = j;
					pointFound = true;
					break;
				}
			}
		}

		// If the found point is not already hovered over, highlight it on the canvas
		if (newHoverPoly !== this.hoverPoly || newHoverPt !== this.hoverPt) {
			this.hoverPt = newHoverPt;
			this.hoverPoly = newHoverPoly;
			this.drawCanvas();
		}
	},

	// Check if mouse is hovering over a point
	getHoverStatus: function () {
		if (this.hoverPt !== undefined) {
			return true;
		}
		else {
			return false;
		}
	},

	// Start dragging a polygon point
	beginDragPt: function () {
		this.mode = canvasMode.cDragPt;
		this.selPoly = this.hoverPoly;
		this.selPt = this.hoverPt;
	},

	// Drag a polygon point
	moveSelPt: function (x, y) {

		// Transform mouse coordinates according to canvas zoom and offset
		x = x / this.zoom + (-this.centerX / this.zoom);
		y = y / this.zoom + (-this.centerY / this.zoom);

		// Keep the point within the image bounds
		x = checkBounds(x, this.getWidth(), 0);
		y = checkBounds(y, this.getHeight(), 0);

		// If a point is selected, move it to the new location
		if (this.selPt !== undefined) {
			this.polygons[this.selPoly][this.selPt][0] = x;
			this.polygons[this.selPoly][this.selPt][1] = y;
			this.drawCanvas();
		}
	},

	// Finish dragging a polygon point
	endDragPt: function () {
		if (this.mode === canvasMode.cDragPt) {
			this.mode = canvasMode.cNone;
			this.selPoly = undefined;
			this.selPt = undefined;
		}
	},

	// Select a polygon point and highlight it on the canvas
	selectPt: function () {
		this.mode = (this.hoverPoly !== undefined && this.hoverPt !== undefined) ? canvasMode.cSelPt : canvasMode.cNone;
		this.selPoly = this.hoverPoly;
		this.selPt = this.hoverPt;
		this.drawCanvas();
	},

	// Delete a polygon point
	deletePt: function () {
		if (this.mode === canvasMode.cSelPt && this.selPoly !== undefined && this.selPt !== undefined) {
			this.polygons[this.selPoly].splice(this.selPt, 1);

			if (this.hoverPt === this.selPt) {
				this.hoverPoly = undefined;
				this.hoverPt = undefined;
			} else if (this.hoverPt > this.selPt) {
				--this.hoverPt;
			}
			this.selPoly = undefined;
			this.selPt = undefined;
			this.drawCanvas();
		}
	},
};

// Normalise y coordinate (0-1)
function normaliseHeight(y) {
	return (y / canvas.getHeight());
}

// Normalise x coordinate (0-1)
function normaliseWidth(x) {
	return (x / canvas.getWidth());
}

// Output the normalised polygons ### CURRENTLY GOES TO HTML ELEMENT, SHOULD GO TO DATABASE
function output() {
	var original = Array.from(canvas.getPolygons());
	var output = []

	// Normalise each polygon point and add it to a new array
	for (var i = 0; i < original.length; ++i) {
		output.push([original[i][0]]);
		for (var j = 1; j < original[i].length; ++j) {
			output[i].push([]);
			output[i][j].push(normaliseWidth(original[i][j][0]));
			output[i][j].push(normaliseHeight(original[i][j][1]));
		}
	}
	// Output array should look like [['label1', [x,y], [x,y], [x,y]], ['label2', [x,y], [x,y], [x,y]]]

	// Output the normalised polygons to an HTML element
	output = output.join(' ');
	document.getElementById("results").innerHTML = output;
}

// Make sure a value is within the given bounds
function checkBounds(val, max, min) {
	if (val > max) {
		return max;
	}
	else if (val < min) {
		return min;
	}
	else {
		return val;
	}
}

// Remove polygons from the canvas
function clearPolygons() {
	canvas.clearPolygons();
}

// Draw a point on a canvas
function drawPt(pt, ctx, radius, color) {
	ctx.beginPath();
	ctx.arc(pt[0], pt[1], radius, 0, Math.PI * 4);
	ctx.fillStyle = color;
	ctx.fill();
}


// Draw polygons on a canvas
function drawPolygon(pts, ctx, color, zoom) {

	// Draw the points in the polygons, adjusted to fit the canvas zoom
	for (var i = 0; i < pts.length; ++i) {
		drawPt(pts[i], ctx, adjustSizeForZoom(3, zoom), color);
	}

	// Draw the paths between the polygon points
	ctx.beginPath();
	ctx.moveTo(pts[0][0], pts[0][1]);

	for (var i = 1; i < pts.length; ++i) {
		ctx.lineTo(pts[i][0], pts[i][1]);
	}

	ctx.lineTo(pts[0][0], pts[0][1]);
	ctx.strokeStyle = color;
	ctx.lineWidth = adjustSizeForZoom(2, zoom);
	ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
	ctx.fill();
	ctx.stroke();
}

// Clear a canvas of image and annotations
function clearCanvas(ctx, width, height) {
	ctx.clearRect(0, 0, width, height);
}

// Shift a polygon point's coordinates
function shiftPt(pt, shift) {
	return [pt[0] + shift[0], pt[1] + shift[1]];
}

// Adjust the size of a value according to the canvas zoom level
function adjustSizeForZoom(num, zoom) {
	return num * (1 / zoom);
}

// Return the square of a value
function sq(x) {
	return x * x;
}

// Get the distance between two coordinates
function dist(pt1, pt2) {
	if (pt2 === undefined) {
		pt2 = [0, 0];
	}

	var pt = shiftPt(pt1, [-pt2[0], -pt2[1]]);

	return sq(pt[0]) + sq(pt[1]);
}

// React to the user moving the mouse
function mouseMoveHandler(e) {

	// Drag a polygon point
	if (canvas.mode === canvasMode.cDragPt) {
		canvas.moveSelPt(e.offsetX, e.offsetY);
	}

	// Draw a rectangular bounding box
	else if (canvas.mode === canvasMode.cDrawBox) {
		canvas.drawBox(e.offsetX, e.offsetY, false);
	}

	else if (canvas.mode === canvasMode.cDragImage) {
		canvas.dragImage(event.x, event.y);
	}

	// Check if the user is hovering over a polygon point
	else {
		canvas.findHoverPt(e.offsetX, e.offsetY);
	}
}

// React to the user clicking the mouse down
function mouseDownHandler(e) {
	var toolSelected = getSelectedTool();
	var labelSelected = getSelectedLabel();

	// Start dragging a polygon point
	if (toolSelected == "select") {
		if (canvas.getHoverStatus()) {
			canvas.beginDragPt();
		}
		else {
			canvas.startDragImage(event.x, event.y);
		}
	}

	// Start drawing a rectangular bounding box
	else if (toolSelected == "box" && labelSelected != null) {
		canvas.startDrawing(e.offsetX, e.offsetY, labelSelected, "box");
	}
}

// React to the user finishing a mouse click
function mouseUpHandler(e) {
	var toolSelected = getSelectedTool();
	var labelSelected = getSelectedLabel();

	// Finish dragging a polygon point
	if (canvas.mode === canvasMode.cDragPt) {
		canvas.endDragPt();
	}

	// Finish drawing a rectagular bounding box
	else if (canvas.mode === canvasMode.cDrawBox) {
		canvas.drawBox(e.offsetX, e.offsetY, true);
	}

	else if (canvas.mode === canvasMode.cDragImage) {
		canvas.finishImageDrag(event.x, event.y);
	}
}

// React to the user clicking the mouse
function mouseClickHandler(e) {
	var toolSelected = getSelectedTool();
	var labelSelected = getSelectedLabel();

	// Start or continue drawing a polygon
	if (toolSelected == "polygon" && labelSelected != null) {
		if (canvas.mode != canvasMode.cDrawPoly) {
			canvas.startDrawing(e.offsetX, e.offsetY, labelSelected, "polygon");
		}
		else {
			canvas.drawPoly(e.offsetX, e.offsetY);
		}
	}

	// Select a polygon point
	else if (toolSelected == "select" && canvas.getHoverStatus()) {
		canvas.selectPt();

	}
}

// React to the mouse moving outside the canvas
function mouseOutHandler(e) {
	if (canvas.mode == canvasMode.cDragImage) {
		canvas.finishImageDrag(event.clientX, event.clientY);
	}
}

// Zoom the canvas when the user uses the scrollwheel
function mouseWheelHandler(e) {
	canvas.zoomCanvas(e);
}

// React to the user pressing a keyboard key
function keyUpHandler(e) {

	// Delete the selected point if they press 'delete'
	if (e.key === "Delete") {
		canvas.deletePt();
	}

	// Finish drawing the current polygon if they press 'enter'
	else if (e.key == "Enter") {
		canvas.finishPoly();
	}
}

// Check which tool the user has selected
function getSelectedTool() {
	if (document.getElementById("button-box").checked) {
		return "box";
	}
	else if (document.getElementById("button-polygon").checked) {
		return "polygon";
	}
	else if (document.getElementById("button-select").checked) {
		return "select";
	}
	return null;
}

// Check which label the user has selected
function getSelectedLabel() {
	var select = document.getElementById('animals')
	var selection = select.options[select.selectedIndex].value;
	return selection;
}






},{}]},{},[1]);

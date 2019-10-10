// simple implementation

function setup(){
	// createCanvas(windowWidth, windowHeight)
	createCanvas(500, 500)
}

/*********************************/
/*********************************/
//          START
/*********************************/
/*********************************/

////////
// STYLE

function draw_cursor(curr_color=[255,50, 10]) {
	// draw trail at mouse
	push();
	// pen color
	stroke(...curr_color);
	// pen Weight
	strokeWeight(pen_size);
	line(mouseX, mouseY, pmouseX, pmouseY)
	pop()
}

////////
// VARS

let MODES_ = {
	 1: 'BOX'
	,2: 'ELLIPSE'
	,3: 'LINES'
	,4: 'cube3d'
}
let MODES = {
	'BOX' : 		1
	,'ELLIPSE' : 	2
	,'LINES' : 		3
	,'cube3d' : 	4
}
let currmode=MODES['LINES']

let boxes = []
// [
// 	[[x1, y1], [x2, y2]]
// 	[[x1, y1], [x2, y2]]
// 	[[x1, y1], [x2, y2]]
// ]

let ellipses = []
// [
// 	[[x1, y1], [x2, y2]]
// 	[[x1, y1], [x2, y2]]
// 	[[x1, y1], [x2, y2]]
// ]

let lines = []
// [
// 	[[x, y], [x, y], [x, y], [x, y], [x, y]]
// 	[[x, y], [x, y], [x, y]]
// 	[[x, y], [x, y], [x, y], [x, y]]
// 	[[x, y], [x, y], [x, y]]
// 	[[x, y], [x, y], [x, y], [x, y], [x, y]]
// 	[[x, y], [x, y], [x, y], [x, y], [x, y]]
// ]
let temp_points = []
// [       temp variable to store lines
// 	[x, y]
// 	[x, y]
// 	[x, y]
// 	[x, y]
// ]

// cursor trail
let pen_size=2


////////////////////
// drawing functions

function draw_full_points(my_points, draw_dots=false, draw_dots_text=false){
	push()
	
	if (my_points.length == 0){return}

	if (draw_dots){
		my_points.forEach((p, index) =>{

			// point
			stroke(255)
			strokeWeight(5);
			point(...p);

			if (draw_dots_text){
				// text
				strokeWeight(1);
				stroke(255, 250, 0)
				text(index, p[0]+5, p[1]);
			}
		})
	}
	
	strokeWeight(1);
	noFill();
	beginShape();
	my_points.forEach((p, index) =>{
		curveVertex(...p);
	})
	endShape();
	pop()
}
function draw_full_lines(mylines) {
	mylines.forEach(a_line => draw_full_points(a_line))
}


// ###################
// loop
// ###################

// ===================================
// ===================================
// ===================================

function draw(){
	background(200);
	
	if (currmode == MODES['BOX']) {
		draw_cursor([0, 200, 150])

		// WHEN mouse is pressed -> I draw line
		push()
		rectMode(CORNERS)

		if (!mouseIsPressed && temp_points.length != 0) {
			boxes.push(temp_points.slice())
			temp_points = []
		}
		
		
		if (boxes.length != 0){
			for (let i = 0; i < boxes.length; i++) {
				let rect_data = boxes[i]
				let start = rect_data[0]
				let end = rect_data[1]
				rect(...start, ...end);
			}
		}


		if (mouseIsPressed){
			// add each line only each 3rd frame
			if (temp_points.length == 0)
				temp_points.push([mouseX+0, mouseY+0])
			
			if (temp_points.length == 1) {
				let last_point = temp_points[0]
				let _x = last_point[0]
				let _y = last_point[1]
				rect(...last_point, mouseX, mouseY)
			}
		}

		pop()
	}
	else if (currmode == MODES['LINES']) {

		draw_cursor()
		
		// WHEN mouse is pressed -> I draw line

		if (!mouseIsPressed && temp_points.length != 0) {
			lines.push(temp_points.slice())

			temp_points = []
		}
		
		draw_full_lines(lines)

		if (mouseIsPressed){
			// add each line only each 3rd frame
			if (frameCount % 2 == 0)
				temp_points.push([mouseX, mouseY])
			// draw current drawing line
			draw_full_points(temp_points)
		}
	}
	else if (currmode == MODES['cube3d']) {
		draw_cursor()
		draw_3d_cube()
	}
	else if (currmode == MODES['ELLIPSE']) {
		draw_cursor([40, 100, 50])

		// WHEN mouse is pressed -> I draw line
		push()
		stroke(0, 255)
		// ellipseMode(CORNERS)
		ellipseMode(CENTER)

		if (!mouseIsPressed && temp_points.length != 0) {
			ellipses.push(temp_points.slice())
			temp_points = []
		}
		
		
		if (ellipses.length != 0){
			for (let i = 0; i < ellipses.length; i++) {
				let rect_data = ellipses[i]
				let start_vec = rect_data[0]
				let end_vec = rect_data[1]

				stroke(0, 255)
				let distance = dist(...start_vec, ...end_vec)
				ellipse(...start_vec, distance*2, 2*distance)
				ellipse(...start_vec, 1,1)
				stroke(0, 10)
				line(...start_vec, ...end_vec)
			}
		}


		if (mouseIsPressed){
			// add each line only each 3rd frame
			if (temp_points.length == 0)
				temp_points.push([mouseX+0, mouseY+0])
			
			if (temp_points.length == 1) {
				let last_point = temp_points[0]
				let _x = last_point[0]
				let _y = last_point[1]
				let distance = dist(...last_point, mouseX, mouseY)

				stroke(0, 255)
				ellipse(...last_point, distance*2, 2*distance)
				ellipse(...last_point, 1,1)
			}
		}

		pop()
	}


	FAQ()
	text(`MODE -` + MODES_[currmode], 0, height-30)
	// ellipse(100,100,4,4);
	// ellipseMode(CORNERS)
	// ellipse(100,100,mouseX, mouseY);
	// ellipseMode(CENTER)
	// ellipse(100,100,mouseX, mouseY);

}

function FAQ() {
	general = '\n==\n' + Object.keys(MODES).map((val, index) =>{
		return `${MODES[val]}) ${val}`
	}).join('\n')

	if (currmode == MODES['BOX']) {
		message = [
		,'d) delete line'
		,'D) delete all lines'
		].join('\n')
	}
	else if (currmode == MODES['ELLIPSE']) {
		message = [
		,'d) delete line'
		,'D) delete all lines'
		].join('\n')
	}
	else if (currmode == MODES['PEN']) {
		message = [
		,'d) delete line'
		,'D) delete all lines'
		].join('\n')
	}
	else if (currmode == MODES['LINES']) {
		message = [
		,'d) delete line'
		,'D) delete all lines'
		].join('\n')
	}
	else if (currmode == MODES['cube3d']) {
		message = ''
	}

	text(message + general, 0, 0)

}
function mouseClicked(){
	temp_points.push([mouseX, mouseY])
}
function keyPressed() {
	// MODES
		 if (key == '1') currmode = MODES['BOX']
	else if (key == '2') currmode = MODES['ELLIPSE']
	else if (key == '3') currmode = MODES['LINES']
	else if (key == '4') currmode = MODES['cube3d']
	// Object.keys(MODES_).map( keyname => {
	// 	if (String(key) == keyname) currmode = MODES_[keyname]
	// })

	
	// COMMANDS
	if (currmode == MODES['BOX']) {
		if (key== 'D') {
			boxes.pop(0)
		}
		if (key== 'D' && keyIsDown(SHIFT)) {
			boxes = []
		}
	}
	else if (currmode == MODES['ELLIPSE']) {
		
		if (key== 'D') {
			ellipses.pop(0)
		}
		if (key== 'D' && keyIsDown(SHIFT)) {
			ellipses = []
		}
	}
	else if (currmode == MODES['LINES']) {
		
		if (key== 'D') {
			lines.pop(0)
		}
		if (key== 'D' && keyIsDown(SHIFT)) {
			lines = []
		}
	}
	else if (currmode == MODES['cube3d']) {
		// no hotkeys for cube3d

		if (key == 'Q') CAMERA_DICTANCE += .1
		if (key == 'W') CAMERA_DICTANCE -= .1
		if (key == 'A') ic_delta += 0.0001
		if (key == 'S') ic_delta -= 0.0001
		if (key == 'Z') cube_STEP += 0.01
		if (key == 'X') cube_STEP -= 0.01
		if (key == 'R') cube_3d_points = new_3d_cube_points(cube_STEP)
	}




	// general
	// if (key== 'P' && keyIsDown(SHIFT)) {
	// 	setTimeout(0, draw_flower)
	// }
	
}

function mouseWheel(event){
	if (event.delta < 0){ // up
		pen_size+=1
	}else{// down
		pen_size-=1
		
		if (pen_size == 0) pen_size = 0
	}
}
















































































































































































/*********************************************/
/*                _          ____      _     */
/*               | |        |___ \    | |    */
/*      ___ _   _| |__   ___  __) | __| |    */
/*     / __| | | | '_ \ / _ \|__ < / _` |    */
/*    | (__| |_| | |_) |  __/___) | (_| |    */
/*     \___|\__,_|_.__/ \___|____/ \__,_|    */
/*                                           */
/*                                           */
/*********************************************/

	function new_3d_cube_points(mystep) {
		let result_points = []
		for (let x = -1; x < 1; x+= mystep) {
			for (let y = -1; y < 1; y+=mystep) {
				for (let z = -1; z < 1; z+=mystep) {
					result_points.push([x,y,z])
				}
			}
		}
		return result_points
	}


let ic = 0
let ic_delta = 0.000053
let W = 500
	,H = 500
	,MODEL_MAX_X = 2
	,MODEL_MIN_X = -2
	,MODEL_MAX_Y =  2
	,MODEL_MIN_Y = -2
	,CAMERA_DICTANCE = 3
	,cube_STEP =  0.45
let cube_3d_points = new_3d_cube_points(cube_STEP)

function draw_3d_cube() {

	function perspectiveProjection(my_point) {
		let xx = my_point[0]
		let yy = my_point[1]
		let zz = my_point[2]

		return [
			xx/(zz+CAMERA_DICTANCE),
			yy/(zz+CAMERA_DICTANCE),
		]
	}

	function project(my_point) {
		let perspectivePoint = perspectiveProjection(my_point)
		let x = perspectivePoint[0],
			y = perspectivePoint[1];

		// return [
		// 	W * x,
		// 	H * y
		// ];

		return [
			W * (x - MODEL_MIN_X) / (MODEL_MAX_X - MODEL_MIN_X),
			H * (1 - (y - MODEL_MIN_Y)) / (MODEL_MAX_Y - MODEL_MIN_Y),
		];
		// return [
		// 	W * (x - MODEL_MIN_X) / (MODEL_MAX_X - MODEL_MIN_X),
		// 	H * (1 - (y - MODEL_MIN_Y)) / (MODEL_MAX_Y - MODEL_MIN_Y),
		// ];
	}

	function my_rotateY(a_point, theta) {
		let x = a_point[0]
		let y = a_point[1]
		let z = a_point[2]
		return [
			cos(theta) * x - sin(theta) * z,
			y,
			sin(theta) * x + cos(theta) * z,
		]
	}

	function my_rotateZ(a_point, theta) {
		let x = a_point[0]
		let y = a_point[1]
		let z = a_point[2]
		return [
			x,
			cos(theta) * y - sin(theta) * z,
			sin(theta) * y + cos(theta) * z,
		]
	}

	function renderPoint(a_point) {
		let proj_a_point = project(a_point)
		ellipse(...proj_a_point,4,4);
		// point(...proj_a_point);
	}

	push()
	translate(0, height)
	cube_3d_points.forEach( pp => {
		ic += ic_delta
		pp = my_rotateY(pp, ic)
		pp = my_rotateZ(pp, .1*ic)
		renderPoint(pp)
	})
	pop()

}

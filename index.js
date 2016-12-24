ds = require('dualshock');


//
// Constants
//


const DUALSCHOCK_TYPE = 'ds3';

const BUTTON_SQUARE = 'square';
const BUTTON_CROSS = 'cross';

const STICK_LEFT_X = 'lStickX';
const STICK_LEFT_Y = 'lStickY';

const STICK_RIGHT_X = 'rStickX';
const STICK_RIGHT_Y = 'rStickY';

const STICK_VALUE_CENTER = 127;
const STICK_TOLERANCE = 68;

const UPDATE_INTERVAL = 30;


//
// State of the controller's sticks
//


let stickLeftX = STICK_VALUE_CENTER;
let stickLeftY = STICK_VALUE_CENTER;
let stickRightX = STICK_VALUE_CENTER;
let stickRightY = STICK_VALUE_CENTER;



//
// Main routine
//


function main() {
  let device = ds.getDevices(DUALSCHOCK_TYPE)[0];

  if(!device) {
    console.error('No dualshock controller found!');
  }
    
  var gamepad = ds.open(device, {smoothAnalog:10, smoothMotion:15, joyDeadband:4, moveDeadband:4});
  gamepad.onanalog = handleAnalalogControl;
  gamepad.ondigital = handleDigitalControl;

  setTimeout(checkStickState, UPDATE_INTERVAL);
}


//
// Timer
//
function checkStickState() {
  handleStickLeftX()
  handleStickLeftY();
  handleStickRightX();
  handleStickRightY();
  setTimeout(checkStickState, UPDATE_INTERVAL)
}


//
// Dualshock control functions
//


function handleAnalalogControl(control, value) {
  if (control === STICK_LEFT_X) {
    stickLeftX = value;
  }
  if (control === STICK_LEFT_Y) {
    stickLeftY = value;
  }

  if (control === STICK_RIGHT_X) {
    stickRightX = value;
  }
  if (control === STICK_RIGHT_Y) {
    stickRightY = value;
  }
}


function handleDigitalControl(control, value) {
  if (control === BUTTON_SQUARE && value) {
    takeOff();
  }

  if (control === BUTTON_CROSS && value) {
    land();
  }
}


function handleStickLeftX() {
  if (stickLeftX > STICK_VALUE_CENTER - STICK_TOLERANCE && stickLeftX < STICK_VALUE_CENTER + STICK_TOLERANCE) {
    return;
  }

  if (stickLeftX < STICK_VALUE_CENTER) {
    rotateLeft();
  }

  if (stickLeftX > STICK_VALUE_CENTER) {
    rotateRight();
  }
}


function handleStickLeftY() {
  if (stickLeftY > STICK_VALUE_CENTER - STICK_TOLERANCE && stickLeftY < STICK_VALUE_CENTER + STICK_TOLERANCE) {
    return;
  }

  if (stickLeftY < STICK_VALUE_CENTER) {
    acend();
  }

  if (stickLeftY > STICK_VALUE_CENTER) {
    descend();
  }
}


function handleStickRightX() {
  if (stickRightX > STICK_VALUE_CENTER - STICK_TOLERANCE && stickRightX < STICK_VALUE_CENTER + STICK_TOLERANCE) {
    return;
  }

  if (stickRightX < STICK_VALUE_CENTER) {
    left();
  }

  if (stickRightX > STICK_VALUE_CENTER) {
    right();
  }
}


function handleStickRightY() {
  if (stickRightY > STICK_VALUE_CENTER - STICK_TOLERANCE && stickRightY < STICK_VALUE_CENTER + STICK_TOLERANCE) {
    return;
  }

  if (stickRightY < STICK_VALUE_CENTER) {
    forward();
  }

  if (stickRightY > STICK_VALUE_CENTER) {
    backward();
  }
}


//
// Drone controll functions
//


function takeOff() {
  console.log('take off');
}


function land() {
  console.log('land');
}


function left() {
  console.log('left');
}


function right() {
  console.log('right');
}


function forward() {
  console.log('forward');
}


function backward() {
  console.log('backward');
}


function rotateLeft() {
  console.log('rotate left')
}


function rotateRight() {
  console.log('rotate right')
}


function acend() {
  console.log('acend')
}


function descend() {
  console.log('descend')
}


// Start application
main();
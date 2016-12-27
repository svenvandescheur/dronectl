let ds = require('dualshock');
let bebop = require('node-bebop');


const DUALSCHOCK_TYPE = 'ds3';

const BUTTON_CIRCLE = 'circle';
const BUTTON_CROSS = 'cross';
const BUTTON_SQUARE = 'square';
const BUTTON_TRIANGLE = 'triangle';

const STICK_LEFT_X = 'lStickX';
const STICK_LEFT_Y = 'lStickY';

const STICK_RIGHT_X = 'rStickX';
const STICK_RIGHT_Y = 'rStickY';

const STICK_VALUE_CENTER = 127;
const STICK_TOLERANCE = 5;

const SCAN_INTERVAL = 500;
const UPDATE_INTERVAL = 30;



/**
 * Allows the DualShock controller to control the Parrot drone
 * @class
 */
class DualshockNavigator {
  /**
   * Constructor methoc
   */
  constructor(drone) {
    this.device = null;

    console.log('drone', drone)

    this.drone = drone;

    /** {number} position of the left controler (x axis) */
    this.stickLeftX = STICK_VALUE_CENTER;

    /** {number} position of the left controler (yx axis) */
    this.stickLeftY = STICK_VALUE_CENTER;

    /** {number} position of the right stick (x axis) */
    this.stickRightX = STICK_VALUE_CENTER;

    /** {number} position of the right stick (y axis) */
    this.stickRightY = STICK_VALUE_CENTER;

    // Connect
    this.connect();
  }

  /**
   * Keeps iterating over itself until a DualShock controller is found
   */
  connect() {
    console.log('Scanning for DualShock controller of type ' + DUALSCHOCK_TYPE);
    let devices = ds.getDevices(DUALSCHOCK_TYPE);

    if (!devices.length) {
      console.log('No controller of type ' + DUALSCHOCK_TYPE + ' found, trying again...');
      setTimeout(this.connect, SCAN_INTERVAL);
      return;
    }

    console.log('Found DualShock controller of type ' + DUALSCHOCK_TYPE);
    this.device = devices[0];
    console.log('Serial number ', this.device.serialNumber);
    this.mapControls();
  }

  /**
   * Maps global analog and digital control events to handlers
   * Sets a timeout to keep track of control state
   */
  mapControls() {
    let gamepad = ds.open(this.device, { smoothAnalog: 10, smoothMotion: 15, joyDeadband: 4, moveDeadband: 4 });
    gamepad.onanalog = this.handleAnalalogControl.bind(this);
    gamepad.ondigital = this.handleDigitalControl.bind(this);

    // Sets a timeout to keep track of control state
    setTimeout(this.checkStickState.bind(this), UPDATE_INTERVAL);
  }
  
  /**
   * Handles all analog input on the DualShock controller
   * @param  {string} control
   * @param  {number} value
   */
  handleAnalalogControl(control, value) {
    if (control === STICK_LEFT_X) {
      this.stickLeftX = value;
    }
    if (control === STICK_LEFT_Y) {
      this.stickLeftY = value;
    }

    if (control === STICK_RIGHT_X) {
      this.stickRightX = value;
    }
    if (control === STICK_RIGHT_Y) {
      this.stickRightY = value;
    }
  }

  /**
   * Hanles all digital input on the DualShock controller
   * @param  {string} control
   * @param  {boolean} value
   */

  handleDigitalControl(control, value) {
    if (control === BUTTON_CIRCLE && value) {
      this.drone.emergency();
    }

    if (control === BUTTON_CROSS && value) {
      this.drone.land();
    }

    if (control === BUTTON_SQUARE && value) {
      this.drone.takeOff();
    }

    if (control === BUTTON_TRIANGLE && value) {
      this.drone.stop();
    }
  }

  /**
   * Gets called very UPDATE_INTERVAL
   * Acts on state of control values
   * Schedules next iteration
   */
  checkStickState() {
    // Acts on state of control values
    this.handleStickLeftX()
    this.handleStickLeftY();
    this.handleStickRightX();
    this.handleStickRightY();

    // Schedules next iteration
    setTimeout(this.checkStickState.bind(this), UPDATE_INTERVAL);
  }

  /**
   * Acts on the value of left stick's x axis
   */
  handleStickLeftX() {
    let velocity = this.getVelocity(this.stickLeftX);

    if (this.stickLeftX < STICK_VALUE_CENTER) {
      this.drone.counterClockwise(velocity);
    }

    if (this.stickLeftX > STICK_VALUE_CENTER) {
      this.drone.clockwise(velocity);
    }
  }

  /**
   * Acts on the value of left stick's y axis
   */
  handleStickLeftY() {
    let velocity = this.getVelocity(this.stickLeftY);

    if (this.stickLeftY < STICK_VALUE_CENTER) {
      this.drone.up(velocity);
    }

    if (this.stickLeftY > STICK_VALUE_CENTER) {
      this.drone.down(velocity);
    }
  }

  /**
   * Acts on the value of right stick's x axis
   */
  handleStickRightX() {
    let velocity = this.getVelocity(this.stickRightX);

    if (this.stickRightX < STICK_VALUE_CENTER) {
      this.drone.left(velocity);
    }

    if (this.stickRightX > STICK_VALUE_CENTER) {
      this.drone.right(velocity);
    }
  }

  /**
   * Acts on the value of righ stick's y axis
   */
  handleStickRightY() {
    let velocity = this.getVelocity(this.stickRightY);

    if (this.stickRightY < STICK_VALUE_CENTER) {
      this.drone.forward(velocity);
    }

    if (this.stickRightY > STICK_VALUE_CENTER) {
      this.drone.backward(velocity);
    }
  }

  /**
   * Converts the raw 0 - 255 range to a velocity
   * Velocity is a percentage (0-100) indicating
   * how far an analog control is moved towards
   * a specific direction.
   * If the value is <= STICK_TOLERANCE 0 is returned
   * @param {number} 
   * @param {number}
   */
  getVelocity(value) {
    value = Math.abs(value - 127);
    return (value <= STICK_TOLERANCE) ? 0 :value / 127 * 100;
  }
}


/**
 * Initializes the Parrot drone and DualShock controller
 */
function main() {
  let drone = bebop.createClient();

  drone.connect(() => {
    new DualshockNavigator(drone);
  });
}

// Start application
main();
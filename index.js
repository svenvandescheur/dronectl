let bebop = require('node-bebop');
let DualshockNavigator = require('./navigators/dualshock');


/**
 * Initializes the Parrot drone and DualShock controller
 */
function main() {
  let drone = bebop.createClient();

  console.log('Connecting to Bebop drone...');

  drone.connect(() => {
    new DualshockNavigator(drone);
  });
}

// Start application
main();
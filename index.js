var bebop = require('node-bebop');
var ConsoleMonitor = require('./monitors/console');
var DualshockNavigator = require('./navigators/dualshock');


/**
 * Initializes the Parrot drone and DualShock controller
 */
function main() {
  var drone = bebop.createClient();

  console.log('Connecting to Bebop drone...');

  drone.connect(() => {
    drone.GPSSettings.resetHome();
    drone.WifiSettings.outdoorSetting(1);

    // new ConsoleMonitor(drone);
    new DualshockNavigator(drone);
  });
}

// Start application
main();

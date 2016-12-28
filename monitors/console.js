/** {string} representing the event */
const POSITION_CHANGED_EVENT = 'PositionChanged';


/**
 * Logs information about the drone to the console
 * @class
 */
class ConsoleMonitor {
    /**
     * Constructor method
     * @param {Bebop} drone
     */
    constructor(drone) {
        /** {Bebop} drone to fly */
        this.drone = drone;

        // Set up monitoring
        this.setUpMonitor();
    }

    /**
     * Logs updates to the console
     */
    setUpMonitor() {
        this.drone.on(POSITION_CHANGED_EVENT, (data) => {
            console.log(data);
        });
    }
}


module.exports = ConsoleMonitor;
'use strict';

const Gpio = require('onoff').Gpio; // Gpio class
const led = new Gpio(17, 'out');       // Export GPIO17 as an output
let stopBlinking = false;

// Toggle the state of the LED connected to GPIO17 every 200ms
const blinkLed = function() {
	if (stopBlinking)
		return led.unexport();

	led.read(function(err, value) { // Asynchronous read
		if (err)
			throw err;

		led.write(value ^ 1, function(err) { // Asynchronous write
			if (err)
				throw err;
		});
	});

	setTimeout(blinkLed, 200);
};

blinkLed();

// Stop blinking the LED after 5 seconds
setTimeout(function() {
	stopBlinking = true
}, 5000);
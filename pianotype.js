const argv = require('yargs')
  .usage('Usage: $0 [options]')
  .argv;

const process = require('process');
const midi = require('midi');

// Set up a new input and output.
const input = new midi.input();
const output = new midi.output();

function listPorts(port) {
  for (let i = 0; i < port.getPortCount(); i++) {
    console.log(`- ${i}: ${port.getPortName(i)}`);
  }
}

if (argv.list) {
  console.log("List of input ports");
  listPorts(input);
  console.log("List of output ports");
  listPorts(output);
  process.exit(0);
}

const inPort = argv.i;
const outPort = argv.o;

const keyMap = {}

// Get the name of a specified input port.
console.log(`Input port: ${input.getPortName(inPort)}`);
if (outPort) {
  console.log(`Output port: ${output.getPortName(outPort)}`);
}

// Configure a callback.
input.on('message', function(deltaTime, message) {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  console.log('m:' + message + ' d:' + deltaTime);

  // Send a MIDI message.
  if (outPort) {
    output.sendMessage(message);
  }
});

// Open the first available input port.
if (outPort) {
  output.openPort(outPort);
}
input.openPort(inPort);

// Sysex, timing, and active sensing messages are ignored
// by default. To enable these message types, pass false for
// the appropriate type in the function below.
// Order: (Sysex, Timing, Active Sensing)
// For example if you want to receive only MIDI Clock beats
// you should use
// input.ignoreTypes(true, false, true)
input.ignoreTypes(false, false, false);

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");

		// Close the port when done.
    input.closePort();
    if (outPort) {
      output.closePort();
    }
    process.exit();
});

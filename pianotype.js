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

function mod(n, m) {
  return ((n%m)+m)%m;
}

function buildMap(rootKey, scale) {
  let map = {};
  for (let i = 0; i < 26; i++) {
    const j = i - 14;
    const k = scale[mod(j, scale.length)] + 12 * Math.floor(j / scale.length);
    const note = rootKey + k;
    map[note] = keys[i];
  }
  return map;
}


if (argv.list) {
  console.log("List of input ports");
  listPorts(input);
  console.log("List of output ports");
  listPorts(output);
  process.exit(0);
}

const keys = [
  "z", "x", "k", "b", "y", "f", "m", "d", "h", "n", "o", "t", "c",
  "l", "e", "a", "i", "s", "r", "u", "w", "g", "p", "v", "j", "q"
];

const scale = [0, 2, 4, 5, 7, 9, 11] // major scale
const rootKey = 60

const inPort = argv.i;
const outPort = argv.o;

const keyMap = buildMap(rootKey, scale);
console.log(keyMap)

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

  // console.log('m:' + message + ' d:' + deltaTime);
  const [status, data1, data2] = message;

  // If velocity is not 0, it is key on
  if (data2 > 0) {
    const key = keyMap[data1];
    if (key) {
      process.stdout.write(key);
    // } else {
      // console.log(message);
    }
  }

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

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");

		// Close the port when done.
    input.closePort();
    if (outPort) {
      output.closePort();
    }
    process.exit();
});

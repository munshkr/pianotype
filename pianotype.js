const argv = require("yargs").usage("Usage: $0 [options]").argv;

const process = require("process");
const midi = require("midi");
const robot = require("robotjs");

// Set up a new input and output.
const input = new midi.input();
const output = new midi.output();

function listPorts(port) {
  for (let i = 0; i < port.getPortCount(); i++) {
    console.log(`- ${i}: ${port.getPortName(i)}`);
  }
}

function mod(n, m) {
  return ((n % m) + m) % m;
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

if (input.getPortCount() == 0) {
  console.error("There are no MIDI input devices");
  process.exit(1);
}

const keys = [
  "z",
  "x",
  "k",
  "b",
  "y",
  "f",
  "m",
  "d",
  "h",
  "n",
  "o",
  "t",
  "c",
  "l",
  "e",
  "a",
  "i",
  "s",
  "r",
  "u",
  "w",
  "g",
  "p",
  "v",
  "j",
  "q"
];

const velocityThreshold = 75;
const chordThresholdMs = 40;

// Scales
const majorScale = [0, 2, 4, 5, 7, 9, 11];
const minorScale = [0, 2, 3, 5, 7, 8, 10];

const scale = majorScale;
const rootKey = 60;

const inPort = argv.i || 0;
const outPort = argv.o;

const keyMap = buildMap(rootKey, scale);
// console.log(keyMap)

// Get the name of a specified input port.
console.log(`Input port: ${input.getPortName(inPort)}`);
if (outPort) {
  console.log(`Output port: ${output.getPortName(outPort)}`);
}

let pressedNotes = [];
let lastTime = Date.now();

function midinoteToDegree(rootKey, scale, n) {
  console.log(`midinoteToDegree(${rootKey}, ${scale}, ${n})`);
  const res = scale.findIndex(d => n % 12 === d);
  return res === -1 ? null : res + 1;
}

function sortPair([a, b]) {
  return a <= b ? [a, b] : [b, a];
}

function evalKeys() {
  const notes = [...pressedNotes];
  pressedNotes.length = 0;

  if (notes.length > 1) {
    const midinotes = notes.map(([midinote, velocity]) => midinote);
    // console.log(`Chord: ${JSON.stringify(notes)}`);

    if (midinotes.length === 2) {
      // Command: Delete character
      const [a, b] = sortPair(midinotes);
      if (b === a + 1) {
        robot.keyTap("backspace");
        console.log(`Command: Delete character`);
        return;
      }

      // Degree intervals
      const [da, db] = sortPair(
        midinotes.map(n => midinoteToDegree(rootKey, scale, n))
      );
      if (da) {
        const interval = db - da + 1;
        // Command: 2nd
        switch (interval) {
          case 1: // octave?
            robot.keyTap("end");
            robot.keyTap("home", "shift");
            robot.keyTap("delete");
            console.log(`Command: Delete line`);
            break;
          case 2:
            robot.keyTap("space");
            console.log(`Command: Space`);
            break;
          case 3:
            robot.typeString(",");
            console.log(`Command: Comma`);
            break;
          case 4:
            robot.typeString(".");
            console.log(`Command: Period`);
            break;
          case 5:
            robot.keyTap("enter");
            console.log(`Command: New line`);
            break;
          case 6:
            robot.keyTap("left", "control");
            robot.keyTap("right", ["control", "shift"]);
            robot.keyTap("delete");
            console.log(`Command: Delete word`);
            break;
        }
      }
    }
  } else if (notes.length === 1) {
    const [midinote, velocity] = notes[0];
    let key = keyMap[midinote];

    if (key) {
      if (velocity >= velocityThreshold) {
        key = key.toUpperCase();
      }
      robot.typeString(key);
      console.log(`Character: ${key} (${velocity})`);
    }
  }
}

// Configure a callback.
input.on("message", function(deltaTime, message) {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.

  // console.log('m:' + message + ' d:' + deltaTime);
  const [status, midinote, velocity] = message;

  // If velocity is not 0, it is key on
  if (velocity > 0) {
    pressedNotes.push([midinote, velocity]);
    // console.log(pressedNotes);

    const delta = Date.now() - lastTime;

    // FIXME Use a constant for 30
    if (!lastTime || delta > chordThresholdMs) {
      lastTime = Date.now();
      setTimeout(() => evalKeys(), chordThresholdMs);
    }
  }

  // Send a MIDI message.
  if (outPort) {
    output.sendMessage(message);
  }
});

console.log("Ready!");

// Open the first available input port.
if (outPort) {
  output.openPort(outPort);
}
input.openPort(inPort);

process.on("SIGINT", function() {
  console.log("Caught interrupt signal");

  // Close the port when done.
  input.closePort();
  if (outPort) {
    output.closePort();
  }
  process.exit();
});

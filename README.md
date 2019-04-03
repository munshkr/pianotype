# Pianotype

*WIP* Type using a MIDI keyboard (or whatever MIDI instrument you have).

This is mostly a learning experiment for me.  I am particularly interested on
understanding how one can learn to type in an alien keyboard layout (like a
piano) but still be able to be productive (that is, write coherently) in
creative ways, like playing the piano with musicality in mind.

Inspired by https://www.youtube.com/watch?v=MAYlMcyVZ2k

See also [Learn Pianotype](https://github.com/munshkr/learn-pianotype) (*still WIP*).


## What it does *right now*

This is the current state of things:

* There is a script that reads MIDI messages
* It prints commands and keys to console, **so it is not usable right now**
* You can optionally forward MIDI messages to another MIDI output device, in
  case you can't forward it from your OS (like Windows). See more on Usage
  below.
* Fixed root key and scale


## Usage

Connect your MIDI keyboard, and run `node pianotype.js`. By default it will use
the first input device.

Otherwise, if you want to use another device, run `node pianotype.js --list`
first to list your MIDI devices (input and output), and then specify it by
index with the `-i` option. For example, if your device has index 2, run `node
pianotype.js -i 2`.

If you are using Windows, you may have to use LoopMIDI or something like that
to redirect MIDI keys to some DAW.  You can tell `pianotype` to redirect the MIDI
messages it receives to an output device (in this case it would be loopMIDI).

For example, if you have an AKAI LPK25 keyboard and Ableton Live:

- List your devices:

```
> node pianotype.js --list
List of input ports
- 0: loopMIDI Port 0
- 1: LPK25 1
List of output ports
- 0: Microsoft GS Wavetable Synth 0
- 1: loopMIDI Port 1
- 2: LPK25 2
```

- Run using the input device 1 (LPK25) and output device 1 (loopMIDI Port 1)

```
> node pianotype.js -i 1 -o 1
```

- Enable loopMIDI Port 0 input device on Ableton Live


## Design

*This is a working draft, it will probably change a lot once I start learning
how to type and practicing, which I haven't yet...*

Characters are mapped to note degrees, based on a root key and scale.

Most common characters are near fingers, when both hands are placed near root key.

If your right hand (RH) is placed with your thumb on the root key, and your
left hand (LH) is placed one octave lower, with your pinky finger on the first
degree, the first 10 most common letters in English are under your fingers
without moving them. I call this the "home octave" (in reference to the home
row in Querty keyboards).

The rest of the characeters are mapped in other keys, moving away from the home
octave.

See this table for reference:

| letter | frequency | octave | degree | finger | hand |
|--------|-----------|--------|--------|--------|------|
| z      | 0,07%     | 1      | 1      |        | L    |
| x      | 0,15%     | 1      | 2      |        | L    |
| k      | 0,77%     | 1      | 3      |        | L    |
| b      | 1,49%     | 1      | 4      |        | L    |
| y      | 1,97%     | 1      | 5      |        | L    |
| f      | 2,23%     | 1      | 6      |        | L    |
| m      | 2,41%     | 1      | 7      |        | L    |
| d      | 4,25%     | 2      | 1      | 5      | L    |
| h      | 6,09%     | 2      | 2      | 4      | L    |
| n      | 6,75%     | 2      | 3      | 3      | L    |
| o      | 7,51%     | 2      | 4      | 2      | L    |
| t      | 9,06%     | 2      | 5      | 1      | L    |
| c      | 2,78%     | 2      | 6      | 2      | L    |
| l      | 4,03%     | 2      | 7      | 2      | R    |
| e      | 12,70%    | 3      | 1      | 1      | R    |
| a      | 8,17%     | 3      | 2      | 2      | R    |
| i      | 6,97%     | 3      | 3      | 3      | R    |
| s      | 6,33%     | 3      | 4      | 4      | R    |
| r      | 5,99%     | 3      | 5      | 5      | R    |
| u      | 2,76%     | 3      | 6      |        | R    |
| w      | 2,36%     | 3      | 7      |        | R    |
| g      | 2,02%     | 4      | 1      |        | R    |
| p      | 1,93%     | 4      | 2      |        | R    |
| v      | 0,98%     | 4      | 3      |        | R    |
| j      | 0,15%     | 4      | 4      |        | R    |
| q      | 0,10%     | 4      | 5      |        | R    |


## To do

* Define how to map numbers (mode? Shift/Mod key?)
* Define how to map symbols (mode? Shift/Mod key?)
* Test...

## License

GPL 3+. Refer to [LICENSE.txt](LICENSE.txt)

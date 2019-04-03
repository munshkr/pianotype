# Pianotype

Type using a MIDI keyboard (or whatever MIDI instrument you have)

This was inspired by https://www.youtube.com/watch?v=MAYlMcyVZ2k


## Usage

Run `node pianotype.js --list` first to list your MIDI devices (input and output)
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


## License

GPL 3+. Refer to [LICENSE.txt](LICENSE.txt)

import {map} from 'lodash';

declare const Tone: any;

export class Sequencer
{
    clock: ScriptProcessorNode;
    cv: GainNode;
    gate: GainNode;

    values;
    active = [true, true, true, true, true, true, true, true];

    state = 0;
    latch = false;
    nextValue = 0;

    constructor(private context: AudioContext) {

        this.values = [
            new Tone.Signal(0),
            new Tone.Signal(0),
            new Tone.Signal(0),
            new Tone.Signal(0),
            new Tone.Signal(0),
            new Tone.Signal(0),
            new Tone.Signal(0),
            new Tone.Signal(0)
        ];

        // input
        this.clock = this.context.createScriptProcessor(2048, 1, 2);

        // output
        this.cv = this.context.createGain();
        this.cv.gain.value = 1;
        this.gate = this.context.createGain();
        this.gate.gain.value = 1;

        const split = this.context.createChannelSplitter(2);
        this.clock.connect(split);
        split.connect(this.cv, 0);
        split.connect(this.gate, 1);

        this.clock.onaudioprocess = (e) => {
            const input = e.inputBuffer.getChannelData(0);
            const output = e.outputBuffer.getChannelData(0);
            const gate = e.outputBuffer.getChannelData(1);

            map(input, (v, i) => {
                if (!this.latch && (v >= 0.5)) {
                    // going high
                    this.state++;
                    if (this.state >= 8) {
                        this.state = 0;
                    }
                    this.latch = true;
                }
                else if (this.latch && (v < 0.5)) {
                    // going low
                    this.latch = false;
                }
                if (this.active[this.state]) {
                    this.nextValue = this.values[this.state].value;
                }

                gate[i] = this.active[this.state] ? 1 : 0;
                output[i] = this.nextValue;
            });
        };
    }

    setValue(index, value) {
        this.values[index].value = value;
    }
    setActive(index, active) {
        this.active[index] = active;
    }
}

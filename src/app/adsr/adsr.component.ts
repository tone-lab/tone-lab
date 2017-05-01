import {Component, OnInit} from '@angular/core';

import {map} from 'lodash';
declare const Tone: any;

@Component({
    selector: 'app-adsr',
    templateUrl: './adsr.component.html',
    styleUrls: ['./adsr.component.scss']
})
export class AdsrComponent implements OnInit {

    activeRange: number = 1;
    rangeLabels = ['1ms', '1s', '5s', '10s'];
    ranges = [
        {min: 0, max: 0.001},
        {min: 0, max: 1},
        {min: 0, max: 5},
        {min: 0, max: 10}
    ];

    adsr;
    gate;
    trigger: ScriptProcessorNode;
    inv;
    input: ScriptProcessorNode;

    latch: boolean = false;

    constructor() {
        this.adsr = new Tone.Envelope();
        this.inv = new Tone.Negate();
        this.adsr.connect(this.inv);

        this.input = Tone.context.createScriptProcessor(2048, 1, 1);
        this.trigger = Tone.context.createScriptProcessor(2048, 1, 1);
        const nullOut = Tone.context.createGain();
        nullOut.gain.value = 0;
        nullOut.connect(Tone.context.destination);
        this.input.connect(nullOut);
        this.trigger.connect(nullOut);


        this.input.onaudioprocess = (e: AudioProcessingEvent) => {
            const input = e.inputBuffer.getChannelData(0);

            const delta = e.inputBuffer.duration / e.inputBuffer.length;
            map(input, (v, i) => {
                const time = e.playbackTime + (i * delta);

                if (!this.latch && (v >= 0.5)) {
                    // going high
                    this.adsr.triggerAttack(time);
                    this.latch = true;
                }
                else if (this.latch && (v < 0.5)) {
                    // going low
                    this.adsr.triggerRelease(time);
                    this.latch = false;
                }
            });
        };
        this.trigger.onaudioprocess = (e: AudioProcessingEvent) => {
            const input = e.inputBuffer.getChannelData(0);

            const delta = e.inputBuffer.duration / e.inputBuffer.length;
            map(input, (v, i) => {
                const time = e.playbackTime + (i * delta);

                if (!this.latch && (v >= 0.5)) {
                    // going high
                    this.adsr.triggerAttack(time);
                    this.latch = true;
                }
                else if (this.latch && (v < 0.5)) {
                    this.latch = false;
                }
            });
        };
    }

    ngOnInit() {
    }

    setRange(i) {
        this.activeRange = i;
        // this.adsr.min = this.ranges[this.activeRange].min;
        // this.adsr.max = this.ranges[this.activeRange].max;
    }

}

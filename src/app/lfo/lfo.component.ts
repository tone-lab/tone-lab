import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SourceComponent} from "../source/source.component";

declare const Tone: any;

@Component({
    selector: 'app-lfo',
    templateUrl: './lfo.component.html',
    styleUrls: ['./lfo.component.scss']
})
export class LfoComponent implements OnInit {

    lfo;

    currentType = 0;
    types = ['sine', 'sawtooth', 'square', 'triangle'];

    activeRange: number = 2;
    rangeLabels = ['0.1 - 10.0', '10 - 40', '40 - 400', '400 - 4000'];

    currentKind: number = 0;
    kinds = ['freq', 'sync'];

    currentLength = 2;
    noteLengths = ['32n', '16n', '8n', '4n', '2n', '1m'];

    ranges = [
        {min: 0.1, max: 10.0},
        {min: 10, max: 40},
        {min: 40, max: 400},
        {min: 400, max: 4000}
    ];

    setRange(i) {
        this.activeRange = i;
        this.lfo.min = this.ranges[this.activeRange].min;
        this.lfo.max = this.ranges[this.activeRange].max;
    }
    setLength(i) {
        this.currentLength = i;
        this.updateFreq();
    }

    constructor() {
        this.lfo = new Tone.LFO("4n").start();
        this.setRange(this.activeRange);
    }

    updateFreq() {
        this.lfo.frequency.setValueAtTime(this.noteLengths[this.currentLength], 0.01);
    }

    ngOnInit() {
    }

    setKind(i) {
        this.currentKind = i;
        this.updateFreq();
        if (this.currentKind === 1) {
            this.lfo.sync();
        }
        else {
            this.lfo.unsync();
        }
    }

    setType(i) {
        this.currentType = i;
        this.lfo.type = this.types[i];
    }

}

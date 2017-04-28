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

    activeRange: number = 1;
    rangeLabels = ['0.1 - 10.0', '400 - 4000'];

    ranges = [
        {min: 0.1, max: 10.0},
        {min: 400, max: 4000}
    ];

    setRange(i) {
        this.activeRange = i;
        this.lfo.min = this.ranges[i].min;
        this.lfo.max = this.ranges[i].max;
    }

    constructor() {
        this.lfo = new Tone.LFO("4n").start();
        this.setRange(this.activeRange);
    }

    ngOnInit() {
    }


    setType(i) {
        this.currentType = i;
        this.lfo.type = this.types[i];
    }

}

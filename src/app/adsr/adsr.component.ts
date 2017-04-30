import {Component, OnInit} from '@angular/core';

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
    trigger;
    inv;

    constructor() {
        this.gate = new Tone.TimelineSignal(0);
        this.trigger = new Tone.TimelineSignal(0);
        this.adsr = new Tone.Envelope();
        this.inv = new Tone.Negate();
        this.adsr.connect(this.inv);
    }

    ngOnInit() {
    }

    setRange(i) {
        this.activeRange = i;
        // this.adsr.min = this.ranges[this.activeRange].min;
        // this.adsr.max = this.ranges[this.activeRange].max;
    }

    gateSignal({time, tick}) {
        if (tick === 1) {
            this.adsr.triggerAttack(time);
        }
        else {
            this.adsr.triggerRelease(time);
        }
    }
    reTrigger({time, tick}) {
        if (tick === 1) {
            this.adsr.triggerAttack(time);
        }
    }
}

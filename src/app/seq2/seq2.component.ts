import {Component, NgZone, OnInit, ViewChild} from '@angular/core';

declare const Tone: any;
import * as _ from 'lodash';
import {SourceComponent} from "../source/source.component";

@Component({
    selector: 'app-seq2',
    templateUrl: './seq2.component.html',
    styleUrls: ['./seq2.component.scss']
})
export class Seq2Component implements OnInit {

    clock;
    signals = [];
    activeSignals = [];

    isPlaying: boolean = false;
    pulse: boolean = false;
    position: number = 0;

    that = this;

    gate;
    @ViewChild('source') source: SourceComponent;

    public freq = new Tone.Signal();

    constructor(private zone: NgZone) {
        this.gate = new Tone.Signal();
        this.clock = new Tone.Signal();
        this.signals = [
            new Tone.Signal(0),
            new Tone.Signal(0),
            new Tone.Signal(0),
            new Tone.Signal(0),
            new Tone.Signal(0),
            new Tone.Signal(0),
            new Tone.Signal(0),
            new Tone.Signal(0)
        ];
        this.activeSignals = _.fill(_.range(8), 1);
    }

    ngOnInit() {
    }

    clockSignal({time, tick}) {
        if (tick === 1) {
            const nextTick = (this.position < 7) ? this.position + 1 : 0;

            if (this.activeSignals[nextTick]) {
                this.freq.setValueAtTime(this.signals[nextTick].value, time);
            }
            // if (!_.isUndefined(this.source)) {
            this.source.sendClock(time, this.activeSignals[nextTick]);
            // }
            Tone.Draw.schedule(() => {
                this.zone.run(() => {
                    this.position = nextTick;
                });
            }, time);
        }
    }

}

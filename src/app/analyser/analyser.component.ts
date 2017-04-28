import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {animationFrame} from "rxjs/scheduler/animationFrame";

import * as _ from 'lodash';
declare const Tone: any;

@Component({
    selector: 'app-analyser',
    templateUrl: './analyser.component.html',
    styleUrls: ['./analyser.component.scss']
})
export class AnalyserComponent implements OnInit, OnDestroy {

    anim: Subscription;

    fft;
    wave;
    bands: Uint8Array;
    wavePoints: Uint8Array;

    constructor() {
        this.fft = new Tone.Analyser('fft', 256);
        this.wave = new Tone.Analyser('waveform', 256);
        this.fft.connect(this.wave);

        this.anim = Observable.of(0, animationFrame)
            .repeat()
            .subscribe(() => {
                this.bands = this.fft.analyse();
                this.wavePoints = this.wave.analyse();
            });
    }

    get paths() {
        return _.map(this.bands, (v, x) => {
            return `M ${x} 128 L ${x} ${128 - (v / 2)}`;
        });
    }
    get w() {
        const points = _.map(this.wavePoints, (v, x) => `L ${x} ${128 - (v / 2)}`);
        return 'M 0 64 ' + points.join(' ');
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.anim.unsubscribe();
    }
}

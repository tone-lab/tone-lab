import {Component, OnDestroy, OnInit} from '@angular/core';
import {IntervalObservable} from "rxjs/observable/IntervalObservable";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/repeat';
import {animationFrame} from "rxjs/scheduler/animationFrame";

import * as _ from 'lodash';

declare const Tone: any;

@Component({
    selector: 'app-mixer',
    templateUrl: './mixer.component.html',
    styleUrls: ['./mixer.component.scss']
})
export class MixerComponent implements OnInit, OnDestroy {

    channels: any[];
    bpm;
    beats;
    anim: Subscription;

    fft;
    wave;
    bands: Uint8Array;
    wavePoints: Uint8Array;

    constructor() {
        this.fft = new Tone.Analyser('fft', 256);
        this.wave = new Tone.Analyser('waveform', 256);
        Tone.Master.chain(this.fft, this.wave);

        this.channels = [
            new Tone.Gain(0).toMaster(),
            new Tone.Gain(0).toMaster(),
            new Tone.Gain(0).toMaster(),
            new Tone.Gain(0).toMaster()
        ];
        this.bpm = Tone.Transport.bpm;

        this.anim = Observable.of(0, animationFrame)
            .repeat()
            .subscribe(() => {
                this.beats = Tone.Transport.bpm.value;
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

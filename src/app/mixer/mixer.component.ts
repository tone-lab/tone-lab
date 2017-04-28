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

    constructor() {

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
            });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.anim.unsubscribe();
    }

}



import {repeat} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';


import * as _ from 'lodash';
import { Subscription } from 'rxjs/Rx';
import { of } from 'rxjs/internal/observable/of';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

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

        this.anim = of(0, animationFrame).pipe(
            repeat())
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

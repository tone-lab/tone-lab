import {Component, OnDestroy, OnInit} from '@angular/core';

import { of, animationFrameScheduler, Subscription } from 'rxjs';
import { repeat } from 'rxjs/operators';

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

        this.anim = of(null, animationFrameScheduler)
            .pipe(
                repeat()
            ).subscribe(() => {
                this.beats = Tone.Transport.bpm.value;
            });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.anim.unsubscribe();
    }

}

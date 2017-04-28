import {Component, OnDestroy, OnInit} from '@angular/core';
import {IntervalObservable} from "rxjs/observable/IntervalObservable";
import {Subscription} from "rxjs/Subscription";

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

        this.anim = IntervalObservable.create(500)
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

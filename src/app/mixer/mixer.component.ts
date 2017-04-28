import {Component, OnInit} from '@angular/core';

declare const Tone: any;

@Component({
    selector: 'app-mixer',
    templateUrl: './mixer.component.html',
    styleUrls: ['./mixer.component.scss']
})
export class MixerComponent implements OnInit {

    channels: any[];

    constructor() {
        this.channels = [
            new Tone.Gain(0).toMaster(),
            new Tone.Gain(0).toMaster(),
            new Tone.Gain(0).toMaster(),
            new Tone.Gain(0).toMaster()
        ];
    }

    ngOnInit() {
    }

}

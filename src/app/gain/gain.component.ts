import {Component, OnInit} from '@angular/core';

declare const Tone: any;

@Component({
    selector: 'app-gain',
    templateUrl: './gain.component.html',
    styleUrls: ['./gain.component.scss']
})
export class GainComponent implements OnInit {


    gain;

    constructor() {
        this.gain = new Tone.Gain(0);
    }

    ngOnInit() {
    }

}

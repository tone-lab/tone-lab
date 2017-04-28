import {Component, OnInit} from '@angular/core';

declare const Tone: any;

@Component({
    selector: 'app-signal',
    templateUrl: './signal.component.html',
    styleUrls: ['./signal.component.scss']
})
export class SignalComponent implements OnInit {

    signal;

    constructor() {
        this.signal = new Tone.Signal(0);
    }

    ngOnInit() {
    }

}

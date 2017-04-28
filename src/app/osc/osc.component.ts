import {Component, OnInit} from '@angular/core';

declare const Tone: any;

@Component({
    selector: 'app-osc',
    templateUrl: './osc.component.html',
    styleUrls: ['./osc.component.scss']
})
export class OscComponent {

    osc;

    currentType = 0;
    types = ['sine', 'sawtooth', 'square', 'triangle'];

    constructor() {
        this.osc = new Tone.Oscillator().start();
    }

    setType(i) {
        this.currentType = i;
        this.osc.type = this.types[i];
    }
}

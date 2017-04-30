import {Component, OnInit} from '@angular/core';

declare const Tone: any;

@Component({
    selector: 'app-osc',
    templateUrl: './osc.component.html',
    styleUrls: ['./osc.component.scss']
})
export class OscComponent {

    osc;

    cvIn;

    currentType = 0;
    types = ['sine', 'sawtooth', 'square', 'triangle'];

    currentClass = 0;
    classes = ['simple', 'fat', 'pwm', 'fm', 'am', 'pulse'];

    constructor() {
        this.osc = new Tone.OmniOscillator().start();
        this.cvIn = new Tone.Scale(
            Tone.Frequency('C3').toFrequency(),
            Tone.Frequency('C7').toFrequency());
        this.cvIn.connect(this.osc.frequency);
    }

    updateType() {
        switch (this.currentClass) {
            case 1:
                this.osc.type = 'fat'+this.types[this.currentType];
                break;
            case 2:
                this.osc.type = 'pwm';
                break;
            case 3:
                this.osc.type = 'fm'+this.types[this.currentType];
                break;
            case 4:
                this.osc.type = 'am'+this.types[this.currentType];
                break;
            case 5:
                this.osc.type = 'pulse';
                break;
            default:
            case 0:
                this.osc.type = this.types[this.currentType];
                break;
        }
    }

    setType(i) {
        this.currentType = i;
        this.updateType();
    }

    setClass(i) {
        this.currentClass = i;
        this.updateType();
    }
}

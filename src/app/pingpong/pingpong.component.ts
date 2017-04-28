import {Component, OnInit} from '@angular/core';

declare const Tone: any;

@Component({
    selector: 'app-pingpong',
    templateUrl: './pingpong.component.html',
    styleUrls: ['./pingpong.component.scss']
})
export class PingpongComponent implements OnInit {

    delay;

    constructor() {
        this.delay = new Tone.PingPongDelay();
        this.delay.wet.value = 0.5;
    }

    ngOnInit() {
    }

}

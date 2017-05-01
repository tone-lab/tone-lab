import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SourceComponent} from "../source/source.component";

declare const Tone: any;

@Component({
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    styleUrls: ['./clock.component.scss']
})
export class ClockComponent {

    clock;

    constructor() {
        this.clock = new Tone.LFO("32n").start("@16n");
    }

}

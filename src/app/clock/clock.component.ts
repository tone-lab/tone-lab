import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SourceComponent} from "../source/source.component";

declare const Tone: any;

@Component({
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements AfterViewInit, OnDestroy {

    clock;
    @ViewChild('source') source: SourceComponent;
    loop;

    currentPeriod = 0;
    displayLengths = [1, 2, 4, 8];
    noteLengths = ['32n', '16n', '8n', '4n'];
    noteLengthsB = ['16n', '8n', '4n', '2n'];

    pulse: boolean = false;

    constructor() {
        this.clock = new Tone.Signal();
    }

    ngAfterViewInit()
    {
        this.configureLoop();
    }

    setPeriod(i) {
        this.currentPeriod = i;
        this.configureLoop();
    }

    configureLoop() {
        if (this.loop) {
            this.loop.dispose();
        }

        this.loop = new Tone.Sequence((time, tick) => {
            this.source.sendClock(time, tick);
        }, [1], this.noteLengths[this.currentPeriod]);

        this.pulse = false;
        this.loop.start(`@16n`);
    }

    ngOnDestroy() {
        this.loop.dispose();
    }
}

import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';

declare const Tone: any;

@Component({
    selector: 'app-trigger',
    templateUrl: './trigger.component.html',
    styleUrls: ['./trigger.component.scss']
})
export class TriggerComponent implements OnInit, OnDestroy {

    isPlaying: boolean = false;
    currentPeriod = 3;
    currentLength = 2;
    noteLengths = ['64n', '32n', '16n', '8n', '4n'];
    pulse: boolean = false;
    loop;

    public gate = new Tone.Envelope({
        "attack" : 0.01,
        "decay" : 0,
        "sustain" : 1,
        "release" : 0.01,
    });

    constructor(private zone: NgZone) {
        this.configureSequence();
    }

    configureSequence() {
        let wasPlaying = false;
        if (this.loop) {
            wasPlaying = this.loop.state === 'started';
            this.loop.dispose();
        }
        this.loop = new Tone.Loop((time) => {

            this.gate.triggerAttackRelease(this.noteLengths[this.currentLength], time);

            Tone.Draw.schedule(() => {
                this.zone.run(() => this.pulse = !this.pulse);
            }, time);

        }, this.noteLengths[this.currentPeriod]);
        if (wasPlaying) {
            this.pulse = false;
            this.loop.start('@4n');
        }
    }

    setPeriod(i) {
        this.currentPeriod = i;
        this.configureSequence();
    }

    setLength(i) {
        this.currentLength = i;
        this.configureSequence();
    }
    ngOnInit() {
    }

    ngOnDestroy() {
        if (this.loop) {
            this.loop.dispose();
        }
    }

    start() {
        this.loop.start('@4n');
        this.pulse = false;
        this.isPlaying = true;
    }

    stop() {
        this.loop.stop();
        this.pulse = false;
        this.isPlaying = false;
    }
}

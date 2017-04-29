import {Component, NgZone, OnInit} from '@angular/core';

declare const Tone: any;
import * as _ from 'lodash';

@Component({
    selector: 'app-membrane',
    templateUrl: './membrane.component.html',
    styleUrls: ['./membrane.component.scss']
})
export class MembraneComponent implements OnInit {

    isPlaying: boolean = false;
    currentPeriod = 2;
    noteLengths = ['64n', '32n', '16n', '8n', '4n'];
    pulse: boolean = false;
    loop;
    activeBox = 0;

    pitch;

    box = _.fill(_.range(16), false);
    coords = [
        [0,0],[1,0],[2,0],[3,0],
        [0,1],[1,1],[2,1],[3,1],
        [0,2],[1,2],[2,2],[3,2],
        [0,3],[1,3],[2,3],[3,3]];

    synth;

    constructor(private zone: NgZone) {
        this.synth = new Tone.MembraneSynth();
        this.pitch = new Tone.Signal(40);
        this.configureSequence();
    }

    configureSequence() {
        let wasPlaying = false;
        if (this.loop) {
            wasPlaying = this.loop.state === 'started';
            this.loop.dispose();
        }
        this.loop = new Tone.Sequence((time, i) => {

            if (this.box[i]) {
                this.synth.triggerAttackRelease(this.pitch.value, this.noteLengths[this.currentPeriod], time);
            }

            Tone.Draw.schedule(() => {
                this.activeBox = i;
                this.zone.run(() => this.pulse = !this.pulse);
            }, time);

        }, _.range(16), this.noteLengths[this.currentPeriod]);
        if (wasPlaying) {
            this.pulse = false;
            this.loop.start('@4n');
        }
    }

    setPeriod(i) {
        this.currentPeriod = i;
        this.configureSequence();
    }

    ngOnInit() {
    }

    toggleBox(i) {
        this.box[i] = !this.box[i];
    }

    get boxes() {
        return _.map(this.coords, ([x, y]) => `M ${x * 32} ${y * 32} h 30 v 30 h -30 v -30`);
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

import {Component, NgZone, OnInit, ViewChild} from '@angular/core';

declare const Tone: any;
import * as _ from 'lodash';
import {SourceComponent} from "../source/source.component";
import {Sequencer} from "./sequencer";

@Component({
    selector: 'app-seq2',
    templateUrl: './seq2.component.html',
    styleUrls: ['./seq2.component.scss']
})
export class Seq2Component implements OnInit {

    seq: Sequencer;
    nullOut: GainNode;

    constructor(private zone: NgZone) {

        this.seq = new Sequencer(Tone.context);
        this.nullOut = new Tone.Gain();
        this.nullOut.gain.value = 0;
        this.nullOut.connect(Tone.Master);
        this.seq.cv.connect(this.nullOut);


    }

    ngOnInit() {
    }


}

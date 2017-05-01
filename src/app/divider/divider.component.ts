import {Component, OnInit} from '@angular/core';

declare const Tone: any;
import {map} from 'lodash';

@Component({
    selector: 'app-divider',
    templateUrl: './divider.component.html',
    styleUrls: ['./divider.component.scss']
})
export class DividerComponent implements OnInit {

    input;
    latch: boolean = false;
    count: number = 0;
    divisor: number = 1;

    rangeLabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    constructor() {
        this.input = Tone.context.createScriptProcessor(2048, 1, 1);

        this.input.onaudioprocess = (e: AudioProcessingEvent) => {
            const input = e.inputBuffer.getChannelData(0);
            const output = e.outputBuffer.getChannelData(0);

            const delta = e.inputBuffer.duration / e.inputBuffer.length;
            map(input, (v, i) => {

                if (!this.latch && (v >= 0.5)) {
                    // going high
                    this.count++;
                    this.latch = true;
                }
                else if (this.latch && (v < 0.5)) {
                    // going low
                    this.latch = false;
                }
                output[i] = (this.count % this.rangeLabels[this.divisor] == 0) ? 1 : 0;
            });
        };


    }

    ngOnInit() {
    }

    setRange(i) {
        this.divisor = i;
        // this.adsr.min = this.ranges[this.activeRange].min;
        // this.adsr.max = this.ranges[this.activeRange].max;
    }

}

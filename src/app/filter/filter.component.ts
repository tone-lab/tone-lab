import {Component, OnInit} from '@angular/core';

declare const Tone: any;

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

    filter;

    activeFilterType = 0;
    filterTypes = [
        'lowpass',
        'highpass',
        'bandpass',
        'lowshelf',
        'highshelf',
        'notch',
        'allpass',
        'peaking'
    ];

    activeRollOff = 0;
    rollOffs = [-12, -24, -48, -96];

    setType(i) {
        this.activeFilterType = i;
        this.filter.type = this.filterTypes[i];
    }

    setRollOff(i) {
        this.activeRollOff = i;
        this.filter.rolloff = this.rollOffs[i];
    }

    constructor() {
        this.filter = new Tone.Filter();
    }

    ngOnInit() {
    }

}

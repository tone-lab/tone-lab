import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {SeqComponent} from "./seq/seq.component";
import {OscComponent} from "./osc/osc.component";
import {LfoComponent} from "./lfo/lfo.component";
import {FilterComponent} from "./filter/filter.component";

declare const Tone: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent
{
    master;

    modules = [];

    constructor() {
        Tone.Transport.start();
        this.master = Tone.Master;
    }

    add(t) {
        this.modules.push(t);
    }
}

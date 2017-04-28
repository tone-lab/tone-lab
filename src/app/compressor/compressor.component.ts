import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {IntervalObservable} from "rxjs/observable/IntervalObservable";

declare const Tone: any;

@Component({
    selector: 'app-compressor',
    templateUrl: './compressor.component.html',
    styleUrls: ['./compressor.component.scss']
})
export class CompressorComponent implements OnDestroy {

    comp;

    anim: Subscription;
    reduction: number = 0;

    constructor() {
        this.comp = new Tone.Compressor();
        this.anim = IntervalObservable.create(500)
            .subscribe(() => {
                this.reduction = this.comp._compressor.reduction;
            });
    }

    ngOnDestroy() {
        this.anim.unsubscribe();
    }
}

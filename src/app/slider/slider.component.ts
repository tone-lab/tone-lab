import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";

import 'rxjs/add/operator/startWith';

import * as _ from 'lodash';
declare const Tone: any;

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() name: string = '';
    @Input() signal: AudioParam;
    @Input() min;
    @Input() max;

    @ViewChild('slider') slider: ElementRef;
    handle: Subscription;
    pt: SVGPoint;
    cursorPt: SVGPoint = {x: 0, y: 0} as any;

    ngOnInit()
    {
        const scaledValue = (this.signal.value - this.min) / (this.max - this.min);
        this.cursorPt = {x: 0, y: 128 - (scaledValue * 128)} as any;
    }

    ngAfterViewInit()
    {
        this.pt = this.slider.nativeElement.createSVGPoint();

        const down = Observable.fromEvent(this.slider.nativeElement, 'mousedown')
            .do((md: MouseEvent) => md.preventDefault());
        const move = Observable.fromEvent(document, 'mousemove')
            .do((mm: MouseEvent) => mm.preventDefault());
        const up = Observable.fromEvent(document, 'mouseup')
            .do((mu: MouseEvent) => mu.preventDefault());

        const drag = down.mergeMap((md: MouseEvent) => {
           return move.startWith(md).takeUntil(up.take(1));
        });

        this.handle = drag
            .subscribe((md: MouseEvent) => {
                this.pt.x = md.clientX;
                this.pt.y = md.clientY;
                this.cursorPt = this.pt.matrixTransform(
                    this.slider.nativeElement.getScreenCTM().inverse());
                this.cursorPt.y = _.clamp(this.cursorPt.y, 0, 128);

                const normalValue = 1 - (this.cursorPt.y / 128);
                const scaledValue = (normalValue * (this.max - this.min)) + this.min;
                this.signal.setValueAtTime(scaledValue, 0.1);
            });
    }

    ngOnDestroy() {
        this.handle.unsubscribe();
    }
}

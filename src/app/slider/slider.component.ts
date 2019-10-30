import {
    AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,
    ViewChild
} from '@angular/core';



import * as _ from 'lodash';
import { Subscription } from 'rxjs/Rx';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { mergeMap, startWith, take, takeUntil, tap } from 'rxjs/operators';
declare const Tone: any;

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() name = '';
    @Input() signal: AudioParam;
    @Input() min;
    @Input() max;
    @Input() defaultValue;
    @Output() change = new EventEmitter<number>();

    @ViewChild('slider', { static: true }) slider: ElementRef;
    handle: Subscription;
    pt: SVGPoint;
    cursorPt: SVGPoint = {x: 0, y: 0} as any;

    constructor() {
    }

    ngOnInit() {
        if (!this.signal) {
            this.signal = new Tone.Signal((!!this.defaultValue)
                ? this.defaultValue
                : (this.max - this.min) / 2);
        }
        const scaledValue = (this.signal.value - this.min) / (this.max - this.min);
        this.cursorPt = {x: 0, y: 128 - (scaledValue * 128)} as any;
    }

    ngAfterViewInit() {
        this.pt = this.slider.nativeElement.createSVGPoint();

        const down = fromEvent(this.slider.nativeElement, 'mousedown')
            .pipe(tap((md: MouseEvent) => md.preventDefault()));
        const move = fromEvent(document, 'mousemove')
          .pipe(tap((md: MouseEvent) => md.preventDefault()));
        const up = fromEvent(document, 'mouseup')
          .pipe(tap((md: MouseEvent) => md.preventDefault()));

        const drag = down.pipe(
          mergeMap((md: MouseEvent) => {
            return move.pipe(
              startWith(md),
              takeUntil(up.pipe(take(1)))
            );
          })
        );

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
                this.change.emit(scaledValue);
            });
    }

    ngOnDestroy() {
        this.handle.unsubscribe();
    }
}

import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';

import * as _ from 'lodash';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/skipUntil';
import 'rxjs/add/operator/startWith';

import {PatchesService} from "../patches.service";
import {CableComponent} from "../cable/cable.component";
import {Subscription} from "rxjs/Subscription";


@Component({
    selector: 'app-source',
    templateUrl: './source.component.html',
    styleUrls: ['./source.component.scss']
})
export class SourceComponent implements AfterViewInit, OnDestroy {

    @Input() name: string;
    @Input() signal;
    @ViewChild('socket') socket: ElementRef;
    @ViewChild('cable') cable: CableComponent;

    draggable: Subscription;

    constructor(private patches: PatchesService) {}

    centrePoint() {
        const x = this.socket.nativeElement.offsetLeft
            + (this.socket.nativeElement.offsetWidth / 2);

        const y = this.socket.nativeElement.offsetTop
            + (this.socket.nativeElement.offsetHeight / 2);

        return {x, y};
    }

    ngAfterViewInit()
    {
        const down = Observable.fromEvent(this.socket.nativeElement, 'mousedown')
            .do((e: MouseEvent) => e.stopPropagation())
            .do((e: MouseEvent) => this.cable.startPatch(this.socket, e))

            .do((e: MouseEvent) => {
                const old = this.patches.removeConnectionsFor(this);
                this.signal.disconnect(old.signal);
            });

        const up = Observable.fromEvent(document, 'mouseup')
            .do((e: MouseEvent) => e.preventDefault());

        const mouseMove = Observable.fromEvent(document, 'mousemove')
            .do((e: MouseEvent) => e.stopPropagation());
        const scrollWindow = Observable.fromEvent(document, 'scroll')
            .startWith({});
        const move = Observable.combineLatest(mouseMove, scrollWindow);

        const drag = down.mergeMap((md: MouseEvent) => {
            return move
                .map(([mm, s]) => mm)
                .do((mm: MouseEvent) => {
                    this.cable.movePatch(mm);
                    this.patches.resetSelection();
                    const target = this.patches.locateTarget(mm);
                    if (target) {
                        target.isSelected = true;
                    }
                })
                .skipUntil(up
                    .take(1)
                    .do(() => this.cable.endPatch()))
                .take(1);
        });

        this.draggable = drag.subscribe((e: MouseEvent) => {
            const target = this.patches.locateTarget(e);
            if (target) {
                this.patches.connect(this, target);
                this.signal.connect(target.signal);
            }
            this.patches.resetSelection();
        });
    }

    ngOnDestroy() {
        const old = this.patches.removeConnectionsFor(this);
        this.signal.disconnect(old.signal);
        this.draggable.unsubscribe();
    }
}

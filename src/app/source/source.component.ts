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
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/merge';

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
    menu: Subscription;
    menuActive: boolean = false;

    constructor(private patches: PatchesService) {}

    centrePoint() {
        const x = this.socket.nativeElement.offsetLeft
            + (this.socket.nativeElement.offsetWidth / 2);

        const y = this.socket.nativeElement.offsetTop
            + (this.socket.nativeElement.offsetHeight / 2);

        return {x, y};
    }

    get sinks() {
        const s = this.patches.getConnectionsFor(this);
        return _.map(s, ({sink}, i) => `${i}:${sink.parent}:${sink.name}`);
    }
    removeConnectionToSink(i) {
        this.menuActive = false;
        const olds = this.patches.removeConnectionsFor(this);
        // TODO: allow individual disconnections via gain node on connection
        // const olds = this.patches.removeConnection(this, i);
        _.map(olds, o => this.signal.disconnect(o.signal));
    }

    ngAfterViewInit()
    {
        this.menu = Observable.fromEvent(this.socket.nativeElement, 'mousedown')
            .filter((e: MouseEvent) => ((e.which && e.which == 3) || (e.button && e.button == 2)))
            .do((e: MouseEvent) => e.preventDefault())
            // .do(e => this.menuActive = true)
            // .mergeMap(e => Observable.fromEvent(document, 'mouseup')
            //     .do(e => this.menuActive = false)
            //     .take(1))
            .subscribe(() => this.menuActive = true);


        const down = Observable.fromEvent(this.socket.nativeElement, 'mousedown')
            .filter((e: MouseEvent) => !((e.which && e.which == 3) || (e.button && e.button == 2)))
            .do((e: MouseEvent) => e.preventDefault())
            .do((e: MouseEvent) => this.cable.startPatch(this.socket, e))

            .do((e: MouseEvent) => {
                // const old = this.patches.removeConnectionsFor(this);
                // this.signal.disconnect(old.signal);
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
            if (target && this.patches.notConnected(this, target)) {
                this.patches.connect(this, target);
                this.signal.connect(target.signal);
            }
            this.patches.resetSelection();
        });
    }

    sendClock(time, tick) {
        _.map(
            this.patches.getConnectionsFor(this),
            ({sink}) => sink.sendClock(time, tick));
    }

    ngOnDestroy() {
        const old = this.patches.removeConnectionsFor(this);
        this.signal.disconnect(old.signal);
        this.draggable.unsubscribe();
        this.menu.unsubscribe();
    }
}

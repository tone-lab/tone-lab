import {AfterViewInit, Component} from '@angular/core';
import { PatchesService } from "../patches.service";

import * as _ from 'lodash';
import {Connection} from "../model";

@Component({
    selector: 'app-patch-overlay',
    templateUrl: './patch-overlay.component.html',
    styleUrls: ['./patch-overlay.component.scss']
})
export class PatchOverlayComponent implements AfterViewInit {

    w: number = 0;
    h: number = 0;

    constructor(private patches: PatchesService) {
    }

    get paths() {
        return _.map(this.patches.connections, (c: Connection) => {
            const {x: x1, y: y1} = c.source.centrePoint();
            const {x: x2, y: y2} = c.sink.centrePoint();

            const pX = (y1 < y2) ? x1 : x2;
            const pY = (y1 < y2) ? y2 : y1;

            return {
                cX1: x1,
                cY1: y1,
                cX2: x2,
                cY2: y2,
                path: `M ${x1} ${y1} Q ${pX} ${pY}, ${x2} ${y2}`
            };
        });
    }

    ngAfterViewInit()
    {
        setTimeout(() => this.calculateSize(), 10);
    }

    calculateSize() {
        this.w = document.body.clientWidth;
        this.h = document.body.clientHeight;
    }
}

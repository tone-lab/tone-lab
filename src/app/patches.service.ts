import {ElementRef, Injectable} from '@angular/core';

import * as _ from 'lodash';
import {SourceComponent} from "./source/source.component";
import {SinkComponent} from "./sink/sink.component";
import {Connection, Socket} from "./model";

@Injectable()
export class PatchesService {

    sockets: Socket[] = [];

    connections: Connection[] = [];


    public connect(source: SourceComponent, sink: SinkComponent)
    {
        this.connections.push({source, sink});
    }

    public notConnected(source: SourceComponent, sink: SinkComponent) {
        return _.isUndefined(
            _.find(
                this.connections,
                ({source: a, sink: b}) => (a === source) && (b === sink)));
    }

    public getConnectionsFor(source: SourceComponent) {
        return _.filter(this.connections, ({source: a}) => a === source);
    }

    public removeConnection(source: SourceComponent, i: number) {
        const sinks = this.getConnectionsFor(source);
        const r = _.remove(this.connections, ({source: a, sink: b}) => {
            return a === source && b === sinks[i].sink;
        });
        return r;
    }

    public registerTarget(el: ElementRef, sink: SinkComponent)
    {
        // TODO: use el.getBoundingClientRect()
        const x1 = el.nativeElement.offsetLeft;
        const y1 = el.nativeElement.offsetTop;
        const x2 = x1 + el.nativeElement.offsetWidth;
        const y2 = y1 + el.nativeElement.offsetHeight;
        this.sockets.push({x1, y1, x2, y2, sink});
    }

    public resetSelection() {
        _.map(this.sockets, s => s.sink.isSelected = false);
    }

    public deregisterTarget(sink: SinkComponent) {
        this.sockets = _.filter(this.sockets, s => s !== sink);
    }

    public removeConnectionsFor(socket: SourceComponent) {
        return _.remove(this.connections, ({source, target}) => {
            return source === socket || target === socket;
        });
    }

    public locateTarget(e: MouseEvent)
    {
        const x = e.clientX + window.scrollX;
        const y = e.clientY + window.scrollY;

        const found = _.find(this.sockets, s => {
            return (x <= s.x2) && (x >= s.x1) && (y <= s.y2) && (y >= s.y1);
        });

        return _.get(found, 'sink', false);
    }

}

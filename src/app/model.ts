import {SinkComponent} from "./sink/sink.component";
import {SourceComponent} from "./source/source.component";

export interface Connection {
    source: SourceComponent;
    sink: SinkComponent;
}

export interface Socket {
    x1, y1, x2, y2: number;
    sink: SinkComponent;
}

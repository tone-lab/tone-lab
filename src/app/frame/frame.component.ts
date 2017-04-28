import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-frame',
    templateUrl: './frame.component.html',
    styleUrls: ['./frame.component.scss']
})
export class FrameComponent implements OnInit {

    @Input() name: string;
    @Output() closed = new EventEmitter<any>();

    constructor() {
    }

    ngOnInit() {
    }

    close() {
        this.closed.emit();
    }
}

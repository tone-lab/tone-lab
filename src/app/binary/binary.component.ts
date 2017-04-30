import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-binary',
    templateUrl: './binary.component.html',
    styleUrls: ['./binary.component.scss']
})
export class BinaryComponent implements OnInit {

    @Input() options = [false, true];
    @Input() active: boolean;
    @Output() toggle = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit() {
    }

    toggleActive() {
        this.toggle.emit(!this.active);
    }
}

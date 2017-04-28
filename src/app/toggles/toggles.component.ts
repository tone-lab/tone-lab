import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-toggles',
    templateUrl: './toggles.component.html',
    styleUrls: ['./toggles.component.scss']
})
export class TogglesComponent {

    @Input() name = '';
    @Input() activeOption: number = 0;
    @Input() options: string[] = [];
    @Output() toggle = new EventEmitter<number>();

    pickOption(i) {
        this.toggle.emit(i);
    }
}

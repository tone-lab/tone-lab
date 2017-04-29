import {Component, NgZone} from '@angular/core';
import {PatchesService} from "./patches.service";

declare const Tone: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent
{
    master;

    showPatches: boolean = true;

    modules = [];

    constructor(
        private zone: NgZone,
        private patches: PatchesService
    ) {
        Tone.Transport.start();
        this.master = Tone.Master;
        document.oncontextmenu = () => false;
    }

    add(t) {
        this.showPatches = false;
        this.modules.push(t);
        setTimeout(() => {
            this.zone.run(() => this.showPatches = true);
        }, 10);
    }

    remove(i) {
        this.modules.splice(i, 1);
    }
}

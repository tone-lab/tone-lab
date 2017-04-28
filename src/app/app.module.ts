import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import { SeqComponent } from './seq/seq.component';
import { OscComponent } from './osc/osc.component';
import { LfoComponent } from './lfo/lfo.component';
import { FilterComponent } from './filter/filter.component';
import { PatchOverlayComponent } from './patch-overlay/patch-overlay.component';
import {PatchesService} from "./patches.service";
import { SourceComponent } from './source/source.component';
import { CableComponent } from './cable/cable.component';
import { SinkComponent } from './sink/sink.component';
import { MixerComponent } from './mixer/mixer.component';
import { PingpongComponent } from './pingpong/pingpong.component';
import { GainComponent } from './gain/gain.component';
import { SliderComponent } from './slider/slider.component';
import { TogglesComponent } from './toggles/toggles.component';
import { NoiseComponent } from './noise/noise.component';

@NgModule({
    declarations: [
        AppComponent,
        SeqComponent,
        OscComponent,
        LfoComponent,
        FilterComponent,
        PatchOverlayComponent,
        SourceComponent,
        CableComponent,
        SinkComponent,
        MixerComponent,
        PingpongComponent,
        GainComponent,
        SliderComponent,
        TogglesComponent,
        NoiseComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    providers: [
        PatchesService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

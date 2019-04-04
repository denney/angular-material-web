import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule
} from '@angular/material';

import { NotaddDirectivesModule } from '@notadd/directives/directives.module';
import { NotaddSidebarModule } from '@notadd/components/sidebar/sidebar.module';
import { NotaddMaterialColorPickerModule } from '@notadd/components/material-color-picker/material-color-picker.module';

import { NotaddThemePanelComponent } from './theme-panel.component';

@NgModule({
    imports: [
        CommonModule,

        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,

        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatOptionModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTabsModule,

        NotaddDirectivesModule,
        NotaddSidebarModule,
        NotaddMaterialColorPickerModule
    ],
    declarations: [ NotaddThemePanelComponent ],
    exports: [ NotaddThemePanelComponent ]
})
export class NotaddThemePanelModule {
}

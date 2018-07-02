import { Component, ViewChild } from '@angular/core';
import { SettingsService } from '@delon/theme';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    searchToggleStatus: boolean;

    constructor(public settings: SettingsService) { }

    toggleCollapsedSidebar() {
        this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
    }

    searchToggleChange() {
        console.log(this.searchToggleStatus);
        this.searchToggleStatus = !this.searchToggleStatus;
    }

}

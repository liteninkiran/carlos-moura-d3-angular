import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
    @Input() options: string[] = [];
    @Input() placeholder = 'Select';
    @Input() selected?: string;
    @Output() selectionChange = new EventEmitter<Event>();

    public onChange(event: Event): void {
        this.selectionChange.emit(event);
    }
}

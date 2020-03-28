import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'cloud-grid-modal-container',
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.scss']
})
export class ModalContainerComponent {

    @Input()
    public title: string;
    @Output()
    public readonly close: EventEmitter<void> = new EventEmitter<void>();

}

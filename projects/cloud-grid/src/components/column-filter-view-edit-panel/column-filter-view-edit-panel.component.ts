import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IFilterView } from '../../models/i-filter-view';

@Component({
    selector: 'cloud-grid-column-filter-view-edit-panel',
    templateUrl: './column-filter-view-edit-panel.component.html',
    styleUrls: ['./column-filter-view-edit-panel.component.scss']
})
export class ColumnFilterViewEditPanelComponent implements OnInit {

    public editForm: FormGroup;
    public constructor(
        public ref: MatDialogRef<ColumnFilterViewEditPanelComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IFilterView,
        fb: FormBuilder,
    ) {
        this.editForm = fb.group({
            name: ['', [Validators.required]]
        });
    }

    public ngOnInit(): void {
        this.editForm.patchValue({ name: this.data?.name });
    }

    public save(): void {
        let view: IFilterView = this.data as IFilterView;
        view.name = this.editForm.value.name;
        this.ref.close(view);
    }
}

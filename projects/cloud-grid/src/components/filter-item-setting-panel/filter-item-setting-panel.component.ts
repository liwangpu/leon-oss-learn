import { Component, OnInit, AfterViewInit, Inject, Injector } from '@angular/core';
import { ColumnTypeEnum } from '../../enums/column-type-enum.enum';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FILTEROPERATORS, LIKE_OPERATOR, NLIKE_OPERATOR, EQ_OPERATOR, NE_OPERATOR, LT_OPERATOR, GT_OPERATOR, LTE_OPERATOR, GTE_OPERATOR } from '../../consts/filter-operators';
import { GridDataService } from '../../services/grid-data.service';
import { ITableColumn } from '../../models/i-table-column';
import { ArrayTool } from '../../utils/array-tool';
import { delay } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISelectOption } from '../../models/i-select-option';

interface SelectItem {
    label: string;
    value: string;
}
@Component({
    selector: 'cloud-grid-filter-item-setting-panel',
    templateUrl: './filter-item-setting-panel.component.html',
    styleUrls: ['./filter-item-setting-panel.component.scss']
})
export class FilterItemSettingPanelComponent implements OnInit, AfterViewInit {

    public testOp: string = 'eq';
    public fieldType: ColumnTypeEnum;
    public editForm: FormGroup;
    public operators: Array<any> = FILTEROPERATORS;
    public fields: Array<SelectItem>;
    public values: Array<any>;
    private columns: Array<ITableColumn>;
    private fieldInfos: { [key: string]: Array<ISelectOption> };
    public constructor(
        public ref: MatDialogRef<FilterItemSettingPanelComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { value: any, cols: Array<ITableColumn>, fieldInfos: any },
        private fb: FormBuilder,
    ) {
        this.editForm = this.fb.group({
            field: [],
            operator: [],
            value: []
        });
        this.columns = data.cols;
        this.fieldInfos = data.fieldInfos;
    }

    public ngOnInit(): void {
        const cols: Array<ITableColumn> = ArrayTool.deepCopy(this.columns);
        this.fields = cols.map(x =>
            ({ label: x.name, value: x.field }));

        this.editForm.get('field').valueChanges
            .pipe(delay(150))
            .subscribe(field => {
                let colIndex: number = cols.findIndex(x => x.field === field);
                let col: ITableColumn = cols[colIndex];
                this.fieldType = col.fieldType;

                // tslint:disable-next-line: prefer-switch
                if (col.fieldType === ColumnTypeEnum.Integer || col.fieldType === ColumnTypeEnum.Decimal) {
                    this.settingNumberOperations();
                } else if (col.fieldType === ColumnTypeEnum.Select) {
                    this.settingSelectOperations();
                    if (this.fieldInfos) {
                        this.values = this.fieldInfos[field].map(x =>
                            ({ label: x.text, value: x.value }));
                    }
                } else {
                    this.settingStringOperations();
                }
            });

        if (this.data.value) {
            this.editForm.patchValue(this.data.value);
        } else {
            this.editForm.patchValue({ field: cols[0].field });
        }
    }

    public ngAfterViewInit(): void {
        this.editForm.get('field').valueChanges.subscribe(() => {
            this.editForm.patchValue({ operator: null });
            this.editForm.patchValue({ value: '' });
        });
    }

    public save(): void {
        const form: any = this.editForm.value;
        this.ref.close(form);
    }

    private settingStringOperations(): void {
        const opts: Array<SelectItem> = [
            { label: '包含', value: LIKE_OPERATOR },
            { label: '不包含', value: NLIKE_OPERATOR },
            { label: '等于', value: EQ_OPERATOR }
        ];
        this.operators = opts;
    }

    private settingNumberOperations(): void {
        const opts: Array<SelectItem> = [
            { label: '等于', value: EQ_OPERATOR },
            { label: '不等于', value: NE_OPERATOR },
            { label: '小于', value: LT_OPERATOR },
            { label: '大于', value: GT_OPERATOR },
            { label: '小于等于', value: LTE_OPERATOR },
            { label: '大于等于', value: GTE_OPERATOR }
        ];
        this.operators = opts;
    }

    private settingSelectOperations(): void {
        const opts: Array<SelectItem> = [
            { label: '等于', value: EQ_OPERATOR },
            { label: '不等于', value: NE_OPERATOR }
        ];
        this.operators = opts;
    }

}

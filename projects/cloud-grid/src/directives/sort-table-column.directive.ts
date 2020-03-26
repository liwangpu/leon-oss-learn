import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { ISortEvent } from '../models/i-sort-event';
import { ITableColumn } from '../models/i-table-column';

const ASCENDINGFLAG: string = 'ascending';
const DESCENDINGFLAG: string = 'descending';

@Directive({
    selector: '[sortTableColumn]'
})
export class SortTableColumnDirective {
    @Input('sortTableColumn') public set column(col: ITableColumn) {
        this._column = col;
        if (col && col.sort) {
            this.renderer2.addClass(this.el.nativeElement, 'sortable');
            this.columnField = this.column.sortField ? this.column.sortField : this.column.field;
        }

        if (col['sorting_order']) {
            if (col['sorting_order'] === 'asc') {
                this.markAsc();
            } else {
                this.markDesc();
            }
        }
    }
    public get column(): ITableColumn {
        return this._column;
    }

    @Output() public readonly sort: EventEmitter<ISortEvent> = new EventEmitter<ISortEvent>();
    public columnField: string;
    private _column: ITableColumn;
    private direction: 'asc' | 'desc' | '';
    public constructor(
        private el: ElementRef,
        private renderer2: Renderer2
    ) { }
    @HostListener('mousedown') public onClick(): void {
        if (!this.column || !this.column.sort) { return; }

        if (this.direction === 'asc') {
            this.markDesc();
        } else if (this.direction === 'desc') {
            this.clearSort();
        } else {
            this.markAsc();
        }

        this.sort.next({ field: this.columnField, direction: this.direction });
    }

    public clearSort(): void {
        this.direction = '';
        this.renderer2.removeClass(this.el.nativeElement, ASCENDINGFLAG);
        this.renderer2.removeClass(this.el.nativeElement, DESCENDINGFLAG);
    }
    private markAsc(): void {
        this.direction = 'asc';
        this.renderer2.removeClass(this.el.nativeElement, DESCENDINGFLAG);
        this.renderer2.addClass(this.el.nativeElement, ASCENDINGFLAG);
    }

    private markDesc(): void {
        this.direction = 'desc';
        this.renderer2.removeClass(this.el.nativeElement, ASCENDINGFLAG);
        this.renderer2.addClass(this.el.nativeElement, DESCENDINGFLAG);
    }

}

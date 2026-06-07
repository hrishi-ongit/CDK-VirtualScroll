import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { WorkItem } from '../models/work-item.model';
import { MockDataService } from '../services/mock-data.service';

type WorkItemColumn =
  | 'workItemKey'
  | 'title'
  | 'status'
  | 'priority'
  | 'type'
  | 'riskLevel'
  | 'department'
  | 'businessUnit'
  | 'region'
  | 'country'
  | 'clientName'
  | 'ownerName'
  | 'assigneeName'
  | 'dueDate'
  | 'budgetUsd'
  | 'completionPercent'
  | 'approvalRequired';

/**
 * MaterialTableDemoComponent is the first comparison view. It intentionally
 * focuses only on MatTable plus MatPaginator with a fixed 1,000-row mock dataset.
 */
@Component({
  selector: 'app-material-table-demo',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './material-table-demo.component.html',
  styleUrl: './material-table-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialTableDemoComponent implements AfterViewInit {
  private readonly mockDataService = inject(MockDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
  private readonly currencyFormatter = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency'
  });

  protected readonly displayedColumns: readonly WorkItemColumn[] = [
    'workItemKey',
    'title',
    'status',
    'priority',
    'type',
    'riskLevel',
    'department',
    'businessUnit',
    'region',
    'country',
    'clientName',
    'ownerName',
    'assigneeName',
    'dueDate',
    'budgetUsd',
    'completionPercent',
    'approvalRequired'
  ];

  protected readonly pageSizeOptions: readonly number[] = [10, 25, 50, 100];
  protected readonly dataSource = new MatTableDataSource<WorkItem>(this.mockDataService.generateWorkItems(1000));
  protected readonly totalRecords = this.dataSource.data.length;
  protected readonly displayedRecordSummary = signal(this.createDisplayedRecordSummary(0, 25));
  protected readonly totalBudgetUsd = this.dataSource.data.reduce((sum, workItem) => sum + workItem.budgetUsd, 0);

  @ViewChild(MatPaginator) private paginator?: MatPaginator;

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.updateDisplayedRecordSummary();
      this.paginator.page.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.updateDisplayedRecordSummary();
      });
    }
  }

  protected isFrozenColumn(column: WorkItemColumn): boolean {
    return column === 'workItemKey' || column === 'title';
  }

  protected getColumnLabel(column: WorkItemColumn): string {
    const labels: Record<WorkItemColumn, string> = {
      workItemKey: 'Work Item',
      title: 'Title',
      status: 'Status',
      priority: 'Priority',
      type: 'Type',
      riskLevel: 'Risk',
      department: 'Department',
      businessUnit: 'Business Unit',
      region: 'Region',
      country: 'Country',
      clientName: 'Client',
      ownerName: 'Owner',
      assigneeName: 'Assignee',
      dueDate: 'Due Date',
      budgetUsd: 'Budget',
      completionPercent: 'Complete',
      approvalRequired: 'Approval'
    };

    return labels[column];
  }

  protected getCellValue(workItem: WorkItem, column: WorkItemColumn): string {
    switch (column) {
      case 'dueDate':
        return this.dateFormatter.format(workItem.dueDate);
      case 'budgetUsd':
        return this.currencyFormatter.format(workItem.budgetUsd);
      case 'completionPercent':
        return `${workItem.completionPercent}%`;
      case 'approvalRequired':
        return workItem.approvalRequired ? 'Required' : 'Not required';
      default:
        return String(workItem[column]);
    }
  }

  protected getFooterValue(column: WorkItemColumn): string {
    switch (column) {
      case 'workItemKey':
        return this.displayedRecordSummary();
      case 'title':
        return 'Totals';
      case 'budgetUsd':
        return this.currencyFormatter.format(this.totalBudgetUsd);
      default:
        return '';
    }
  }

  private updateDisplayedRecordSummary(): void {
    if (!this.paginator) {
      return;
    }

    this.displayedRecordSummary.set(this.createDisplayedRecordSummary(this.paginator.pageIndex, this.paginator.pageSize));
  }

  private createDisplayedRecordSummary(pageIndex: number, pageSize: number): string {
    if (this.totalRecords === 0) {
      return 'Displaying 0 of 0 records';
    }

    const startRecord = pageIndex * pageSize + 1;
    const endRecord = Math.min((pageIndex + 1) * pageSize, this.totalRecords);

    return `Displaying ${startRecord}-${endRecord} of ${this.totalRecords} records`;
  }
}

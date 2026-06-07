import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
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

  @ViewChild(MatPaginator) private paginator?: MatPaginator;

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
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
}

import { Injectable } from '@angular/core';

import {
  WorkItem,
  WorkItemPriority,
  WorkItemRegion,
  WorkItemRiskLevel,
  WorkItemStatus,
  WorkItemType
} from '../models/work-item.model';

/**
 * Preset sizes requested for table/grid performance comparisons.
 */
export type WorkItemDatasetSize = 100 | 1000 | 5000 | 10000 | 50000;

/**
 * MockDataService generates deterministic WorkItem rows locally. It deliberately
 * avoids sorting, filtering, pagination and backend behavior so future Material
 * Table, CDK Virtual Scroll and AG Grid tests can consume the same baseline data.
 */
@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  readonly datasetSizes: readonly WorkItemDatasetSize[] = [100, 1000, 5000, 10000, 50000];

  private readonly statuses: readonly WorkItemStatus[] = [
    'New',
    'In Progress',
    'Blocked',
    'In Review',
    'Completed',
    'Cancelled'
  ];

  private readonly priorities: readonly WorkItemPriority[] = ['Low', 'Medium', 'High', 'Critical'];
  private readonly types: readonly WorkItemType[] = ['Feature', 'Bug', 'Task', 'Change Request', 'Incident', 'Risk'];
  private readonly riskLevels: readonly WorkItemRiskLevel[] = ['Low', 'Medium', 'High'];
  private readonly regions: readonly WorkItemRegion[] = ['APAC', 'EMEA', 'LATAM', 'North America'];

  private readonly departments: readonly string[] = [
    'Engineering',
    'Finance',
    'Operations',
    'Human Resources',
    'Legal',
    'Sales',
    'Customer Success',
    'Information Security'
  ];

  private readonly businessUnits: readonly string[] = [
    'Enterprise Platforms',
    'Digital Banking',
    'Cloud Operations',
    'Risk and Compliance',
    'Revenue Operations',
    'People Systems'
  ];

  private readonly countries: readonly string[] = [
    'Australia',
    'Brazil',
    'Canada',
    'Germany',
    'India',
    'Singapore',
    'United Kingdom',
    'United States'
  ];

  private readonly clients: readonly string[] = [
    'Apex Manufacturing',
    'BluePeak Financial',
    'Contoso Retail',
    'Northwind Health',
    'Pioneer Logistics',
    'Summit Telecom'
  ];

  private readonly people: readonly string[] = [
    'Aarav Mehta',
    'Amelia Brooks',
    'Daniel Chen',
    'Fatima Khan',
    'James Wilson',
    'Maya Iyer',
    'Noah Patel',
    'Sophia Martinez'
  ];

  private readonly complianceCategories: readonly string[] = [
    'SOX',
    'GDPR',
    'HIPAA',
    'PCI DSS',
    'ISO 27001',
    'Internal Policy'
  ];

  private readonly tagPool: readonly string[] = [
    'automation',
    'audit',
    'billing',
    'customer-impact',
    'data-quality',
    'migration',
    'security',
    'workflow'
  ];

  generateWorkItems(count: number): WorkItem[] {
    const safeCount = this.normalizeCount(count);

    return Array.from({ length: safeCount }, (_, index) => this.createWorkItem(index + 1));
  }

  generatePreset(size: WorkItemDatasetSize): WorkItem[] {
    return this.generateWorkItems(size);
  }

  private createWorkItem(id: number): WorkItem {
    const status = this.pick(this.statuses, id);
    const priority = this.pick(this.priorities, id + 1);
    const type = this.pick(this.types, id + 2);
    const createdDate = this.createDate(id, -180);
    const updatedDate = this.createDate(id, -30);
    const dueDate = this.createDate(id, 15);
    const estimatedHours = this.numberBetween(id, 8, 240);
    const actualHours = this.numberBetween(id + 3, 0, estimatedHours + 40);
    const completionPercent = status === 'Completed' ? 100 : this.numberBetween(id + 7, 0, 95);

    return {
      id,
      workItemKey: `WI-${id.toString().padStart(6, '0')}`,
      title: `${type} for ${this.pick(this.businessUnits, id)} ${this.pick(this.departments, id + 4)}`,
      description: `Enterprise ${type.toLowerCase()} owned by ${this.pick(this.departments, id)} for operational tracking.`,
      type,
      status,
      priority,
      riskLevel: this.pick(this.riskLevels, id + 5),
      department: this.pick(this.departments, id),
      businessUnit: this.pick(this.businessUnits, id + 1),
      region: this.pick(this.regions, id + 2),
      country: this.pick(this.countries, id + 3),
      projectCode: `PRJ-${this.numberBetween(id, 100, 999)}`,
      costCenter: `CC-${this.numberBetween(id + 5, 1000, 9999)}`,
      clientName: this.pick(this.clients, id + 6),
      ownerName: this.pick(this.people, id + 7),
      assigneeName: this.pick(this.people, id + 8),
      reporterName: this.pick(this.people, id + 9),
      createdDate,
      updatedDate,
      dueDate,
      estimatedHours,
      actualHours,
      budgetUsd: this.numberBetween(id + 10, 5000, 250000),
      completionPercent,
      dependencyCount: this.numberBetween(id + 11, 0, 12),
      slaHoursRemaining: this.numberBetween(id + 12, -48, 240),
      approvalRequired: id % 3 === 0,
      complianceCategory: this.pick(this.complianceCategories, id + 13),
      tags: this.createTags(id)
    };
  }

  private normalizeCount(count: number): number {
    return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  }

  private createDate(seed: number, dayOffset: number): Date {
    const date = new Date(2025, 0, 1);
    date.setDate(date.getDate() + dayOffset + (seed % 365));

    return date;
  }

  private createTags(seed: number): readonly string[] {
    const firstTag = this.pick(this.tagPool, seed);
    const secondTag = this.pick(this.tagPool, seed + 3);

    return firstTag === secondTag ? [firstTag] : [firstTag, secondTag];
  }

  private pick<T>(values: readonly T[], seed: number): T {
    return values[seed % values.length];
  }

  private numberBetween(seed: number, min: number, max: number): number {
    const normalizedSeed = Math.sin(seed * 9999) * 10000;
    const decimal = normalizedSeed - Math.floor(normalizedSeed);

    return Math.floor(decimal * (max - min + 1)) + min;
  }
}

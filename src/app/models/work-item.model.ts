/**
 * WorkItem is the shared row contract for future Material Table, CDK Virtual
 * Scroll and AG Grid comparisons. Keeping this as a pure TypeScript model makes
 * the generated data reusable without coupling it to a specific UI library.
 */
export type WorkItemStatus =
  | 'New'
  | 'In Progress'
  | 'Blocked'
  | 'In Review'
  | 'Completed'
  | 'Cancelled';

export type WorkItemPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type WorkItemType =
  | 'Feature'
  | 'Bug'
  | 'Task'
  | 'Change Request'
  | 'Incident'
  | 'Risk';

export type WorkItemRiskLevel = 'Low' | 'Medium' | 'High';

export type WorkItemRegion = 'APAC' | 'EMEA' | 'LATAM' | 'North America';

export interface WorkItem {
  id: number;
  workItemKey: string;
  title: string;
  description: string;
  type: WorkItemType;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  riskLevel: WorkItemRiskLevel;
  department: string;
  businessUnit: string;
  region: WorkItemRegion;
  country: string;
  projectCode: string;
  costCenter: string;
  clientName: string;
  ownerName: string;
  assigneeName: string;
  reporterName: string;
  createdDate: Date;
  updatedDate: Date;
  dueDate: Date;
  estimatedHours: number;
  actualHours: number;
  budgetUsd: number;
  completionPercent: number;
  dependencyCount: number;
  slaHoursRemaining: number;
  approvalRequired: boolean;
  complianceCategory: string;
  tags: readonly string[];
}

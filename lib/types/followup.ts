export type FollowUpStatus = 'pending' | 'completed';

export interface FollowUp {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  dueDate: string; // ISO date (YYYY-MM-DD)
  dueTime?: string; // HH:MM
  status: FollowUpStatus;
  notificationEnabled: boolean;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface FollowUpFormData {
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  notificationEnabled: boolean;
}

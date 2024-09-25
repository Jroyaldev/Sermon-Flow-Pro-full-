export interface WorkflowStep {
  id: number;
  name: string;
  color: string;
  dayOfWeek: string;
  weeksBeforeSermon: number;
  number: number;
  defaultDay: string;
  defaultWeeks: number;
}

export interface SermonWorkflowRef {
  saveWorkflow: () => void;
}
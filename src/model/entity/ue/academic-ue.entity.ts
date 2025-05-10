export interface AcademicUE {
  id: string;
  label: string;
  numberOfPeriods: number;
  sectionId: string;
  sectionName: string;
  cycleYear: number;
  startDate: string;
  endDate: string;
  prerequisites: string[];
  sessions: UESession[];
}

export interface UESession {
  id: string;
  date: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface CreateAcademicUEDto {
  label: string;
  numberOfPeriods: number;
  sectionId: string;
  cycleYear: number;
  startDate: string;
  endDate: string;
  prerequisites: string[];
}

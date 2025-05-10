export interface ContactDetails {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  identifier: string;
}

export interface Student {
  id: number;
  role: string;
  contactDetails: ContactDetails;
  email: string;
}

export interface UE {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  cycle: number;
  periods: number;
  section: number;
  prerequisites: string[];
}

export interface Professor {
  id: number;
  contactDetails: ContactDetails;
  email: string;
}

export interface Result {
  id: number;
  result: number | null;
  period: number;
  success: boolean;
  isExempt: boolean;
  approved: boolean;
  student: number;
}

export interface AcademicUE {
  id: number;
  year: number;
  start_date: string;
  end_date: string;
  ue: UE;
  students: Student[];
  professor: Professor | null;
  lessons: {
    id: number;
    lesson_date: string;
    status: string;
  }[];
  results: Result[];
} 
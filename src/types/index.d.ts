export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface Session {
  id: string;
  name: string;
  created_at: string;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple choice' | 'multiple selection' | 'essay';
  options?: string[];
  exercise_id?: string;
  exam_id?: string;
}

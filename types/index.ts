export interface JobSimulation {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  difficulty: Difficulty;
  estimatedTime: number; // in minutes
  skills: string[];
  available: boolean;
  icon: string;
}

export enum JobCategory {
  DATA = 'Data & Analytics',
  ENGINEERING = 'Engineering',
  DESIGN = 'Design',
  MARKETING = 'Marketing',
  SALES = 'Sales',
  PRODUCT = 'Product',
  FINANCE = 'Finance',
  OPERATIONS = 'Operations',
}

export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert',
}

export interface SQLChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  expectedQuery?: string;
  hint?: string;
  testCases: TestCase[];
  tables: TableSchema[];
}

export interface TestCase {
  id: string;
  description: string;
  expectedRows?: number;
  expectedColumns?: string[];
  validateFunction?: (result: any[]) => boolean;
}

export interface TableSchema {
  name: string;
  columns: Column[];
  sampleData?: any[];
}

export interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey?: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
}

export interface SimulationProgress {
  simulationId: string;
  userId?: string;
  startedAt: Date;
  completedAt?: Date;
  challenges: ChallengeProgress[];
  score?: number;
}

export interface ChallengeProgress {
  challengeId: string;
  attempts: Attempt[];
  completed: boolean;
  timeSpent: number;
}

export interface Attempt {
  id: string;
  query: string;
  timestamp: Date;
  success: boolean;
  error?: string;
  executionTime?: number;
}
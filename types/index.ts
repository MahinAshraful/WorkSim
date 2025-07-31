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
  phases?: SimulationPhase[]; // New: support for multi-phase simulations
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

export interface SimulationPhase {
  id: string;
  title: string;
  description: string;
  order: number;
  challenges: (
    | DataExplorationChallenge
    | DataCleaningChallenge
    | VisualizationChallenge
    | StatisticalAnalysisChallenge
    | BusinessIntelligenceChallenge
    | ABTestingChallenge
    | DashboardChallenge
    | PresentationChallenge
    | DataStorytellingChallenge
    | FrontendCodingChallenge
    | UIComponentChallenge
    | CodeReviewChallenge
  )[];
  estimatedTime: number;
  requiredToComplete: boolean;
}

export interface BaseChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  type: ChallengeType;
  estimatedTime: number;
  hint?: string;
  testCases: TestCase[];
}

export enum ChallengeType {
  SQL = 'SQL',
  DATA_EXPLORATION = 'Data Exploration',
  DATA_CLEANING = 'Data Cleaning',
  VISUALIZATION = 'Visualization',
  STATISTICAL_ANALYSIS = 'Statistical Analysis',
  BUSINESS_INTELLIGENCE = 'Business Intelligence',
  AB_TESTING = 'A/B Testing',
  DASHBOARD = 'Dashboard',
  PRESENTATION = 'Presentation',
  DATA_STORYTELLING = 'Data Storytelling',
  FRONTEND_CODING = 'Frontend Coding',
  UI_COMPONENT = 'UI Component',
  CODE_REVIEW = 'Code Review'
}

export interface DataExplorationChallenge extends BaseChallenge {
  type: ChallengeType.DATA_EXPLORATION;
  dataset: Dataset;
  questions: ExplorationQuestion[];
  expectedInsights: string[];
}

export interface DataCleaningChallenge extends BaseChallenge {
  type: ChallengeType.DATA_CLEANING;
  dataset: Dataset;
  issues: DataIssue[];
  expectedOutput: CleanedDataSpec;
}

export interface VisualizationChallenge extends BaseChallenge {
  type: ChallengeType.VISUALIZATION;
  dataset: Dataset;
  chartType: ChartType;
  requirements: VisualizationRequirement[];
}

export interface StatisticalAnalysisChallenge extends BaseChallenge {
  type: ChallengeType.STATISTICAL_ANALYSIS;
  dataset: Dataset;
  analysisType: AnalysisType;
  hypotheses: Hypothesis[];
}

export interface BusinessIntelligenceChallenge extends BaseChallenge {
  type: ChallengeType.BUSINESS_INTELLIGENCE;
  businessContext: BusinessContext;
  kpis: KPI[];
  metrics: Metric[];
}

export interface ABTestingChallenge extends BaseChallenge {
  type: ChallengeType.AB_TESTING;
  experiment: Experiment;
  metrics: ABTestMetric[];
  significanceLevel: number;
}

export interface DashboardChallenge extends BaseChallenge {
  type: ChallengeType.DASHBOARD;
  requirements: DashboardRequirement[];
  dataSources: Dataset[];
  stakeholders: Stakeholder[];
}

export interface PresentationChallenge extends BaseChallenge {
  type: ChallengeType.PRESENTATION;
  audience: Audience;
  keyFindings: Finding[];
  presentationFormat: PresentationFormat;
}

export interface DataStorytellingChallenge extends BaseChallenge {
  type: ChallengeType.DATA_STORYTELLING;
  narrative: Narrative;
  dataPoints: DataPoint[];
  audience: Audience;
}

// Supporting types for the new challenges
export interface Dataset {
  id: string;
  name: string;
  description: string;
  schema: TableSchema[];
  sampleData: any[];
  dataQuality: DataQuality;
  source: string;
}

export interface DataQuality {
  completeness: number; // 0-1
  accuracy: number; // 0-1
  consistency: number; // 0-1
  timeliness: number; // 0-1
  issues: DataIssue[];
}

export interface DataIssue {
  type: 'missing_values' | 'duplicates' | 'outliers' | 'inconsistent_format' | 'data_type_mismatch';
  description: string;
  severity: 'low' | 'medium' | 'high';
  affectedColumns: string[];
}

export interface CleanedDataSpec {
  expectedShape: [number, number];
  expectedColumns: string[];
  dataQualityThresholds: Partial<DataQuality>;
  transformations: string[];
}

export interface ExplorationQuestion {
  id: string;
  question: string;
  expectedApproach: string;
  keyInsights: string[];
}

export enum ChartType {
  BAR = 'Bar Chart',
  LINE = 'Line Chart',
  SCATTER = 'Scatter Plot',
  HISTOGRAM = 'Histogram',
  BOX_PLOT = 'Box Plot',
  HEATMAP = 'Heatmap',
  PIE = 'Pie Chart',
  DASHBOARD = 'Dashboard'
}

export interface VisualizationRequirement {
  id: string;
  description: string;
  chartType: ChartType;
  dataRequirements: string[];
  designRequirements: string[];
}

export enum AnalysisType {
  DESCRIPTIVE = 'Descriptive',
  INFERENTIAL = 'Inferential',
  PREDICTIVE = 'Predictive',
  CORRELATION = 'Correlation',
  REGRESSION = 'Regression',
  HYPOTHESIS_TESTING = 'Hypothesis Testing'
}

export interface Hypothesis {
  id: string;
  nullHypothesis: string;
  alternativeHypothesis: string;
  testType: string;
  significanceLevel: number;
}

export interface BusinessContext {
  company: string;
  industry: string;
  businessProblem: string;
  stakeholders: Stakeholder[];
  successMetrics: string[];
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  needs: string[];
  technicalLevel: 'low' | 'medium' | 'high';
}

export interface KPI {
  id: string;
  name: string;
  definition: string;
  calculation: string;
  target: number;
  current: number;
}

export interface Metric {
  id: string;
  name: string;
  description: string;
  formula: string;
  unit: string;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  controlGroup: Group;
  treatmentGroup: Group;
  duration: number; // days
  randomizationMethod: string;
}

export interface Group {
  id: string;
  name: string;
  size: number;
  treatment: string;
}

export interface ABTestMetric {
  id: string;
  name: string;
  description: string;
  type: 'conversion' | 'revenue' | 'engagement' | 'custom';
  calculation: string;
}

export interface DashboardRequirement {
  id: string;
  title: string;
  description: string;
  chartType: ChartType;
  dataSource: string;
  refreshRate: string;
  filters: string[];
}

export interface Audience {
  id: string;
  name: string;
  role: string;
  technicalLevel: 'low' | 'medium' | 'high';
  interests: string[];
  decisionMakingPower: 'low' | 'medium' | 'high';
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number; // 0-1
  supportingData: string[];
}

export enum PresentationFormat {
  SLIDES = 'Slides',
  REPORT = 'Report',
  DASHBOARD = 'Dashboard',
  EMAIL = 'Email',
  MEETING = 'Meeting'
}

export interface Narrative {
  id: string;
  title: string;
  storyArc: string[];
  keyMessages: string[];
  callToAction: string;
}

export interface DataPoint {
  id: string;
  label: string;
  value: number;
  context: string;
  significance: string;
}

// Frontend Engineering Challenge Types
export interface FrontendCodingChallenge extends BaseChallenge {
  type: ChallengeType.FRONTEND_CODING;
  task: FrontendTask;
  starterCode: CodeFile[];
  requirements: string[];
  managerPrompt: string;
  teammateHints: string[];
}

export interface UIComponentChallenge extends BaseChallenge {
  type: ChallengeType.UI_COMPONENT;
  componentSpec: ComponentSpec;
  designTokens: DesignTokens;
  starterCode: CodeFile[];
  requirements: string[];
}

export interface CodeReviewChallenge extends BaseChallenge {
  type: ChallengeType.CODE_REVIEW;
  codeToReview: string;
  originalCode: string;
  reviewCriteria: ReviewCriteria[];
  expectedImprovements: string[];
}

// Supporting types for Frontend challenges
export interface FrontendTask {
  id: string;
  title: string;
  description: string;
  userStory: string;
  acceptanceCriteria: string[];
  priority: 'low' | 'medium' | 'high';
  managerPrompt: string;
  starterCode: CodeFile[];
}

export interface CodeFile {
  name: string;
  path: string;
  content: string;
  language: 'typescript' | 'javascript' | 'css' | 'html' | 'jsx' | 'tsx';
  editable: boolean;
}

export interface ComponentSpec {
  name: string;
  props: ComponentProp[];
  variants: ComponentVariant[];
  states: ComponentState[];
  accessibility: AccessibilityRequirement[];
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: any;
}

export interface ComponentVariant {
  name: string;
  description: string;
  props: Record<string, any>;
}

export interface ComponentState {
  name: string;
  description: string;
  triggers: string[];
}

export interface AccessibilityRequirement {
  id: string;
  description: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  testMethod: string;
}

export interface DesignTokens {
  colors: Record<string, string>;
  typography: TypographyToken[];
  spacing: Record<string, string>;
  borders: Record<string, string>;
  shadows: Record<string, string>;
}

export interface TypographyToken {
  name: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  fontFamily: string;
}

export interface ReviewCriteria {
  id: string;
  category: 'functionality' | 'performance' | 'accessibility' | 'maintainability' | 'security';
  description: string;
  weight: number;
}

// Chat bot message types
export interface ChatMessage {
  id: string;
  role: 'manager' | 'teammate' | 'user';
  content: string;
  timestamp: Date;
  type: 'text' | 'code' | 'file';
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  type: 'manager' | 'teammate';
  messages: ChatMessage[];
  context: FrontendSimulationContext;
}

export interface FrontendSimulationContext {
  currentTask?: FrontendTask;
  completedTasks: string[];
  codeFiles: CodeFile[];
  progress: number;
  hints: string[];
}
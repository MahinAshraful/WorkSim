import { 
  SimulationPhase, 
  ChallengeType, 
  Difficulty, 
  DataExplorationChallenge,
  DataCleaningChallenge,
  VisualizationChallenge,
  StatisticalAnalysisChallenge,
  BusinessIntelligenceChallenge,
  ABTestingChallenge,
  DashboardChallenge,
  PresentationChallenge,
  DataStorytellingChallenge,
  ChartType,
  AnalysisType,
  PresentationFormat
} from '@/types';

export const DATA_ANALYST_PHASES: SimulationPhase[] = [
  {
    id: 'phase-1',
    title: 'Data Exploration & Understanding',
    description: 'Start by exploring the dataset to understand its structure, quality, and potential insights',
    order: 1,
    estimatedTime: 20,
    requiredToComplete: true,
    challenges: [
      {
        id: 'exploration-1',
        title: 'E-commerce Dataset Exploration',
        description: 'Explore the e-commerce dataset to understand customer behavior patterns and identify key metrics',
        difficulty: Difficulty.BEGINNER,
        type: ChallengeType.DATA_EXPLORATION,
        estimatedTime: 15,
        hint: 'Start with basic descriptive statistics, then look for patterns in customer segments and purchase behavior',
        testCases: [
          {
            id: 'test-exploration-1',
            description: 'Should identify key customer segments and their characteristics',
            expectedColumns: ['customer_segment', 'avg_order_value', 'purchase_frequency', 'customer_lifetime_value']
          }
        ],
        dataset: {
          id: 'ecommerce-dataset',
          name: 'E-commerce Customer Data',
          description: 'Customer transaction data from an online retail platform',
          schema: [
            {
              name: 'customers',
              columns: [
                { name: 'customer_id', type: 'INTEGER', nullable: false, primaryKey: true },
                { name: 'customer_name', type: 'TEXT', nullable: false },
                { name: 'email', type: 'TEXT', nullable: false },
                { name: 'registration_date', type: 'DATE', nullable: false },
                { name: 'customer_segment', type: 'TEXT', nullable: true },
                { name: 'total_orders', type: 'INTEGER', nullable: false },
                { name: 'total_spent', type: 'DECIMAL', nullable: false },
                { name: 'last_order_date', type: 'DATE', nullable: true }
              ]
            },
            {
              name: 'orders',
              columns: [
                { name: 'order_id', type: 'INTEGER', nullable: false, primaryKey: true },
                { name: 'customer_id', type: 'INTEGER', nullable: false },
                { name: 'order_date', type: 'DATE', nullable: false },
                { name: 'order_value', type: 'DECIMAL', nullable: false },
                { name: 'payment_method', type: 'TEXT', nullable: false },
                { name: 'shipping_region', type: 'TEXT', nullable: false }
              ]
            }
          ],
          sampleData: [],
          dataQuality: {
            completeness: 0.85,
            accuracy: 0.92,
            consistency: 0.88,
            timeliness: 0.95,
            issues: [
              {
                type: 'missing_values',
                description: 'Some customer segments are missing',
                severity: 'medium',
                affectedColumns: ['customer_segment']
              }
            ]
          },
          source: 'Internal CRM System'
        },
        questions: [
          {
            id: 'q1',
            question: 'What are the main customer segments and their characteristics?',
            expectedApproach: 'Group customers by segment and calculate average metrics',
            keyInsights: ['High-value customers represent 20% of base but 60% of revenue', 'New customers have lower average order values']
          },
          {
            id: 'q2',
            question: 'How does purchase behavior vary by region?',
            expectedApproach: 'Analyze order patterns by shipping region',
            keyInsights: ['West Coast has highest average order value', 'Midwest has most frequent purchases']
          }
        ],
        expectedInsights: [
          'Customer segmentation reveals distinct behavior patterns',
          'Regional differences in purchasing behavior',
          'Seasonal trends in order patterns'
        ]
      }
    ]
  },
  {
    id: 'phase-2',
    title: 'Data Cleaning & Quality Assurance',
    description: 'Clean and prepare the data for analysis by handling missing values, duplicates, and inconsistencies',
    order: 2,
    estimatedTime: 25,
    requiredToComplete: true,
    challenges: [
      {
        id: 'cleaning-1',
        title: 'Clean Customer Data for Analysis',
        description: 'Identify and fix data quality issues in the customer dataset to ensure reliable analysis',
        difficulty: Difficulty.INTERMEDIATE,
        type: ChallengeType.DATA_CLEANING,
        estimatedTime: 20,
        hint: 'Look for missing values, duplicates, and inconsistent formats. Consider imputation strategies for missing data.',
        testCases: [
          {
            id: 'test-cleaning-1',
            description: 'Should handle missing customer segments and duplicate records',
            expectedColumns: ['customer_id', 'customer_name', 'email', 'customer_segment', 'total_orders', 'total_spent']
          }
        ],
        dataset: {
          id: 'dirty-customer-data',
          name: 'Customer Data with Quality Issues',
          description: 'Customer data with various quality issues that need cleaning',
          schema: [
            {
              name: 'customers',
              columns: [
                { name: 'customer_id', type: 'INTEGER', nullable: false, primaryKey: true },
                { name: 'customer_name', type: 'TEXT', nullable: false },
                { name: 'email', type: 'TEXT', nullable: false },
                { name: 'customer_segment', type: 'TEXT', nullable: true },
                { name: 'total_orders', type: 'INTEGER', nullable: false },
                { name: 'total_spent', type: 'DECIMAL', nullable: false }
              ]
            }
          ],
          sampleData: [],
          dataQuality: {
            completeness: 0.75,
            accuracy: 0.85,
            consistency: 0.70,
            timeliness: 0.90,
            issues: []
          },
          source: 'CRM System Export'
        },
        issues: [
          {
            type: 'missing_values',
            description: '30% of customer_segment values are NULL',
            severity: 'high',
            affectedColumns: ['customer_segment']
          },
          {
            type: 'duplicates',
            description: '5% of customer records are duplicates',
            severity: 'medium',
            affectedColumns: ['customer_id', 'email']
          },
          {
            type: 'inconsistent_format',
            description: 'Email addresses have inconsistent formatting',
            severity: 'low',
            affectedColumns: ['email']
          }
        ],
        expectedOutput: {
          expectedShape: [1000, 6],
          expectedColumns: ['customer_id', 'customer_name', 'email', 'customer_segment', 'total_orders', 'total_spent'],
          dataQualityThresholds: {
            completeness: 0.95,
            accuracy: 0.95,
            consistency: 0.95
          },
          transformations: [
            'Impute missing customer segments based on spending patterns',
            'Remove duplicate customer records',
            'Standardize email format',
            'Validate data types and ranges'
          ]
        }
      }
    ]
  },
  {
    id: 'phase-3',
    title: 'Data Visualization & Insights',
    description: 'Create compelling visualizations to communicate key insights and patterns in the data',
    order: 3,
    estimatedTime: 30,
    requiredToComplete: true,
    challenges: [
      {
        id: 'viz-1',
        title: 'Customer Behavior Dashboard',
        description: 'Create visualizations to show customer segmentation, purchase patterns, and regional performance',
        difficulty: Difficulty.INTERMEDIATE,
        type: ChallengeType.VISUALIZATION,
        estimatedTime: 25,
        hint: 'Use appropriate chart types for different data relationships. Consider color coding and clear labels.',
        testCases: [
          {
            id: 'test-viz-1',
            description: 'Should create 4-5 meaningful visualizations',
            expectedColumns: ['chart_type', 'insight', 'recommendation']
          }
        ],
        dataset: {
          id: 'clean-customer-data',
          name: 'Cleaned Customer Data',
          description: 'Clean customer data ready for visualization',
          schema: [
            {
              name: 'customers',
              columns: [
                { name: 'customer_id', type: 'INTEGER', nullable: false, primaryKey: true },
                { name: 'customer_name', type: 'TEXT', nullable: false },
                { name: 'customer_segment', type: 'TEXT', nullable: false },
                { name: 'total_orders', type: 'INTEGER', nullable: false },
                { name: 'total_spent', type: 'DECIMAL', nullable: false },
                { name: 'avg_order_value', type: 'DECIMAL', nullable: false },
                { name: 'region', type: 'TEXT', nullable: false }
              ]
            }
          ],
          sampleData: [],
          dataQuality: {
            completeness: 0.98,
            accuracy: 0.98,
            consistency: 0.98,
            timeliness: 0.95,
            issues: []
          },
          source: 'Cleaned CRM Data'
        },
        chartType: ChartType.DASHBOARD,
        requirements: [
          {
            id: 'req1',
            description: 'Customer segment distribution with revenue contribution',
            chartType: ChartType.PIE,
            dataRequirements: ['customer_segment', 'total_spent'],
            designRequirements: ['Use consistent color scheme', 'Include percentage labels']
          },
          {
            id: 'req2',
            description: 'Average order value by region',
            chartType: ChartType.BAR,
            dataRequirements: ['region', 'avg_order_value'],
            designRequirements: ['Sort by value descending', 'Include value labels on bars']
          },
          {
            id: 'req3',
            description: 'Monthly order trends over time',
            chartType: ChartType.LINE,
            dataRequirements: ['order_date', 'order_count'],
            designRequirements: ['Show trend line', 'Highlight seasonal patterns']
          }
        ]
      }
    ]
  },
  {
    id: 'phase-4',
    title: 'Statistical Analysis & Hypothesis Testing',
    description: 'Perform statistical analysis to test hypotheses and draw meaningful conclusions',
    order: 4,
    estimatedTime: 35,
    requiredToComplete: true,
    challenges: [
      {
        id: 'stats-1',
        title: 'Customer Lifetime Value Analysis',
        description: 'Analyze customer lifetime value patterns and test hypotheses about customer behavior',
        difficulty: Difficulty.ADVANCED,
        type: ChallengeType.STATISTICAL_ANALYSIS,
        estimatedTime: 30,
        hint: 'Use correlation analysis, t-tests, and regression to understand relationships between variables.',
        testCases: [
          {
            id: 'test-stats-1',
            description: 'Should perform correlation analysis and hypothesis testing',
            expectedColumns: ['analysis_type', 'p_value', 'conclusion', 'confidence_interval']
          }
        ],
        dataset: {
          id: 'customer-ltv-data',
          name: 'Customer Lifetime Value Dataset',
          description: 'Comprehensive customer data with behavioral and demographic variables',
          schema: [
            {
              name: 'customers',
              columns: [
                { name: 'customer_id', type: 'INTEGER', nullable: false, primaryKey: true },
                { name: 'customer_lifetime_value', type: 'DECIMAL', nullable: false },
                { name: 'total_orders', type: 'INTEGER', nullable: false },
                { name: 'avg_order_value', type: 'DECIMAL', nullable: false },
                { name: 'days_since_first_order', type: 'INTEGER', nullable: false },
                { name: 'customer_segment', type: 'TEXT', nullable: false },
                { name: 'region', type: 'TEXT', nullable: false }
              ]
            }
          ],
          sampleData: [],
          dataQuality: {
            completeness: 0.99,
            accuracy: 0.98,
            consistency: 0.99,
            timeliness: 0.95,
            issues: []
          },
          source: 'Analytics Database'
        },
        analysisType: AnalysisType.CORRELATION,
        hypotheses: [
          {
            id: 'h1',
            nullHypothesis: 'There is no correlation between total orders and customer lifetime value',
            alternativeHypothesis: 'There is a positive correlation between total orders and customer lifetime value',
            testType: 'Pearson Correlation',
            significanceLevel: 0.05
          },
          {
            id: 'h2',
            nullHypothesis: 'Average order value is the same across all customer segments',
            alternativeHypothesis: 'Average order value differs significantly between customer segments',
            testType: 'ANOVA',
            significanceLevel: 0.05
          }
        ]
      }
    ]
  },
  {
    id: 'phase-5',
    title: 'A/B Testing Analysis',
    description: 'Analyze A/B test results to determine the effectiveness of marketing campaigns and product changes',
    order: 5,
    estimatedTime: 30,
    requiredToComplete: true,
    challenges: [
      {
        id: 'ab-test-1',
        title: 'Email Campaign A/B Test Analysis',
        description: 'Analyze the results of an email marketing A/B test to determine which campaign variant performed better',
        difficulty: Difficulty.ADVANCED,
        type: ChallengeType.AB_TESTING,
        estimatedTime: 25,
        hint: 'Calculate conversion rates, perform statistical significance testing, and consider practical significance.',
        testCases: [
          {
            id: 'test-ab-1',
            description: 'Should determine statistical significance and recommend winning variant',
            expectedColumns: ['variant', 'conversion_rate', 'p_value', 'confidence_interval', 'recommendation']
          }
        ],
        experiment: {
          id: 'email-campaign-test',
          name: 'Email Subject Line A/B Test',
          description: 'Testing two different email subject lines to improve open rates and conversions',
          controlGroup: {
            id: 'control',
            name: 'Control Group',
            size: 5000,
            treatment: 'Original subject line: "Don\'t miss out on our sale!"'
          },
          treatmentGroup: {
            id: 'treatment',
            name: 'Treatment Group',
            size: 5000,
            treatment: 'New subject line: "Limited time: 50% off everything"'
          },
          duration: 14,
          randomizationMethod: 'Random assignment by customer ID'
        },
        metrics: [
          {
            id: 'open_rate',
            name: 'Email Open Rate',
            description: 'Percentage of emails opened by recipients',
            type: 'engagement',
            calculation: 'emails_opened / emails_sent'
          },
          {
            id: 'click_rate',
            name: 'Click-through Rate',
            description: 'Percentage of recipients who clicked on links in the email',
            type: 'engagement',
            calculation: 'clicks / emails_sent'
          },
          {
            id: 'conversion_rate',
            name: 'Conversion Rate',
            description: 'Percentage of recipients who made a purchase',
            type: 'conversion',
            calculation: 'purchases / emails_sent'
          }
        ],
        significanceLevel: 0.05
      }
    ]
  },
  {
    id: 'phase-6',
    title: 'Business Intelligence & KPI Tracking',
    description: 'Create business intelligence reports and track key performance indicators',
    order: 6,
    estimatedTime: 25,
    requiredToComplete: true,
    challenges: [
      {
        id: 'bi-1',
        title: 'E-commerce Performance Dashboard',
        description: 'Create a comprehensive BI dashboard to track key business metrics and performance indicators',
        difficulty: Difficulty.INTERMEDIATE,
        type: ChallengeType.BUSINESS_INTELLIGENCE,
        estimatedTime: 20,
        hint: 'Focus on actionable metrics that drive business decisions. Include trend analysis and goal tracking.',
        testCases: [
          {
            id: 'test-bi-1',
            description: 'Should track key business metrics with targets and trends',
            expectedColumns: ['metric_name', 'current_value', 'target_value', 'trend', 'status']
          }
        ],
        businessContext: {
          company: 'TechRetail Inc.',
          industry: 'E-commerce',
          businessProblem: 'Need to track and improve overall business performance across multiple channels',
          stakeholders: [
            {
              id: 'stakeholder-1',
              name: 'Sarah Johnson',
              role: 'VP of Marketing',
              needs: ['Customer acquisition costs', 'Marketing ROI', 'Campaign performance'],
              technicalLevel: 'medium'
            },
            {
              id: 'stakeholder-2',
              name: 'Mike Chen',
              role: 'Head of Operations',
              needs: ['Inventory turnover', 'Order fulfillment rates', 'Customer satisfaction'],
              technicalLevel: 'low'
            }
          ],
          successMetrics: ['Revenue growth', 'Customer retention', 'Operational efficiency']
        },
        kpis: [
          {
            id: 'kpi-1',
            name: 'Monthly Recurring Revenue (MRR)',
            definition: 'Total predictable revenue generated each month',
            calculation: 'SUM(monthly_subscriptions + recurring_orders)',
            target: 500000,
            current: 475000
          },
          {
            id: 'kpi-2',
            name: 'Customer Acquisition Cost (CAC)',
            definition: 'Average cost to acquire a new customer',
            calculation: 'total_marketing_spend / new_customers_acquired',
            target: 50,
            current: 65
          },
          {
            id: 'kpi-3',
            name: 'Customer Lifetime Value (CLV)',
            definition: 'Average revenue generated per customer over their lifetime',
            calculation: 'avg_order_value * avg_purchase_frequency * avg_customer_lifespan',
            target: 300,
            current: 275
          }
        ],
        metrics: [
          {
            id: 'metric-1',
            name: 'Conversion Rate',
            description: 'Percentage of visitors who make a purchase',
            formula: 'purchases / total_visitors * 100',
            unit: '%'
          },
          {
            id: 'metric-2',
            name: 'Average Order Value',
            description: 'Average amount spent per order',
            formula: 'total_revenue / total_orders',
            unit: '$'
          },
          {
            id: 'metric-3',
            name: 'Cart Abandonment Rate',
            description: 'Percentage of carts that don\'t result in a purchase',
            formula: '(carts_created - purchases) / carts_created * 100',
            unit: '%'
          }
        ]
      }
    ]
  },
  {
    id: 'phase-7',
    title: 'Dashboard Creation & Data Storytelling',
    description: 'Build interactive dashboards and craft compelling data stories for stakeholders',
    order: 7,
    estimatedTime: 40,
    requiredToComplete: true,
    challenges: [
      {
        id: 'dashboard-1',
        title: 'Executive Dashboard for Stakeholders',
        description: 'Create an executive-level dashboard that tells a compelling story about business performance',
        difficulty: Difficulty.ADVANCED,
        type: ChallengeType.DASHBOARD,
        estimatedTime: 35,
        hint: 'Focus on high-level insights that matter to executives. Use clear visualizations and actionable insights.',
        testCases: [
          {
            id: 'test-dashboard-1',
            description: 'Should create executive-friendly dashboard with key insights',
            expectedColumns: ['dashboard_section', 'key_insight', 'action_item', 'priority']
          }
        ],
        requirements: [
          {
            id: 'req1',
            title: 'Revenue Overview',
            description: 'High-level revenue metrics with trends and forecasts',
            chartType: ChartType.LINE,
            dataSource: 'Sales Database',
            refreshRate: 'Daily',
            filters: ['Date Range', 'Product Category', 'Region']
          },
          {
            id: 'req2',
            title: 'Customer Health Score',
            description: 'Customer satisfaction and retention metrics',
            chartType: ChartType.BAR,
            dataSource: 'CRM System',
            refreshRate: 'Weekly',
            filters: ['Customer Segment', 'Time Period']
          },
          {
            id: 'req3',
            title: 'Operational Efficiency',
            description: 'Key operational metrics and bottlenecks',
            chartType: ChartType.HEATMAP,
            dataSource: 'Operations Database',
            refreshRate: 'Real-time',
            filters: ['Department', 'Process Type']
          }
        ],
        dataSources: [
          {
            id: 'sales-data',
            name: 'Sales Performance Data',
            description: 'Comprehensive sales and revenue data',
            schema: [],
            sampleData: [],
            dataQuality: { completeness: 0.98, accuracy: 0.97, consistency: 0.99, timeliness: 0.95, issues: [] },
            source: 'Sales Database'
          }
        ],
        stakeholders: [
          {
            id: 'exec-1',
            name: 'Jennifer Smith',
            role: 'CEO',
            needs: ['Revenue growth', 'Market position', 'Strategic insights'],
            technicalLevel: 'low'
          },
          {
            id: 'exec-2',
            name: 'David Rodriguez',
            role: 'CFO',
            needs: ['Financial metrics', 'Cost analysis', 'Profitability trends'],
            technicalLevel: 'medium'
          }
        ]
      }
    ]
  },
  {
    id: 'phase-8',
    title: 'Presentation & Communication',
    description: 'Present findings to stakeholders and communicate insights effectively',
    order: 8,
    estimatedTime: 20,
    requiredToComplete: true,
    challenges: [
      {
        id: 'presentation-1',
        title: 'Quarterly Business Review Presentation',
        description: 'Create a presentation summarizing key findings and recommendations for the quarterly business review',
        difficulty: Difficulty.INTERMEDIATE,
        type: ChallengeType.PRESENTATION,
        estimatedTime: 15,
        hint: 'Structure your presentation with clear sections: Executive Summary, Key Findings, Recommendations, Next Steps.',
        testCases: [
          {
            id: 'test-presentation-1',
            description: 'Should create compelling presentation with clear recommendations',
            expectedColumns: ['slide_number', 'content_type', 'key_message', 'supporting_data']
          }
        ],
        audience: {
          id: 'qbr-audience',
          name: 'Quarterly Business Review Attendees',
          role: 'Senior Leadership Team',
          technicalLevel: 'low',
          interests: ['Business performance', 'Strategic insights', 'Actionable recommendations'],
          decisionMakingPower: 'high'
        },
        keyFindings: [
          {
            id: 'finding-1',
            title: 'Customer Acquisition Cost Increased by 15%',
            description: 'Marketing efficiency has declined due to increased competition and ad costs',
            impact: 'high',
            confidence: 0.95,
            supportingData: ['CAC trend analysis', 'Competitive analysis', 'Channel performance data']
          },
          {
            id: 'finding-2',
            title: 'High-Value Customer Retention Improved',
            description: 'Premium customer segment shows 25% improvement in retention rates',
            impact: 'medium',
            confidence: 0.90,
            supportingData: ['Customer lifetime value analysis', 'Retention cohort analysis']
          }
        ],
        presentationFormat: PresentationFormat.SLIDES
      }
    ]
  }
];

export const DATA_ANALYST_SIMULATION_CONFIG = {
  id: 'comprehensive-data-analyst',
  title: 'Comprehensive Data Analyst',
  description: 'Complete data analyst simulation covering SQL, data exploration, visualization, statistical analysis, A/B testing, and business intelligence',
  phases: DATA_ANALYST_PHASES,
  totalEstimatedTime: 225, // Sum of all phases
  skills: [
    'SQL',
    'Data Exploration',
    'Data Cleaning',
    'Data Visualization',
    'Statistical Analysis',
    'A/B Testing',
    'Business Intelligence',
    'Dashboard Creation',
    'Data Storytelling',
    'Stakeholder Communication'
  ]
}; 
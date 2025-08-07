/**
 * Configuration for the lionagi learning system
 */

export const LEARNING_CONFIG = {
  // Difficulty adjustment parameters
  difficulty: {
    minLevel: 0.1,
    maxLevel: 1.0,
    adjustmentFactor: 0.1,
    performanceThresholds: {
      decrease: 0.3,
      maintain: 0.7,
      increase: 0.9
    },
    consecutiveFailuresBeforeDecrease: 3,
    consecutiveSuccessesBeforeIncrease: 5
  },

  // Code playground settings
  playground: {
    maxExecutionTime: 5000, // 5 seconds
    maxMemoryUsage: 100 * 1024 * 1024, // 100MB
    allowedPackages: [
      'lionagi',
      'numpy',
      'pandas',
      'matplotlib',
      'seaborn',
      'sklearn'
    ],
    sandboxEnvironment: 'docker',
    supportedLanguages: ['python', 'typescript', 'javascript']
  },

  // Exercise generation settings
  exerciseGeneration: {
    maxComplexity: 10,
    templateVariations: 5,
    difficultyProgression: [1, 2, 3, 5, 7, 9],
    conceptReinforcement: {
      minExercisesPerConcept: 3,
      maxExercisesPerConcept: 7,
      spacedRepetition: true
    }
  },

  // User progress tracking
  progress: {
    scoreWeights: {
      accuracy: 0.4,
      speed: 0.2,
      consistency: 0.2,
      engagement: 0.2
    },
    achievementThresholds: {
      streak: [3, 7, 14, 30, 60],
      perfectScore: [1, 5, 10, 25, 50],
      speedBonus: [0.8, 0.6, 0.4, 0.2] // Time ratio thresholds
    }
  },

  // Content adaptation
  adaptation: {
    learningStyleWeights: {
      visual: { multimedia: 0.6, text: 0.2, interactive: 0.2 },
      textual: { multimedia: 0.2, text: 0.6, interactive: 0.2 },
      interactive: { multimedia: 0.2, text: 0.2, interactive: 0.6 },
      mixed: { multimedia: 0.33, text: 0.33, interactive: 0.34 }
    },
    paceAdjustments: {
      slow: 1.5,
      moderate: 1.0,
      fast: 0.7
    }
  },

  // Lionagi-specific settings
  lionagi: {
    coreModules: [
      'agents',
      'sessions',
      'tools',
      'memory',
      'reasoning',
      'planning',
      'execution'
    ],
    skillProgression: {
      beginner: ['basic-agents', 'simple-sessions', 'tool-usage'],
      intermediate: ['advanced-agents', 'complex-sessions', 'custom-tools', 'memory-management'],
      advanced: ['agent-coordination', 'distributed-sessions', 'advanced-reasoning'],
      expert: ['system-architecture', 'performance-optimization', 'enterprise-patterns']
    },
    practicalProjects: [
      'chatbot-creation',
      'data-analysis-agent',
      'workflow-automation',
      'multi-agent-system',
      'enterprise-integration'
    ]
  }
} as const;

export const API_ENDPOINTS = {
  exercises: '/api/exercises',
  progress: '/api/progress',
  playground: '/api/playground',
  concepts: '/api/concepts',
  achievements: '/api/achievements'
} as const;

export const UI_CONSTANTS = {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#f8fafc',
    surface: '#ffffff'
  },
  animations: {
    fadeIn: 'fade-in 0.3s ease-in-out',
    slideUp: 'slide-up 0.4s ease-out',
    bounce: 'bounce 0.6s ease-in-out'
  },
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px'
  }
} as const;
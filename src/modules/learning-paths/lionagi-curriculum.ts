/**
 * Comprehensive Learning Curriculum for lionagi SDK
 * Based on progressive complexity levels from SDK analysis
 */

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  concepts: string[];
  exercises: any[];
  difficulty: number;
  estimatedMinutes: number;
  order: number;
}

export interface CurriculumLevel {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
  estimatedHours: number;
  modules: LearningModule[];
}

export class LionagiCurriculum {
  private levels: CurriculumLevel[] = [
    {
      id: 'beginner',
      name: 'Foundation: Basic Interactions',
      description: 'Learn core lionagi concepts: Branch, iModel, and simple conversations',
      prerequisites: ['Python basics', 'Async programming fundamentals'],
      estimatedHours: 8,
      modules: [
        {
          id: 'intro-lionagi',
          title: 'Introduction to lionagi',
          description: 'Understanding AI orchestration and lionagi philosophy',
          concepts: ['AI agents', 'LLM orchestration', 'lionagi ecosystem'],
          exercises: [],
          difficulty: 0.2,
          estimatedMinutes: 30,
          order: 1
        },
        {
          id: 'first-branch',
          title: 'Creating Your First Branch',
          description: 'Learn to create and use the Branch conversational interface',
          concepts: ['Branch class', 'System prompts', 'Basic communication'],
          exercises: [],
          difficulty: 0.3,
          estimatedMinutes: 60,
          order: 2
        }
      ]
    },
    {
      id: 'intermediate',
      name: 'Structured Interactions',
      description: 'Master structured responses, tools, and conversation management',
      prerequisites: ['beginner'],
      estimatedHours: 12,
      modules: [
        {
          id: 'pydantic-integration',
          title: 'Structured Responses with Pydantic',
          description: 'Generate validated, structured outputs from AI',
          concepts: ['Pydantic models', 'Response formats', 'Validation'],
          exercises: [],
          difficulty: 0.5,
          estimatedMinutes: 75,
          order: 1
        }
      ]
    }
  ];

  getCurriculum(): CurriculumLevel[] {
    return this.levels;
  }

  getLevel(levelId: string): CurriculumLevel | undefined {
    return this.levels.find(level => level.id === levelId);
  }

  getRecommendedLevel(skillAssessment: {
    pythonSkill: number;
    asyncProgramming: number;
    aiExperience: number;
  }): string {
    const avgSkill = (skillAssessment.pythonSkill + 
                     skillAssessment.asyncProgramming + 
                     skillAssessment.aiExperience) / 3;
    
    if (avgSkill < 0.3) return 'beginner';
    if (avgSkill < 0.6) return 'intermediate';
    return 'advanced';
  }

  getNextModule(completedModules: string[], currentLevel: string): LearningModule | null {
    const level = this.getLevel(currentLevel);
    if (!level) return null;

    for (const module of level.modules) {
      if (!completedModules.includes(module.id)) {
        return module;
      }
    }
    return null;
  }

  calculateProgress(completedModules: string[]): {
    overall: number;
    byLevel: Record<string, number>;
  } {
    const totalModules = this.levels.reduce(
      (sum, level) => sum + level.modules.length, 0
    );
    
    const byLevel: Record<string, number> = {};
    
    for (const level of this.levels) {
      const levelCompleted = level.modules.filter(
        m => completedModules.includes(m.id)
      ).length;
      byLevel[level.id] = (levelCompleted / level.modules.length) * 100;
    }
    
    return {
      overall: (completedModules.length / totalModules) * 100,
      byLevel
    };
  }

  getLearningPath(goal: 'chatbot' | 'research' | 'automation' | 'full'): string[] {
    const paths: Record<string, string[]> = {
      chatbot: ['intro-lionagi', 'first-branch'],
      research: ['intro-lionagi', 'first-branch', 'pydantic-integration'],
      automation: ['intro-lionagi', 'first-branch', 'pydantic-integration'],
      full: this.levels.flatMap(level => level.modules.map(m => m.id))
    };
    
    return paths[goal] || paths.full;
  }
}
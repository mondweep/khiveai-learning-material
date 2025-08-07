/**
 * Exercise Generation System for dynamic content creation
 */

import { 
  Exercise, 
  GeneratedExercise, 
  TestCase, 
  Hint, 
  ExerciseType,
  SkillLevel 
} from '../../types/learning';
import { generateId, randomSelection } from '../../utils/common';
import { LEARNING_CONFIG } from '../../config/learning';

export class ExerciseGenerator {
  private templates: Map<string, ExerciseTemplate> = new Map();
  private generatedExercises: Map<string, GeneratedExercise> = new Map();
  private conceptMappings: Map<string, string[]> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Generates an exercise based on concept and user parameters
   */
  async generateExercise(
    conceptId: string,
    skillLevel: SkillLevel,
    exerciseType: ExerciseType,
    userPreferences: {
      language: string;
      difficulty: number;
      focusAreas?: string[];
    }
  ): Promise<GeneratedExercise> {
    const templates = this.getTemplatesForConcept(conceptId, exerciseType, skillLevel);
    
    if (templates.length === 0) {
      throw new Error(`No templates found for concept ${conceptId} and type ${exerciseType}`);
    }

    const selectedTemplate = this.selectOptimalTemplate(templates, userPreferences);
    const parameters = await this.generateParameters(selectedTemplate, userPreferences);
    
    const exercise = await this.instantiateExercise(selectedTemplate, parameters);
    
    const generatedExercise: GeneratedExercise = {
      id: generateId('exercise'),
      generatedAt: new Date(),
      templateId: selectedTemplate.id,
      parameters,
      exercise,
      difficulty: this.calculateActualDifficulty(exercise, userPreferences.difficulty),
      estimatedSolvingTime: this.estimateSolvingTime(exercise, skillLevel)
    };

    this.generatedExercises.set(generatedExercise.id, generatedExercise);
    return generatedExercise;
  }

  /**
   * Generates multiple exercises for a concept with progressive difficulty
   */
  async generateExerciseSeries(
    conceptId: string,
    skillLevel: SkillLevel,
    count: number,
    userPreferences: {
      language: string;
      progressiveIncrease: boolean;
      mixedTypes: boolean;
    }
  ): Promise<GeneratedExercise[]> {
    const exercises: GeneratedExercise[] = [];
    const exerciseTypes: ExerciseType[] = userPreferences.mixedTypes 
      ? ['coding', 'multiple-choice', 'fill-blank']
      : ['coding'];

    for (let i = 0; i < count; i++) {
      const difficulty = userPreferences.progressiveIncrease 
        ? 0.3 + (i / count) * 0.6  // Progress from 0.3 to 0.9
        : 0.5; // Consistent difficulty

      const exerciseType = exerciseTypes[i % exerciseTypes.length];
      
      const exercise = await this.generateExercise(conceptId, skillLevel, exerciseType, {
        language: userPreferences.language,
        difficulty
      });

      exercises.push(exercise);
    }

    return exercises;
  }

  /**
   * Generates adaptive exercise based on user's recent performance
   */
  async generateAdaptiveExercise(
    userId: string,
    conceptId: string,
    recentPerformance: number[],
    weakAreas: string[]
  ): Promise<GeneratedExercise> {
    const averagePerformance = recentPerformance.reduce((sum, score) => sum + score, 0) / recentPerformance.length;
    
    // Adjust difficulty based on performance
    let targetDifficulty = averagePerformance;
    if (averagePerformance > 0.8) {
      targetDifficulty = Math.min(1.0, targetDifficulty + 0.2);
    } else if (averagePerformance < 0.4) {
      targetDifficulty = Math.max(0.1, targetDifficulty - 0.1);
    }

    // Determine skill level from performance
    const skillLevel = this.inferSkillLevel(averagePerformance, recentPerformance.length);

    // Focus on weak areas
    const focusAreas = weakAreas.length > 0 ? randomSelection(weakAreas, 2) : undefined;

    return this.generateExercise(conceptId, skillLevel, 'coding', {
      language: 'python', // Default, could be user preference
      difficulty: targetDifficulty,
      focusAreas
    });
  }

  /**
   * Creates a custom exercise template
   */
  createTemplate(template: Partial<ExerciseTemplate>): ExerciseTemplate {
    const fullTemplate: ExerciseTemplate = {
      id: template.id || generateId('template'),
      name: template.name || 'Custom Template',
      description: template.description || '',
      conceptIds: template.conceptIds || [],
      exerciseType: template.exerciseType || 'coding',
      skillLevels: template.skillLevels || ['intermediate'],
      parameters: template.parameters || [],
      instructionTemplate: template.instructionTemplate || '',
      codeTemplate: template.codeTemplate || '',
      solutionTemplate: template.solutionTemplate || '',
      testTemplate: template.testTemplate || '',
      hintTemplates: template.hintTemplates || [],
      difficultyFactors: template.difficultyFactors || {}
    };

    this.templates.set(fullTemplate.id, fullTemplate);
    return fullTemplate;
  }

  /**
   * Initializes default exercise templates
   */
  private initializeTemplates(): void {
    // Python function implementation template
    this.createTemplate({
      id: 'python-function-basic',
      name: 'Basic Python Function',
      description: 'Create a simple function that performs a specific task',
      conceptIds: ['functions', 'basic-syntax'],
      exerciseType: 'coding',
      skillLevels: ['beginner', 'intermediate'],
      parameters: [
        { name: 'functionName', type: 'string', values: ['calculate', 'process', 'convert', 'validate'] },
        { name: 'inputType', type: 'string', values: ['number', 'string', 'list'] },
        { name: 'operation', type: 'string', values: ['sum', 'reverse', 'filter', 'transform'] }
      ],
      instructionTemplate: 'Create a function called `{{functionName}}` that takes a {{inputType}} as input and {{operation}}s it.',
      codeTemplate: `def {{functionName}}({{inputParam}}):\n    # Your code here\n    pass`,
      solutionTemplate: `def {{functionName}}({{inputParam}}):\n    {{solutionBody}}`,
      testTemplate: `assert {{functionName}}({{testInput}}) == {{expectedOutput}}, "Test failed for input {{testInput}}"`,
      hintTemplates: [
        'Remember to define your function with the correct parameters',
        'Think about what operation you need to perform on the input',
        'Don\'t forget to return a value from your function'
      ]
    });

    // Lionagi agent creation template
    this.createTemplate({
      id: 'lionagi-agent-basic',
      name: 'Basic Lionagi Agent',
      description: 'Create and configure a simple Lionagi agent',
      conceptIds: ['agents', 'lionagi-basics'],
      exerciseType: 'coding',
      skillLevels: ['beginner', 'intermediate', 'advanced'],
      parameters: [
        { name: 'agentRole', type: 'string', values: ['assistant', 'analyzer', 'coordinator', 'specialist'] },
        { name: 'capability', type: 'string', values: ['text_analysis', 'data_processing', 'task_management', 'decision_making'] },
        { name: 'model', type: 'string', values: ['gpt-4', 'claude-3', 'local-llm'] }
      ],
      instructionTemplate: 'Create a Lionagi {{agentRole}} agent with {{capability}} capability using the {{model}} model.',
      codeTemplate: `from lionagi import Agent\n\n# Create your {{agentRole}} agent here\nagent = Agent(\n    # Add configuration\n)\n\n# Test the agent\nresult = agent.run("test message")`,
      solutionTemplate: `from lionagi import Agent\n\nagent = Agent(\n    role="{{agentRole}}",\n    capabilities=["{{capability}}"],\n    model="{{model}}"\n)\n\nresult = agent.run("test message")`,
      testTemplate: `assert isinstance(agent, Agent), "Should create an Agent instance"\nassert "{{capability}}" in agent.capabilities, "Should have correct capability"`,
      hintTemplates: [
        'Import the Agent class from lionagi',
        'Set the role parameter to define the agent\'s purpose',
        'Add capabilities as a list of strings',
        'Specify the model to use for the agent'
      ]
    });

    // Multiple choice template
    this.createTemplate({
      id: 'multiple-choice-concept',
      name: 'Concept Understanding Quiz',
      description: 'Test understanding of key concepts',
      conceptIds: ['any'],
      exerciseType: 'multiple-choice',
      skillLevels: ['beginner', 'intermediate', 'advanced'],
      parameters: [
        { name: 'concept', type: 'string', values: ['agents', 'sessions', 'tools', 'memory'] },
        { name: 'questionType', type: 'string', values: ['definition', 'usage', 'comparison', 'best-practice'] }
      ],
      instructionTemplate: 'Select the correct answer about {{concept}}.',
      testTemplate: 'Correct answer should be option {{correctIndex}}'
    });
  }

  /**
   * Gets templates matching the criteria
   */
  private getTemplatesForConcept(
    conceptId: string, 
    exerciseType: ExerciseType, 
    skillLevel: SkillLevel
  ): ExerciseTemplate[] {
    return Array.from(this.templates.values()).filter(template => 
      (template.conceptIds.includes(conceptId) || template.conceptIds.includes('any')) &&
      template.exerciseType === exerciseType &&
      template.skillLevels.includes(skillLevel)
    );
  }

  /**
   * Selects optimal template based on user preferences
   */
  private selectOptimalTemplate(
    templates: ExerciseTemplate[], 
    preferences: { difficulty: number; focusAreas?: string[] }
  ): ExerciseTemplate {
    // Score templates based on preferences
    const scoredTemplates = templates.map(template => ({
      template,
      score: this.scoreTemplate(template, preferences)
    }));

    // Sort by score and return best match
    scoredTemplates.sort((a, b) => b.score - a.score);
    return scoredTemplates[0].template;
  }

  /**
   * Scores a template based on user preferences
   */
  private scoreTemplate(
    template: ExerciseTemplate, 
    preferences: { difficulty: number; focusAreas?: string[] }
  ): number {
    let score = 1.0;

    // Adjust for focus areas
    if (preferences.focusAreas) {
      const overlap = template.conceptIds.filter(id => 
        preferences.focusAreas!.includes(id)
      ).length;
      score += overlap * 0.5;
    }

    // Adjust for template complexity matching target difficulty
    const templateComplexity = this.estimateTemplateComplexity(template);
    const difficultyMatch = 1 - Math.abs(templateComplexity - preferences.difficulty);
    score *= difficultyMatch;

    return score;
  }

  /**
   * Estimates template complexity
   */
  private estimateTemplateComplexity(template: ExerciseTemplate): number {
    let complexity = 0.5; // Base complexity

    // Adjust based on number of parameters
    complexity += template.parameters.length * 0.1;

    // Adjust based on code template complexity
    if (template.codeTemplate) {
      const lines = template.codeTemplate.split('\n').length;
      complexity += lines * 0.02;
    }

    // Adjust based on number of concepts
    complexity += template.conceptIds.length * 0.05;

    return Math.min(1.0, complexity);
  }

  /**
   * Generates parameters for a template
   */
  private async generateParameters(
    template: ExerciseTemplate,
    preferences: { language: string; difficulty: number }
  ): Promise<Record<string, any>> {
    const parameters: Record<string, any> = {};

    for (const param of template.parameters) {
      if (param.type === 'string' && param.values) {
        parameters[param.name] = randomSelection(param.values, 1)[0];
      } else if (param.type === 'number' && param.range) {
        const [min, max] = param.range;
        parameters[param.name] = Math.floor(Math.random() * (max - min + 1)) + min;
      } else if (param.type === 'boolean') {
        parameters[param.name] = Math.random() > 0.5;
      }
    }

    // Add language-specific parameters
    parameters.language = preferences.language;
    parameters.difficulty = preferences.difficulty;

    return parameters;
  }

  /**
   * Instantiates an exercise from template and parameters
   */
  private async instantiateExercise(
    template: ExerciseTemplate,
    parameters: Record<string, any>
  ): Promise<Exercise> {
    const exercise: Exercise = {
      id: generateId('exercise'),
      title: this.renderTemplate(template.name, parameters),
      description: this.renderTemplate(template.description, parameters),
      type: template.exerciseType,
      difficulty: parameters.difficulty,
      estimatedTime: this.estimateTime(template, parameters.difficulty),
      instructions: [this.renderTemplate(template.instructionTemplate, parameters)],
      starterCode: template.codeTemplate ? this.renderTemplate(template.codeTemplate, parameters) : undefined,
      solution: this.renderTemplate(template.solutionTemplate, parameters),
      tests: await this.generateTests(template, parameters),
      hints: this.generateHints(template, parameters),
      conceptsReinforced: template.conceptIds
    };

    return exercise;
  }

  /**
   * Renders a template string with parameters
   */
  private renderTemplate(template: string, parameters: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return parameters[key] || match;
    });
  }

  /**
   * Generates test cases for an exercise
   */
  private async generateTests(
    template: ExerciseTemplate,
    parameters: Record<string, any>
  ): Promise<TestCase[]> {
    const tests: TestCase[] = [];

    if (template.testTemplate) {
      // Generate multiple test cases with different inputs
      const testData = this.generateTestData(parameters);
      
      testData.forEach((data, index) => {
        tests.push({
          id: generateId('test'),
          input: data.input,
          expectedOutput: data.expectedOutput,
          description: `Test case ${index + 1}`,
          hidden: index > 1 // Hide tests after the first two
        });
      });
    }

    return tests;
  }

  /**
   * Generates test data based on parameters
   */
  private generateTestData(parameters: Record<string, any>): Array<{input: any; expectedOutput: any}> {
    const testData = [];
    
    // Generate basic test cases based on operation type
    if (parameters.operation === 'sum') {
      testData.push(
        { input: [1, 2, 3], expectedOutput: 6 },
        { input: [0], expectedOutput: 0 },
        { input: [-1, 1, -1], expectedOutput: -1 },
        { input: [10, 20, 30], expectedOutput: 60 }
      );
    } else if (parameters.operation === 'reverse') {
      testData.push(
        { input: 'hello', expectedOutput: 'olleh' },
        { input: 'a', expectedOutput: 'a' },
        { input: '', expectedOutput: '' },
        { input: '12345', expectedOutput: '54321' }
      );
    } else {
      // Default test cases
      testData.push(
        { input: 'test', expectedOutput: 'expected' },
        { input: 42, expectedOutput: 84 },
        { input: [], expectedOutput: [] }
      );
    }

    return testData.slice(0, 4); // Limit to 4 test cases
  }

  /**
   * Generates hints for an exercise
   */
  private generateHints(template: ExerciseTemplate, parameters: Record<string, any>): Hint[] {
    return template.hintTemplates.map((hintTemplate, index) => ({
      id: generateId('hint'),
      level: index + 1,
      content: this.renderTemplate(hintTemplate, parameters),
      triggeredAfterAttempts: (index + 1) * 2
    }));
  }

  /**
   * Calculates actual difficulty of generated exercise
   */
  private calculateActualDifficulty(exercise: Exercise, targetDifficulty: number): number {
    let actualDifficulty = targetDifficulty;

    // Adjust based on number of test cases
    actualDifficulty += exercise.tests.length * 0.05;

    // Adjust based on code complexity
    if (exercise.starterCode) {
      const complexity = this.estimateCodeComplexity(exercise.starterCode);
      actualDifficulty += complexity * 0.1;
    }

    // Adjust based on number of concepts
    actualDifficulty += exercise.conceptsReinforced.length * 0.02;

    return Math.min(1.0, Math.max(0.1, actualDifficulty));
  }

  /**
   * Estimates code complexity (reused from concept framework)
   */
  private estimateCodeComplexity(code: string): number {
    let complexity = 1;
    
    const controlStructures = code.match(/(if|for|while|try|catch|switch|case)/g);
    complexity += (controlStructures?.length || 0) * 2;
    
    const functions = code.match(/(def|function|class|=>)/g);
    complexity += (functions?.length || 0) * 1.5;
    
    const lines = code.split('\n').length;
    complexity += lines * 0.1;
    
    return complexity;
  }

  /**
   * Estimates solving time for an exercise
   */
  private estimateSolvingTime(exercise: Exercise, skillLevel: SkillLevel): number {
    let baseTime = 10; // 10 minutes base

    // Adjust for skill level
    const skillMultipliers: Record<SkillLevel, number> = {
      beginner: 2.0,
      intermediate: 1.0,
      advanced: 0.7,
      expert: 0.5
    };
    baseTime *= skillMultipliers[skillLevel];

    // Adjust for exercise type
    const typeMultipliers: Record<ExerciseType, number> = {
      coding: 1.0,
      'multiple-choice': 0.2,
      'drag-drop': 0.3,
      'fill-blank': 0.4,
      project: 3.0
    };
    baseTime *= typeMultipliers[exercise.type];

    // Adjust for difficulty
    baseTime *= (0.5 + exercise.difficulty);

    // Adjust for number of test cases
    baseTime += exercise.tests.length * 2;

    return Math.ceil(baseTime);
  }

  /**
   * Estimates time for template instantiation
   */
  private estimateTime(template: ExerciseTemplate, difficulty: number): number {
    let baseTime = 5;
    
    baseTime += template.parameters.length * 2;
    baseTime *= (0.5 + difficulty);
    
    if (template.exerciseType === 'coding') {
      baseTime *= 2;
    }
    
    return Math.ceil(baseTime);
  }

  /**
   * Infers skill level from performance data
   */
  private inferSkillLevel(averagePerformance: number, sampleSize: number): SkillLevel {
    if (sampleSize < 3) return 'beginner';
    
    if (averagePerformance >= 0.8) return 'advanced';
    if (averagePerformance >= 0.6) return 'intermediate';
    return 'beginner';
  }

  /**
   * Gets exercise analytics
   */
  getExerciseAnalytics(exerciseId: string): ExerciseAnalytics | null {
    const exercise = this.generatedExercises.get(exerciseId);
    if (!exercise) return null;

    // In a real application, this would query attempt data
    return {
      exerciseId,
      totalAttempts: 0,
      successRate: 0,
      averageAttempts: 0,
      averageTimeToSolve: exercise.estimatedSolvingTime,
      commonMistakes: [],
      difficultyRating: exercise.difficulty
    };
  }

  /**
   * Bulk generate exercises for a learning path
   */
  async generateLearningPath(
    conceptIds: string[],
    skillLevel: SkillLevel,
    exercisesPerConcept: number = 3
  ): Promise<GeneratedExercise[]> {
    const exercises: GeneratedExercise[] = [];

    for (const conceptId of conceptIds) {
      const conceptExercises = await this.generateExerciseSeries(
        conceptId,
        skillLevel,
        exercisesPerConcept,
        {
          language: 'python',
          progressiveIncrease: true,
          mixedTypes: true
        }
      );
      exercises.push(...conceptExercises);
    }

    return exercises;
  }
}

// Additional interfaces
interface ExerciseTemplate {
  id: string;
  name: string;
  description: string;
  conceptIds: string[];
  exerciseType: ExerciseType;
  skillLevels: SkillLevel[];
  parameters: TemplateParameter[];
  instructionTemplate: string;
  codeTemplate?: string;
  solutionTemplate: string;
  testTemplate?: string;
  hintTemplates: string[];
  difficultyFactors?: Record<string, number>;
}

interface TemplateParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  values?: any[];
  range?: [number, number];
  required?: boolean;
}

interface ExerciseAnalytics {
  exerciseId: string;
  totalAttempts: number;
  successRate: number;
  averageAttempts: number;
  averageTimeToSolve: number;
  commonMistakes: string[];
  difficultyRating: number;
}
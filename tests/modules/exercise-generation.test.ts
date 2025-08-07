/**
 * Tests for Exercise Generator
 */

import { ExerciseGenerator } from '../../src/modules/exercise-generation/generator';

describe('ExerciseGenerator', () => {
  let generator: ExerciseGenerator;
  
  beforeEach(() => {
    generator = new ExerciseGenerator();
  });

  describe('generateExercise', () => {
    it('should generate a coding exercise for beginners', async () => {
      const exercise = await generator.generateExercise(
        'functions',
        'beginner',
        'coding',
        { language: 'python', difficulty: 0.3 }
      );
      
      expect(exercise).toBeDefined();
      expect(exercise.exercise.type).toBe('coding');
      expect(exercise.exercise.difficulty).toBeLessThan(0.5);
      expect(exercise.exercise.starterCode).toContain('def ');
    });

    it('should generate appropriate test cases', async () => {
      const exercise = await generator.generateExercise(
        'functions',
        'intermediate',
        'coding',
        { language: 'python', difficulty: 0.5 }
      );
      
      expect(exercise.exercise.tests.length).toBeGreaterThan(0);
      expect(exercise.exercise.tests[0]).toHaveProperty('input');
      expect(exercise.exercise.tests[0]).toHaveProperty('expectedOutput');
    });

    it('should include helpful hints', async () => {
      const exercise = await generator.generateExercise(
        'functions',
        'beginner',
        'coding',
        { language: 'python', difficulty: 0.3 }
      );
      
      expect(exercise.exercise.hints.length).toBeGreaterThan(0);
      expect(exercise.exercise.hints[0].level).toBe(1);
      expect(exercise.exercise.hints[0].content).toBeTruthy();
    });
  });

  describe('generateExerciseSeries', () => {
    it('should generate multiple exercises with progressive difficulty', async () => {
      const exercises = await generator.generateExerciseSeries(
        'functions',
        'intermediate',
        3,
        { language: 'python', progressiveIncrease: true, mixedTypes: false }
      );
      
      expect(exercises.length).toBe(3);
      
      // Check that difficulty increases
      for (let i = 1; i < exercises.length; i++) {
        expect(exercises[i].difficulty).toBeGreaterThanOrEqual(exercises[i-1].difficulty);
      }
    });

    it('should generate mixed exercise types when requested', async () => {
      const exercises = await generator.generateExerciseSeries(
        'functions',
        'intermediate',
        4,
        { language: 'python', progressiveIncrease: false, mixedTypes: true }
      );
      
      const types = new Set(exercises.map(e => e.exercise.type));
      expect(types.size).toBeGreaterThan(1);
    });
  });

  describe('generateAdaptiveExercise', () => {
    it('should adjust difficulty based on performance', async () => {
      const highPerformance = [0.9, 0.85, 0.95, 0.8, 0.9];
      const exercise = await generator.generateAdaptiveExercise(
        'user1',
        'functions',
        highPerformance,
        []
      );
      
      expect(exercise.difficulty).toBeGreaterThan(0.7);
    });

    it('should lower difficulty for poor performance', async () => {
      const poorPerformance = [0.2, 0.3, 0.1, 0.4, 0.2];
      const exercise = await generator.generateAdaptiveExercise(
        'user1',
        'functions',
        poorPerformance,
        []
      );
      
      expect(exercise.difficulty).toBeLessThan(0.4);
    });
  });

  describe('generateLearningPath', () => {
    it('should create exercises for multiple concepts', async () => {
      const exercises = await generator.generateLearningPath(
        ['functions', 'loops', 'data-structures'],
        'intermediate',
        2
      );
      
      expect(exercises.length).toBe(6); // 3 concepts × 2 exercises each
      
      const conceptsUsed = new Set(
        exercises.flatMap(e => e.exercise.conceptsReinforced)
      );
      expect(conceptsUsed.size).toBeGreaterThan(2);
    });
  });

  describe('createTemplate', () => {
    it('should create and store a custom template', () => {
      const template = generator.createTemplate({
        name: 'Custom Test Template',
        description: 'A test template',
        conceptIds: ['test-concept'],
        exerciseType: 'coding',
        skillLevels: ['beginner'],
        parameters: [],
        instructionTemplate: 'Do something',
        solutionTemplate: 'Solution here'
      });
      
      expect(template.id).toBeDefined();
      expect(template.name).toBe('Custom Test Template');
      expect(template.conceptIds).toContain('test-concept');
    });
  });
});
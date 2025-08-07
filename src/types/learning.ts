/**
 * Core types for the lionagi learning system
 */

export interface User {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
  progress: UserProgress;
}

export interface UserProfile {
  skillLevel: SkillLevel;
  learningPreferences: LearningPreferences;
  completedModules: string[];
  currentStreak: number;
  totalTimeSpent: number;
}

export interface UserProgress {
  moduleProgress: Record<string, ModuleProgress>;
  overallScore: number;
  achievements: Achievement[];
  weakAreas: string[];
  strongAreas: string[];
}

export interface ModuleProgress {
  moduleId: string;
  completionPercentage: number;
  exercisesCompleted: number;
  averageScore: number;
  timeSpent: number;
  lastAccessed: Date;
  conceptsMastered: string[];
  conceptsInProgress: string[];
}

export interface LearningPreferences {
  preferredLanguage: 'typescript' | 'python' | 'javascript';
  learningStyle: 'visual' | 'textual' | 'interactive' | 'mixed';
  pacePreference: 'slow' | 'moderate' | 'fast';
  difficultyPreference: 'gradual' | 'challenging';
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  skillLevel: SkillLevel;
  prerequisites: string[];
  estimatedDuration: number;
  concepts: Concept[];
  exercises: Exercise[];
  assessments: Assessment[];
}

export interface Concept {
  id: string;
  title: string;
  description: string;
  content: ConceptContent;
  examples: CodeExample[];
  relatedConcepts: string[];
  difficulty: number;
}

export interface ConceptContent {
  text: string;
  multimedia?: MultimediaContent[];
  interactiveElements?: InteractiveElement[];
}

export interface MultimediaContent {
  type: 'image' | 'video' | 'animation' | 'diagram';
  url: string;
  caption?: string;
  alt?: string;
}

export interface InteractiveElement {
  type: 'quiz' | 'drag-drop' | 'fill-blank' | 'code-snippet';
  data: any;
}

export interface CodeExample {
  id: string;
  title: string;
  code: string;
  language: string;
  explanation: string;
  runnable: boolean;
  expectedOutput?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: ExerciseType;
  difficulty: number;
  estimatedTime: number;
  instructions: string[];
  starterCode?: string;
  solution: string;
  tests: TestCase[];
  hints: Hint[];
  conceptsReinforced: string[];
}

export type ExerciseType = 'coding' | 'multiple-choice' | 'drag-drop' | 'fill-blank' | 'project';

export interface TestCase {
  id: string;
  input: any;
  expectedOutput: any;
  description: string;
  hidden: boolean;
}

export interface Hint {
  id: string;
  level: number;
  content: string;
  triggeredAfterAttempts: number;
}

export interface Assessment {
  id: string;
  title: string;
  type: 'formative' | 'summative';
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'code-completion' | 'debugging' | 'explanation';
  content: string;
  options?: string[];
  correctAnswer: any;
  explanation: string;
  points: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: Date;
  type: 'skill' | 'streak' | 'completion' | 'speed' | 'perfect';
}

export interface DifficultyAdjustment {
  userId: string;
  moduleId: string;
  previousDifficulty: number;
  newDifficulty: number;
  reason: string;
  timestamp: Date;
  performanceMetrics: PerformanceMetrics;
}

export interface PerformanceMetrics {
  accuracy: number;
  speed: number;
  consistency: number;
  engagement: number;
  frustrationLevel: number;
}

export interface PlaygroundSession {
  id: string;
  userId: string;
  code: string;
  language: string;
  output: string;
  errors: string[];
  executionTime: number;
  createdAt: Date;
  shared: boolean;
}

export interface GeneratedExercise {
  id: string;
  generatedAt: Date;
  templateId: string;
  parameters: Record<string, any>;
  exercise: Exercise;
  difficulty: number;
  estimatedSolvingTime: number;
}
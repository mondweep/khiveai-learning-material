/**
 * Concept Explanation Framework for adaptive learning content delivery
 */

import { 
  Concept, 
  ConceptContent, 
  MultimediaContent, 
  InteractiveElement, 
  CodeExample, 
  LearningPreferences,
  SkillLevel 
} from '../../types/learning';
import { generateId, calculateTextSimilarity } from '../../utils/common';
import { LEARNING_CONFIG } from '../../config/learning';

export class ConceptExplanationFramework {
  private concepts: Map<string, Concept> = new Map();
  private userInteractions: Map<string, ConceptInteraction[]> = new Map();
  private conceptDependencies: Map<string, string[]> = new Map();

  /**
   * Creates or updates a concept with adaptive content
   */
  async createConcept(conceptData: Partial<Concept>): Promise<Concept> {
    const concept: Concept = {
      id: conceptData.id || generateId('concept'),
      title: conceptData.title || 'Untitled Concept',
      description: conceptData.description || '',
      content: conceptData.content || { text: '' },
      examples: conceptData.examples || [],
      relatedConcepts: conceptData.relatedConcepts || [],
      difficulty: conceptData.difficulty || 0.5
    };

    this.concepts.set(concept.id, concept);
    return concept;
  }

  /**
   * Generates personalized explanation for a user
   */
  async generatePersonalizedExplanation(
    conceptId: string,
    userPreferences: LearningPreferences,
    skillLevel: SkillLevel,
    priorKnowledge: string[] = []
  ): Promise<PersonalizedExplanation> {
    const concept = this.concepts.get(conceptId);
    if (!concept) {
      throw new Error(`Concept ${conceptId} not found`);
    }

    // Get user's learning style weights
    const styleWeights = LEARNING_CONFIG.adaptation.learningStyleWeights[userPreferences.learningStyle];

    // Generate content sections based on preferences
    const sections = await this.generateContentSections(
      concept,
      styleWeights,
      skillLevel,
      priorKnowledge
    );

    // Create interactive elements based on learning style
    const interactiveElements = await this.generateInteractiveElements(
      concept,
      userPreferences,
      skillLevel
    );

    // Select appropriate examples
    const examples = this.selectRelevantExamples(
      concept.examples,
      skillLevel,
      userPreferences.preferredLanguage
    );

    return {
      conceptId,
      title: concept.title,
      sections,
      examples,
      interactiveElements,
      estimatedReadTime: this.calculateReadTime(sections),
      difficulty: concept.difficulty,
      personalizedFor: {
        skillLevel,
        learningStyle: userPreferences.learningStyle,
        language: userPreferences.preferredLanguage
      }
    };
  }

  /**
   * Generates content sections based on learning preferences
   */
  private async generateContentSections(
    concept: Concept,
    styleWeights: Record<string, number>,
    skillLevel: SkillLevel,
    priorKnowledge: string[]
  ): Promise<ContentSection[]> {
    const sections: ContentSection[] = [];

    // Introduction section (always included)
    sections.push({
      type: 'introduction',
      title: `What is ${concept.title}?`,
      content: await this.adaptContentForSkillLevel(concept.content.text, skillLevel),
      multimedia: this.selectMultimedia(concept.content.multimedia, 'introduction', styleWeights),
      weight: 1.0
    });

    // Core concept section
    sections.push({
      type: 'explanation',
      title: 'Core Concepts',
      content: await this.generateCoreExplanation(concept, skillLevel, priorKnowledge),
      multimedia: this.selectMultimedia(concept.content.multimedia, 'explanation', styleWeights),
      weight: styleWeights.text || 0.33
    });

    // Visual representation (if preferred)
    if (styleWeights.multimedia > 0.4) {
      sections.push({
        type: 'visual',
        title: 'Visual Representation',
        content: await this.generateVisualExplanation(concept),
        multimedia: this.selectMultimedia(concept.content.multimedia, 'visual', styleWeights),
        weight: styleWeights.multimedia
      });
    }

    // Interactive exploration (if preferred)
    if (styleWeights.interactive > 0.4) {
      sections.push({
        type: 'interactive',
        title: 'Interactive Exploration',
        content: 'Explore this concept through hands-on interaction.',
        multimedia: [],
        weight: styleWeights.interactive
      });
    }

    // Prerequisites (if user lacks prior knowledge)
    const missingPrereqs = this.identifyMissingPrerequisites(concept, priorKnowledge);
    if (missingPrereqs.length > 0) {
      sections.push({
        type: 'prerequisites',
        title: 'Before We Continue',
        content: await this.generatePrerequisiteExplanation(missingPrereqs),
        multimedia: [],
        weight: 0.8
      });
    }

    // Real-world applications
    sections.push({
      type: 'applications',
      title: 'Real-World Applications',
      content: await this.generateApplicationExamples(concept, skillLevel),
      multimedia: this.selectMultimedia(concept.content.multimedia, 'applications', styleWeights),
      weight: 0.7
    });

    return sections.sort((a, b) => b.weight - a.weight);
  }

  /**
   * Adapts content complexity based on skill level
   */
  private async adaptContentForSkillLevel(content: string, skillLevel: SkillLevel): Promise<string> {
    const adaptations: Record<SkillLevel, (text: string) => string> = {
      beginner: (text) => this.simplifyLanguage(text),
      intermediate: (text) => this.addTechnicalDetails(text, 'moderate'),
      advanced: (text) => this.addTechnicalDetails(text, 'detailed'),
      expert: (text) => this.addAdvancedInsights(text)
    };

    return adaptations[skillLevel](content);
  }

  /**
   * Simplifies language for beginners
   */
  private simplifyLanguage(text: string): string {
    return text
      .replace(/\b(utilize|implement|instantiate)\b/g, 'use')
      .replace(/\b(functionality|capability)\b/g, 'feature')
      .replace(/\b(parameters|arguments)\b/g, 'inputs')
      .replace(/\b(execute|invoke)\b/g, 'run')
      .replace(/complex/g, 'complicated');
  }

  /**
   * Adds technical details for intermediate/advanced users
   */
  private addTechnicalDetails(text: string, level: 'moderate' | 'detailed'): string {
    if (level === 'detailed') {
      // Add more comprehensive explanations, API references, etc.
      return `${text}\n\n**Technical Details:**\nThis concept involves several important technical considerations including implementation patterns, performance implications, and best practices that experienced developers should be aware of.`;
    }
    
    // Add moderate technical context
    return `${text}\n\n**Technical Note:**\nUnderstanding the underlying mechanics can help you use this concept more effectively in your projects.`;
  }

  /**
   * Adds advanced insights for expert users
   */
  private addAdvancedInsights(text: string): string {
    return `${text}\n\n**Advanced Insights:**\nExperienced practitioners often leverage advanced patterns and optimizations with this concept. Consider the architectural implications, scalability concerns, and integration patterns when applying this in production environments.`;
  }

  /**
   * Generates interactive elements based on preferences
   */
  private async generateInteractiveElements(
    concept: Concept,
    preferences: LearningPreferences,
    skillLevel: SkillLevel
  ): Promise<InteractiveElement[]> {
    const elements: InteractiveElement[] = [];

    // Knowledge check quiz
    elements.push({
      type: 'quiz',
      data: {
        questions: await this.generateQuizQuestions(concept, skillLevel),
        multipleChoice: true,
        feedback: true
      }
    });

    // Code manipulation (if applicable)
    if (concept.examples.length > 0) {
      elements.push({
        type: 'code-snippet',
        data: {
          code: concept.examples[0].code,
          language: preferences.preferredLanguage,
          editable: true,
          runnable: concept.examples[0].runnable
        }
      });
    }

    // Drag and drop for concept relationships
    if (concept.relatedConcepts.length > 0) {
      elements.push({
        type: 'drag-drop',
        data: {
          items: concept.relatedConcepts,
          categories: ['Prerequisites', 'Related', 'Advanced'],
          instruction: 'Categorize these related concepts'
        }
      });
    }

    return elements;
  }

  /**
   * Generates quiz questions for a concept
   */
  private async generateQuizQuestions(concept: Concept, skillLevel: SkillLevel): Promise<QuizQuestion[]> {
    const questions: QuizQuestion[] = [];
    const baseComplexity = skillLevel === 'beginner' ? 1 : skillLevel === 'intermediate' ? 2 : 3;

    // Definition question
    questions.push({
      id: generateId('quiz'),
      type: 'multiple-choice',
      question: `What best describes ${concept.title}?`,
      options: [
        concept.description,
        this.generateDistractor(concept.description, 1),
        this.generateDistractor(concept.description, 2),
        this.generateDistractor(concept.description, 3)
      ],
      correctAnswer: 0,
      explanation: `${concept.title} is defined as: ${concept.description}`,
      difficulty: baseComplexity
    });

    // Application question
    if (concept.examples.length > 0) {
      questions.push({
        id: generateId('quiz'),
        type: 'multiple-choice',
        question: `Which of the following is a valid use case for ${concept.title}?`,
        options: [
          concept.examples[0].explanation,
          'This concept has no practical applications',
          'Only for theoretical understanding',
          'Deprecated and no longer used'
        ],
        correctAnswer: 0,
        explanation: concept.examples[0].explanation,
        difficulty: baseComplexity + 1
      });
    }

    return questions;
  }

  /**
   * Generates distractor options for multiple choice questions
   */
  private generateDistractor(correctAnswer: string, variation: number): string {
    const distractors = [
      correctAnswer.replace(/\b\w+\b/, 'feature'),
      correctAnswer.replace(/enables?/g, 'prevents'),
      'A deprecated approach that is no longer recommended',
      'An advanced technique only suitable for experts'
    ];

    return distractors[variation - 1] || `Alternative definition ${variation}`;
  }

  /**
   * Selects relevant multimedia content
   */
  private selectMultimedia(
    multimedia: MultimediaContent[] | undefined,
    sectionType: string,
    styleWeights: Record<string, number>
  ): MultimediaContent[] {
    if (!multimedia || styleWeights.multimedia < 0.3) {
      return [];
    }

    return multimedia.filter(media => {
      // Filter based on section relevance
      if (sectionType === 'visual' && media.type !== 'image' && media.type !== 'diagram') {
        return false;
      }
      if (sectionType === 'explanation' && media.type === 'video') {
        return styleWeights.multimedia > 0.6;
      }
      return true;
    }).slice(0, 3); // Limit to 3 items per section
  }

  /**
   * Selects relevant code examples
   */
  private selectRelevantExamples(
    examples: CodeExample[],
    skillLevel: SkillLevel,
    preferredLanguage: string
  ): CodeExample[] {
    return examples
      .filter(example => {
        // Filter by language preference
        if (example.language !== preferredLanguage && example.language !== 'pseudocode') {
          return false;
        }
        
        // Filter by complexity (simplified heuristic)
        const complexity = this.estimateCodeComplexity(example.code);
        const maxComplexity = skillLevel === 'beginner' ? 3 : 
                             skillLevel === 'intermediate' ? 6 : 10;
        return complexity <= maxComplexity;
      })
      .slice(0, 5); // Limit to 5 examples
  }

  /**
   * Estimates code complexity (simplified heuristic)
   */
  private estimateCodeComplexity(code: string): number {
    let complexity = 1;
    
    // Count control structures
    const controlStructures = code.match(/(if|for|while|try|catch|switch|case)/g);
    complexity += (controlStructures?.length || 0) * 2;
    
    // Count function definitions
    const functions = code.match(/(def|function|class|=>)/g);
    complexity += (functions?.length || 0) * 1.5;
    
    // Count nested structures (simplified)
    const indentationLevels = code.split('\n')
      .map(line => line.match(/^\s*/)?.[0].length || 0);
    const maxIndentation = Math.max(...indentationLevels);
    complexity += maxIndentation / 4;
    
    return Math.ceil(complexity);
  }

  /**
   * Identifies missing prerequisites
   */
  private identifyMissingPrerequisites(concept: Concept, priorKnowledge: string[]): string[] {
    // Get concept dependencies
    const dependencies = this.conceptDependencies.get(concept.id) || [];
    
    // Find missing prerequisites
    return dependencies.filter(dep => !priorKnowledge.includes(dep));
  }

  /**
   * Generates prerequisite explanations
   */
  private async generatePrerequisiteExplanation(missingPrereqs: string[]): Promise<string> {
    const explanations = await Promise.all(
      missingPrereqs.map(async (prereq) => {
        const prereqConcept = this.concepts.get(prereq);
        if (prereqConcept) {
          return `**${prereqConcept.title}**: ${prereqConcept.description}`;
        }
        return `**${prereq}**: You should understand this concept first.`;
      })
    );

    return `To fully understand this concept, you should first be familiar with:\n\n${explanations.join('\n\n')}`;
  }

  /**
   * Generates real-world application examples
   */
  private async generateApplicationExamples(concept: Concept, skillLevel: SkillLevel): Promise<string> {
    const applications = [
      'Used in modern web applications for improved user experience',
      'Essential for building scalable distributed systems',
      'Commonly implemented in enterprise software solutions',
      'Popular in machine learning and AI applications',
      'Fundamental to mobile app development'
    ];

    // Select applications based on concept and skill level
    const relevantApps = applications.slice(0, skillLevel === 'beginner' ? 2 : 3);
    
    return `${concept.title} is widely used in:\n\n${relevantApps.map(app => `• ${app}`).join('\n')}`;
  }

  /**
   * Calculates estimated reading time
   */
  private calculateReadTime(sections: ContentSection[]): number {
    const wordsPerMinute = 200;
    const totalWords = sections.reduce((total, section) => {
      return total + section.content.split(' ').length;
    }, 0);
    
    return Math.ceil(totalWords / wordsPerMinute);
  }

  /**
   * Records user interaction with a concept
   */
  recordInteraction(userId: string, conceptId: string, interactionType: string, data: any): void {
    if (!this.userInteractions.has(userId)) {
      this.userInteractions.set(userId, []);
    }

    const interaction: ConceptInteraction = {
      conceptId,
      interactionType,
      timestamp: new Date(),
      data,
      duration: data.duration || 0
    };

    this.userInteractions.get(userId)!.push(interaction);
  }

  /**
   * Gets concept analytics for improvement
   */
  getConceptAnalytics(conceptId: string): ConceptAnalytics {
    const interactions = Array.from(this.userInteractions.values())
      .flat()
      .filter(interaction => interaction.conceptId === conceptId);

    const totalViews = interactions.filter(i => i.interactionType === 'view').length;
    const completions = interactions.filter(i => i.interactionType === 'complete').length;
    const averageTime = interactions.reduce((sum, i) => sum + i.duration, 0) / interactions.length;
    const struggling = interactions.filter(i => i.interactionType === 'hint_requested').length;

    return {
      conceptId,
      totalViews,
      completions,
      completionRate: totalViews > 0 ? completions / totalViews : 0,
      averageTimeSpent: averageTime,
      strugglingUsers: struggling,
      popularSections: this.getPopularSections(interactions),
      improvementSuggestions: this.generateImprovementSuggestions(interactions)
    };
  }

  /**
   * Gets popular sections from interactions
   */
  private getPopularSections(interactions: ConceptInteraction[]): string[] {
    const sectionViews = interactions
      .filter(i => i.interactionType === 'section_view')
      .reduce((acc, i) => {
        const section = i.data.section;
        acc[section] = (acc[section] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(sectionViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([section]) => section);
  }

  /**
   * Generates improvement suggestions
   */
  private generateImprovementSuggestions(interactions: ConceptInteraction[]): string[] {
    const suggestions = [];
    
    const avgTime = interactions.reduce((sum, i) => sum + i.duration, 0) / interactions.length;
    if (avgTime > 600) { // More than 10 minutes
      suggestions.push('Consider breaking this concept into smaller, more digestible sections');
    }

    const hintRequests = interactions.filter(i => i.interactionType === 'hint_requested').length;
    if (hintRequests > interactions.length * 0.3) {
      suggestions.push('Add more examples or clarify difficult sections');
    }

    const drops = interactions.filter(i => i.interactionType === 'dropped').length;
    if (drops > interactions.length * 0.2) {
      suggestions.push('Review content engagement and add more interactive elements');
    }

    return suggestions.length > 0 ? suggestions : ['Content performing well - no immediate improvements needed'];
  }
}

// Additional interfaces
interface PersonalizedExplanation {
  conceptId: string;
  title: string;
  sections: ContentSection[];
  examples: CodeExample[];
  interactiveElements: InteractiveElement[];
  estimatedReadTime: number;
  difficulty: number;
  personalizedFor: {
    skillLevel: SkillLevel;
    learningStyle: string;
    language: string;
  };
}

interface ContentSection {
  type: 'introduction' | 'explanation' | 'visual' | 'interactive' | 'prerequisites' | 'applications';
  title: string;
  content: string;
  multimedia: MultimediaContent[];
  weight: number;
}

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
}

interface ConceptInteraction {
  conceptId: string;
  interactionType: string;
  timestamp: Date;
  data: any;
  duration: number;
}

interface ConceptAnalytics {
  conceptId: string;
  totalViews: number;
  completions: number;
  completionRate: number;
  averageTimeSpent: number;
  strugglingUsers: number;
  popularSections: string[];
  improvementSuggestions: string[];
}
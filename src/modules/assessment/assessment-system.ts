/**
 * Assessment System for lionagi Learning Platform
 * Comprehensive evaluation and progress tracking
 */

import { UserProfile, PerformanceMetrics } from '../../types/learning';
import { LionagiCodeAnalyzer } from '../code-analysis/analyzer';
import { AdaptiveDifficultyEngine } from '../adaptive-difficulty/engine';

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'coding' | 'project' | 'mixed';
  difficulty: number;
  timeLimit?: number; // in minutes
  questions: AssessmentQuestion[];
  passingScore: number;
  rubric: AssessmentRubric;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple-choice' | 'code' | 'short-answer' | 'debugging';
  question: string;
  points: number;
  timeEstimate: number;
  hints?: string[];
  context?: string;
  options?: string[]; // for multiple-choice
  starterCode?: string; // for coding questions
  testCases?: TestCase[]; // for coding questions
  correctAnswer?: any;
}

export interface TestCase {
  input: any;
  expectedOutput: any;
  points: number;
  hidden?: boolean;
}

export interface AssessmentRubric {
  criteria: RubricCriterion[];
  totalPoints: number;
  gradingScale: GradingScale;
}

export interface RubricCriterion {
  name: string;
  description: string;
  maxPoints: number;
  weight: number;
  subCriteria?: SubCriterion[];
}

export interface SubCriterion {
  name: string;
  points: number;
  description: string;
}

export interface GradingScale {
  A: number; // 90-100
  B: number; // 80-89
  C: number; // 70-79
  D: number; // 60-69
  F: number; // 0-59
}

export interface AssessmentResult {
  assessmentId: string;
  userId: string;
  score: number;
  percentage: number;
  grade: string;
  passed: boolean;
  timeSpent: number;
  completedAt: Date;
  answers: AnswerRecord[];
  feedback: AssessmentFeedback;
  recommendations: string[];
}

export interface AnswerRecord {
  questionId: string;
  answer: any;
  correct: boolean;
  pointsEarned: number;
  feedback?: string;
  executionResults?: any; // for coding questions
}

export interface AssessmentFeedback {
  overall: string;
  strengths: string[];
  improvements: string[];
  detailedFeedback: QuestionFeedback[];
}

export interface QuestionFeedback {
  questionId: string;
  feedback: string;
  suggestions?: string[];
}

export class AssessmentSystem {
  private codeAnalyzer: LionagiCodeAnalyzer;
  private difficultyEngine: AdaptiveDifficultyEngine;
  private assessments: Map<string, Assessment> = new Map();

  constructor() {
    this.codeAnalyzer = new LionagiCodeAnalyzer();
    this.difficultyEngine = new AdaptiveDifficultyEngine();
    this.initializeAssessments();
  }

  /**
   * Initialize pre-built assessments
   */
  private initializeAssessments() {
    // Beginner Assessment
    this.assessments.set('beginner-final', {
      id: 'beginner-final',
      title: 'Foundation Level Assessment',
      description: 'Test your understanding of basic lionagi concepts',
      type: 'mixed',
      difficulty: 0.3,
      timeLimit: 60,
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What is the primary purpose of a Branch in lionagi?',
          points: 10,
          timeEstimate: 2,
          options: [
            'To manage database connections',
            'To handle conversation state and AI model interactions',
            'To create web servers',
            'To compile Python code'
          ],
          correctAnswer: 1
        },
        {
          id: 'q2',
          type: 'code',
          question: 'Create a Branch with a system prompt that makes the AI act as a Python tutor',
          points: 20,
          timeEstimate: 5,
          starterCode: `from lionagi import Branch, iModel
import asyncio

async def create_tutor():
    # TODO: Create your Branch here
    
    # Test the branch
    response = await branch.communicate("Explain variables in Python")
    return response

asyncio.run(create_tutor())`,
          testCases: [
            {
              input: 'branch creation',
              expectedOutput: 'Branch object created',
              points: 10,
              hidden: false
            },
            {
              input: 'system prompt',
              expectedOutput: 'Contains tutor/teacher/educator',
              points: 10,
              hidden: false
            }
          ]
        },
        {
          id: 'q3',
          type: 'debugging',
          question: 'Fix the async/await errors in this code',
          points: 15,
          timeEstimate: 3,
          starterCode: `from lionagi import Branch, iModel

def chat():
    branch = Branch(system="Helper")
    response = branch.communicate("Hello")
    print(response)

chat()`,
          correctAnswer: `from lionagi import Branch, iModel
import asyncio

async def chat():
    branch = Branch(system="Helper", chat_model=iModel(provider="openai", model="gpt-4"))
    response = await branch.communicate("Hello")
    print(response)

asyncio.run(chat())`
        }
      ],
      rubric: {
        criteria: [
          {
            name: 'Conceptual Understanding',
            description: 'Understanding of lionagi core concepts',
            maxPoints: 30,
            weight: 0.3,
            subCriteria: [
              { name: 'Branch concept', points: 10, description: 'Understands Branch purpose' },
              { name: 'Async patterns', points: 10, description: 'Understands async/await' },
              { name: 'Model abstraction', points: 10, description: 'Understands iModel' }
            ]
          },
          {
            name: 'Practical Application',
            description: 'Ability to write working lionagi code',
            maxPoints: 40,
            weight: 0.4,
            subCriteria: [
              { name: 'Code correctness', points: 20, description: 'Code runs without errors' },
              { name: 'Proper syntax', points: 10, description: 'Uses correct Python/lionagi syntax' },
              { name: 'Best practices', points: 10, description: 'Follows lionagi best practices' }
            ]
          },
          {
            name: 'Problem Solving',
            description: 'Ability to debug and fix issues',
            maxPoints: 30,
            weight: 0.3,
            subCriteria: [
              { name: 'Error identification', points: 15, description: 'Identifies issues correctly' },
              { name: 'Solution quality', points: 15, description: 'Provides working solutions' }
            ]
          }
        ],
        totalPoints: 100,
        gradingScale: {
          A: 90,
          B: 80,
          C: 70,
          D: 60,
          F: 0
        }
      }
    });

    // Intermediate Assessment
    this.assessments.set('intermediate-final', {
      id: 'intermediate-final',
      title: 'Intermediate Level Assessment',
      description: 'Test your skills with tools, structured responses, and multi-model orchestration',
      type: 'project',
      difficulty: 0.6,
      timeLimit: 90,
      passingScore: 75,
      questions: [
        {
          id: 'q1',
          type: 'code',
          question: 'Create a Branch that uses Pydantic for structured book recommendations',
          points: 30,
          timeEstimate: 15,
          context: 'Build a system that returns structured book recommendations',
          starterCode: `from lionagi import Branch, iModel
from pydantic import BaseModel
from typing import List
import asyncio

# TODO: Define a Pydantic model for book recommendations
class BookRecommendation(BaseModel):
    pass

async def get_recommendations(genre: str):
    # TODO: Create branch and get structured recommendations
    pass

asyncio.run(get_recommendations("science fiction"))`,
          testCases: [
            {
              input: 'pydantic model',
              expectedOutput: 'Valid BookRecommendation model',
              points: 10,
              hidden: false
            },
            {
              input: 'response_format usage',
              expectedOutput: 'Uses response_format parameter',
              points: 10,
              hidden: false
            },
            {
              input: 'structured output',
              expectedOutput: 'Returns structured data',
              points: 10,
              hidden: false
            }
          ]
        },
        {
          id: 'q2',
          type: 'code',
          question: 'Implement a tool and use it with branch.operate()',
          points: 35,
          timeEstimate: 20,
          context: 'Create a calculator tool and integrate it with lionagi',
          starterCode: `from lionagi import Branch, iModel
import asyncio

# TODO: Create calculator tool functions

async def use_calculator():
    branch = Branch(
        system="You are a math assistant with calculation tools",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    # TODO: Register tools and use operate()
    
asyncio.run(use_calculator())`,
          testCases: [
            {
              input: 'tool definition',
              expectedOutput: 'Calculator tool defined',
              points: 15,
              hidden: false
            },
            {
              input: 'tool registration',
              expectedOutput: 'Tools registered with branch',
              points: 10,
              hidden: false
            },
            {
              input: 'operate usage',
              expectedOutput: 'Uses branch.operate()',
              points: 10,
              hidden: false
            }
          ]
        }
      ],
      rubric: {
        criteria: [
          {
            name: 'Advanced Features',
            description: 'Use of advanced lionagi features',
            maxPoints: 40,
            weight: 0.4,
            subCriteria: [
              { name: 'Pydantic integration', points: 20, description: 'Proper use of structured responses' },
              { name: 'Tool integration', points: 20, description: 'Successful tool implementation' }
            ]
          },
          {
            name: 'Code Quality',
            description: 'Quality and maintainability of code',
            maxPoints: 30,
            weight: 0.3,
            subCriteria: [
              { name: 'Clean code', points: 15, description: 'Readable and well-organized' },
              { name: 'Error handling', points: 15, description: 'Proper error handling' }
            ]
          },
          {
            name: 'Problem Solving',
            description: 'Creative and effective solutions',
            maxPoints: 30,
            weight: 0.3,
            subCriteria: [
              { name: 'Solution completeness', points: 15, description: 'Fully solves the problem' },
              { name: 'Innovation', points: 15, description: 'Creative approach' }
            ]
          }
        ],
        totalPoints: 100,
        gradingScale: {
          A: 90,
          B: 80,
          C: 75,
          D: 65,
          F: 0
        }
      }
    });
  }

  /**
   * Create a custom assessment
   */
  createAssessment(assessment: Assessment): void {
    this.assessments.set(assessment.id, assessment);
  }

  /**
   * Get assessment by ID
   */
  getAssessment(assessmentId: string): Assessment | undefined {
    return this.assessments.get(assessmentId);
  }

  /**
   * Evaluate a user's assessment submission
   */
  async evaluateAssessment(
    assessmentId: string,
    userId: string,
    answers: Map<string, any>,
    timeSpent: number
  ): Promise<AssessmentResult> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error('Assessment not found');

    const answerRecords: AnswerRecord[] = [];
    let totalScore = 0;

    // Evaluate each question
    for (const question of assessment.questions) {
      const userAnswer = answers.get(question.id);
      const evaluation = await this.evaluateQuestion(question, userAnswer);
      
      answerRecords.push(evaluation);
      totalScore += evaluation.pointsEarned;
    }

    const percentage = (totalScore / assessment.rubric.totalPoints) * 100;
    const grade = this.calculateGrade(percentage, assessment.rubric.gradingScale);
    const passed = percentage >= assessment.passingScore;

    // Generate feedback
    const feedback = this.generateFeedback(
      assessment,
      answerRecords,
      percentage,
      timeSpent
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      assessment,
      answerRecords,
      percentage
    );

    return {
      assessmentId,
      userId,
      score: totalScore,
      percentage,
      grade,
      passed,
      timeSpent,
      completedAt: new Date(),
      answers: answerRecords,
      feedback,
      recommendations
    };
  }

  /**
   * Evaluate a single question
   */
  private async evaluateQuestion(
    question: AssessmentQuestion,
    userAnswer: any
  ): Promise<AnswerRecord> {
    let correct = false;
    let pointsEarned = 0;
    let feedback = '';
    let executionResults = null;

    switch (question.type) {
      case 'multiple-choice':
        correct = userAnswer === question.correctAnswer;
        pointsEarned = correct ? question.points : 0;
        feedback = correct ? 'Correct!' : `Incorrect. The correct answer is option ${question.correctAnswer + 1}`;
        break;

      case 'code':
        const codeEvaluation = await this.evaluateCodeQuestion(question, userAnswer);
        correct = codeEvaluation.allTestsPassed;
        pointsEarned = codeEvaluation.pointsEarned;
        feedback = codeEvaluation.feedback;
        executionResults = codeEvaluation.results;
        break;

      case 'debugging':
        const debugEvaluation = await this.evaluateDebuggingQuestion(question, userAnswer);
        correct = debugEvaluation.correct;
        pointsEarned = debugEvaluation.pointsEarned;
        feedback = debugEvaluation.feedback;
        break;

      case 'short-answer':
        // For short answers, we'd use NLP/AI to evaluate
        // For now, simple keyword matching
        const keywords = question.correctAnswer?.keywords || [];
        const matchedKeywords = keywords.filter((kw: string) => 
          userAnswer.toLowerCase().includes(kw.toLowerCase())
        );
        const matchPercentage = matchedKeywords.length / keywords.length;
        pointsEarned = Math.floor(question.points * matchPercentage);
        correct = matchPercentage >= 0.7;
        feedback = `You mentioned ${matchedKeywords.length} out of ${keywords.length} key concepts`;
        break;
    }

    return {
      questionId: question.id,
      answer: userAnswer,
      correct,
      pointsEarned,
      feedback,
      executionResults
    };
  }

  /**
   * Evaluate a coding question
   */
  private async evaluateCodeQuestion(
    question: AssessmentQuestion,
    userCode: string
  ): Promise<{
    allTestsPassed: boolean;
    pointsEarned: number;
    feedback: string;
    results: any;
  }> {
    // Analyze code quality
    const analysis = await this.codeAnalyzer.analyzePythonCode(userCode);
    
    // Run test cases (simulated)
    const testResults = question.testCases?.map(testCase => {
      // In production, would actually execute code
      const passed = this.simulateTestCase(userCode, testCase);
      return {
        testCase: testCase.input,
        passed,
        points: passed ? testCase.points : 0
      };
    }) || [];

    const totalTestPoints = testResults.reduce((sum, r) => sum + r.points, 0);
    const passedTests = testResults.filter(r => r.passed).length;
    const allTestsPassed = passedTests === testResults.length;

    // Calculate points based on tests and code quality
    const testPoints = totalTestPoints;
    const qualityPoints = Math.floor(question.points * 0.2 * analysis.quality.overall);
    const pointsEarned = Math.min(testPoints + qualityPoints, question.points);

    const feedback = `Passed ${passedTests}/${testResults.length} tests. ` +
                    `Code quality: ${(analysis.quality.overall * 100).toFixed(0)}%. ` +
                    analysis.suggestions.length > 0 
                      ? `Suggestions: ${analysis.suggestions[0].message}`
                      : 'Good job!';

    return {
      allTestsPassed,
      pointsEarned,
      feedback,
      results: { testResults, codeAnalysis: analysis }
    };
  }

  /**
   * Evaluate a debugging question
   */
  private async evaluateDebuggingQuestion(
    question: AssessmentQuestion,
    userCode: string
  ): Promise<{
    correct: boolean;
    pointsEarned: number;
    feedback: string;
  }> {
    const analysis = await this.codeAnalyzer.analyzePythonCode(userCode);
    
    // Check if major errors are fixed
    const hasNoErrors = analysis.errors.filter(e => e.severity === 'error').length === 0;
    
    // Compare with correct answer (if provided)
    const similarToCorrect = question.correctAnswer 
      ? this.calculateCodeSimilarity(userCode, question.correctAnswer) > 0.8
      : hasNoErrors;

    const correct = hasNoErrors && similarToCorrect;
    const pointsEarned = correct ? question.points : 
                        hasNoErrors ? question.points * 0.5 : 0;

    const feedback = hasNoErrors 
      ? 'All errors fixed successfully!'
      : `Still has ${analysis.errors.length} errors to fix`;

    return { correct, pointsEarned, feedback };
  }

  /**
   * Simulate test case execution
   */
  private simulateTestCase(code: string, testCase: TestCase): boolean {
    // In production, would use actual code execution
    // For now, check for key patterns
    
    if (testCase.input === 'branch creation') {
      return code.includes('Branch(') && code.includes('system=');
    }
    
    if (testCase.input === 'system prompt') {
      return code.toLowerCase().includes('tutor') || 
             code.toLowerCase().includes('teacher') ||
             code.toLowerCase().includes('educator');
    }
    
    if (testCase.input === 'pydantic model') {
      return code.includes('class') && code.includes('BaseModel');
    }
    
    if (testCase.input === 'response_format usage') {
      return code.includes('response_format=');
    }
    
    return Math.random() > 0.5; // Random for unknown tests
  }

  /**
   * Calculate code similarity
   */
  private calculateCodeSimilarity(code1: string, code2: string): number {
    // Simple similarity based on common lines
    const lines1 = code1.split('\n').map(l => l.trim()).filter(l => l);
    const lines2 = code2.split('\n').map(l => l.trim()).filter(l => l);
    
    const commonLines = lines1.filter(line => lines2.includes(line)).length;
    const totalLines = Math.max(lines1.length, lines2.length);
    
    return totalLines > 0 ? commonLines / totalLines : 0;
  }

  /**
   * Generate assessment feedback
   */
  private generateFeedback(
    assessment: Assessment,
    answers: AnswerRecord[],
    percentage: number,
    timeSpent: number
  ): AssessmentFeedback {
    const strengths: string[] = [];
    const improvements: string[] = [];
    
    // Analyze performance by question type
    const codeQuestions = answers.filter(a => 
      assessment.questions.find(q => q.id === a.questionId)?.type === 'code'
    );
    const mcQuestions = answers.filter(a => 
      assessment.questions.find(q => q.id === a.questionId)?.type === 'multiple-choice'
    );
    
    if (codeQuestions.filter(q => q.correct).length / codeQuestions.length > 0.7) {
      strengths.push('Strong coding skills demonstrated');
    } else {
      improvements.push('Practice more coding exercises');
    }
    
    if (mcQuestions.filter(q => q.correct).length / mcQuestions.length > 0.8) {
      strengths.push('Good conceptual understanding');
    } else {
      improvements.push('Review core concepts');
    }
    
    // Time management
    if (assessment.timeLimit && timeSpent < assessment.timeLimit * 0.8) {
      strengths.push('Efficient time management');
    } else if (assessment.timeLimit && timeSpent > assessment.timeLimit) {
      improvements.push('Work on solving problems more quickly');
    }
    
    // Overall feedback
    let overall = '';
    if (percentage >= 90) {
      overall = 'Excellent work! You have mastered this level.';
    } else if (percentage >= 80) {
      overall = 'Great job! You have a strong understanding of the material.';
    } else if (percentage >= 70) {
      overall = 'Good effort! You passed but there\'s room for improvement.';
    } else {
      overall = 'Keep practicing! Review the material and try again.';
    }
    
    // Detailed feedback for each question
    const detailedFeedback = answers.map(answer => ({
      questionId: answer.questionId,
      feedback: answer.feedback || '',
      suggestions: this.getQuestionSuggestions(answer)
    }));
    
    return {
      overall,
      strengths,
      improvements,
      detailedFeedback
    };
  }

  /**
   * Get suggestions for a question
   */
  private getQuestionSuggestions(answer: AnswerRecord): string[] {
    const suggestions: string[] = [];
    
    if (!answer.correct) {
      suggestions.push('Review the related tutorial section');
      suggestions.push('Practice similar exercises');
      
      if (answer.executionResults?.codeAnalysis) {
        const analysis = answer.executionResults.codeAnalysis;
        if (analysis.suggestions.length > 0) {
          suggestions.push(...analysis.suggestions.slice(0, 2).map((s: any) => s.message));
        }
      }
    }
    
    return suggestions;
  }

  /**
   * Generate learning recommendations
   */
  private generateRecommendations(
    assessment: Assessment,
    answers: AnswerRecord[],
    percentage: number
  ): string[] {
    const recommendations: string[] = [];
    
    if (percentage < 70) {
      recommendations.push('Review the foundational concepts before moving forward');
      recommendations.push('Complete more practice exercises at the current level');
      recommendations.push('Consider working with a study partner or mentor');
    } else if (percentage < 85) {
      recommendations.push('Strengthen weak areas with targeted practice');
      recommendations.push('Review incorrect answers and understand the solutions');
    } else {
      recommendations.push('Ready to advance to the next level!');
      recommendations.push('Consider challenging yourself with advanced projects');
    }
    
    // Specific recommendations based on question performance
    const weakAreas = new Set<string>();
    answers.forEach(answer => {
      if (!answer.correct) {
        const question = assessment.questions.find(q => q.id === answer.questionId);
        if (question?.type === 'code') weakAreas.add('coding');
        if (question?.type === 'debugging') weakAreas.add('debugging');
        if (question?.type === 'multiple-choice') weakAreas.add('concepts');
      }
    });
    
    if (weakAreas.has('coding')) {
      recommendations.push('Practice more hands-on coding exercises');
    }
    if (weakAreas.has('debugging')) {
      recommendations.push('Work on identifying and fixing common errors');
    }
    if (weakAreas.has('concepts')) {
      recommendations.push('Review the conceptual material and documentation');
    }
    
    return recommendations;
  }

  /**
   * Calculate letter grade
   */
  private calculateGrade(percentage: number, scale: GradingScale): string {
    if (percentage >= scale.A) return 'A';
    if (percentage >= scale.B) return 'B';
    if (percentage >= scale.C) return 'C';
    if (percentage >= scale.D) return 'D';
    return 'F';
  }

  /**
   * Track user progress over time
   */
  async trackProgress(
    userId: string,
    assessmentResults: AssessmentResult[]
  ): Promise<{
    trend: 'improving' | 'stable' | 'declining';
    averageScore: number;
    strongAreas: string[];
    weakAreas: string[];
    recommendedNext: string;
  }> {
    // Sort results by date
    const sortedResults = assessmentResults.sort(
      (a, b) => a.completedAt.getTime() - b.completedAt.getTime()
    );
    
    // Calculate trend
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (sortedResults.length >= 2) {
      const recent = sortedResults.slice(-3);
      const recentAvg = recent.reduce((sum, r) => sum + r.percentage, 0) / recent.length;
      const older = sortedResults.slice(0, -3);
      const olderAvg = older.length > 0 
        ? older.reduce((sum, r) => sum + r.percentage, 0) / older.length
        : recentAvg;
      
      if (recentAvg > olderAvg + 5) trend = 'improving';
      else if (recentAvg < olderAvg - 5) trend = 'declining';
    }
    
    // Calculate average score
    const averageScore = assessmentResults.reduce((sum, r) => sum + r.percentage, 0) / assessmentResults.length;
    
    // Identify strong and weak areas
    const areaScores = new Map<string, number[]>();
    assessmentResults.forEach(result => {
      result.answers.forEach(answer => {
        const assessment = this.assessments.get(result.assessmentId);
        const question = assessment?.questions.find(q => q.id === answer.questionId);
        if (question) {
          const area = question.type;
          if (!areaScores.has(area)) areaScores.set(area, []);
          areaScores.get(area)!.push(answer.correct ? 100 : 0);
        }
      });
    });
    
    const areaAverages = Array.from(areaScores.entries()).map(([area, scores]) => ({
      area,
      average: scores.reduce((sum, s) => sum + s, 0) / scores.length
    }));
    
    const strongAreas = areaAverages.filter(a => a.average >= 80).map(a => a.area);
    const weakAreas = areaAverages.filter(a => a.average < 60).map(a => a.area);
    
    // Recommend next assessment
    let recommendedNext = 'intermediate-final';
    if (averageScore >= 85) {
      recommendedNext = 'advanced-final';
    } else if (averageScore < 70) {
      recommendedNext = 'beginner-review';
    }
    
    return {
      trend,
      averageScore,
      strongAreas,
      weakAreas,
      recommendedNext
    };
  }
}

// Export singleton instance
export const assessmentSystem = new AssessmentSystem();
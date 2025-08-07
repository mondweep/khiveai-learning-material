/**
 * Adaptive Difficulty Engine for personalized learning progression
 */

import { 
  User, 
  PerformanceMetrics, 
  DifficultyAdjustment,
  SkillLevel,
  LearningModule 
} from '../../types/learning';
import { calculatePerformanceScore, shouldAdjustDifficulty } from '../../utils/common';
import { LEARNING_CONFIG } from '../../config/learning';

export class AdaptiveDifficultyEngine {
  private performanceHistory: Map<string, number[]> = new Map();
  private difficultyHistory: Map<string, DifficultyAdjustment[]> = new Map();
  private userModels: Map<string, UserModel> = new Map();

  /**
   * Analyzes user performance and adjusts difficulty accordingly
   */
  async adjustDifficulty(
    userId: string,
    moduleId: string,
    performanceMetrics: PerformanceMetrics
  ): Promise<DifficultyAdjustment> {
    const userKey = `${userId}-${moduleId}`;
    const currentPerformance = calculatePerformanceScore(performanceMetrics);
    
    // Update performance history
    if (!this.performanceHistory.has(userKey)) {
      this.performanceHistory.set(userKey, []);
    }
    const history = this.performanceHistory.get(userKey)!;
    history.push(currentPerformance);
    
    // Keep only recent performance data
    if (history.length > 20) {
      history.shift();
    }

    // Get current difficulty
    const currentDifficulty = await this.getCurrentDifficulty(userId, moduleId);
    
    // Determine if adjustment is needed
    const adjustment = shouldAdjustDifficulty(history, currentDifficulty);
    
    let newDifficulty = currentDifficulty;
    if (adjustment.shouldAdjust) {
      newDifficulty = this.calculateNewDifficulty(
        currentDifficulty,
        adjustment.direction,
        adjustment.magnitude,
        performanceMetrics
      );
    }

    // Create adjustment record
    const difficultyAdjustment: DifficultyAdjustment = {
      userId,
      moduleId,
      previousDifficulty: currentDifficulty,
      newDifficulty,
      reason: this.generateAdjustmentReason(adjustment, performanceMetrics),
      timestamp: new Date(),
      performanceMetrics
    };

    // Store adjustment history
    if (!this.difficultyHistory.has(userKey)) {
      this.difficultyHistory.set(userKey, []);
    }
    this.difficultyHistory.get(userKey)!.push(difficultyAdjustment);

    // Update user model
    await this.updateUserModel(userId, difficultyAdjustment);

    return difficultyAdjustment;
  }

  /**
   * Calculates new difficulty level based on performance
   */
  private calculateNewDifficulty(
    currentDifficulty: number,
    direction: 'increase' | 'decrease' | 'maintain',
    magnitude: number,
    metrics: PerformanceMetrics
  ): number {
    let newDifficulty = currentDifficulty;

    switch (direction) {
      case 'increase':
        // Increase difficulty, but consider frustration level
        const increaseRate = Math.max(0.05, magnitude * (1 - metrics.frustrationLevel));
        newDifficulty = Math.min(
          LEARNING_CONFIG.difficulty.maxLevel,
          currentDifficulty + increaseRate
        );
        break;

      case 'decrease':
        // Decrease difficulty more aggressively if highly frustrated
        const decreaseRate = magnitude + (metrics.frustrationLevel * 0.1);
        newDifficulty = Math.max(
          LEARNING_CONFIG.difficulty.minLevel,
          currentDifficulty - decreaseRate
        );
        break;

      case 'maintain':
      default:
        // Fine-tune based on consistency and engagement
        const finetune = (metrics.consistency - 0.5) * 0.02 + (metrics.engagement - 0.5) * 0.02;
        newDifficulty = Math.max(
          LEARNING_CONFIG.difficulty.minLevel,
          Math.min(LEARNING_CONFIG.difficulty.maxLevel, currentDifficulty + finetune)
        );
        break;
    }

    return Math.round(newDifficulty * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Generates human-readable reason for difficulty adjustment
   */
  private generateAdjustmentReason(
    adjustment: { shouldAdjust: boolean; direction: string; magnitude: number },
    metrics: PerformanceMetrics
  ): string {
    if (!adjustment.shouldAdjust) {
      return 'Maintaining current difficulty based on consistent performance';
    }

    const reasons = [];
    
    if (adjustment.direction === 'increase') {
      reasons.push('High accuracy and engagement indicate readiness for increased challenge');
      if (metrics.speed > 0.8) reasons.push('Fast completion times suggest content may be too easy');
    } else if (adjustment.direction === 'decrease') {
      reasons.push('Low accuracy or high frustration level detected');
      if (metrics.consistency < 0.4) reasons.push('Inconsistent performance suggests difficulty is too high');
    }

    return reasons.join('. ');
  }

  /**
   * Predicts optimal difficulty for a user starting a new module
   */
  async predictOptimalDifficulty(
    userId: string,
    moduleId: string,
    userSkillLevel: SkillLevel
  ): Promise<number> {
    const userModel = this.userModels.get(userId);
    
    // Base difficulty on skill level
    let baseDifficulty = this.getBaseDifficultyForSkillLevel(userSkillLevel);

    if (userModel) {
      // Adjust based on user's historical performance patterns
      baseDifficulty = this.adjustBasedOnUserModel(baseDifficulty, userModel);
    }

    // Consider module-specific factors
    const moduleComplexity = await this.getModuleComplexity(moduleId);
    baseDifficulty *= moduleComplexity;

    return Math.max(
      LEARNING_CONFIG.difficulty.minLevel,
      Math.min(LEARNING_CONFIG.difficulty.maxLevel, baseDifficulty)
    );
  }

  /**
   * Gets base difficulty for skill level
   */
  private getBaseDifficultyForSkillLevel(skillLevel: SkillLevel): number {
    const baseMap: Record<SkillLevel, number> = {
      beginner: 0.2,
      intermediate: 0.4,
      advanced: 0.6,
      expert: 0.8
    };
    return baseMap[skillLevel];
  }

  /**
   * Adjusts difficulty based on user model
   */
  private adjustBasedOnUserModel(baseDifficulty: number, userModel: UserModel): number {
    let adjustment = 0;

    // Fast learners can handle higher difficulty
    if (userModel.learningSpeed > 0.8) adjustment += 0.1;
    if (userModel.learningSpeed < 0.3) adjustment -= 0.1;

    // Persistent users can handle more challenge
    if (userModel.persistence > 0.8) adjustment += 0.05;
    if (userModel.persistence < 0.3) adjustment -= 0.05;

    // Adapt to frustration tolerance
    if (userModel.frustrationTolerance > 0.8) adjustment += 0.05;
    if (userModel.frustrationTolerance < 0.3) adjustment -= 0.1;

    return baseDifficulty + adjustment;
  }

  /**
   * Updates user model based on new performance data
   */
  private async updateUserModel(userId: string, adjustment: DifficultyAdjustment): Promise<void> {
    let userModel = this.userModels.get(userId);
    
    if (!userModel) {
      userModel = {
        userId,
        learningSpeed: 0.5,
        persistence: 0.5,
        frustrationTolerance: 0.5,
        preferredDifficulty: 0.5,
        adaptationRate: 0.1,
        lastUpdated: new Date()
      };
    }

    const metrics = adjustment.performanceMetrics;
    const alpha = 0.1; // Learning rate for model updates

    // Update learning speed based on completion time relative to estimates
    userModel.learningSpeed = userModel.learningSpeed * (1 - alpha) + metrics.speed * alpha;

    // Update persistence based on engagement over time
    userModel.persistence = userModel.persistence * (1 - alpha) + metrics.engagement * alpha;

    // Update frustration tolerance
    userModel.frustrationTolerance = userModel.frustrationTolerance * (1 - alpha) + 
      (1 - metrics.frustrationLevel) * alpha;

    // Update preferred difficulty based on performance at current difficulty
    if (metrics.accuracy > 0.7 && metrics.frustrationLevel < 0.3) {
      userModel.preferredDifficulty = Math.min(1.0, userModel.preferredDifficulty + 0.02);
    } else if (metrics.accuracy < 0.4 || metrics.frustrationLevel > 0.7) {
      userModel.preferredDifficulty = Math.max(0.1, userModel.preferredDifficulty - 0.02);
    }

    userModel.lastUpdated = new Date();
    this.userModels.set(userId, userModel);
  }

  /**
   * Gets current difficulty for a user-module combination
   */
  private async getCurrentDifficulty(userId: string, moduleId: string): Promise<number> {
    const userKey = `${userId}-${moduleId}`;
    const history = this.difficultyHistory.get(userKey);
    
    if (history && history.length > 0) {
      return history[history.length - 1].newDifficulty;
    }
    
    // Return default difficulty if no history
    return 0.5;
  }

  /**
   * Gets module complexity factor
   */
  private async getModuleComplexity(moduleId: string): Promise<number> {
    // This would typically fetch from a database
    // For now, return a default complexity
    const complexityMap: Record<string, number> = {
      'basic-agents': 0.8,
      'advanced-agents': 1.2,
      'memory-management': 1.1,
      'agent-coordination': 1.3,
      'enterprise-patterns': 1.4
    };
    
    return complexityMap[moduleId] || 1.0;
  }

  /**
   * Gets performance analytics for a user
   */
  getPerformanceAnalytics(userId: string): {
    averagePerformance: number;
    improvementRate: number;
    difficultyProgression: number[];
    recommendedActions: string[];
  } {
    const userHistory = Array.from(this.performanceHistory.entries())
      .filter(([key]) => key.startsWith(userId))
      .flatMap(([, history]) => history);

    if (userHistory.length === 0) {
      return {
        averagePerformance: 0,
        improvementRate: 0,
        difficultyProgression: [],
        recommendedActions: ['Complete more exercises to generate analytics']
      };
    }

    const averagePerformance = userHistory.reduce((sum, score) => sum + score, 0) / userHistory.length;
    
    // Calculate improvement rate
    const firstHalf = userHistory.slice(0, Math.floor(userHistory.length / 2));
    const secondHalf = userHistory.slice(Math.floor(userHistory.length / 2));
    const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
    const improvementRate = secondAvg - firstAvg;

    // Get difficulty progression
    const difficultyProgression = Array.from(this.difficultyHistory.entries())
      .filter(([key]) => key.startsWith(userId))
      .flatMap(([, adjustments]) => adjustments.map(adj => adj.newDifficulty));

    // Generate recommendations
    const recommendedActions = this.generateRecommendations(averagePerformance, improvementRate, difficultyProgression);

    return {
      averagePerformance,
      improvementRate,
      difficultyProgression,
      recommendedActions
    };
  }

  /**
   * Generates personalized recommendations
   */
  private generateRecommendations(
    averagePerformance: number,
    improvementRate: number,
    difficultyProgression: number[]
  ): string[] {
    const recommendations = [];

    if (averagePerformance < 0.4) {
      recommendations.push('Focus on fundamental concepts before advancing');
      recommendations.push('Consider reviewing prerequisite materials');
    } else if (averagePerformance > 0.8) {
      recommendations.push('Consider taking on more challenging exercises');
      recommendations.push('Explore advanced topics in your area of interest');
    }

    if (improvementRate < 0) {
      recommendations.push('Take breaks between learning sessions to improve retention');
      recommendations.push('Practice spaced repetition for better concept mastery');
    } else if (improvementRate > 0.2) {
      recommendations.push('Excellent progress! Consider increasing your learning pace');
    }

    if (difficultyProgression.length > 5) {
      const recentDifficulty = difficultyProgression.slice(-5);
      const isStagnating = recentDifficulty.every(d => Math.abs(d - recentDifficulty[0]) < 0.1);
      
      if (isStagnating) {
        recommendations.push('Try varying your learning approach or seeking additional challenges');
      }
    }

    return recommendations.length > 0 ? recommendations : ['Keep up the great work!'];
  }
}

interface UserModel {
  userId: string;
  learningSpeed: number;
  persistence: number;
  frustrationTolerance: number;
  preferredDifficulty: number;
  adaptationRate: number;
  lastUpdated: Date;
}
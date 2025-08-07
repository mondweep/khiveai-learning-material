/**
 * Tests for Adaptive Difficulty Engine
 */

import { AdaptiveDifficultyEngine } from '../../src/modules/adaptive-difficulty/engine';
import { PerformanceMetrics } from '../../src/types/learning';

describe('AdaptiveDifficultyEngine', () => {
  let engine: AdaptiveDifficultyEngine;
  
  beforeEach(() => {
    engine = new AdaptiveDifficultyEngine();
  });

  describe('adjustDifficulty', () => {
    it('should increase difficulty for high performance', async () => {
      const highPerformance: PerformanceMetrics = {
        accuracy: 0.95,
        speed: 0.9,
        consistency: 0.85,
        engagement: 0.8,
        frustrationLevel: 0.1
      };

      const adjustment = await engine.adjustDifficulty('user1', 'module1', highPerformance);
      
      expect(adjustment.newDifficulty).toBeGreaterThan(adjustment.previousDifficulty);
      expect(adjustment.reason).toContain('high accuracy');
    });

    it('should decrease difficulty for poor performance', async () => {
      const poorPerformance: PerformanceMetrics = {
        accuracy: 0.2,
        speed: 0.3,
        consistency: 0.25,
        engagement: 0.4,
        frustrationLevel: 0.8
      };

      const adjustment = await engine.adjustDifficulty('user1', 'module1', poorPerformance);
      
      expect(adjustment.newDifficulty).toBeLessThan(adjustment.previousDifficulty);
      expect(adjustment.reason).toContain('frustration');
    });

    it('should maintain difficulty for average performance', async () => {
      const averagePerformance: PerformanceMetrics = {
        accuracy: 0.7,
        speed: 0.6,
        consistency: 0.65,
        engagement: 0.7,
        frustrationLevel: 0.3
      };

      const adjustment = await engine.adjustDifficulty('user1', 'module1', averagePerformance);
      
      expect(Math.abs(adjustment.newDifficulty - adjustment.previousDifficulty)).toBeLessThan(0.1);
    });
  });

  describe('predictOptimalDifficulty', () => {
    it('should predict higher difficulty for advanced users', async () => {
      const difficulty = await engine.predictOptimalDifficulty('user1', 'module1', 'advanced');
      expect(difficulty).toBeGreaterThan(0.5);
    });

    it('should predict lower difficulty for beginners', async () => {
      const difficulty = await engine.predictOptimalDifficulty('user1', 'module1', 'beginner');
      expect(difficulty).toBeLessThan(0.4);
    });
  });

  describe('getPerformanceAnalytics', () => {
    it('should return empty analytics for new user', () => {
      const analytics = engine.getPerformanceAnalytics('newUser');
      
      expect(analytics.averagePerformance).toBe(0);
      expect(analytics.improvementRate).toBe(0);
      expect(analytics.recommendedActions).toContain('Complete more exercises');
    });
  });
});
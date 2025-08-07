/**
 * Common utility functions for the learning system
 */

import { PerformanceMetrics, SkillLevel } from '../types/learning';

/**
 * Calculates a composite performance score from individual metrics
 */
export function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  const weights = {
    accuracy: 0.4,
    speed: 0.2,
    consistency: 0.2,
    engagement: 0.2
  };

  return (
    metrics.accuracy * weights.accuracy +
    metrics.speed * weights.speed +
    metrics.consistency * weights.consistency +
    metrics.engagement * weights.engagement -
    metrics.frustrationLevel * 0.1 // Penalty for frustration
  );
}

/**
 * Determines if difficulty should be adjusted based on performance
 */
export function shouldAdjustDifficulty(
  performanceHistory: number[],
  currentDifficulty: number
): { shouldAdjust: boolean; direction: 'increase' | 'decrease' | 'maintain'; magnitude: number } {
  const recentPerformance = performanceHistory.slice(-5);
  const averagePerformance = recentPerformance.reduce((sum, score) => sum + score, 0) / recentPerformance.length;

  if (averagePerformance < 0.3 && currentDifficulty > 0.1) {
    return { shouldAdjust: true, direction: 'decrease', magnitude: 0.1 };
  }
  
  if (averagePerformance > 0.9 && currentDifficulty < 1.0) {
    return { shouldAdjust: true, direction: 'increase', magnitude: 0.1 };
  }

  return { shouldAdjust: false, direction: 'maintain', magnitude: 0 };
}

/**
 * Formats duration in milliseconds to human-readable string
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Generates a unique ID with timestamp
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Debounce function for API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Calculates skill level based on overall progress
 */
export function calculateSkillLevel(
  totalScore: number,
  modulesCompleted: number,
  timeSpent: number
): SkillLevel {
  const experiencePoints = totalScore * 10 + modulesCompleted * 50 + Math.floor(timeSpent / 3600) * 5;

  if (experiencePoints < 100) return 'beginner';
  if (experiencePoints < 500) return 'intermediate';
  if (experiencePoints < 1500) return 'advanced';
  return 'expert';
}

/**
 * Validates code syntax (basic validation)
 */
export function validateCodeSyntax(code: string, language: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Basic validation rules
  if (language === 'python') {
    // Check for basic Python syntax issues
    if (code.includes('def ') && !code.includes(':')) {
      errors.push('Function definition missing colon');
    }
    
    // Check indentation (simplified)
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().endsWith(':') && i < lines.length - 1) {
        const nextLine = lines[i + 1];
        if (nextLine.trim() && !nextLine.startsWith(' ')) {
          errors.push(`Line ${i + 2}: Expected indentation after line ${i + 1}`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Calculates similarity between two text strings (simple implementation)
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Generates a random selection from an array
 */
export function randomSelection<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Deep clone utility
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as any;
  
  const cloned: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Converts camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Sanitizes user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
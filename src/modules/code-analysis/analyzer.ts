/**
 * Code Analysis Module for lionagi Learning Platform
 * Provides syntax highlighting, live evaluation, and code quality feedback
 */

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

export interface CodeAnalysisResult {
  syntax: SyntaxAnalysis;
  quality: QualityMetrics;
  suggestions: CodeSuggestion[];
  lionagiPatterns: LionagiPattern[];
  complexity: ComplexityAnalysis;
  errors: CodeError[];
}

export interface SyntaxAnalysis {
  isValid: boolean;
  tokens: Token[];
  ast?: any;
  highlights: HighlightRange[];
}

export interface Token {
  type: string;
  value: string;
  start: number;
  end: number;
  line: number;
  column: number;
}

export interface HighlightRange {
  start: number;
  end: number;
  type: 'keyword' | 'string' | 'comment' | 'function' | 'class' | 'variable' | 'lionagi';
  color: string;
}

export interface QualityMetrics {
  readability: number;
  maintainability: number;
  testability: number;
  documentation: number;
  bestPractices: number;
  overall: number;
}

export interface CodeSuggestion {
  line: number;
  column: number;
  severity: 'info' | 'warning' | 'error';
  message: string;
  fix?: string;
  category: 'style' | 'performance' | 'security' | 'lionagi' | 'async';
}

export interface LionagiPattern {
  pattern: string;
  usage: 'correct' | 'incorrect' | 'suboptimal';
  location: { line: number; column: number };
  suggestion?: string;
  documentation?: string;
}

export interface ComplexityAnalysis {
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  halsteadMetrics: HalsteadMetrics;
  linesOfCode: number;
  difficulty: 'simple' | 'moderate' | 'complex' | 'very-complex';
}

export interface HalsteadMetrics {
  vocabulary: number;
  length: number;
  volume: number;
  difficulty: number;
  effort: number;
}

export interface CodeError {
  line: number;
  column: number;
  message: string;
  type: 'syntax' | 'runtime' | 'logic' | 'lionagi';
  severity: 'error' | 'warning';
}

export class LionagiCodeAnalyzer {
  private lionagiKeywords = [
    'Branch', 'iModel', 'communicate', 'chat', 'operate',
    'ReAct', 'register_tools', 'messages', 'system',
    'chat_model', 'response_format', 'brainstorm', 'instruct'
  ];

  private lionagiImports = [
    'from lionagi import',
    'import lionagi',
    'from lionagi.',
    'lionagi.'
  ];

  /**
   * Analyze Python code for lionagi patterns and quality
   */
  async analyzePythonCode(code: string): Promise<CodeAnalysisResult> {
    const syntax = await this.analyzeSyntax(code);
    const quality = this.assessCodeQuality(code, syntax);
    const suggestions = this.generateSuggestions(code, syntax);
    const lionagiPatterns = this.detectLionagiPatterns(code);
    const complexity = this.analyzeComplexity(code);
    const errors = this.detectErrors(code, syntax);

    return {
      syntax,
      quality,
      suggestions,
      lionagiPatterns,
      complexity,
      errors
    };
  }

  /**
   * Perform syntax analysis and generate highlighting
   */
  private async analyzeSyntax(code: string): Promise<SyntaxAnalysis> {
    const tokens: Token[] = [];
    const highlights: HighlightRange[] = [];
    let isValid = true;

    try {
      // Tokenize Python code (simplified - would use proper Python parser in production)
      const lines = code.split('\n');
      let position = 0;

      lines.forEach((line, lineIndex) => {
        // Detect comments
        const commentMatch = line.match(/#(.*)$/);
        if (commentMatch) {
          highlights.push({
            start: position + commentMatch.index!,
            end: position + line.length,
            type: 'comment',
            color: '#6a737d'
          });
        }

        // Detect strings
        const stringRegex = /(['"])(?:(?=(\\?))\2.)*?\1/g;
        let stringMatch;
        while ((stringMatch = stringRegex.exec(line)) !== null) {
          highlights.push({
            start: position + stringMatch.index,
            end: position + stringMatch.index + stringMatch[0].length,
            type: 'string',
            color: '#032f62'
          });
        }

        // Detect lionagi-specific keywords
        this.lionagiKeywords.forEach(keyword => {
          const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'g');
          let match;
          while ((match = keywordRegex.exec(line)) !== null) {
            highlights.push({
              start: position + match.index,
              end: position + match.index + keyword.length,
              type: 'lionagi',
              color: '#ff6b6b'
            });
          }
        });

        // Detect Python keywords
        const pythonKeywords = ['def', 'class', 'async', 'await', 'import', 'from', 'if', 'else', 'for', 'while', 'return', 'try', 'except'];
        pythonKeywords.forEach(keyword => {
          const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'g');
          let match;
          while ((match = keywordRegex.exec(line)) !== null) {
            highlights.push({
              start: position + match.index,
              end: position + match.index + keyword.length,
              type: 'keyword',
              color: '#d73a49'
            });
          }
        });

        position += line.length + 1; // +1 for newline
      });

    } catch (error) {
      isValid = false;
    }

    return {
      isValid,
      tokens,
      highlights
    };
  }

  /**
   * Assess overall code quality
   */
  private assessCodeQuality(code: string, syntax: SyntaxAnalysis): QualityMetrics {
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(l => l.trim().length > 0);
    
    // Readability score based on line length and complexity
    const avgLineLength = nonEmptyLines.reduce((sum, line) => sum + line.length, 0) / nonEmptyLines.length;
    const readability = Math.max(0, Math.min(1, 1 - (avgLineLength - 50) / 100));

    // Documentation score based on comments and docstrings
    const commentLines = lines.filter(l => l.trim().startsWith('#'));
    const docstringMatches = code.match(/"""[\s\S]*?"""/g) || [];
    const documentation = Math.min(1, (commentLines.length + docstringMatches.length * 3) / nonEmptyLines.length);

    // Best practices score
    const hasAsyncAwait = code.includes('async') && code.includes('await');
    const hasErrorHandling = code.includes('try') && code.includes('except');
    const hasTypeHints = code.includes(':') && code.includes('->');
    const bestPractices = (hasAsyncAwait ? 0.33 : 0) + (hasErrorHandling ? 0.33 : 0) + (hasTypeHints ? 0.34 : 0);

    // Maintainability based on function/class count and size
    const functionCount = (code.match(/def \w+/g) || []).length;
    const classCount = (code.match(/class \w+/g) || []).length;
    const avgFunctionSize = functionCount > 0 ? nonEmptyLines.length / functionCount : nonEmptyLines.length;
    const maintainability = Math.max(0, Math.min(1, 1 - (avgFunctionSize - 20) / 50));

    // Testability based on function modularity
    const testability = Math.min(1, (functionCount + classCount) / 10);

    const overall = (readability + documentation + bestPractices + maintainability + testability) / 5;

    return {
      readability,
      maintainability,
      testability,
      documentation,
      bestPractices,
      overall
    };
  }

  /**
   * Generate code improvement suggestions
   */
  private generateSuggestions(code: string, syntax: SyntaxAnalysis): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];
    const lines = code.split('\n');

    lines.forEach((line, lineIndex) => {
      // Check for missing async/await
      if (line.includes('branch.communicate') && !line.includes('await')) {
        suggestions.push({
          line: lineIndex + 1,
          column: line.indexOf('branch.communicate'),
          severity: 'error',
          message: 'Missing "await" before branch.communicate()',
          fix: line.replace('branch.communicate', 'await branch.communicate'),
          category: 'async'
        });
      }

      // Check for missing asyncio.run()
      if (line.includes('async def main') && !code.includes('asyncio.run')) {
        suggestions.push({
          line: lineIndex + 1,
          column: 0,
          severity: 'warning',
          message: 'Async function defined but not called with asyncio.run()',
          fix: '\n\nif __name__ == "__main__":\n    asyncio.run(main())',
          category: 'async'
        });
      }

      // Check for lionagi best practices
      if (line.includes('Branch()') && !line.includes('system=')) {
        suggestions.push({
          line: lineIndex + 1,
          column: line.indexOf('Branch()'),
          severity: 'info',
          message: 'Consider adding a system prompt to define the assistant\'s behavior',
          fix: 'Branch(system="You are a helpful assistant")',
          category: 'lionagi'
        });
      }

      // Check for error handling
      if (line.includes('communicate(') && !this.hasNearbyTryCatch(lines, lineIndex)) {
        suggestions.push({
          line: lineIndex + 1,
          column: line.indexOf('communicate('),
          severity: 'warning',
          message: 'Consider adding error handling for API calls',
          category: 'lionagi'
        });
      }

      // Check line length
      if (line.length > 100) {
        suggestions.push({
          line: lineIndex + 1,
          column: 100,
          severity: 'info',
          message: `Line too long (${line.length} > 100 characters)`,
          category: 'style'
        });
      }
    });

    return suggestions;
  }

  /**
   * Detect lionagi-specific patterns
   */
  private detectLionagiPatterns(code: string): LionagiPattern[] {
    const patterns: LionagiPattern[] = [];
    const lines = code.split('\n');

    lines.forEach((line, lineIndex) => {
      // Check for correct Branch initialization
      if (line.includes('Branch(')) {
        const hasSystem = line.includes('system=');
        const hasModel = line.includes('chat_model=') || code.includes('iModel');
        
        patterns.push({
          pattern: 'Branch initialization',
          usage: hasSystem && hasModel ? 'correct' : 'suboptimal',
          location: { line: lineIndex + 1, column: line.indexOf('Branch(') },
          suggestion: !hasSystem ? 'Add system prompt for better context' : 
                     !hasModel ? 'Specify chat_model for explicit configuration' : undefined,
          documentation: 'https://lionagi.ai/docs/branch-setup'
        });
      }

      // Check for async/await patterns
      if (line.includes('.communicate(') || line.includes('.chat(') || line.includes('.operate(')) {
        const hasAwait = line.includes('await');
        patterns.push({
          pattern: 'Async communication',
          usage: hasAwait ? 'correct' : 'incorrect',
          location: { line: lineIndex + 1, column: 0 },
          suggestion: !hasAwait ? 'Add "await" keyword before async method call' : undefined
        });
      }

      // Check for tool registration
      if (line.includes('register_tools')) {
        patterns.push({
          pattern: 'Tool registration',
          usage: 'correct',
          location: { line: lineIndex + 1, column: line.indexOf('register_tools') },
          documentation: 'https://lionagi.ai/docs/tools'
        });
      }

      // Check for ReAct pattern
      if (line.includes('ReAct(')) {
        const hasTools = code.includes('tools=');
        patterns.push({
          pattern: 'ReAct reasoning',
          usage: hasTools ? 'correct' : 'suboptimal',
          location: { line: lineIndex + 1, column: line.indexOf('ReAct(') },
          suggestion: !hasTools ? 'Provide tools for ReAct to use' : undefined,
          documentation: 'https://lionagi.ai/docs/react-pattern'
        });
      }
    });

    return patterns;
  }

  /**
   * Analyze code complexity
   */
  private analyzeComplexity(code: string): ComplexityAnalysis {
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(l => l.trim().length > 0);
    
    // Calculate cyclomatic complexity (simplified)
    const decisionPoints = (code.match(/\b(if|elif|for|while|except|and|or)\b/g) || []).length;
    const cyclomaticComplexity = decisionPoints + 1;

    // Calculate cognitive complexity
    const nestingLevel = this.calculateMaxNesting(lines);
    const cognitiveComplexity = decisionPoints + nestingLevel * 2;

    // Calculate Halstead metrics (simplified)
    const operators = code.match(/[+\-*/%=<>!&|]/g) || [];
    const operands = code.match(/\b\w+\b/g) || [];
    const uniqueOperators = new Set(operators).size;
    const uniqueOperands = new Set(operands).size;
    
    const vocabulary = uniqueOperators + uniqueOperands;
    const length = operators.length + operands.length;
    const volume = length * Math.log2(vocabulary);
    const difficulty = (uniqueOperators / 2) * (operands.length / uniqueOperands);
    const effort = difficulty * volume;

    // Determine overall difficulty
    let difficultyLevel: 'simple' | 'moderate' | 'complex' | 'very-complex';
    if (cyclomaticComplexity <= 5) difficultyLevel = 'simple';
    else if (cyclomaticComplexity <= 10) difficultyLevel = 'moderate';
    else if (cyclomaticComplexity <= 20) difficultyLevel = 'complex';
    else difficultyLevel = 'very-complex';

    return {
      cyclomaticComplexity,
      cognitiveComplexity,
      halsteadMetrics: {
        vocabulary,
        length,
        volume,
        difficulty,
        effort
      },
      linesOfCode: nonEmptyLines.length,
      difficulty: difficultyLevel
    };
  }

  /**
   * Detect errors in code
   */
  private detectErrors(code: string, syntax: SyntaxAnalysis): CodeError[] {
    const errors: CodeError[] = [];
    const lines = code.split('\n');

    if (!syntax.isValid) {
      errors.push({
        line: 1,
        column: 0,
        message: 'Syntax error in code',
        type: 'syntax',
        severity: 'error'
      });
    }

    lines.forEach((line, lineIndex) => {
      // Check for common lionagi errors
      if (line.includes('Branch.communicate') && !line.includes('await')) {
        errors.push({
          line: lineIndex + 1,
          column: line.indexOf('Branch.communicate'),
          message: 'Async method called without await',
          type: 'runtime',
          severity: 'error'
        });
      }

      // Check for undefined variables (simplified)
      if (line.includes('branch.') && !code.includes('branch =')) {
        errors.push({
          line: lineIndex + 1,
          column: line.indexOf('branch.'),
          message: 'Variable "branch" may not be defined',
          type: 'runtime',
          severity: 'warning'
        });
      }

      // Check for missing imports
      if (line.includes('Branch(') && !this.hasImport(code, 'Branch')) {
        errors.push({
          line: lineIndex + 1,
          column: line.indexOf('Branch('),
          message: 'Branch not imported from lionagi',
          type: 'lionagi',
          severity: 'error'
        });
      }
    });

    return errors;
  }

  /**
   * Helper: Check if code has nearby try-catch
   */
  private hasNearbyTryCatch(lines: string[], lineIndex: number): boolean {
    const searchRange = 5;
    const start = Math.max(0, lineIndex - searchRange);
    const end = Math.min(lines.length, lineIndex + searchRange);
    
    for (let i = start; i < end; i++) {
      if (lines[i].includes('try:') || lines[i].includes('except')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Helper: Check if import exists
   */
  private hasImport(code: string, item: string): boolean {
    return code.includes(`from lionagi import ${item}`) ||
           code.includes(`from lionagi import`) && code.includes(item) ||
           code.includes(`import lionagi`) && code.includes(`lionagi.${item}`);
  }

  /**
   * Helper: Calculate maximum nesting level
   */
  private calculateMaxNesting(lines: string[]): number {
    let maxNesting = 0;
    let currentNesting = 0;
    
    lines.forEach(line => {
      const indent = line.search(/\S/);
      if (indent > 0) {
        currentNesting = Math.floor(indent / 4); // Assuming 4-space indentation
        maxNesting = Math.max(maxNesting, currentNesting);
      }
    });
    
    return maxNesting;
  }

  /**
   * Generate syntax highlighting HTML
   */
  generateHighlightedHTML(code: string, highlights: HighlightRange[]): string {
    let html = '<pre><code>';
    let lastEnd = 0;
    
    // Sort highlights by start position
    highlights.sort((a, b) => a.start - b.start);
    
    highlights.forEach(highlight => {
      // Add unhighlighted text before this highlight
      if (highlight.start > lastEnd) {
        html += this.escapeHtml(code.substring(lastEnd, highlight.start));
      }
      
      // Add highlighted text
      html += `<span style="color: ${highlight.color}">`;
      html += this.escapeHtml(code.substring(highlight.start, highlight.end));
      html += '</span>';
      
      lastEnd = highlight.end;
    });
    
    // Add remaining unhighlighted text
    if (lastEnd < code.length) {
      html += this.escapeHtml(code.substring(lastEnd));
    }
    
    html += '</code></pre>';
    return html;
  }

  /**
   * Helper: Escape HTML characters
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Provide real-time feedback as user types
   */
  async provideRealTimeFeedback(
    code: string,
    cursorPosition: { line: number; column: number }
  ): Promise<{
    suggestions: string[];
    diagnostics: CodeSuggestion[];
    completions: string[];
  }> {
    const lines = code.split('\n');
    const currentLine = lines[cursorPosition.line - 1] || '';
    const beforeCursor = currentLine.substring(0, cursorPosition.column);
    
    const suggestions: string[] = [];
    const completions: string[] = [];
    
    // Auto-complete lionagi imports
    if (beforeCursor.includes('from lionagi import')) {
      completions.push(...this.lionagiKeywords);
    }
    
    // Auto-complete Branch methods
    if (beforeCursor.includes('branch.')) {
      completions.push('communicate', 'chat', 'operate', 'register_tools', 'messages');
    }
    
    // Suggest await for async methods
    if (beforeCursor.includes('.communicate(') && !beforeCursor.includes('await')) {
      suggestions.push('Add "await" before async method call');
    }
    
    // Quick analysis for current context
    const analysis = await this.analyzePythonCode(code);
    const relevantDiagnostics = analysis.suggestions.filter(
      s => Math.abs(s.line - cursorPosition.line) <= 2
    );
    
    return {
      suggestions,
      diagnostics: relevantDiagnostics,
      completions
    };
  }
}

// Export singleton instance
export const codeAnalyzer = new LionagiCodeAnalyzer();
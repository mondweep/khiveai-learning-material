/**
 * Interactive Code Playground for safe code execution
 */

import { PlaygroundSession } from '../../types/learning';
import { generateId, validateCodeSyntax } from '../../utils/common';
import { LEARNING_CONFIG } from '../../config/learning';

export class CodePlayground {
  private sessions: Map<string, PlaygroundSession> = new Map();
  private executionQueue: ExecutionTask[] = [];
  private isProcessing: boolean = false;

  /**
   * Creates a new playground session
   */
  async createSession(
    userId: string,
    initialCode: string = '',
    language: string = 'python'
  ): Promise<PlaygroundSession> {
    const session: PlaygroundSession = {
      id: generateId('session'),
      userId,
      code: initialCode,
      language,
      output: '',
      errors: [],
      executionTime: 0,
      createdAt: new Date(),
      shared: false
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Updates code in a session
   */
  updateSessionCode(sessionId: string, code: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.code = code;
      // Reset output and errors when code changes
      session.output = '';
      session.errors = [];
    }
  }

  /**
   * Executes code in a sandboxed environment
   */
  async executeCode(sessionId: string): Promise<{
    output: string;
    errors: string[];
    executionTime: number;
    success: boolean;
  }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Validate code syntax first
    const validation = validateCodeSyntax(session.code, session.language);
    if (!validation.isValid) {
      return {
        output: '',
        errors: validation.errors,
        executionTime: 0,
        success: false
      };
    }

    // Security checks
    const securityCheck = this.performSecurityChecks(session.code, session.language);
    if (!securityCheck.passed) {
      return {
        output: '',
        errors: securityCheck.errors,
        executionTime: 0,
        success: false
      };
    }

    // Add to execution queue
    const executionTask: ExecutionTask = {
      sessionId,
      code: session.code,
      language: session.language,
      timestamp: Date.now()
    };

    return new Promise((resolve) => {
      executionTask.resolve = resolve;
      this.executionQueue.push(executionTask);
      this.processExecutionQueue();
    });
  }

  /**
   * Processes the execution queue
   */
  private async processExecutionQueue(): Promise<void> {
    if (this.isProcessing || this.executionQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.executionQueue.length > 0) {
      const task = this.executionQueue.shift()!;
      const result = await this.executeInSandbox(task);
      
      // Update session
      const session = this.sessions.get(task.sessionId);
      if (session) {
        session.output = result.output;
        session.errors = result.errors;
        session.executionTime = result.executionTime;
      }

      task.resolve!(result);
    }

    this.isProcessing = false;
  }

  /**
   * Executes code in a sandboxed environment
   */
  private async executeInSandbox(task: ExecutionTask): Promise<{
    output: string;
    errors: string[];
    executionTime: number;
    success: boolean;
  }> {
    const startTime = Date.now();
    
    try {
      // This is a simplified implementation
      // In a real application, you would use Docker, VM, or a secure sandbox service
      const result = await this.mockCodeExecution(task.code, task.language);
      const executionTime = Date.now() - startTime;

      return {
        output: result.output,
        errors: result.errors,
        executionTime,
        success: result.success
      };
    } catch (error) {
      return {
        output: '',
        errors: [error instanceof Error ? error.message : 'Unknown execution error'],
        executionTime: Date.now() - startTime,
        success: false
      };
    }
  }

  /**
   * Mock code execution for demonstration
   * In production, this would interface with a real sandbox
   */
  private async mockCodeExecution(code: string, language: string): Promise<{
    output: string;
    errors: string[];
    success: boolean;
  }> {
    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

    if (language === 'python') {
      return this.mockPythonExecution(code);
    } else if (language === 'javascript' || language === 'typescript') {
      return this.mockJavaScriptExecution(code);
    }

    return {
      output: '',
      errors: [`Language ${language} not supported`],
      success: false
    };
  }

  /**
   * Mock Python execution
   */
  private mockPythonExecution(code: string): {
    output: string;
    errors: string[];
    success: boolean;
  } {
    const lines = code.split('\n').filter(line => line.trim());
    const output: string[] = [];
    const errors: string[] = [];

    for (const line of lines) {
      if (line.includes('print(')) {
        // Extract print content (simplified)
        const match = line.match(/print\(([^)]+)\)/);
        if (match) {
          let content = match[1].replace(/['"]/g, '');
          // Handle simple variable substitution
          if (content.includes('+')) {
            content = content.replace(/\s*\+\s*/g, '');
          }
          output.push(content);
        }
      } else if (line.includes('=') && !line.includes('==')) {
        // Variable assignment (mock)
        continue;
      } else if (line.includes('import ')) {
        // Check for allowed imports
        const importMatch = line.match(/import\s+(\w+)/);
        if (importMatch) {
          const module = importMatch[1];
          if (!LEARNING_CONFIG.playground.allowedPackages.includes(module)) {
            errors.push(`Module '${module}' is not allowed in the playground`);
          }
        }
      } else if (line.includes('def ') || line.includes('class ')) {
        // Function/class definition
        continue;
      } else if (line.includes('for ') || line.includes('while ') || line.includes('if ')) {
        // Control structures
        continue;
      }
    }

    return {
      output: output.join('\n'),
      errors,
      success: errors.length === 0
    };
  }

  /**
   * Mock JavaScript execution
   */
  private mockJavaScriptExecution(code: string): {
    output: string;
    errors: string[];
    success: boolean;
  } {
    const lines = code.split('\n').filter(line => line.trim());
    const output: string[] = [];
    const errors: string[] = [];

    for (const line of lines) {
      if (line.includes('console.log(')) {
        // Extract console.log content
        const match = line.match(/console\.log\(([^)]+)\)/);
        if (match) {
          let content = match[1].replace(/['"]/g, '');
          output.push(content);
        }
      } else if (line.includes('const ') || line.includes('let ') || line.includes('var ')) {
        // Variable declaration
        continue;
      } else if (line.includes('function ') || line.includes('=>')) {
        // Function definition
        continue;
      }
    }

    return {
      output: output.join('\n'),
      errors,
      success: errors.length === 0
    };
  }

  /**
   * Performs security checks on code
   */
  private performSecurityChecks(code: string, language: string): {
    passed: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const dangerousPatterns = [
      /import\s+os/,
      /import\s+sys/,
      /import\s+subprocess/,
      /eval\(/,
      /exec\(/,
      /\.__/,
      /file\s*\(/,
      /open\s*\(/,
      /input\s*\(/,
      /raw_input\s*\(/
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        errors.push(`Potentially unsafe code detected: ${pattern.source}`);
      }
    }

    // Check for infinite loops (basic detection)
    if (/while\s+True/i.test(code) && !/break/.test(code)) {
      errors.push('Potential infinite loop detected');
    }

    // Check code length
    if (code.length > 10000) {
      errors.push('Code too long (max 10,000 characters)');
    }

    return {
      passed: errors.length === 0,
      errors
    };
  }

  /**
   * Shares a playground session
   */
  shareSession(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.shared = true;
    return `${window.location.origin}/playground/shared/${sessionId}`;
  }

  /**
   * Gets a shared session
   */
  getSharedSession(sessionId: string): PlaygroundSession | null {
    const session = this.sessions.get(sessionId);
    return session && session.shared ? session : null;
  }

  /**
   * Gets session history for a user
   */
  getUserSessions(userId: string): PlaygroundSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Provides code suggestions based on context
   */
  getCodeSuggestions(code: string, cursorPosition: number, language: string): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];
    const currentLine = this.getCurrentLine(code, cursorPosition);

    if (language === 'python') {
      suggestions.push(...this.getPythonSuggestions(currentLine, code));
    } else if (language === 'javascript' || language === 'typescript') {
      suggestions.push(...this.getJavaScriptSuggestions(currentLine, code));
    }

    return suggestions.slice(0, 10); // Limit to 10 suggestions
  }

  /**
   * Gets the current line from code and cursor position
   */
  private getCurrentLine(code: string, cursorPosition: number): string {
    const beforeCursor = code.substring(0, cursorPosition);
    const lines = beforeCursor.split('\n');
    return lines[lines.length - 1];
  }

  /**
   * Gets Python-specific code suggestions
   */
  private getPythonSuggestions(currentLine: string, fullCode: string): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    // Import suggestions
    if (currentLine.trim().startsWith('import ') || currentLine.trim().startsWith('from ')) {
      LEARNING_CONFIG.playground.allowedPackages.forEach(pkg => {
        suggestions.push({
          text: pkg,
          displayText: `import ${pkg}`,
          type: 'import'
        });
      });
    }

    // Function suggestions
    if (currentLine.includes('.')) {
      const beforeDot = currentLine.split('.').slice(0, -1).join('.');
      if (beforeDot.includes('lionagi')) {
        suggestions.push(
          { text: 'Agent()', displayText: 'Agent()', type: 'method' },
          { text: 'Session()', displayText: 'Session()', type: 'method' },
          { text: 'Tool()', displayText: 'Tool()', type: 'method' }
        );
      }
    }

    // Print statement suggestion
    if (currentLine.includes('print') || currentLine === '') {
      suggestions.push({
        text: 'print()',
        displayText: 'print("Hello World")',
        type: 'statement'
      });
    }

    return suggestions;
  }

  /**
   * Gets JavaScript-specific code suggestions
   */
  private getJavaScriptSuggestions(currentLine: string, fullCode: string): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    // Console suggestions
    if (currentLine.includes('console')) {
      suggestions.push(
        { text: 'console.log()', displayText: 'console.log()', type: 'method' },
        { text: 'console.error()', displayText: 'console.error()', type: 'method' },
        { text: 'console.warn()', displayText: 'console.warn()', type: 'method' }
      );
    }

    // Function suggestions
    if (currentLine.trim() === '' || currentLine.includes('function')) {
      suggestions.push({
        text: 'function example() {}',
        displayText: 'function example() {\n  // code here\n}',
        type: 'function'
      });
    }

    return suggestions;
  }

  /**
   * Cleanup old sessions
   */
  cleanupSessions(): void {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (!session.shared && session.createdAt.getTime() < oneHourAgo) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

interface ExecutionTask {
  sessionId: string;
  code: string;
  language: string;
  timestamp: number;
  resolve?: (result: {
    output: string;
    errors: string[];
    executionTime: number;
    success: boolean;
  }) => void;
}

interface CodeSuggestion {
  text: string;
  displayText: string;
  type: 'import' | 'method' | 'statement' | 'function' | 'variable';
}
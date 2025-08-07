/**
 * Tests for Code Playground
 */

import { CodePlayground } from '../../src/modules/code-playground/playground';

describe('CodePlayground', () => {
  let playground: CodePlayground;
  
  beforeEach(() => {
    playground = new CodePlayground();
  });

  describe('createSession', () => {
    it('should create a new session with default values', async () => {
      const session = await playground.createSession('user1');
      
      expect(session).toBeDefined();
      expect(session.userId).toBe('user1');
      expect(session.language).toBe('python');
      expect(session.code).toBe('');
      expect(session.output).toBe('');
      expect(session.errors).toEqual([]);
    });

    it('should create a session with custom code and language', async () => {
      const session = await playground.createSession('user1', 'print("hello")', 'python');
      
      expect(session.code).toBe('print("hello")');
      expect(session.language).toBe('python');
    });
  });

  describe('executeCode', () => {
    it('should execute simple Python print statement', async () => {
      const session = await playground.createSession('user1', 'print("hello world")', 'python');
      const result = await playground.executeCode(session.id);
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('hello world');
      expect(result.errors).toEqual([]);
    });

    it('should detect syntax errors', async () => {
      const session = await playground.createSession('user1', 'def invalid syntax', 'python');
      const result = await playground.executeCode(session.id);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should block dangerous code', async () => {
      const session = await playground.createSession('user1', 'import os\nos.system("rm -rf /")', 'python');
      const result = await playground.executeCode(session.id);
      
      expect(result.success).toBe(false);
      expect(result.errors).toContain(expect.stringMatching(/unsafe code/i));
    });
  });

  describe('getCodeSuggestions', () => {
    it('should provide relevant suggestions for Python', () => {
      const suggestions = playground.getCodeSuggestions('print', 5, 'python');
      
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.text.includes('print'))).toBe(true);
    });

    it('should provide import suggestions', () => {
      const suggestions = playground.getCodeSuggestions('import ', 7, 'python');
      
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.type === 'import')).toBe(true);
    });
  });

  describe('shareSession', () => {
    it('should generate shareable URL for session', async () => {
      const session = await playground.createSession('user1', 'print("shared")', 'python');
      const url = playground.shareSession(session.id);
      
      expect(url).toContain('/playground/shared/');
      expect(url).toContain(session.id);
    });
  });
});
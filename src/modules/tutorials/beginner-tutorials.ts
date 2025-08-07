/**
 * Beginner Tutorial Content for lionagi
 * Step-by-step tutorials for foundation concepts
 */

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  sections: TutorialSection[];
}

export interface TutorialSection {
  heading: string;
  content: string;
  codeSnippet?: string;
}

export const beginnerTutorials: Tutorial[] = [
  {
    id: 'intro-to-branch',
    title: 'Understanding the Branch Concept',
    description: 'Learn the fundamental building block of lionagi - the Branch',
    sections: [
      {
        heading: 'What is a Branch?',
        content: `A Branch in lionagi is like a conversation thread with an AI model. Think of it as a smart notebook that:
        
        • Maintains conversation history
        • Manages the AI model connection
        • Handles tools and functions
        • Tracks the system context`,
        codeSnippet: `from lionagi import Branch

# A Branch is your AI conversation manager
branch = Branch()`
      }
    ]
  }
];

export function getTutorial(tutorialId: string): Tutorial | undefined {
  return beginnerTutorials.find(t => t.id === tutorialId);
}
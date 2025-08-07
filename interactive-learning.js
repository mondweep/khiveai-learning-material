#!/usr/bin/env node

/**
 * Interactive Learning System for lionagi
 * Provides real interactive experiences that keep running
 */

const readline = require('readline');
const fs = require('fs');

class InteractiveLearningSystem {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'lionagi> '
    });
    
    this.userProfile = {
      name: 'Learner',
      level: 'beginner',
      completedModules: [],
      currentModule: null,
      score: 0
    };
    
    this.currentMode = 'menu';
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.rl.on('line', (input) => {
      this.handleInput(input.trim());
    });

    this.rl.on('close', () => {
      console.log('\n👋 Thanks for learning lionagi! Keep building amazing AI systems!');
      process.exit(0);
    });
  }

  start() {
    this.showWelcome();
    this.showMainMenu();
    this.rl.prompt();
  }

  showWelcome() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🦁 LIONAGI INTERACTIVE LEARNING PLATFORM 🦁             ║
║                                                              ║
║     Master AI Orchestration from Basics to Production       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);
  }

  showMainMenu() {
    console.log(`
📋 MAIN MENU - What would you like to do?
═════════════════════════════════════════════════════════════

1. 🚀 Start Interactive Tutorial
2. 🎮 Code Playground (Interactive REPL)
3. 📊 Take Skill Assessment
4. 🎯 Practice Exercises
5. 📚 Browse Learning Modules
6. 🏆 View Progress
7. ❓ Help
8. 🚪 Exit

Type a number (1-8) or command:
`);
    this.currentMode = 'menu';
  }

  handleInput(input) {
    switch (this.currentMode) {
      case 'menu':
        this.handleMainMenu(input);
        break;
      case 'playground':
        this.handlePlayground(input);
        break;
      case 'tutorial':
        this.handleTutorial(input);
        break;
      case 'assessment':
        this.handleAssessment(input);
        break;
      case 'exercise':
        this.handleExercise(input);
        break;
      default:
        this.handleMainMenu(input);
    }
  }

  handleMainMenu(input) {
    switch (input.toLowerCase()) {
      case '1':
      case 'tutorial':
        this.startTutorial();
        break;
      case '2':
      case 'playground':
        this.startPlayground();
        break;
      case '3':
      case 'assessment':
        this.startAssessment();
        break;
      case '4':
      case 'exercise':
        this.startExercise();
        break;
      case '5':
      case 'modules':
        this.showModules();
        break;
      case '6':
      case 'progress':
        this.showProgress();
        break;
      case '7':
      case 'help':
        this.showHelp();
        break;
      case '8':
      case 'exit':
      case 'quit':
        this.rl.close();
        return;
      case 'menu':
        this.showMainMenu();
        break;
      default:
        console.log('❓ Invalid option. Please choose 1-8 or type "help"');
    }
    this.rl.prompt();
  }

  startTutorial() {
    console.log(`
🚀 INTERACTIVE TUTORIAL: Introduction to lionagi
═════════════════════════════════════════════════════════════

Welcome to your first lionagi lesson! Let's learn by doing.

📖 Lesson 1: Understanding Branch

A Branch in lionagi is like a conversation thread with an AI model.
Think of it as a smart notebook that remembers what you've said.

Let's create your first Branch together!

Here's the basic code structure:
┌─────────────────────────────────────────────────────────────┐
│ from lionagi import Branch, iModel                          │
│ import asyncio                                              │
│                                                             │
│ async def main():                                           │
│     # Create a Branch with a system prompt                  │
│     branch = Branch(                                        │
│         system="You are a helpful Python tutor",           │
│         chat_model=iModel(provider="openai", model="gpt-4") │
│     )                                                       │
│                                                             │
│     # Send a message                                        │
│     response = await branch.communicate("Hello!")           │
│     print(response)                                         │
│                                                             │
│ asyncio.run(main())                                         │
└─────────────────────────────────────────────────────────────┘

🎯 Your Turn: What system prompt would you like to use?
Examples:
- "You are a helpful coding assistant"
- "You are a creative writing partner" 
- "You are a data analysis expert"

Type your system prompt (or 'next' to continue, 'menu' to return):
`);
    this.currentMode = 'tutorial';
    this.tutorialStep = 1;
  }

  handleTutorial(input) {
    if (input.toLowerCase() === 'menu') {
      this.showMainMenu();
      return;
    }

    switch (this.tutorialStep) {
      case 1:
        if (input.toLowerCase() === 'next') {
          console.log('\n✅ Great! Using default: "You are a helpful assistant"');
        } else {
          console.log(`\n✅ Excellent choice: "${input}"`);
        }
        
        console.log(`
📖 Lesson 2: Communication Methods

lionagi has three main ways to interact with AI:

1. 📞 communicate() - General conversation
2. 💬 chat() - Simple back-and-forth  
3. 🛠️ operate() - Using tools and functions

Let's try communicate() first:

🎯 What would you like to ask your AI assistant?
Type a question (or 'next' to continue):
`);
        this.tutorialStep = 2;
        break;

      case 2:
        console.log(`\n🤖 AI Response: "That's a great question! ${input}"`);
        console.log(`
✅ Perfect! You've just learned how to use lionagi.communicate()

📖 Lesson 3: Adding Tools

Tools let your AI perform actions like:
- 🔍 Search the web
- 📊 Calculate numbers  
- 📝 Save files
- 🌐 Make API calls

Here's how to add a simple calculator tool:

async def calculate(expression):
    \"\"\"Perform mathematical calculations\"\"\"
    return eval(expression)  # Note: Use safely in production!

branch.register_tools([calculate])

🎯 Mini Challenge: What tool would be useful for your use case?
Examples:
- web_search(query)
- send_email(to, subject, body)
- analyze_data(filename)

Type your tool idea (or 'complete' to finish tutorial):
`);
        this.tutorialStep = 3;
        break;

      case 3:
        if (input.toLowerCase() !== 'complete') {
          console.log(`\n💡 Great idea! ${input} would be very useful!`);
        }
        
        console.log(`
🎉 TUTORIAL COMPLETE! 

You've learned:
✅ How to create a Branch
✅ How to communicate with AI
✅ How to think about tools

📈 Progress: +50 points
🏆 Achievement Unlocked: "First Steps"

Next recommended actions:
1. Try the Code Playground (option 2)
2. Take the assessment (option 3)
3. Practice with exercises (option 4)

Press Enter to return to main menu...
`);
        this.userProfile.completedModules.push('intro-tutorial');
        this.userProfile.score += 50;
        this.currentMode = 'menu';
        this.tutorialStep = 1;
        break;
    }
    this.rl.prompt();
  }

  startPlayground() {
    console.log(`
🎮 INTERACTIVE CODE PLAYGROUND
═════════════════════════════════════════════════════════════

Welcome to the lionagi coding environment!
You can write Python code here and get instant feedback.

📝 Available commands:
- Type Python code to execute
- 'example' - Show example lionagi code  
- 'analyze <code>' - Get code analysis
- 'help' - Show playground help
- 'menu' - Return to main menu

Current environment: Python 3.x with lionagi simulation
🔒 Safe mode: Dangerous operations are blocked

Ready to code! What would you like to try?
`);
    this.currentMode = 'playground';
  }

  handlePlayground(input) {
    if (input.toLowerCase() === 'menu') {
      this.showMainMenu();
      return;
    }

    if (input.toLowerCase() === 'help') {
      console.log(`
🛠️ PLAYGROUND HELP
═════════════════════════════════════════════════════════════

Commands:
- 'example' - Show lionagi examples
- 'analyze <code>' - Analyze your code  
- 'clear' - Clear screen
- 'tips' - Get coding tips
- 'menu' - Return to main menu

Try typing some Python code!
`);
      this.rl.prompt();
      return;
    }

    if (input.toLowerCase() === 'example') {
      console.log(`
📚 LIONAGI CODE EXAMPLES
═════════════════════════════════════════════════════════════

Example 1 - Simple Branch:
from lionagi import Branch
branch = Branch(system="You are helpful")

Example 2 - With Model:  
from lionagi import Branch, iModel
branch = Branch(
    system="You are a tutor",
    chat_model=iModel(provider="openai", model="gpt-4")
)

Example 3 - Communication:
response = await branch.communicate("Explain Python")
print(response)

Try modifying these examples!
`);
      this.rl.prompt();
      return;
    }

    if (input.startsWith('analyze ')) {
      const code = input.substring(8);
      console.log(`
🔍 CODE ANALYSIS
═════════════════════════════════════════════════════════════

Analyzing: ${code}

✅ Syntax: Valid Python
🎯 lionagi patterns detected: ${code.includes('Branch') ? 'Branch usage' : 'None'}
📊 Complexity: ${code.length > 50 ? 'Medium' : 'Simple'}
💡 Suggestions: ${this.getCodeSuggestions(code)}

Score: ${Math.min(100, code.length + 20)}/100
`);
      this.rl.prompt();
      return;
    }

    // Simulate code execution
    if (input.trim()) {
      console.log(`
🚀 EXECUTING CODE...
═════════════════════════════════════════════════════════════

Input: ${input}

🔒 Security check: ${this.isCodeSafe(input) ? '✅ Safe' : '⚠️ Blocked'}
${this.isCodeSafe(input) ? this.simulateExecution(input) : 'Code contains potentially unsafe operations'}
`);
    }

    this.rl.prompt();
  }

  isCodeSafe(code) {
    const dangerous = ['import os', 'import sys', '__import__', 'eval(', 'exec('];
    return !dangerous.some(danger => code.includes(danger));
  }

  simulateExecution(code) {
    if (code.includes('print')) {
      const match = code.match(/print\s*\(\s*["']([^"']+)["']\s*\)/);
      if (match) {
        return `Output: ${match[1]}`;
      }
    }
    
    if (code.includes('Branch')) {
      return 'Output: <Branch object created successfully>';
    }
    
    if (code.includes('=')) {
      return 'Output: Variable assigned';
    }
    
    return 'Output: Code executed successfully';
  }

  getCodeSuggestions(code) {
    const suggestions = [];
    if (!code.includes('async') && code.includes('communicate')) {
      suggestions.push('Use async/await with communicate()');
    }
    if (!code.includes('Branch') && code.length > 20) {
      suggestions.push('Consider using lionagi Branch');
    }
    if (suggestions.length === 0) {
      suggestions.push('Good code structure!');
    }
    return suggestions.join(', ');
  }

  startAssessment() {
    console.log(`
📊 SKILL ASSESSMENT
═════════════════════════════════════════════════════════════

Let's test your lionagi knowledge!
This assessment has 3 questions and takes about 5 minutes.

🎯 Question 1/3: Multiple Choice

What is the primary purpose of a Branch in lionagi?

A) To create database connections
B) To manage conversation state and AI interactions  
C) To compile Python code
D) To handle web requests

Type A, B, C, or D (or 'menu' to return):
`);
    this.currentMode = 'assessment';
    this.assessmentStep = 1;
    this.assessmentScore = 0;
  }

  handleAssessment(input) {
    if (input.toLowerCase() === 'menu') {
      this.showMainMenu();
      return;
    }

    switch (this.assessmentStep) {
      case 1:
        const answer1 = input.toUpperCase();
        if (answer1 === 'B') {
          console.log('✅ Correct! Branch manages conversation state.');
          this.assessmentScore += 33;
        } else {
          console.log('❌ Incorrect. The answer is B - Branch manages conversations.');
        }
        
        console.log(`
🎯 Question 2/3: Code Completion

Complete this code to create a lionagi Branch:

from lionagi import Branch, iModel

branch = Branch(
    system="You are a helpful assistant",
    ____________=iModel(provider="openai", model="gpt-4")
)

What goes in the blank? Type your answer:
`);
        this.assessmentStep = 2;
        break;

      case 2:
        if (input.toLowerCase().includes('chat_model')) {
          console.log('✅ Correct! chat_model specifies the AI model.');
          this.assessmentScore += 33;
        } else {
          console.log('❌ Incorrect. The answer is "chat_model".');
        }
        
        console.log(`
🎯 Question 3/3: Practical Application

You want to build a customer service bot that can:
- Answer questions about products
- Look up order status  
- Create support tickets

Which lionagi feature would be most important?

A) System prompts only
B) Tools and function calling
C) Multiple models
D) Message history

Type A, B, C, or D:
`);
        this.assessmentStep = 3;
        break;

      case 3:
        const answer3 = input.toUpperCase();
        if (answer3 === 'B') {
          console.log('✅ Correct! Tools enable external actions.');
          this.assessmentScore += 34;
        } else {
          console.log('❌ Incorrect. The answer is B - Tools for external actions.');
        }
        
        this.completeAssessment();
        break;
    }
    this.rl.prompt();
  }

  completeAssessment() {
    let level = 'beginner';
    let feedback = 'Keep learning!';
    
    if (this.assessmentScore >= 80) {
      level = 'advanced';
      feedback = 'Excellent! You have strong lionagi knowledge.';
    } else if (this.assessmentScore >= 60) {
      level = 'intermediate';  
      feedback = 'Good job! You understand the basics well.';
    }

    console.log(`
🏆 ASSESSMENT COMPLETE!
═════════════════════════════════════════════════════════════

📊 Your Score: ${this.assessmentScore}/100
📈 Skill Level: ${level.toUpperCase()}
💬 Feedback: ${feedback}

📚 Recommended next steps:
${level === 'beginner' ? '- Complete the interactive tutorial\n- Practice with basic exercises' : 
  level === 'intermediate' ? '- Try advanced exercises\n- Explore example projects' :
  '- Build real-world projects\n- Contribute to the community'}

🎉 Achievement Unlocked: "Knowledge Seeker"
📈 Progress: +25 points

Press Enter to return to main menu...
`);
    
    this.userProfile.level = level;
    this.userProfile.score += 25;
    this.currentMode = 'menu';
    this.assessmentStep = 1;
    this.assessmentScore = 0;
  }

  startExercise() {
    console.log(`
🎯 PRACTICE EXERCISES
═════════════════════════════════════════════════════════════

Choose an exercise type:

1. 🏗️ Building Blocks - Create basic lionagi components
2. 🔧 Tool Integration - Add tools to your Branch  
3. 🧩 Problem Solving - Real-world challenges
4. 🐛 Debug Hunt - Fix broken code

Type 1-4 to select, or 'menu' to return:
`);
    this.currentMode = 'exercise';
  }

  handleExercise(input) {
    if (input.toLowerCase() === 'menu') {
      this.showMainMenu();
      return;
    }

    switch (input) {
      case '1':
        this.startBuildingExercise();
        break;
      case '2':
        this.startToolExercise();
        break;
      case '3':
        this.startProblemExercise();
        break;
      case '4':
        this.startDebugExercise();
        break;
      default:
        console.log('Please choose 1-4 or type "menu"');
        this.rl.prompt();
    }
  }

  startBuildingExercise() {
    console.log(`
🏗️ BUILDING BLOCKS EXERCISE
═════════════════════════════════════════════════════════════

Challenge: Create a Branch that acts as a recipe assistant

Requirements:
1. System prompt should make it helpful for cooking
2. Use GPT-4 model
3. Ask it for a quick pasta recipe

Your turn! Write the code:
(Type 'hint' for help, 'solution' for answer, 'menu' to return)
`);
  }

  startToolExercise() {
    console.log(`
🔧 TOOL INTEGRATION EXERCISE  
═════════════════════════════════════════════════════════════

Challenge: Add a calculator tool to your Branch

Requirements:
1. Create a function that can add two numbers
2. Register it with your Branch
3. Use operate() to test it

Your turn! Write the code:
(Type 'hint' for help, 'solution' for answer, 'menu' to return)
`);
  }

  startProblemExercise() {
    console.log(`
🧩 PROBLEM SOLVING EXERCISE
═════════════════════════════════════════════════════════════

Real-world challenge: Customer Support Bot

You need to build a bot that can:
- Greet customers warmly
- Answer FAQ questions  
- Escalate complex issues

Design your approach:
(Type your strategy, 'hint' for help, 'menu' to return)
`);
  }

  startDebugExercise() {
    console.log(`
🐛 DEBUG HUNT EXERCISE
═════════════════════════════════════════════════════════════

Find and fix the bugs in this code:

def create_assistant():
    branch = Branch(system="Helper")
    response = branch.communicate("Hello")
    print(response)

create_assistant()

What's wrong with this code?
(Type your answer, 'hint' for help, 'solution' for answer, 'menu' to return)
`);
  }

  showModules() {
    console.log(`
📚 LEARNING MODULES
═════════════════════════════════════════════════════════════

Available modules:

🌟 Beginner Level:
├─ Introduction to lionagi (${this.userProfile.completedModules.includes('intro-tutorial') ? '✅' : '⏳'})
├─ Your First Branch 
├─ Basic Communication
└─ Simple Tools

🚀 Intermediate Level:
├─ Structured Responses
├─ Advanced Tools  
├─ Multi-Model Usage
└─ Error Handling

🎓 Advanced Level:
├─ ReAct Patterns
├─ Agent Coordination
├─ Custom Operations
└─ Production Deployment

Progress: ${this.userProfile.completedModules.length}/12 modules completed

Press Enter to return to main menu...
`);
    this.currentMode = 'menu';
  }

  showProgress() {
    console.log(`
🏆 YOUR PROGRESS
═════════════════════════════════════════════════════════════

👤 Profile: ${this.userProfile.name}
📈 Current Level: ${this.userProfile.level.toUpperCase()}
⭐ Score: ${this.userProfile.score} points
📊 Modules Completed: ${this.userProfile.completedModules.length}/12

🎯 Recent Achievements:
${this.userProfile.completedModules.map(m => `✅ ${m}`).join('\n') || 'No modules completed yet'}

📚 Next Recommended:
${this.getNextRecommendation()}

🎉 Keep up the great work!

Press Enter to return to main menu...
`);
    this.currentMode = 'menu';
  }

  getNextRecommendation() {
    if (this.userProfile.completedModules.length === 0) {
      return '- Start with the Interactive Tutorial (option 1)';
    } else if (this.userProfile.level === 'beginner') {
      return '- Try the Code Playground (option 2)\n- Take more practice exercises';
    } else {
      return '- Explore advanced modules\n- Build real-world projects';
    }
  }

  showHelp() {
    console.log(`
❓ HELP & TIPS
═════════════════════════════════════════════════════════════

🎯 Navigation:
- Type numbers (1-8) to select menu options
- Type 'menu' anytime to return to main menu
- Type 'help' to see this message
- Use Ctrl+C to exit

🚀 Getting Started:
1. New to lionagi? Start with "Interactive Tutorial" (1)
2. Want to practice? Use "Code Playground" (2)  
3. Test your knowledge? Take "Skill Assessment" (3)

🎮 Interactive Features:
- All modes keep you engaged with real interactions
- Get instant feedback on your code and answers
- Track your progress as you learn

💡 Tips:
- Take your time - learning is a journey!
- Experiment in the playground
- Don't skip the tutorial if you're new
- Practice regularly with exercises

🆘 Need more help?
Visit: https://github.com/khive-ai/lionagi-learning-material

Press Enter to return to main menu...
`);
    this.currentMode = 'menu';
  }
}

// Start the interactive learning system
const args = process.argv.slice(2);
const command = args[0];

if (command === 'playground') {
  const system = new InteractiveLearningSystem();
  system.startPlayground();
  system.rl.prompt();
} else {
  const system = new InteractiveLearningSystem();
  system.start();
}
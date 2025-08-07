#!/usr/bin/env node

/**
 * Start Platform - Stable version that stays running
 */

const readline = require('readline');

class LionagiLearningPlatform {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        this.userProfile = {
            name: 'Learner',
            level: 'beginner',
            score: 0,
            completedLessons: []
        };
        
        this.currentMode = 'menu';
    }

    start() {
        console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🦁 LIONAGI INTERACTIVE LEARNING PLATFORM 🦁             ║
║                                                              ║
║     Master AI Orchestration from Basics to Production       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);
        this.showMainMenu();
        this.waitForInput();
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

Type a number (1-8) or command:`);
    }

    waitForInput() {
        this.rl.question('\nlionagi> ', (input) => {
            this.handleInput(input.trim());
        });
    }

    handleInput(input) {
        const choice = input.toLowerCase();

        switch (choice) {
            case '1':
                this.startTutorial();
                break;
            case '2':
                this.startPlayground();
                break;
            case '3':
                this.startAssessment();
                break;
            case '4':
                this.startExercises();
                break;
            case '5':
                this.browseModules();
                break;
            case '6':
                this.viewProgress();
                break;
            case '7':
                this.showHelp();
                break;
            case '8':
            case 'exit':
            case 'quit':
                this.exit();
                return;
            case 'menu':
                this.showMainMenu();
                this.waitForInput();
                break;
            case 'help':
                this.showHelp();
                break;
            default:
                console.log(`
❌ Invalid option: "${input}"
💡 Type a number (1-8), 'menu' to return to main menu, or 'help' for assistance.`);
                this.waitForInput();
        }
    }

    startTutorial() {
        console.log(`
🚀 INTERACTIVE TUTORIAL STARTED
════════════════════════════════

📚 Lesson 1: Introduction to lionagi
────────────────────────────────────

Welcome to lionagi! Let's start with the basics.

lionagi is an AI orchestration framework that helps you build 
intelligent systems by managing AI model interactions.

🔑 Key Concept: Branch
A Branch is the core component that manages AI conversations.

Example:
\`\`\`python
from lionagi import Branch, iModel

# Create a branch
branch = Branch(
    system="You are a helpful assistant",
    chat_model=iModel(provider="openai", model="gpt-4")
)

# Communicate with AI
response = await branch.communicate("Hello!")
\`\`\`

📝 Quick Check: What is the main component for managing AI conversations?
Type your answer:`);

        this.rl.question('\nYour answer> ', (answer) => {
            if (answer.toLowerCase().includes('branch')) {
                console.log(`
✅ Correct! A Branch is indeed the main component.

🎉 You've completed Lesson 1!
📈 +10 points to your score!

Continue? (y/n):`);
                
                this.rl.question('', (cont) => {
                    if (cont.toLowerCase() === 'y') {
                        this.tutorialLesson2();
                    } else {
                        console.log('\n🏠 Returning to main menu...');
                        this.showMainMenu();
                        this.waitForInput();
                    }
                });
            } else {
                console.log(`
❌ Not quite right. The answer is "Branch".

💡 A Branch manages AI conversations and maintains context.

Continue anyway? (y/n):`);
                
                this.rl.question('', (cont) => {
                    if (cont.toLowerCase() === 'y') {
                        this.tutorialLesson2();
                    } else {
                        console.log('\n🏠 Returning to main menu...');
                        this.showMainMenu();
                        this.waitForInput();
                    }
                });
            }
        });
    }

    tutorialLesson2() {
        console.log(`
📚 Lesson 2: AI Models with iModel
──────────────────────────────────

The iModel class configures which AI provider and model to use.

Supported providers:
• openai (GPT-3.5, GPT-4)
• anthropic (Claude)
• groq (Fast inference)

Example configurations:
\`\`\`python
# OpenAI GPT-4
model = iModel(provider="openai", model="gpt-4")

# Anthropic Claude
model = iModel(provider="anthropic", model="claude-3-haiku-20240307")
\`\`\`

📝 Quick Check: What are the three supported providers?
Type them separated by commas:`);

        this.rl.question('\nProviders> ', (answer) => {
            const providers = ['openai', 'anthropic', 'groq'];
            const userProviders = answer.toLowerCase().split(',').map(p => p.trim());
            
            if (providers.every(p => userProviders.some(up => up.includes(p)))) {
                console.log(`
✅ Excellent! You got all three: OpenAI, Anthropic, and Groq!

🎊 Tutorial Complete!
📈 Total Score: +25 points!

What would you like to do next?
1. Try the Code Playground
2. Take Skill Assessment
3. Return to Main Menu

Choice:`);
                
                this.rl.question('', (next) => {
                    switch (next) {
                        case '1':
                            this.startPlayground();
                            break;
                        case '2':
                            this.startAssessment();
                            break;
                        default:
                            this.showMainMenu();
                            this.waitForInput();
                    }
                });
            } else {
                console.log(`
🔄 Close! The three providers are: OpenAI, Anthropic, and Groq.

🎊 Tutorial Complete anyway!
📈 Score: +20 points for effort!

🏠 Returning to main menu...`);
                this.showMainMenu();
                this.waitForInput();
            }
        });
    }

    startPlayground() {
        console.log(`
🎮 CODE PLAYGROUND
═══════════════════

Welcome to the interactive lionagi code playground!
Here you can practice lionagi syntax and get instant feedback.

🎯 Try typing some lionagi code patterns:
• branch creation
• model configuration  
• communication
• tools

Type 'examples' to see code examples
Type 'menu' to return to main menu
Type 'help' for playground commands

Ready to code!`);

        this.playgroundLoop();
    }

    playgroundLoop() {
        this.rl.question('\nplayground> ', (code) => {
            const input = code.trim().toLowerCase();
            
            if (input === 'menu') {
                this.showMainMenu();
                this.waitForInput();
                return;
            }
            
            if (input === 'examples') {
                console.log(`
📋 LIONAGI CODE EXAMPLES:
═════════════════════════

1. Basic Branch:
   from lionagi import Branch, iModel
   branch = Branch(system="You are helpful")

2. With Model:
   model = iModel(provider="openai", model="gpt-4")
   branch = Branch(system="...", chat_model=model)

3. Communication:
   response = await branch.communicate("Hello!")

4. Structured Response:
   from pydantic import BaseModel
   class Result(BaseModel):
       answer: str
   result = await branch.communicate("...", response_format=Result)

Try typing any of these patterns!`);
                this.playgroundLoop();
                return;
            }
            
            // Simulate code analysis
            this.analyzeCode(code);
            this.playgroundLoop();
        });
    }

    analyzeCode(code) {
        if (code.includes('Branch')) {
            console.log(`
✅ Great! You're using Branch - the core component.
💡 Branch manages AI conversations and maintains context.`);
        }
        
        if (code.includes('iModel')) {
            console.log(`
✅ Perfect! iModel configures which AI provider to use.
💡 Remember to set provider and model parameters.`);
        }
        
        if (code.includes('communicate')) {
            console.log(`
✅ Excellent! communicate() sends messages to the AI.
💡 This is how you interact with AI models through lionagi.`);
        }
        
        if (code.includes('await')) {
            console.log(`
✅ Good async usage! lionagi operations are asynchronous.
💡 Don't forget to use async/await for real implementations.`);
        }
        
        if (!code.includes('Branch') && !code.includes('iModel') && code.trim()) {
            console.log(`
🤔 Interesting code! Here's how to make it lionagi-specific:
💡 Try using Branch, iModel, or communicate patterns.
💡 Type 'examples' to see lionagi code patterns.`);
        }
    }

    startAssessment() {
        console.log(`
📊 SKILL ASSESSMENT
════════════════════

Let's evaluate your lionagi knowledge!
This will help create a personalized learning path.

🎯 Question 1/3: What is lionagi?
a) A Python web framework
b) An AI orchestration framework  
c) A database system
d) A machine learning library

Type your answer (a, b, c, or d):`);

        this.rl.question('\nassessment> ', (answer) => {
            if (answer.toLowerCase() === 'b') {
                console.log(`✅ Correct! +10 points`);
                this.userProfile.score += 10;
            } else {
                console.log(`❌ Incorrect. The answer is 'b' - AI orchestration framework.`);
            }
            
            this.assessmentQuestion2();
        });
    }

    assessmentQuestion2() {
        console.log(`
🎯 Question 2/3: Which component manages AI conversations?
a) iModel
b) Branch
c) Communicate
d) Provider

Type your answer:`);

        this.rl.question('\nassessment> ', (answer) => {
            if (answer.toLowerCase() === 'b') {
                console.log(`✅ Correct! +10 points`);
                this.userProfile.score += 10;
            } else {
                console.log(`❌ Incorrect. The answer is 'b' - Branch manages conversations.`);
            }
            
            this.assessmentQuestion3();
        });
    }

    assessmentQuestion3() {
        console.log(`
🎯 Question 3/3: Which providers does lionagi support?
a) Only OpenAI
b) OpenAI and Anthropic
c) OpenAI, Anthropic, and Groq
d) Only local models

Type your answer:`);

        this.rl.question('\nassessment> ', (answer) => {
            if (answer.toLowerCase() === 'c') {
                console.log(`✅ Correct! +10 points`);
                this.userProfile.score += 10;
            } else {
                console.log(`❌ Incorrect. The answer is 'c' - OpenAI, Anthropic, and Groq.`);
            }
            
            this.showAssessmentResults();
        });
    }

    showAssessmentResults() {
        const level = this.userProfile.score >= 25 ? 'Advanced' : 
                     this.userProfile.score >= 15 ? 'Intermediate' : 'Beginner';
        
        console.log(`
📈 ASSESSMENT COMPLETE!
═══════════════════════

🎯 Your Score: ${this.userProfile.score}/30 points
📊 Your Level: ${level}

📚 Recommended Learning Path:
${level === 'Beginner' ? 
  '→ Start with Interactive Tutorial\n→ Practice in Code Playground\n→ Try Basic Exercises' :
  level === 'Intermediate' ?
  '→ Advanced Patterns Module\n→ Real-world Projects\n→ Production Techniques' :
  '→ Expert Techniques\n→ Custom Integrations\n→ Performance Optimization'
}

Continue learning? (y/n):`);

        this.rl.question('', (cont) => {
            if (cont.toLowerCase() === 'y') {
                this.showMainMenu();
                this.waitForInput();
            } else {
                this.exit();
            }
        });
    }

    startExercises() {
        console.log(`
🎯 PRACTICE EXERCISES
══════════════════════

Choose an exercise:

1. 🤖 Build a Simple Chatbot
2. 📝 Create a Code Reviewer  
3. 🔍 Design a Research Assistant
4. 🏠 Return to Main Menu

Which exercise interests you?`);

        this.rl.question('\nexercise> ', (choice) => {
            switch (choice) {
                case '1':
                    this.exerciseChatbot();
                    break;
                case '2':
                    this.exerciseCodeReviewer();
                    break;
                case '3':
                    this.exerciseResearchAssistant();
                    break;
                default:
                    this.showMainMenu();
                    this.waitForInput();
            }
        });
    }

    exerciseChatbot() {
        console.log(`
🤖 EXERCISE: Build a Simple Chatbot
════════════════════════════════════

Your task: Create a chatbot that can answer questions about Python.

Requirements:
✓ Use lionagi Branch
✓ Configure with appropriate system message
✓ Handle user questions
✓ Provide helpful responses

Here's the template:

\`\`\`python
from lionagi import Branch, iModel

# TODO: Create your chatbot
# 1. Define system message
# 2. Create Branch with iModel
# 3. Add conversation loop

async def chatbot():
    # Your code here
    pass
\`\`\`

💡 Hint: Start with a system message like "You are a helpful Python tutor"

Ready to code? Type 'solution' to see the answer, or 'menu' to go back:`);

        this.rl.question('\nchatbot> ', (input) => {
            if (input === 'solution') {
                console.log(`
💡 SOLUTION:
════════════

\`\`\`python
from lionagi import Branch, iModel

async def chatbot():
    branch = Branch(
        system="You are a helpful Python programming tutor",
        chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
    )
    
    while True:
        question = input("Ask me about Python: ")
        if question.lower() == 'quit':
            break
            
        response = await branch.communicate(question)
        print(f"Tutor: {response}")

# Run it
import asyncio
asyncio.run(chatbot())
\`\`\`

🎉 Excellent work! You've built a Python tutoring chatbot!

Press Enter to continue...`);
                
                this.rl.question('', () => {
                    this.startExercises();
                });
            } else {
                this.showMainMenu();
                this.waitForInput();
            }
        });
    }

    exerciseCodeReviewer() {
        console.log(`
📝 EXERCISE: Create a Code Reviewer
═══════════════════════════════════

Build an AI that reviews Python code for quality and bugs.

Requirements:
✓ Use structured responses (Pydantic)
✓ Rate code quality (1-10)
✓ Suggest improvements
✓ Check for common issues

This is a more advanced exercise - great for learning!

Press Enter to return to exercises menu...`);

        this.rl.question('', () => {
            this.startExercises();
        });
    }

    exerciseResearchAssistant() {
        console.log(`
🔍 EXERCISE: Design a Research Assistant
═══════════════════════════════════════

Create an AI that helps with research tasks.

Features to implement:
✓ Summarize topics
✓ Generate research questions
✓ Suggest sources
✓ Create outlines

This combines multiple lionagi concepts!

Press Enter to return to exercises menu...`);

        this.rl.question('', () => {
            this.startExercises();
        });
    }

    browseModules() {
        console.log(`
📚 LEARNING MODULES
════════════════════

🎓 Available Curriculum:

📖 Level 1: lionagi Foundations (12 hours)
   • Introduction to AI Orchestration
   • Branch and iModel Basics
   • Communication Patterns
   • Error Handling
   • Basic Projects

📈 Level 2: Advanced Patterns (15 hours)  
   • Structured Responses with Pydantic
   • Tool Integration
   • Multi-agent Systems
   • Context Management
   • Performance Optimization

🏭 Level 3: Production Systems (12 hours)
   • Scalability Patterns
   • Error Recovery
   • Monitoring and Logging
   • Testing Strategies
   • Deployment Best Practices

🚀 Level 4: Expert Techniques (7 hours)
   • Custom Provider Integration
   • Advanced Tool Chains
   • Memory Management
   • Plugin Architecture
   • Contributing to lionagi

📊 Your Progress: ${this.userProfile.completedLessons.length} lessons completed

Press Enter to return to main menu...`);

        this.rl.question('', () => {
            this.showMainMenu();
            this.waitForInput();
        });
    }

    viewProgress() {
        console.log(`
🏆 YOUR PROGRESS
═════════════════

👤 Profile: ${this.userProfile.name}
📊 Level: ${this.userProfile.level}
🎯 Score: ${this.userProfile.score} points
📚 Completed: ${this.userProfile.completedLessons.length} lessons

🏅 ACHIEVEMENTS:
${this.userProfile.score >= 10 ? '✅ First Steps - Completed your first lesson' : '⏳ First Steps - Complete a lesson'}
${this.userProfile.score >= 25 ? '✅ Tutorial Master - Finished the tutorial' : '⏳ Tutorial Master - Complete the tutorial'}
${this.userProfile.score >= 50 ? '✅ Code Warrior - Practiced in playground' : '⏳ Code Warrior - Use the code playground'}

📈 NEXT STEPS:
${this.userProfile.score < 10 ? '→ Try the Interactive Tutorial' : ''}
${this.userProfile.score >= 10 && this.userProfile.score < 25 ? '→ Complete the Tutorial' : ''}
${this.userProfile.score >= 25 ? '→ Practice in Code Playground\n→ Try Advanced Exercises' : ''}

Press Enter to return to main menu...`);

        this.rl.question('', () => {
            this.showMainMenu();
            this.waitForInput();
        });
    }

    showHelp() {
        console.log(`
❓ HELP & SUPPORT
══════════════════

🎯 NAVIGATION:
• Type numbers (1-8) to select menu options
• Type 'menu' to return to main menu anytime
• Type 'help' for this help screen
• Type 'exit' or 'quit' to end session
• Use Ctrl+C for immediate exit

🎮 FEATURES:
• Interactive Tutorial: Learn step-by-step
• Code Playground: Practice lionagi syntax
• Skill Assessment: Test your knowledge
• Practice Exercises: Real-world challenges
• Learning Modules: Comprehensive curriculum
• Progress Tracking: See your achievements

⚠️  IMPORTANT NOTES:
• This is an educational SIMULATION
• For real lionagi development, use your Python environment
• The playground shows patterns but doesn't execute real code
• See README.md for actual development setup

🆘 TROUBLESHOOTING:
• Platform not responding? Try Ctrl+C and restart
• Want real lionagi? Use: python examples/lionagi_walkthrough.py
• Need API setup? Check the .env file configuration

Press Enter to return to main menu...`);

        this.rl.question('', () => {
            this.showMainMenu();
            this.waitForInput();
        });
    }

    exit() {
        console.log(`
👋 Thanks for using the lionagi Learning Platform!

📊 Session Summary:
• Score: ${this.userProfile.score} points
• Level: ${this.userProfile.level}
• Lessons: ${this.userProfile.completedLessons.length} completed

🚀 Next Steps:
• For real lionagi development: python examples/lionagi_walkthrough.py
• Check out the README.md for setup instructions
• Keep practicing and building amazing AI systems!

Happy coding! 🦁✨`);
        
        this.rl.close();
        process.exit(0);
    }
}

// Start the platform
const platform = new LionagiLearningPlatform();
platform.start();
/**
 * Exercise Templates for Progressive Learning
 * Pre-defined exercise patterns for lionagi concepts
 */

export interface ExerciseTemplate {
  id: string;
  concept: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'coding' | 'debugging' | 'completion' | 'refactoring';
  template: string;
  variables: TemplateVariable[];
  solution: string;
  hints: string[];
  testCases?: TestCase[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'array' | 'object' | 'code';
  options?: any[];
  generator?: () => any;
}

export interface TestCase {
  input: any;
  expectedOutput: any;
  description: string;
}

export const exerciseTemplates: ExerciseTemplate[] = [
  // Beginner Templates
  {
    id: 'basic-branch-creation',
    concept: 'Branch creation',
    difficulty: 'beginner',
    type: 'coding',
    template: `# Create a Branch with a system prompt that makes the AI act as a {{role}}
# The AI should be {{personality}} and {{expertise}}

from lionagi import Branch, iModel
import asyncio

async def create_assistant():
    # TODO: Create your Branch here
    branch = None  # Replace this line
    
    # Test your branch
    response = await branch.communicate("{{test_question}}")
    print(response)
    return branch

# Run the function
asyncio.run(create_assistant())`,
    variables: [
      {
        name: 'role',
        type: 'string',
        options: ['math tutor', 'coding mentor', 'language teacher', 'science explainer']
      },
      {
        name: 'personality',
        type: 'string',
        options: ['friendly', 'professional', 'encouraging', 'patient']
      },
      {
        name: 'expertise',
        type: 'string',
        options: ['explain concepts clearly', 'provide examples', 'give step-by-step guidance']
      },
      {
        name: 'test_question',
        type: 'string',
        generator: () => {
          const questions = [
            'Can you introduce yourself?',
            'What can you help me with?',
            'How do you approach teaching?'
          ];
          return questions[Math.floor(Math.random() * questions.length)];
        }
      }
    ],
    solution: `from lionagi import Branch, iModel
import asyncio

async def create_assistant():
    branch = Branch(
        system="You are a {{role}}. You are {{personality}} and {{expertise}}.",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    response = await branch.communicate("{{test_question}}")
    print(response)
    return branch

asyncio.run(create_assistant())`,
    hints: [
      'Remember to import Branch and iModel from lionagi',
      'The system parameter defines the AI\'s behavior',
      'Don\'t forget to specify the chat_model'
    ]
  },
  {
    id: 'simple-conversation',
    concept: 'Basic communication',
    difficulty: 'beginner',
    type: 'completion',
    template: `from lionagi import Branch, iModel
import asyncio

async def have_conversation():
    branch = Branch(
        system="You are a helpful assistant",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    # TODO: Send these messages in sequence and print responses:
    # 1. "Hello!"
    # 2. "What's the weather like?"
    # 3. "Thank you!"
    
    # Your code here
    {{code_placeholder}}

asyncio.run(have_conversation())`,
    variables: [
      {
        name: 'code_placeholder',
        type: 'code',
        generator: () => '# Add your communication code here'
      }
    ],
    solution: `from lionagi import Branch, iModel
import asyncio

async def have_conversation():
    branch = Branch(
        system="You are a helpful assistant",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    response1 = await branch.communicate("Hello!")
    print("AI:", response1)
    
    response2 = await branch.communicate("What's the weather like?")
    print("AI:", response2)
    
    response3 = await branch.communicate("Thank you!")
    print("AI:", response3)

asyncio.run(have_conversation())`,
    hints: [
      'Use await branch.communicate() for each message',
      'The branch maintains conversation context',
      'Print each response to see the conversation flow'
    ]
  },
  {
    id: 'debugging-async',
    concept: 'Async/await debugging',
    difficulty: 'beginner',
    type: 'debugging',
    template: `from lionagi import Branch, iModel
import asyncio

# This code has errors. Fix them!

def chat_with_ai():  # Error 1: Should be async
    branch = Branch(
        system="You are a helpful assistant",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    # Error 2: Missing await
    response = branch.communicate("Explain Python in one sentence")
    print(response)
    
    return response

# Error 3: Wrong way to run async function
chat_with_ai()`,
    variables: [],
    solution: `from lionagi import Branch, iModel
import asyncio

async def chat_with_ai():  # Fixed: Added async
    branch = Branch(
        system="You are a helpful assistant",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    response = await branch.communicate("Explain Python in one sentence")  # Fixed: Added await
    print(response)
    
    return response

asyncio.run(chat_with_ai())  # Fixed: Using asyncio.run()`,
    hints: [
      'Functions using await must be declared as async',
      'communicate() is an async method and needs await',
      'Use asyncio.run() to execute async functions'
    ]
  },

  // Intermediate Templates
  {
    id: 'structured-response',
    concept: 'Pydantic integration',
    difficulty: 'intermediate',
    type: 'coding',
    template: `from lionagi import Branch, iModel
from pydantic import BaseModel
from typing import List
import asyncio

# Define a Pydantic model for a {{data_type}}
class {{class_name}}(BaseModel):
    # TODO: Add appropriate fields for a {{data_type}}
    pass

async def get_structured_data():
    branch = Branch(
        system="You are a data extraction expert",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    # TODO: Use response_format to get structured data
    result = await branch.communicate(
        "{{prompt}}",
        # Add response_format parameter here
    )
    
    print(f"Structured result: {result}")
    return result

asyncio.run(get_structured_data())`,
    variables: [
      {
        name: 'data_type',
        type: 'string',
        options: ['book review', 'recipe', 'product description', 'weather report']
      },
      {
        name: 'class_name',
        type: 'string',
        generator: () => {
          const names = ['BookReview', 'Recipe', 'Product', 'Weather'];
          return names[Math.floor(Math.random() * names.length)];
        }
      },
      {
        name: 'prompt',
        type: 'string',
        generator: () => {
          const prompts = [
            'Review the book "1984" by George Orwell',
            'Give me a recipe for chocolate chip cookies',
            'Describe a laptop computer',
            'What\'s the weather in San Francisco?'
          ];
          return prompts[Math.floor(Math.random() * prompts.length)];
        }
      }
    ],
    solution: `from lionagi import Branch, iModel
from pydantic import BaseModel
from typing import List
import asyncio

class BookReview(BaseModel):
    title: str
    author: str
    rating: float
    summary: str
    pros: List[str]
    cons: List[str]

async def get_structured_data():
    branch = Branch(
        system="You are a data extraction expert",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    result = await branch.communicate(
        "Review the book '1984' by George Orwell",
        response_format=BookReview
    )
    
    print(f"Structured result: {result}")
    return result

asyncio.run(get_structured_data())`,
    hints: [
      'Define fields in your Pydantic model that match the data type',
      'Use response_format=YourModel in communicate()',
      'The response will be automatically validated and structured'
    ]
  },
  {
    id: 'tool-integration',
    concept: 'Tool registration',
    difficulty: 'intermediate',
    type: 'coding',
    template: `from lionagi import Branch, iModel
import asyncio
import random

# TODO: Create a tool function that {{tool_purpose}}
async def {{tool_name}}({{parameters}}):
    """{{tool_description}}"""
    # Implement your tool logic here
    pass

async def use_tools():
    branch = Branch(
        system="You are an AI assistant with access to tools",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    # TODO: Register your tool with the branch
    
    # TODO: Use operate() to let the AI use your tool
    result = await branch.operate("{{user_request}}")
    print(f"Result: {result}")

asyncio.run(use_tools())`,
    variables: [
      {
        name: 'tool_purpose',
        type: 'string',
        options: [
          'calculates the area of shapes',
          'generates random numbers',
          'converts temperatures',
          'searches a database'
        ]
      },
      {
        name: 'tool_name',
        type: 'string',
        options: ['calculate_area', 'random_number', 'convert_temp', 'search_db']
      },
      {
        name: 'parameters',
        type: 'string',
        options: ['shape: str, size: float', 'min: int, max: int', 'value: float, from_unit: str, to_unit: str', 'query: str']
      },
      {
        name: 'tool_description',
        type: 'string',
        generator: () => 'A tool that performs a specific task'
      },
      {
        name: 'user_request',
        type: 'string',
        options: [
          'Calculate the area of a circle with radius 5',
          'Generate a random number between 1 and 100',
          'Convert 32 Fahrenheit to Celsius',
          'Search for information about Python'
        ]
      }
    ],
    solution: `from lionagi import Branch, iModel
import asyncio
import random

async def calculate_area(shape: str, size: float):
    """Calculate the area of different shapes"""
    if shape.lower() == "circle":
        return 3.14159 * size ** 2
    elif shape.lower() == "square":
        return size ** 2
    else:
        return f"Unknown shape: {shape}"

async def use_tools():
    branch = Branch(
        system="You are an AI assistant with access to tools",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    branch.register_tools([calculate_area])
    
    result = await branch.operate("Calculate the area of a circle with radius 5")
    print(f"Result: {result}")

asyncio.run(use_tools())`,
    hints: [
      'Define your tool as an async function',
      'Use branch.register_tools([your_function]) to register',
      'Use branch.operate() instead of communicate() to use tools'
    ]
  },

  // Advanced Templates
  {
    id: 'react-reasoning',
    concept: 'ReAct pattern',
    difficulty: 'advanced',
    type: 'coding',
    template: `from lionagi import Branch, iModel
import asyncio

# Create tools for the ReAct pattern
async def search_web(query: str) -> str:
    """Search the web for information"""
    # Simulated search
    return f"Search results for '{query}': [simulated data]"

async def calculate(expression: str) -> float:
    """Perform mathematical calculations"""
    try:
        return eval(expression)
    except:
        return 0.0

async def analyze_data(data: str) -> str:
    """Analyze provided data"""
    return f"Analysis of data: {len(data)} characters, {len(data.split())} words"

async def solve_complex_problem():
    branch = Branch(
        system="You are a problem-solving AI that uses reasoning and tools",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    # TODO: Register all tools
    
    # TODO: Use ReAct to solve this problem:
    # "{{complex_problem}}"
    
    result = await branch.ReAct(
        "{{complex_problem}}",
        # Add ReAct parameters
    )
    
    print(f"Solution: {result}")

asyncio.run(solve_complex_problem())`,
    variables: [
      {
        name: 'complex_problem',
        type: 'string',
        options: [
          'What is the population of Tokyo and how does it compare to New York?',
          'Calculate the compound interest on $1000 at 5% for 10 years',
          'Research climate change impacts and summarize the top 3 concerns'
        ]
      }
    ],
    solution: `from lionagi import Branch, iModel
import asyncio

async def search_web(query: str) -> str:
    """Search the web for information"""
    return f"Search results for '{query}': Tokyo population: 13.96 million, NYC: 8.3 million"

async def calculate(expression: str) -> float:
    """Perform mathematical calculations"""
    try:
        return eval(expression)
    except:
        return 0.0

async def analyze_data(data: str) -> str:
    """Analyze provided data"""
    return f"Analysis: {len(data)} characters, {len(data.split())} words"

async def solve_complex_problem():
    branch = Branch(
        system="You are a problem-solving AI that uses reasoning and tools",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    branch.register_tools([search_web, calculate, analyze_data])
    
    result = await branch.ReAct(
        "What is the population of Tokyo and how does it compare to New York?",
        tools=[search_web, calculate, analyze_data],
        max_iterations=5
    )
    
    print(f"Solution: {result}")

asyncio.run(solve_complex_problem())`,
    hints: [
      'Register all tools before using ReAct',
      'Provide tools parameter to ReAct',
      'Set max_iterations to prevent infinite loops'
    ]
  },
  {
    id: 'multi-branch-coordination',
    concept: 'Inter-branch communication',
    difficulty: 'advanced',
    type: 'coding',
    template: `from lionagi import Branch, iModel
import asyncio

async def multi_agent_system():
    # Create specialized branches
    researcher = Branch(
        system="You are a research specialist who gathers information",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    analyst = Branch(
        system="You are a data analyst who interprets information",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    writer = Branch(
        system="You are a content writer who creates summaries",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    # TODO: Implement a workflow where:
    # 1. Researcher gathers information about "{{topic}}"
    # 2. Analyst processes the research
    # 3. Writer creates a final summary
    # Use message passing between branches
    
    {{workflow_placeholder}}
    
    print(f"Final output: {final_output}")

asyncio.run(multi_agent_system())`,
    variables: [
      {
        name: 'topic',
        type: 'string',
        options: ['artificial intelligence', 'renewable energy', 'space exploration']
      },
      {
        name: 'workflow_placeholder',
        type: 'code',
        generator: () => '# Implement multi-agent workflow here'
      }
    ],
    solution: `from lionagi import Branch, iModel
import asyncio

async def multi_agent_system():
    researcher = Branch(
        system="You are a research specialist who gathers information",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    analyst = Branch(
        system="You are a data analyst who interprets information",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    writer = Branch(
        system="You are a content writer who creates summaries",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    # Step 1: Research
    research_data = await researcher.communicate(
        "Research the latest developments in artificial intelligence"
    )
    
    # Step 2: Analysis
    analysis = await analyst.communicate(
        f"Analyze this research data: {research_data}"
    )
    
    # Step 3: Writing
    final_output = await writer.communicate(
        f"Create a concise summary based on this analysis: {analysis}"
    )
    
    print(f"Final output: {final_output}")

asyncio.run(multi_agent_system())`,
    hints: [
      'Each branch has a specialized role',
      'Pass outputs from one branch as input to another',
      'Consider using concurrent processing where possible'
    ]
  }
];

/**
 * Exercise generator using templates
 */
export class TemplateBasedExerciseGenerator {
  /**
   * Generate an exercise from a template
   */
  generateFromTemplate(templateId: string): any {
    const template = exerciseTemplates.find(t => t.id === templateId);
    if (!template) throw new Error(`Template ${templateId} not found`);

    // Replace variables with actual values
    let exerciseContent = template.template;
    let solutionContent = template.solution;

    template.variables.forEach(variable => {
      const value = variable.generator 
        ? variable.generator()
        : variable.options
        ? variable.options[Math.floor(Math.random() * variable.options.length)]
        : '';

      const placeholder = `{{${variable.name}}}`;
      exerciseContent = exerciseContent.replace(new RegExp(placeholder, 'g'), value);
      solutionContent = solutionContent.replace(new RegExp(placeholder, 'g'), value);
    });

    return {
      id: `${template.id}-${Date.now()}`,
      title: `Exercise: ${template.concept}`,
      description: `Practice ${template.concept} with this ${template.type} exercise`,
      difficulty: template.difficulty,
      type: template.type,
      concept: template.concept,
      starterCode: exerciseContent,
      solution: solutionContent,
      hints: template.hints,
      testCases: template.testCases
    };
  }

  /**
   * Get templates by difficulty
   */
  getTemplatesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): ExerciseTemplate[] {
    return exerciseTemplates.filter(t => t.difficulty === difficulty);
  }

  /**
   * Get templates by concept
   */
  getTemplatesByConcept(concept: string): ExerciseTemplate[] {
    return exerciseTemplates.filter(t => 
      t.concept.toLowerCase().includes(concept.toLowerCase())
    );
  }

  /**
   * Generate a progressive series of exercises
   */
  generateProgressiveSeries(concept: string, count: number = 3): any[] {
    const exercises = [];
    const difficulties: ('beginner' | 'intermediate' | 'advanced')[] = ['beginner', 'intermediate', 'advanced'];
    
    for (let i = 0; i < count; i++) {
      const difficulty = difficulties[Math.min(i, difficulties.length - 1)];
      const templates = this.getTemplatesByDifficulty(difficulty);
      const conceptTemplates = templates.filter(t => 
        t.concept.toLowerCase().includes(concept.toLowerCase())
      );
      
      if (conceptTemplates.length > 0) {
        const template = conceptTemplates[Math.floor(Math.random() * conceptTemplates.length)];
        exercises.push(this.generateFromTemplate(template.id));
      }
    }
    
    return exercises;
  }
}
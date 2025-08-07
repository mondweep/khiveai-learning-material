#!/usr/bin/env python3
"""
Complete lionagi Walkthrough
Step-by-step exploration of lionagi capabilities
"""

import asyncio
import os
from dotenv import load_dotenv
from lionagi import Branch, iModel

# Load environment variables
load_dotenv()

class LionagiWalkthrough:
    """Interactive lionagi learning walkthrough"""
    
    def __init__(self):
        """Initialize the walkthrough"""
        print("🦁 Welcome to the lionagi Interactive Walkthrough!")
        print("=" * 60)
        
    async def step_1_basic_branch(self):
        """Step 1: Create a basic branch and communicate"""
        print("\n📚 STEP 1: Basic Branch Creation & Communication")
        print("-" * 50)
        
        # Create a branch
        branch = Branch(
            system="You are a friendly AI assistant who explains things clearly and concisely.",
            chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
        )
        
        print("✅ Created Branch with OpenAI GPT-3.5-turbo")
        
        # Simple communication
        response = await branch.communicate("Hello! Introduce yourself in 2 sentences.")
        print(f"🤖 AI: {response}")
        
        return branch
    
    async def step_2_conversation_flow(self, branch):
        """Step 2: Multi-turn conversation"""
        print("\n📚 STEP 2: Multi-turn Conversation")
        print("-" * 50)
        
        questions = [
            "What is machine learning?",
            "Can you give me a simple example?",
            "How does this relate to AI?"
        ]
        
        for i, question in enumerate(questions, 1):
            print(f"\n👤 Human ({i}/3): {question}")
            response = await branch.communicate(question)
            print(f"🤖 AI: {response}")
    
    async def step_3_system_prompts(self):
        """Step 3: Different system prompts"""
        print("\n📚 STEP 3: System Prompt Variations")
        print("-" * 50)
        
        # Creative assistant
        creative_branch = Branch(
            system="You are a creative poet who speaks only in rhymes and metaphors.",
            chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
        )
        
        print("🎭 Creative Assistant (Poet):")
        response = await creative_branch.communicate("Tell me about programming")
        print(f"🤖 Poet: {response}")
        
        # Technical expert
        tech_branch = Branch(
            system="You are a senior software engineer who gives precise, technical explanations.",
            chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
        )
        
        print("\n💻 Technical Expert:")
        response = await tech_branch.communicate("Tell me about programming")
        print(f"🤖 Engineer: {response}")
    
    async def step_4_structured_responses(self):
        """Step 4: Structured responses with Pydantic"""
        print("\n📚 STEP 4: Structured Responses")
        print("-" * 50)
        
        from pydantic import BaseModel
        
        class CodeReview(BaseModel):
            language: str
            quality_score: int  # 1-10
            suggestions: list[str]
            overall_assessment: str
        
        branch = Branch(
            system="You are a code review expert.",
            chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
        )
        
        code_to_review = """
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)
        """
        
        print("🔍 Reviewing this Python code:")
        print(code_to_review)
        
        response = await branch.communicate(
            f"Review this code and provide structured feedback: {code_to_review}",
            response_format=CodeReview
        )
        
        print(f"📊 Structured Review:")
        print(f"   Language: {response.language}")
        print(f"   Quality Score: {response.quality_score}/10")
        print(f"   Suggestions: {', '.join(response.suggestions)}")
        print(f"   Assessment: {response.overall_assessment}")
    
    async def step_5_different_models(self):
        """Step 5: Compare different models"""
        print("\n📚 STEP 5: Model Comparison")
        print("-" * 50)
        
        question = "Explain quantum computing in simple terms"
        
        # GPT-3.5 Turbo
        gpt35_branch = Branch(
            system="You are a science educator.",
            chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
        )
        
        print("🧠 GPT-3.5 Turbo Response:")
        response = await gpt35_branch.communicate(question)
        print(f"🤖 {response}")
        
        # GPT-4o Mini (if available)
        try:
            gpt4_branch = Branch(
                system="You are a science educator.",
                chat_model=iModel(provider="openai", model="gpt-4o-mini")
            )
            
            print("\n🧠 GPT-4o Mini Response:")
            response = await gpt4_branch.communicate(question)
            print(f"🤖 {response}")
        except Exception as e:
            print(f"\n⚠️ GPT-4o Mini not available: {e}")
    
    async def step_6_practical_example(self):
        """Step 6: Practical coding assistant example"""
        print("\n📚 STEP 6: Practical Coding Assistant")
        print("-" * 50)
        
        coding_branch = Branch(
            system="""You are an expert Python developer who:
            1. Writes clean, well-commented code
            2. Follows Python best practices
            3. Explains your reasoning
            4. Provides working examples""",
            chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
        )
        
        print("💻 Request: Create a class for managing a simple to-do list")
        
        response = await coding_branch.communicate(
            "Create a Python class called TodoList that can add tasks, mark them complete, and display all tasks. Include proper error handling."
        )
        
        print(f"🤖 Generated Code:\n{response}")
    
    async def run_complete_walkthrough(self):
        """Run the complete walkthrough"""
        try:
            # Step 1: Basic usage
            branch = await self.step_1_basic_branch()
            
            # Step 2: Conversation
            await self.step_2_conversation_flow(branch)
            
            # Step 3: System prompts
            await self.step_3_system_prompts()
            
            # Step 4: Structured responses
            await self.step_4_structured_responses()
            
            # Step 5: Model comparison
            await self.step_5_different_models()
            
            # Step 6: Practical example
            await self.step_6_practical_example()
            
            print("\n" + "=" * 60)
            print("🎉 WALKTHROUGH COMPLETE!")
            print("✅ You've successfully explored key lionagi features:")
            print("   • Basic Branch creation and communication")
            print("   • Multi-turn conversations")
            print("   • System prompt customization")
            print("   • Structured responses with Pydantic")
            print("   • Model comparison")
            print("   • Practical coding assistance")
            print("\n🚀 Ready to build your own lionagi applications!")
            
        except Exception as e:
            print(f"\n❌ Walkthrough error: {e}")
            print("💡 Check your API keys and internet connection")

async def main():
    """Main function"""
    walkthrough = LionagiWalkthrough()
    await walkthrough.run_complete_walkthrough()

if __name__ == "__main__":
    asyncio.run(main())
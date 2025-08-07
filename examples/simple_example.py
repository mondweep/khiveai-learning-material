#!/usr/bin/env python3
"""
Simple lionagi Example
Demonstrates basic AI conversation using lionagi
"""

import asyncio
import os
from dotenv import load_dotenv
from lionagi import Branch, iModel

# Load environment variables
load_dotenv()

async def simple_conversation():
    """Simple AI conversation example"""
    print("🦁 Starting simple lionagi conversation...")
    
    # Create a branch with OpenAI model
    branch = Branch(
        system="You are a helpful Python programming tutor who gives clear, concise explanations.",
        chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
    )
    
    # Example conversation
    questions = [
        "What is lionagi in one sentence?",
        "Give me a 2-line Python function that adds two numbers",
        "Explain async/await in Python in 20 words or less"
    ]
    
    for i, question in enumerate(questions, 1):
        print(f"\n📝 Question {i}: {question}")
        response = await branch.communicate(question)
        print(f"🤖 AI Response: {response}")
        print("-" * 60)

async def anthropic_example():
    """Example using Anthropic's Claude"""
    print("\n🧠 Testing Anthropic Claude...")
    
    branch = Branch(
        system="You are a creative writing assistant.",
        chat_model=iModel(provider="anthropic", model="claude-3-haiku-20240307")
    )
    
    response = await branch.communicate(
        "Write a haiku about artificial intelligence and programming"
    )
    print(f"🎭 Claude's Haiku:\n{response}")

async def main():
    """Run all examples"""
    print("🚀 lionagi Real Examples Demo\n")
    
    try:
        # OpenAI example
        await simple_conversation()
        
        # Anthropic example  
        await anthropic_example()
        
        print("\n✅ All examples completed successfully!")
        print("🎉 Your lionagi environment is fully operational!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("💡 Make sure your API keys are correctly set in .env file")

if __name__ == "__main__":
    asyncio.run(main())
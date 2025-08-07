#!/usr/bin/env python3
"""
lionagi Async Interactive REPL
Real Python environment with async support for lionagi
"""

import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import lionagi components
from lionagi import Branch, iModel
from pydantic import BaseModel

print("""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🦁 LIONAGI ASYNC PYTHON REPL 🦁                         ║
║                                                              ║
║     Real Python with async support for lionagi              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

✅ lionagi imported and ready
✅ Your OpenAI API key loaded
✅ Async support enabled

🚀 USAGE:
• Just type lionagi code normally
• await will work automatically
• No need for async/await wrappers

💡 EXAMPLES TO TRY:
""")

async def main():
    """Main async function where you can use await"""
    print("""
🔥 Ready! Try these commands:

# 1. Quick test
branch = Branch(system="You are helpful", chat_model=iModel(provider="openai", model="gpt-3.5-turbo"))
response = await branch.communicate("Say hello in 5 words")
print(response)

# 2. Python tutor
tutor = Branch(system="You are a Python expert", chat_model=iModel(provider="openai", model="gpt-3.5-turbo"))  
answer = await tutor.communicate("What are list comprehensions?")
print(answer)

# 3. Code generator
coder = Branch(system="You write clean Python code", chat_model=iModel(provider="openai", model="gpt-3.5-turbo"))
code = await coder.communicate("Write a function to check if a number is prime")
print(code)

Let's start with a quick test:
    """)
    
    # Quick test to verify everything works
    print("🧪 Running quick test...")
    branch = Branch(
        system="You are a helpful assistant. Be concise.",
        chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
    )
    
    try:
        response = await branch.communicate("Say 'lionagi is working!' in a creative way")
        print(f"✅ Success! AI says: {response}")
        print()
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    print("🎯 Now try your own commands:")
    print()
    
    # Interactive loop
    while True:
        try:
            # Get user input
            user_input = input("lionagi>>> ")
            
            if user_input.strip().lower() in ['exit', 'quit']:
                print("👋 Goodbye!")
                break
                
            if user_input.strip() == '':
                continue
                
            # Special commands
            if user_input.strip() == 'help':
                print_help()
                continue
                
            if user_input.strip() == 'examples':
                await show_examples()
                continue
            
            # Execute the code
            try:
                # For simple expressions, use eval
                if not any(keyword in user_input for keyword in ['await', '=', 'print', 'for', 'if', 'def', 'class']):
                    result = eval(user_input)
                    if result is not None:
                        print(result)
                else:
                    # For complex code with await, exec it
                    exec(user_input)
            except SyntaxError:
                # If it has await, wrap it properly
                if 'await' in user_input:
                    try:
                        result = await eval(user_input)
                        if result is not None:
                            print(result)
                    except:
                        exec(f"result = {user_input}")
                        if 'result' in locals():
                            print(locals()['result'])
                else:
                    raise
                    
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
            print("💡 Tip: Try 'help' for examples or 'examples' for working code")

def print_help():
    """Print help information"""
    print("""
🆘 LIONAGI REPL HELP:
═══════════════════════

📋 BASIC COMMANDS:
• help - Show this help
• examples - Run example code
• exit/quit - Exit the REPL

🚀 LIONAGI USAGE:
• Create branch: branch = Branch(system="...", chat_model=iModel(provider="openai", model="gpt-3.5-turbo"))
• Chat: response = await branch.communicate("your question")
• Print: print(response)

💡 TIPS:
• You can use 'await' directly
• Variables persist between commands
• Use print() to see results
    """)

async def show_examples():
    """Show working examples"""
    print("\n🔥 RUNNING EXAMPLES:")
    print("=" * 40)
    
    # Example 1: Basic chat
    print("📝 Example 1: Basic Chat")
    branch = Branch(
        system="You are a helpful assistant", 
        chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
    )
    response = await branch.communicate("What's the capital of France?")
    print(f"🤖 {response}")
    print()
    
    # Example 2: Code generation  
    print("📝 Example 2: Code Generation")
    coder = Branch(
        system="You are a Python expert who writes clean, simple code",
        chat_model=iModel(provider="openai", model="gpt-3.5-turbo") 
    )
    code = await coder.communicate("Write a Python function to reverse a string")
    print(f"💻 Generated Code:\n{code}")
    print()
    
    # Example 3: Structured response
    print("📝 Example 3: Structured Response")
    
    class Summary(BaseModel):
        topic: str
        key_points: list[str]
        difficulty: str
    
    analyst = Branch(
        system="You are an expert analyst",
        chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
    )
    
    result = await analyst.communicate(
        "Summarize machine learning basics", 
        response_format=Summary
    )
    
    print(f"📊 Topic: {result.topic}")
    print(f"🎯 Key Points: {result.key_points}")
    print(f"📈 Difficulty: {result.difficulty}")
    print()

if __name__ == "__main__":
    asyncio.run(main())
#!/usr/bin/env python3
"""
lionagi Interactive REPL
Real Python environment with lionagi loaded and ready to use
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
║     🦁 LIONAGI INTERACTIVE PYTHON REPL 🦁                   ║
║                                                              ║
║     Real Python environment with your OpenAI API key        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

✅ lionagi imported and ready
✅ Your OpenAI API key loaded from .env
✅ All components available: Branch, iModel, BaseModel

🚀 QUICK START EXAMPLES:
═══════════════════════

# Create a basic branch
branch = Branch(
    system="You are a helpful assistant",
    chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
)

# Send a message (in async context)
response = await branch.communicate("Hello!")

📋 AVAILABLE IMPORTS:
• Branch - Main conversation manager
• iModel - AI model configuration  
• BaseModel - For structured responses
• asyncio - For running async code

💡 TIP: Use 'await' for lionagi operations
💡 TIP: Type 'help_examples()' for more examples

🎯 Ready to code with real AI! Type your lionagi code below:
""")

def help_examples():
    """Show helpful lionagi examples"""
    print("""
🔥 LIONAGI CODE EXAMPLES:
═══════════════════════════

1. BASIC CONVERSATION:
   branch = Branch(system="You are helpful")
   response = await branch.communicate("What is Python?")
   print(response)

2. STRUCTURED RESPONSE:
   class Answer(BaseModel):
       response: str
       confidence: float
   
   result = await branch.communicate("Explain AI", response_format=Answer)
   print(f"Answer: {result.response}")
   print(f"Confidence: {result.confidence}")

3. DIFFERENT MODEL:
   branch = Branch(
       system="You are a coding expert",
       chat_model=iModel(provider="openai", model="gpt-4")
   )

4. ANTHROPIC CLAUDE:
   branch = Branch(
       system="You are creative",
       chat_model=iModel(provider="anthropic", model="claude-3-haiku-20240307")
   )

💡 Remember to use 'await' with communicate()!
    """)

# Helper function for quick testing
async def quick_test():
    """Quick test to verify everything works"""
    branch = Branch(
        system="You are a helpful assistant. Respond in exactly 5 words.",
        chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
    )
    
    response = await branch.communicate("Say hello")
    print(f"🤖 AI Response: {response}")
    return response

# Make functions available in the REPL
globals()['help_examples'] = help_examples
globals()['quick_test'] = quick_test

print("Type 'await quick_test()' to verify everything works!")
print("Type 'help_examples()' to see more examples.")
print()

# Start the interactive Python REPL with asyncio support
if __name__ == "__main__":
    import code
    import sys
    
    # Create an interactive console with asyncio support
    class AsyncREPL:
        def __init__(self):
            self.loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self.loop)
        
        def run_async(self, coro):
            """Helper to run async code in REPL"""
            return self.loop.run_until_complete(coro)
    
    # Create async REPL instance
    repl = AsyncREPL()
    
    # Add to globals so you can use it
    globals()['run_async'] = repl.run_async
    
    # Start interactive console
    console = code.InteractiveConsole(globals())
    console.interact(banner="")
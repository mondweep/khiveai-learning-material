"""
LEVEL 1 - EXERCISE 1: Basic Branch Creation and Messaging
SOLUTION
"""

import asyncio
import lionagi as li
from lionagi import Branch

async def basic_branch_exercise():
    """
    Create a basic Branch and send a message
    """
    
    # Create a Branch instance
    branch = Branch()
    
    # Send a message asking "What is the capital of France?"
    response = await branch.chat("What is the capital of France?")
    
    # Print the response
    print("Response:", response)
    
    return response

# Test runner
if __name__ == "__main__":
    result = asyncio.run(basic_branch_exercise())
    print("Exercise completed!")
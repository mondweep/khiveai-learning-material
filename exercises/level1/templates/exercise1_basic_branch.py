"""
LEVEL 1 - EXERCISE 1: Basic Branch Creation and Messaging
Difficulty: Beginner

OBJECTIVE:
Learn how to create a Branch and send a simple message to an AI model.

INSTRUCTIONS:
1. Create a Branch instance
2. Send a message asking "What is the capital of France?"
3. Print the response

TEMPLATE CODE (fill in the blanks):
"""

import asyncio
import lionagi as li
from lionagi import Branch

async def basic_branch_exercise():
    """
    Create a basic Branch and send a message
    """
    
    # TODO: Create a Branch instance
    # Hint: Use Branch() constructor
    branch = None  # Replace with your code
    
    # TODO: Send a message asking "What is the capital of France?"
    # Hint: Use await branch.chat() method
    response = None  # Replace with your code
    
    # TODO: Print the response
    # Hint: Access the response content appropriately
    print("Response:", response)
    
    return response

# Test runner
if __name__ == "__main__":
    result = asyncio.run(basic_branch_exercise())
    print("Exercise completed!")
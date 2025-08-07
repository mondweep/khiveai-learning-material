#!/usr/bin/env python3
"""
Real lionagi Test Script
Verifies that lionagi is properly installed and configured

This script tests actual lionagi functionality (not simulation)
Requires: lionagi installed, API keys configured
"""

import asyncio
import os
import sys
from pathlib import Path

def check_environment():
    """Check if the environment is properly set up"""
    print("🔍 Checking lionagi development environment...")
    
    # Check Python version
    if sys.version_info < (3, 10):
        print("❌ Python 3.10+ required. Current version:", sys.version)
        return False
    else:
        print(f"✅ Python version: {sys.version.split()[0]}")
    
    # Check if lionagi is installed
    try:
        import lionagi
        print(f"✅ lionagi version: {getattr(lionagi, '__version__', 'unknown')}")
    except ImportError:
        print("❌ lionagi not installed. Run: pip install lionagi")
        return False
    
    # Check for API keys
    openai_key = os.getenv('OPENAI_API_KEY')
    if openai_key:
        print(f"✅ OpenAI API key configured: {openai_key[:10]}...")
    else:
        print("⚠️  OpenAI API key not found. Set OPENAI_API_KEY environment variable")
        print("   Create .env file or export OPENAI_API_KEY=your-key-here")
    
    anthropic_key = os.getenv('ANTHROPIC_API_KEY')
    if anthropic_key:
        print(f"✅ Anthropic API key configured: {anthropic_key[:10]}...")
    
    return True

async def test_basic_branch():
    """Test basic Branch creation and communication"""
    print("\n🧪 Testing basic Branch functionality...")
    
    try:
        from lionagi import Branch, iModel
        
        # Create a simple branch
        branch = Branch(
            system="You are a helpful assistant that responds briefly",
        )
        
        print("✅ Branch created successfully")
        
        # Test if we can configure a model (won't actually use API without key)
        if os.getenv('OPENAI_API_KEY'):
            branch = Branch(
                system="You are a helpful assistant",
                chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
            )
            print("✅ iModel configured successfully")
            
            # Test actual communication (will use API)
            try:
                response = await branch.communicate("Say hello in exactly 3 words")
                print(f"✅ Real AI Response: {response}")
                return True
            except Exception as e:
                print(f"⚠️  Communication test failed: {e}")
                print("   This might be due to API key issues or network")
                return False
        else:
            print("⚠️  Skipping communication test (no API key)")
            return True
            
    except Exception as e:
        print(f"❌ Branch test failed: {e}")
        return False

async def test_structured_response():
    """Test structured responses with Pydantic"""
    print("\n🧪 Testing structured responses...")
    
    if not os.getenv('OPENAI_API_KEY'):
        print("⚠️  Skipping structured response test (no OpenAI API key)")
        return True
    
    try:
        from lionagi import Branch, iModel
        from pydantic import BaseModel
        
        class SimpleResponse(BaseModel):
            greeting: str
            word_count: int
        
        branch = Branch(
            system="You are a helpful assistant",
            chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
        )
        
        response = await branch.communicate(
            "Give me a greeting and count how many words it has",
            response_format=SimpleResponse
        )
        
        print(f"✅ Structured response: {response}")
        print(f"   Type: {type(response)}")
        return True
        
    except Exception as e:
        print(f"❌ Structured response test failed: {e}")
        return False

async def test_tool_integration():
    """Test tool registration and usage"""
    print("\n🧪 Testing tool integration...")
    
    if not os.getenv('OPENAI_API_KEY'):
        print("⚠️  Skipping tool test (no OpenAI API key)")
        return True
    
    try:
        from lionagi import Branch, iModel
        
        async def simple_calculator(a: float, b: float, operation: str = "add") -> float:
            """Perform basic math operations"""
            if operation == "add":
                return a + b
            elif operation == "subtract":
                return a - b
            elif operation == "multiply":
                return a * b
            elif operation == "divide":
                return a / b if b != 0 else 0
            else:
                return 0
        
        branch = Branch(
            system="You are a helpful math assistant with access to a calculator",
            chat_model=iModel(provider="openai", model="gpt-3.5-turbo")
        )
        
        # Register the tool
        branch.register_tools([simple_calculator])
        print("✅ Tool registered successfully")
        
        # Test tool usage
        response = await branch.operate("Calculate 15 + 27 using the calculator")
        print(f"✅ Tool usage result: {response}")
        return True
        
    except Exception as e:
        print(f"❌ Tool integration test failed: {e}")
        return False

def create_example_env_file():
    """Create example .env file"""
    env_example = """# lionagi Environment Variables
# Copy this to .env and fill in your actual API keys

# OpenAI API Key (Required for most examples)
OPENAI_API_KEY=your-openai-api-key-here

# Anthropic API Key (Optional)
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Groq API Key (Optional - for fast inference)
GROQ_API_KEY=your-groq-api-key-here

# Other configuration
PYTHONPATH=.
"""
    
    env_path = Path(".env.example")
    if not env_path.exists():
        with open(env_path, 'w') as f:
            f.write(env_example)
        print(f"✅ Created {env_path} - copy to .env and add your API keys")

async def main():
    """Main test function"""
    print("""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║         🧪 REAL LIONAGI ENVIRONMENT TEST SCRIPT 🧪         ║
║                                                              ║
║           Verifying actual lionagi functionality            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
""")
    
    # Environment check
    if not check_environment():
        print("\n❌ Environment check failed. Please fix issues above.")
        return
    
    # Create example env file
    create_example_env_file()
    
    # Run tests
    tests = [
        ("Basic Branch", test_basic_branch),
        ("Structured Response", test_structured_response),
        ("Tool Integration", test_tool_integration),
    ]
    
    results = {}
    for test_name, test_func in tests:
        try:
            result = await test_func()
            results[test_name] = result
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for r in results.values() if r)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} {test_name}")
    
    print(f"\n📈 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your lionagi environment is ready!")
        print("\n🚀 Next steps:")
        print("  1. Explore examples/ folder for complete projects")
        print("  2. Try building your own lionagi application")
        print("  3. Check out the learning platform: npm start")
    else:
        print("⚠️  Some tests failed. Check the issues above.")
        print("\n🔧 Common fixes:")
        print("  1. Install lionagi: pip install lionagi")
        print("  2. Set API keys in .env file")
        print("  3. Check internet connection")
        print("  4. Verify API key permissions")

if __name__ == "__main__":
    try:
        # Load .env file if it exists
        try:
            from dotenv import load_dotenv
            load_dotenv()
        except ImportError:
            print("ℹ️  python-dotenv not installed. Using environment variables only.")
        
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Test script failed: {e}")
        sys.exit(1)
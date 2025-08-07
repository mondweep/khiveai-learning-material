# 🦁 lionagi Interactive Learning Platform

A comprehensive, interactive learning platform for mastering the lionagi SDK - from basic concepts to advanced multi-agent orchestration.

## 🎯 Overview

This platform provides an interactive learning experience to help developers master lionagi, an AI orchestration framework. It includes tutorials, code playgrounds, assessments, and real-world project examples.

## ⚠️ Important: Simulation vs. Reality

### 🎮 What This Platform Provides (Educational Simulation)

The interactive learning system includes:

- **📚 Interactive Tutorials**: Step-by-step lessons with personalized feedback
- **🎮 Code Playground**: Simulated Python environment for learning lionagi syntax
- **📊 Skill Assessments**: Interactive quizzes to test your knowledge
- **🎯 Practice Exercises**: Coding challenges with hints and solutions
- **📈 Progress Tracking**: Learning analytics and achievement system

**🔍 The Code Playground is a SIMULATION** - it provides educational feedback on lionagi patterns and syntax, but does not execute real lionagi code or make actual AI model calls.

### 🚀 What You Need for Real lionagi Development

To run actual lionagi code and build real AI applications, you need:

1. **Python 3.10+** installed locally
2. **lionagi SDK** properly installed
3. **API Keys** for AI providers (OpenAI, Anthropic, etc.)
4. **Proper environment setup** with dependencies

## 🚀 Quick Start (Learning Platform)

### Option 1: Interactive Learning Experience
```bash
# Clone this repository
git clone https://github.com/khive-ai/lionagi-learning-material.git
cd lionagi-learning-material

# Install basic dependencies
npm install

# Start interactive learning platform
npm start
```

### Option 2: Direct Playground Access
```bash
# Jump directly to code playground
npm run playground

# Or start with skill assessment
npm run assess
```

## 🛠️ Setting Up Real lionagi Development Environment

To work with actual lionagi code and build real AI applications:

### Step 1: Python Environment Setup
```bash
# Ensure Python 3.10+ is installed
python --version

# Create virtual environment (recommended)
python -m venv lionagi-env
source lionagi-env/bin/activate  # On Windows: lionagi-env\Scripts\activate

# Install lionagi and dependencies
pip install -r requirements.txt
```

### Step 2: API Keys Setup
Create a `.env` file in your project root:
```env
# OpenAI API Key (required for most examples)
OPENAI_API_KEY=your-openai-api-key-here

# Anthropic API Key (optional)
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Other provider keys as needed
GROQ_API_KEY=your-groq-api-key-here
```

### Step 3: Verify Real lionagi Setup
```bash
# Test real lionagi installation
python -c "from lionagi import Branch, iModel; print('✅ lionagi imported successfully')"

# Run a real example
python examples/real-lionagi-test.py
```

## 📁 Project Structure

```
lionagi-learning-material/
├── 📚 Learning Platform (Simulation)
│   ├── interactive-learning.js     # Interactive learning system
│   ├── simple-start.js            # Basic command interface
│   ├── test-runner.js             # Platform validation
│   └── src/                       # TypeScript learning modules
│       ├── modules/               # Core learning components
│       ├── examples/              # Example projects
│       └── types/                 # Type definitions
│
├── 🚀 Real lionagi Setup
│   ├── requirements.txt           # Python dependencies
│   ├── examples/                  # Real working examples
│   │   ├── real-lionagi-test.py   # Basic lionagi test
│   │   ├── customer-support/      # Complete project
│   │   ├── research-assistant/    # Multi-agent example
│   │   └── code-reviewer/         # Code analysis bot
│   └── .env.example               # Environment variables template
│
└── 📖 Documentation
    ├── docs/                      # Comprehensive guides
    └── CLAUDE.md                  # Development setup
```

## 🎓 Learning Path

### Phase 1: Interactive Learning (Simulation)
1. **Start the Platform**: `npm start`
2. **Take Assessment**: Option 3 to determine your level
3. **Interactive Tutorial**: Option 1 for guided lessons
4. **Code Playground**: Option 2 to practice syntax
5. **Browse Modules**: Option 5 to explore curriculum

### Phase 2: Real Development Setup
1. **Install lionagi**: Follow setup instructions above
2. **Get API Keys**: From OpenAI, Anthropic, etc.
3. **Run Real Examples**: Start with `examples/real-lionagi-test.py`
4. **Build Projects**: Use the complete project examples
5. **Create Your Own**: Apply what you've learned

## 🎮 Interactive Platform Features

### Learning Modes Available:
- **🚀 Interactive Tutorial** - Guided lessons with real-time feedback
- **🎮 Code Playground** - Practice lionagi syntax (simulated)
- **📊 Skill Assessment** - Test your knowledge with quizzes
- **🎯 Practice Exercises** - Coding challenges and debugging
- **📚 Module Browser** - Explore curriculum and track progress
- **🏆 Progress Tracking** - View achievements and learning analytics

### Navigation Commands:
- Type `1-8` to select menu options
- Type `menu` to return to main menu anytime
- Type `help` for assistance
- Use `Ctrl+C` to exit

## 💻 Real lionagi Examples

Once you have lionagi properly installed, you can run these real examples:

### Basic Branch Example
```python
from lionagi import Branch, iModel
import asyncio

async def main():
    branch = Branch(
        system="You are a helpful Python tutor",
        chat_model=iModel(provider="openai", model="gpt-4")
    )
    
    response = await branch.communicate("Explain async/await in Python")
    print(response)

asyncio.run(main())
```

### Customer Support Bot
```python
# Complete working example in examples/customer-support/
python examples/customer-support/main.py
```

### Research Assistant
```python
# Multi-agent system example
python examples/research-assistant/main.py
```

## 🧪 Testing & Validation

### Test the Learning Platform
```bash
# Run all platform tests
npm test

# Validate all components
npm run validate

# Test integration
npm run test:integration
```

### Test Real lionagi Setup
```bash
# Verify lionagi installation
python examples/real-lionagi-test.py

# Run complete project tests
python -m pytest tests/
```

## 🚦 System Requirements

### For Learning Platform (Simulation)
- **Node.js 18+**
- **NPM 9+**
- **5MB disk space**

### For Real lionagi Development
- **Python 3.10+**
- **10GB+ disk space** (for AI models)
- **API Keys** from AI providers
- **Internet connection** for model access
- **8GB+ RAM** recommended

## 🔗 API Keys & Pricing

To use real lionagi features, you'll need API keys from:

- **OpenAI** (GPT-4, GPT-3.5): https://platform.openai.com/api-keys
  - Pay-per-use: ~$0.01-0.06 per 1K tokens
- **Anthropic** (Claude): https://console.anthropic.com/
  - Pay-per-use: ~$0.008-0.024 per 1K tokens
- **Groq** (Fast inference): https://console.groq.com/
  - Free tier available

⚠️ **Cost Warning**: Real AI API calls cost money. Start with small experiments.

## 🛟 Troubleshooting

### Learning Platform Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Run basic test
node test-runner.js
```

### Real lionagi Issues
```bash
# Check Python version
python --version  # Must be 3.10+

# Verify lionagi installation
pip show lionagi

# Test API connectivity
python -c "import openai; print('✅ OpenAI client ready')"

# Check environment variables
python -c "import os; print('OPENAI_API_KEY:', os.getenv('OPENAI_API_KEY', 'Not set')[:10] + '...')"
```

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **lionagi Team** for the incredible AI orchestration framework
- **OpenAI & Anthropic** for AI model access
- **Open Source Community** for tools and inspiration

---

## 📞 Support & Community

- **Documentation**: Comprehensive guides in `/docs` folder
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join community discussions
- **Examples**: Complete working examples in `/examples`

**Ready to master lionagi?** Start with `npm start` for interactive learning, then move to real development with the setup guide above! 🚀
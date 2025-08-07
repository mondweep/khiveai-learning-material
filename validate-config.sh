#!/bin/bash

# Validate the hive-mind configuration file
echo "Validating lionagi-learning-hivemind.yaml..."

# Check if file exists
if [ ! -f "lionagi-learning-hivemind.yaml" ]; then
    echo "❌ Configuration file not found!"
    exit 1
fi

# Check YAML syntax
if command -v python3 &> /dev/null; then
    python3 -c "import yaml; yaml.safe_load(open('lionagi-learning-hivemind.yaml'))" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ YAML syntax is valid"
    else
        echo "❌ YAML syntax error detected"
        exit 1
    fi
else
    echo "⚠️  Python not available for YAML validation"
fi

# Check required fields
if grep -q "^name:" lionagi-learning-hivemind.yaml && \
   grep -q "^type:" lionagi-learning-hivemind.yaml && \
   grep -q "^topology:" lionagi-learning-hivemind.yaml && \
   grep -q "^agents:" lionagi-learning-hivemind.yaml; then
    echo "✅ Required fields present"
else
    echo "❌ Missing required fields"
    exit 1
fi

echo ""
echo "Configuration ready! You can now run:"
echo "npx claude-flow@alpha hive-mind spawn --config ./lionagi-learning-hivemind.yaml --claude"
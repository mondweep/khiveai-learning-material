/**
 * Real-World lionagi Example Projects
 * Complete applications demonstrating lionagi capabilities
 */

export interface ExampleProject {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  concepts: string[];
  estimatedTime: number; // in minutes
  code: string;
  explanation: string;
  extensions: string[];
}

export const exampleProjects: ExampleProject[] = [
  {
    id: 'customer-support-bot',
    title: 'AI Customer Support Bot',
    description: 'Build an intelligent customer support system with context awareness and tool integration',
    difficulty: 'intermediate',
    concepts: ['Branch', 'tools', 'conversation memory', 'structured responses'],
    estimatedTime: 45,
    code: `from lionagi import Branch, iModel
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import asyncio
import json

# Database simulation
customer_db = {
    "12345": {
        "name": "John Doe",
        "email": "john@example.com",
        "orders": [
            {"id": "ORD-001", "status": "delivered", "date": "2024-01-15"},
            {"id": "ORD-002", "status": "processing", "date": "2024-01-20"}
        ],
        "tier": "premium"
    }
}

# Structured response models
class CustomerInfo(BaseModel):
    customer_id: str
    name: str
    email: str
    tier: str

class OrderStatus(BaseModel):
    order_id: str
    status: str
    estimated_delivery: Optional[str]
    tracking_number: Optional[str]

class SupportTicket(BaseModel):
    category: str
    priority: str
    summary: str
    resolution_steps: List[str]
    escalate: bool

# Tool functions
async def lookup_customer(customer_id: str) -> dict:
    """Look up customer information"""
    return customer_db.get(customer_id, {"error": "Customer not found"})

async def check_order_status(order_id: str) -> dict:
    """Check the status of an order"""
    # Simulated order lookup
    statuses = {
        "ORD-001": {"status": "delivered", "tracking": "TRK123456"},
        "ORD-002": {"status": "processing", "estimated": "2024-01-25"}
    }
    return statuses.get(order_id, {"error": "Order not found"})

async def create_ticket(category: str, description: str, priority: str = "medium") -> dict:
    """Create a support ticket"""
    ticket_id = f"TKT-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    return {
        "ticket_id": ticket_id,
        "status": "created",
        "priority": priority,
        "assigned_to": "support_team"
    }

async def send_email(to: str, subject: str, body: str) -> dict:
    """Send an email to customer"""
    print(f"📧 Sending email to {to}")
    print(f"Subject: {subject}")
    print(f"Body: {body[:100]}...")
    return {"status": "sent", "timestamp": datetime.now().isoformat()}

class CustomerSupportBot:
    def __init__(self):
        self.branch = Branch(
            system="""You are an expert customer support agent for an e-commerce company.
            You are helpful, empathetic, and professional.
            You have access to customer data and order information.
            Always:
            - Greet customers warmly
            - Verify customer identity when needed
            - Provide clear and accurate information
            - Escalate complex issues when necessary
            - Follow up on previous interactions
            """,
            chat_model=iModel(provider="openai", model="gpt-4")
        )
        
        # Register tools
        self.branch.register_tools([
            lookup_customer,
            check_order_status,
            create_ticket,
            send_email
        ])
        
        # Session context
        self.customer_verified = False
        self.current_customer = None
    
    async def handle_conversation(self):
        """Main conversation handler"""
        print("🤖 Customer Support Bot Active")
        print("=" * 50)
        
        # Initial greeting
        greeting = await self.branch.communicate(
            "Generate a friendly greeting for a customer contacting support"
        )
        print(f"Bot: {greeting}\\n")
        
        # Simulate customer messages
        customer_messages = [
            "Hi, I need help with my recent order",
            "My customer ID is 12345",
            "I want to know the status of order ORD-002",
            "When will it be delivered?",
            "Also, I'm having trouble logging into my account"
        ]
        
        for message in customer_messages:
            print(f"Customer: {message}")
            
            # Process message based on context
            if "customer ID" in message:
                # Extract and verify customer ID
                customer_id = "12345"  # In production, would extract from message
                customer_info = await lookup_customer(customer_id)
                
                if "error" not in customer_info:
                    self.customer_verified = True
                    self.current_customer = customer_info
                    
                    response = await self.branch.communicate(
                        f"Customer verified: {customer_info['name']}. " +
                        f"They are a {customer_info['tier']} customer. " +
                        "Acknowledge verification and ask how you can help."
                    )
                else:
                    response = await self.branch.communicate(
                        "Customer ID not found. Ask for verification."
                    )
            
            elif "status of order" in message and self.customer_verified:
                # Check order status
                order_id = "ORD-002"  # Extract from message
                order_info = await check_order_status(order_id)
                
                # Get structured response
                status_response = await self.branch.communicate(
                    f"Order {order_id} status: {order_info}. " +
                    "Provide a helpful update to the customer.",
                    response_format=OrderStatus
                )
                
                response = f"Let me check that for you. {status_response}"
            
            elif "trouble logging" in message:
                # Create support ticket
                ticket = await self.branch.communicate(
                    f"Customer {self.current_customer['name'] if self.current_customer else 'unknown'} " +
                    "is having login issues. Analyze and create a support ticket.",
                    response_format=SupportTicket
                )
                
                if ticket.escalate:
                    ticket_result = await create_ticket(
                        ticket.category,
                        ticket.summary,
                        ticket.priority
                    )
                    response = f"I've created a support ticket ({ticket_result['ticket_id']}) " + \
                              f"for your login issue. Our technical team will assist you shortly."
                else:
                    response = f"For login issues, try these steps: " + \
                              f"{', '.join(ticket.resolution_steps)}"
            
            else:
                # General response using operate
                response = await self.branch.operate(message)
            
            print(f"Bot: {response}\\n")
        
        # End conversation with follow-up
        followup = await self.branch.communicate(
            "Generate a professional closing message with follow-up actions"
        )
        print(f"Bot: {followup}")
        
        # Send follow-up email if customer verified
        if self.customer_verified and self.current_customer:
            email_result = await send_email(
                self.current_customer['email'],
                "Support Conversation Summary",
                f"Thank you for contacting support. Summary of your issues..."
            )
            print(f"\\n✅ Follow-up email sent: {email_result['status']}")

async def main():
    bot = CustomerSupportBot()
    await bot.handle_conversation()

if __name__ == "__main__":
    asyncio.run(main())`,
    explanation: `This customer support bot demonstrates:
    
1. **Tool Integration**: Multiple tools for database lookup, order tracking, ticket creation, and email
2. **Structured Responses**: Pydantic models for consistent data formats
3. **Context Management**: Tracks customer verification and session state
4. **Conditional Logic**: Different responses based on customer status and request type
5. **Professional Communication**: Empathetic and helpful responses
6. **Follow-up Actions**: Automatic ticket creation and email summaries

The bot can handle various customer service scenarios including order inquiries, account issues, and technical problems.`,
    extensions: [
      'Add sentiment analysis to detect frustrated customers',
      'Implement multi-language support',
      'Add integration with real CRM systems',
      'Create escalation workflows for complex issues',
      'Add voice interaction capabilities'
    ]
  },
  {
    id: 'research-assistant',
    title: 'AI Research Assistant',
    description: 'Multi-agent system for comprehensive research with ReAct reasoning',
    difficulty: 'advanced',
    concepts: ['ReAct', 'multi-branch', 'operation graphs', 'inter-branch communication'],
    estimatedTime: 60,
    code: `from lionagi import Branch, iModel
from typing import List, Dict, Any
import asyncio
import json
from datetime import datetime

class ResearchAssistant:
    """Advanced research system using multiple specialized agents"""
    
    def __init__(self):
        # Create specialized branches for different research tasks
        self.researcher = Branch(
            system="""You are a research specialist focused on gathering information.
            You excel at finding relevant sources, extracting key information, and 
            identifying knowledge gaps. Be thorough and cite sources.""",
            chat_model=iModel(provider="openai", model="gpt-4")
        )
        
        self.analyst = Branch(
            system="""You are a data analyst who synthesizes research findings.
            You identify patterns, draw connections between different sources,
            and provide statistical insights. Focus on objective analysis.""",
            chat_model=iModel(provider="openai", model="gpt-4")
        )
        
        self.critic = Branch(
            system="""You are a critical reviewer who evaluates research quality.
            You identify biases, check for logical fallacies, verify claims,
            and ensure comprehensive coverage. Be constructive but thorough.""",
            chat_model=iModel(provider="openai", model="gpt-4")
        )
        
        self.writer = Branch(
            system="""You are a technical writer who creates clear, well-structured
            research reports. You excel at organizing complex information into
            readable formats with proper citations and visual aids suggestions.""",
            chat_model=iModel(provider="openai", model="gpt-4")
        )
        
        # Coordinator branch for orchestrating the research
        self.coordinator = Branch(
            system="""You are a research coordinator managing a team of specialists.
            You break down research questions, assign tasks, synthesize findings,
            and ensure comprehensive coverage of the topic.""",
            chat_model=iModel(provider="openai", model="gpt-4")
        )
        
        # Register research tools
        self.register_tools()
        
        # Research memory
        self.research_memory = {
            "sources": [],
            "findings": [],
            "analysis": {},
            "gaps": []
        }
    
    def register_tools(self):
        """Register tools for research operations"""
        
        async def search_academic(query: str) -> List[Dict]:
            """Search academic databases"""
            # Simulated academic search
            return [
                {
                    "title": f"Study on {query}",
                    "authors": ["Smith, J.", "Doe, A."],
                    "year": 2024,
                    "abstract": f"Research findings about {query}...",
                    "doi": "10.1234/example"
                }
            ]
        
        async def search_web(query: str) -> List[str]:
            """Search the web for information"""
            # Simulated web search
            return [
                f"Wikipedia: {query} is defined as...",
                f"Recent news: Developments in {query}...",
                f"Expert opinion: Dr. Expert says about {query}..."
            ]
        
        async def analyze_statistics(data: List[float]) -> Dict:
            """Perform statistical analysis"""
            if not data:
                return {"error": "No data provided"}
            
            return {
                "mean": sum(data) / len(data),
                "min": min(data),
                "max": max(data),
                "count": len(data),
                "trend": "increasing" if data[-1] > data[0] else "decreasing"
            }
        
        async def generate_citations(sources: List[Dict]) -> List[str]:
            """Generate formatted citations"""
            citations = []
            for source in sources:
                if "authors" in source:
                    citation = f"{', '.join(source['authors'])} ({source.get('year', 'n.d.')}). "
                    citation += f"{source.get('title', 'Untitled')}."
                    if "doi" in source:
                        citation += f" DOI: {source['doi']}"
                    citations.append(citation)
            return citations
        
        async def identify_gaps(findings: List[str]) -> List[str]:
            """Identify research gaps"""
            # Simulated gap analysis
            gaps = []
            keywords = ["long-term effects", "diverse populations", "mechanisms", "applications"]
            for keyword in keywords:
                if not any(keyword in finding.lower() for finding in findings):
                    gaps.append(f"Limited research on {keyword}")
            return gaps
        
        # Register tools with all branches that need them
        tools = [search_academic, search_web, analyze_statistics, 
                generate_citations, identify_gaps]
        
        self.researcher.register_tools(tools)
        self.analyst.register_tools(tools)
        self.coordinator.register_tools(tools)
    
    async def conduct_research(self, topic: str, depth: str = "comprehensive") -> Dict:
        """Conduct multi-phase research on a topic"""
        
        print(f"🔬 Starting {depth} research on: {topic}")
        print("=" * 60)
        
        # Phase 1: Planning with coordinator
        research_plan = await self.coordinator.communicate(
            f"Create a research plan for '{topic}'. " +
            f"Break it down into 4-5 key research questions."
        )
        print(f"📋 Research Plan:\\n{research_plan}\\n")
        
        # Phase 2: Information gathering with ReAct
        print("📚 Gathering Information...")
        research_results = await self.researcher.ReAct(
            f"Research '{topic}' comprehensively. " +
            "Use search tools to find academic and web sources. " +
            "Extract key findings and identify patterns.",
            tools=[self.researcher.tools],
            max_iterations=5
        )
        
        # Store findings
        self.research_memory["findings"].append(research_results)
        
        # Phase 3: Analysis with parallel processing
        print("🔍 Analyzing Findings...")
        analysis_tasks = [
            self.analyst.communicate(
                f"Analyze these research findings for patterns: {research_results}"
            ),
            self.analyst.communicate(
                f"Identify statistical trends in: {research_results}"
            ),
            self.analyst.communicate(
                f"Find connections between different aspects of: {research_results}"
            )
        ]
        
        analysis_results = await asyncio.gather(*analysis_tasks)
        self.research_memory["analysis"] = {
            "patterns": analysis_results[0],
            "trends": analysis_results[1],
            "connections": analysis_results[2]
        }
        
        # Phase 4: Critical review
        print("🎯 Critical Review...")
        critique = await self.critic.communicate(
            f"Critically review this research on '{topic}':\\n" +
            f"Findings: {research_results}\\n" +
            f"Analysis: {analysis_results}\\n" +
            "Identify any biases, gaps, or areas needing more research."
        )
        
        gaps = await self.critic.operate(
            f"Use identify_gaps tool on findings: {self.research_memory['findings']}"
        )
        self.research_memory["gaps"] = gaps
        
        # Phase 5: Report generation
        print("✍️ Generating Report...")
        report = await self.writer.communicate(
            f"Create a comprehensive research report on '{topic}' with:\\n" +
            f"1. Executive Summary\\n" +
            f"2. Key Findings: {research_results}\\n" +
            f"3. Analysis: {self.research_memory['analysis']}\\n" +
            f"4. Critical Assessment: {critique}\\n" +
            f"5. Research Gaps: {gaps}\\n" +
            f"6. Conclusions and Recommendations\\n" +
            "Format with clear sections and bullet points."
        )
        
        # Phase 6: Multi-agent consensus
        print("🤝 Building Consensus...")
        consensus_messages = [
            ("researcher", await self.researcher.communicate(
                f"Do you agree with this report summary? {report[:500]}"
            )),
            ("analyst", await self.analyst.communicate(
                f"Is the analysis accurate? {report[:500]}"
            )),
            ("critic", await self.critic.communicate(
                f"Are there any remaining concerns? {report[:500]}"
            ))
        ]
        
        # Final output
        final_report = {
            "topic": topic,
            "timestamp": datetime.now().isoformat(),
            "research_plan": research_plan,
            "report": report,
            "consensus": consensus_messages,
            "memory": self.research_memory,
            "metadata": {
                "depth": depth,
                "agents_used": 5,
                "iterations": 6
            }
        }
        
        return final_report
    
    async def interactive_research(self):
        """Interactive research session with follow-up questions"""
        
        topic = "Impact of AI on education"
        
        # Initial research
        report = await self.conduct_research(topic)
        
        print("\\n" + "=" * 60)
        print("📊 RESEARCH COMPLETE")
        print("=" * 60)
        print(report["report"][:1500] + "...\\n")
        
        # Follow-up questions
        followup_questions = [
            "What are the ethical considerations?",
            "How does this compare to traditional methods?",
            "What are the implementation challenges?"
        ]
        
        print("💬 Follow-up Questions:")
        for question in followup_questions:
            print(f"\\n❓ {question}")
            
            # Use coordinator to route question to appropriate expert
            router_response = await self.coordinator.communicate(
                f"Which expert should answer: {question}? " +
                "Choose: researcher, analyst, critic, or writer"
            )
            
            # Get expert response
            if "researcher" in router_response.lower():
                answer = await self.researcher.communicate(
                    f"Based on our research on {topic}, answer: {question}"
                )
            elif "analyst" in router_response.lower():
                answer = await self.analyst.communicate(
                    f"Based on our analysis of {topic}, answer: {question}"
                )
            elif "critic" in router_response.lower():
                answer = await self.critic.communicate(
                    f"From a critical perspective on {topic}, answer: {question}"
                )
            else:
                answer = await self.writer.communicate(
                    f"Summarize the answer to: {question} about {topic}"
                )
            
            print(f"💡 {answer[:300]}...")

async def main():
    assistant = ResearchAssistant()
    await assistant.interactive_research()

if __name__ == "__main__":
    asyncio.run(main())`,
    explanation: `This research assistant showcases:

1. **Multi-Agent Architecture**: Five specialized agents working together
2. **ReAct Reasoning**: Using the ReAct pattern for systematic research
3. **Parallel Processing**: Concurrent analysis tasks for efficiency
4. **Inter-Branch Communication**: Agents sharing findings and building consensus
5. **Tool Integration**: Academic search, statistical analysis, citation generation
6. **Memory Management**: Persistent research memory across phases
7. **Critical Thinking**: Dedicated critic agent for quality assurance
8. **Dynamic Routing**: Coordinator routing questions to appropriate experts

The system demonstrates how complex research tasks can be broken down and handled by specialized agents working in coordination.`,
    extensions: [
      'Add real API integrations for academic databases',
      'Implement visual report generation with charts',
      'Add collaborative features for team research',
      'Create domain-specific research templates',
      'Add version control for research iterations'
    ]
  },
  {
    id: 'code-review-assistant',
    title: 'Intelligent Code Review System',
    description: 'AI-powered code review with multiple perspectives and actionable feedback',
    difficulty: 'intermediate',
    concepts: ['Branch specialization', 'code analysis', 'structured feedback', 'best practices'],
    estimatedTime: 30,
    code: `from lionagi import Branch, iModel
from pydantic import BaseModel
from typing import List, Optional, Dict
import asyncio
import ast
import re

class CodeIssue(BaseModel):
    line: int
    severity: str  # "error", "warning", "info"
    category: str  # "security", "performance", "style", "logic"
    message: str
    suggestion: Optional[str]

class CodeReview(BaseModel):
    overall_quality: float  # 0-10
    issues: List[CodeIssue]
    strengths: List[str]
    improvements: List[str]
    security_score: float
    maintainability_score: float
    test_coverage_suggestion: List[str]

class CodeReviewAssistant:
    """Multi-perspective code review system"""
    
    def __init__(self):
        # Security-focused reviewer
        self.security_reviewer = Branch(
            system="""You are a security expert reviewing code for vulnerabilities.
            Focus on: SQL injection, XSS, authentication issues, data exposure,
            input validation, and cryptographic weaknesses.
            Be specific about line numbers and provide fixes.""",
            chat_model=iModel(provider="openai", model="gpt-4")
        )
        
        # Performance reviewer
        self.performance_reviewer = Branch(
            system="""You are a performance optimization expert.
            Focus on: algorithmic complexity, database queries, caching opportunities,
            memory usage, and async patterns. Suggest specific optimizations.""",
            chat_model=iModel(provider="openai", model="gpt-4")
        )
        
        # Clean code reviewer
        self.clean_code_reviewer = Branch(
            system="""You are a clean code advocate focusing on readability and maintainability.
            Check for: naming conventions, function length, code duplication,
            SOLID principles, and documentation. Suggest refactoring patterns.""",
            chat_model=iModel(provider="openai", model="gpt-4")
        )
    
    async def analyze_code_structure(self, code: str) -> Dict:
        """Analyze code structure and metrics"""
        lines = code.split('\\n')
        
        # Basic metrics
        metrics = {
            "total_lines": len(lines),
            "code_lines": len([l for l in lines if l.strip() and not l.strip().startswith('#')]),
            "comment_lines": len([l for l in lines if l.strip().startswith('#')]),
            "functions": [],
            "classes": [],
            "imports": []
        }
        
        # Parse Python code
        try:
            tree = ast.parse(code)
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    metrics["functions"].append({
                        "name": node.name,
                        "line": node.lineno,
                        "args": len(node.args.args)
                    })
                elif isinstance(node, ast.ClassDef):
                    metrics["classes"].append({
                        "name": node.name,
                        "line": node.lineno
                    })
                elif isinstance(node, ast.Import) or isinstance(node, ast.ImportFrom):
                    module = node.module if hasattr(node, 'module') else node.names[0].name
                    metrics["imports"].append(module)
        except:
            pass  # If parsing fails, continue with basic metrics
        
        # Complexity estimation
        complexity_indicators = ['if', 'elif', 'for', 'while', 'except', 'with']
        complexity_count = sum(
            1 for line in lines 
            for indicator in complexity_indicators 
            if indicator in line
        )
        metrics["complexity_score"] = min(10, complexity_count)
        
        return metrics
    
    async def review_code(self, code: str, context: str = "") -> CodeReview:
        """Perform comprehensive code review"""
        
        print("🔍 Starting Code Review...")
        print("=" * 50)
        
        # Analyze structure
        structure = await self.analyze_code_structure(code)
        print(f"📊 Code Metrics: {structure['code_lines']} lines, "
              f"{len(structure['functions'])} functions, "
              f"{len(structure['classes'])} classes\\n")
        
        # Parallel reviews from different perspectives
        review_tasks = [
            self.security_reviewer.communicate(
                f"Review this code for security issues:\\n```python\\n{code}\\n```\\n"
                f"Context: {context}\\n"
                "Provide specific line numbers and severity levels.",
                response_format=CodeReview
            ),
            self.performance_reviewer.communicate(
                f"Review this code for performance issues:\\n```python\\n{code}\\n```\\n"
                f"Identify bottlenecks and optimization opportunities.",
                response_format=CodeReview
            ),
            self.clean_code_reviewer.communicate(
                f"Review this code for readability and maintainability:\\n```python\\n{code}\\n```\\n"
                "Check naming, structure, and documentation.",
                response_format=CodeReview
            )
        ]
        
        reviews = await asyncio.gather(*review_tasks)
        
        # Aggregate reviews
        all_issues = []
        all_strengths = []
        all_improvements = []
        
        for review in reviews:
            all_issues.extend(review.issues)
            all_strengths.extend(review.strengths)
            all_improvements.extend(review.improvements)
        
        # Remove duplicates and sort by severity
        unique_issues = self.deduplicate_issues(all_issues)
        unique_issues.sort(key=lambda x: self.severity_rank(x.severity))
        
        # Calculate overall scores
        security_score = reviews[0].security_score if hasattr(reviews[0], 'security_score') else 7.0
        maintainability_score = reviews[2].maintainability_score if hasattr(reviews[2], 'maintainability_score') else 7.0
        overall_quality = (security_score + maintainability_score + (10 - structure["complexity_score"])) / 3
        
        # Generate test suggestions
        test_suggestions = await self.generate_test_suggestions(code, structure)
        
        final_review = CodeReview(
            overall_quality=overall_quality,
            issues=unique_issues[:10],  # Top 10 issues
            strengths=list(set(all_strengths))[:5],
            improvements=list(set(all_improvements))[:5],
            security_score=security_score,
            maintainability_score=maintainability_score,
            test_coverage_suggestion=test_suggestions
        )
        
        return final_review
    
    def deduplicate_issues(self, issues: List[CodeIssue]) -> List[CodeIssue]:
        """Remove duplicate issues"""
        seen = set()
        unique = []
        for issue in issues:
            key = (issue.line, issue.category, issue.message[:50])
            if key not in seen:
                seen.add(key)
                unique.append(issue)
        return unique
    
    def severity_rank(self, severity: str) -> int:
        """Rank severity for sorting"""
        ranks = {"error": 0, "warning": 1, "info": 2}
        return ranks.get(severity, 3)
    
    async def generate_test_suggestions(self, code: str, structure: Dict) -> List[str]:
        """Generate test case suggestions"""
        suggestions = []
        
        for func in structure.get("functions", []):
            suggestions.append(f"Test {func['name']} with valid inputs")
            suggestions.append(f"Test {func['name']} with edge cases")
            if func['args'] > 0:
                suggestions.append(f"Test {func['name']} with invalid arguments")
        
        if "database" in code.lower() or "sql" in code.lower():
            suggestions.append("Test database connection handling")
            suggestions.append("Test SQL injection prevention")
        
        if "api" in code.lower() or "request" in code.lower():
            suggestions.append("Test API error handling")
            suggestions.append("Test rate limiting")
        
        return suggestions[:5]  # Return top 5 suggestions
    
    async def interactive_review(self):
        """Interactive code review session"""
        
        # Sample code to review
        sample_code = '''
def get_user_data(user_id):
    """Fetch user data from database"""
    import sqlite3
    conn = sqlite3.connect('users.db')
    
    # Build query
    query = f"SELECT * FROM users WHERE id = {user_id}"
    cursor = conn.execute(query)
    data = cursor.fetchone()
    
    # Process data
    if data:
        result = {
            'id': data[0],
            'name': data[1],
            'email': data[2],
            'password': data[3]  # Exposing password!
        }
    else:
        result = None
    
    conn.close()
    return result

def calculate_discount(price, user_type):
    if user_type == "premium":
        discount = price * 0.2
    elif user_type == "regular":
        discount = price * 0.1
    else:
        discount = 0
    
    final_price = price - discount
    return final_price

class UserManager:
    def __init__(self):
        self.users = []
    
    def add_user(self, user):
        # No validation
        self.users.append(user)
    
    def remove_user(self, user_id):
        for i in range(len(self.users)):
            if self.users[i]['id'] == user_id:
                del self.users[i]
                break
'''
        
        # Perform review
        review = await self.review_code(
            sample_code,
            context="User management system for e-commerce platform"
        )
        
        # Display results
        print("\\n" + "=" * 50)
        print("📋 CODE REVIEW RESULTS")
        print("=" * 50)
        
        print(f"\\n⭐ Overall Quality: {review.overall_quality:.1f}/10")
        print(f"🔒 Security Score: {review.security_score:.1f}/10")
        print(f"🏗️ Maintainability: {review.maintainability_score:.1f}/10")
        
        if review.issues:
            print("\\n❌ Issues Found:")
            for issue in review.issues[:5]:
                icon = "🔴" if issue.severity == "error" else "🟡" if issue.severity == "warning" else "🔵"
                print(f"{icon} Line {issue.line} [{issue.category}]: {issue.message}")
                if issue.suggestion:
                    print(f"   💡 {issue.suggestion}")
        
        if review.strengths:
            print("\\n✅ Strengths:")
            for strength in review.strengths:
                print(f"  • {strength}")
        
        if review.improvements:
            print("\\n📈 Suggested Improvements:")
            for improvement in review.improvements:
                print(f"  • {improvement}")
        
        if review.test_coverage_suggestion:
            print("\\n🧪 Test Suggestions:")
            for test in review.test_coverage_suggestion:
                print(f"  • {test}")

async def main():
    reviewer = CodeReviewAssistant()
    await reviewer.interactive_review()

if __name__ == "__main__":
    asyncio.run(main())`,
    explanation: `This code review system demonstrates:

1. **Multiple Perspectives**: Three specialized reviewers (security, performance, clean code)
2. **Structured Analysis**: AST parsing for code structure understanding
3. **Parallel Review**: Concurrent review from different angles
4. **Issue Aggregation**: Deduplication and prioritization of findings
5. **Actionable Feedback**: Specific line numbers and fix suggestions
6. **Comprehensive Scoring**: Multiple quality metrics
7. **Test Suggestions**: Automated test case recommendations

The system provides thorough code review comparable to having multiple senior developers review your code.`,
    extensions: [
      'Add integration with GitHub/GitLab PRs',
      'Implement auto-fix suggestions',
      'Add support for multiple programming languages',
      'Create IDE plugins for real-time review',
      'Add team coding standards customization'
    ]
  }
];

/**
 * Get example project by ID
 */
export function getExampleProject(projectId: string): ExampleProject | undefined {
  return exampleProjects.find(p => p.id === projectId);
}

/**
 * Get projects by difficulty level
 */
export function getProjectsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): ExampleProject[] {
  return exampleProjects.filter(p => p.difficulty === difficulty);
}

/**
 * Get projects that demonstrate specific concepts
 */
export function getProjectsByConcept(concept: string): ExampleProject[] {
  return exampleProjects.filter(p => 
    p.concepts.some(c => c.toLowerCase().includes(concept.toLowerCase()))
  );
}

/**
 * Generate a learning path with projects
 */
export function generateProjectPath(
  skillLevel: 'beginner' | 'intermediate' | 'advanced'
): ExampleProject[] {
  const path: ExampleProject[] = [];
  
  // Start with easier projects and progress
  const difficulties: ('beginner' | 'intermediate' | 'advanced')[] = 
    skillLevel === 'beginner' ? ['beginner', 'intermediate'] :
    skillLevel === 'intermediate' ? ['intermediate', 'advanced'] :
    ['advanced'];
  
  difficulties.forEach(diff => {
    const projects = getProjectsByDifficulty(diff);
    path.push(...projects);
  });
  
  return path;
}
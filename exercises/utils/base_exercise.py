"""
Base Exercise Framework for LionAGI Learning Material
Provides common utilities and base classes for all exercises.
"""

import asyncio
import json
import time
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Union
from enum import Enum
from dataclasses import dataclass
import sys
import os

# Add lionagi to path (assuming it's installed)
try:
    import lionagi as li
    from lionagi import Branch, Session
except ImportError:
    print("LionAGI not found. Please install with: pip install lionagi")
    sys.exit(1)


class ExerciseLevel(Enum):
    LEVEL_1 = "basic_interaction"
    LEVEL_2 = "structured_responses"
    LEVEL_3 = "tool_integration"
    LEVEL_4 = "advanced_orchestration"


class Difficulty(Enum):
    BEGINNER = 1
    INTERMEDIATE = 2
    ADVANCED = 3


@dataclass
class ExerciseResult:
    """Results from an exercise attempt"""
    success: bool
    score: float  # 0.0 to 1.0
    time_taken: float
    errors: List[str]
    output: Any
    hints_used: int


class BaseExercise(ABC):
    """Base class for all LionAGI exercises"""
    
    def __init__(
        self,
        name: str,
        level: ExerciseLevel,
        difficulty: Difficulty,
        description: str,
        learning_objectives: List[str],
        max_hints: int = 3
    ):
        self.name = name
        self.level = level
        self.difficulty = difficulty
        self.description = description
        self.learning_objectives = learning_objectives
        self.max_hints = max_hints
        self.hints_used = 0
        self.start_time: Optional[float] = None
        
    @abstractmethod
    async def setup(self) -> None:
        """Setup the exercise environment"""
        pass
    
    @abstractmethod
    async def run_exercise(self, user_code: str) -> ExerciseResult:
        """Run the user's code and evaluate results"""
        pass
    
    @abstractmethod
    def get_template(self) -> str:
        """Get the code template for the exercise"""
        pass
    
    @abstractmethod
    def get_solution(self) -> str:
        """Get the solution code"""
        pass
    
    @abstractmethod
    def get_hints(self) -> List[str]:
        """Get progressive hints for the exercise"""
        pass
    
    def get_next_hint(self) -> Optional[str]:
        """Get the next available hint"""
        hints = self.get_hints()
        if self.hints_used < len(hints) and self.hints_used < self.max_hints:
            hint = hints[self.hints_used]
            self.hints_used += 1
            return hint
        return None
    
    def start_timer(self) -> None:
        """Start timing the exercise"""
        self.start_time = time.time()
    
    def get_elapsed_time(self) -> float:
        """Get elapsed time since start"""
        if self.start_time is None:
            return 0.0
        return time.time() - self.start_time
    
    async def validate_code(self, code: str) -> List[str]:
        """Basic code validation"""
        errors = []
        
        # Check for required imports
        if "import lionagi" not in code and "from lionagi" not in code:
            errors.append("Missing lionagi import")
        
        # Check for basic syntax
        try:
            compile(code, '<string>', 'exec')
        except SyntaxError as e:
            errors.append(f"Syntax error: {e}")
        
        return errors


class ExerciseRunner:
    """Utility class to run and manage exercises"""
    
    def __init__(self):
        self.exercises: List[BaseExercise] = []
        self.results: List[ExerciseResult] = []
    
    def add_exercise(self, exercise: BaseExercise) -> None:
        """Add an exercise to the runner"""
        self.exercises.append(exercise)
    
    async def run_exercise(self, exercise: BaseExercise, user_code: str) -> ExerciseResult:
        """Run a specific exercise"""
        await exercise.setup()
        exercise.start_timer()
        
        # Validate code first
        validation_errors = await exercise.validate_code(user_code)
        if validation_errors:
            return ExerciseResult(
                success=False,
                score=0.0,
                time_taken=exercise.get_elapsed_time(),
                errors=validation_errors,
                output=None,
                hints_used=exercise.hints_used
            )
        
        # Run the exercise
        result = await exercise.run_exercise(user_code)
        result.hints_used = exercise.hints_used
        self.results.append(result)
        
        return result
    
    def get_progress_report(self) -> Dict[str, Any]:
        """Generate a progress report"""
        if not self.results:
            return {"message": "No exercises completed yet"}
        
        total_exercises = len(self.results)
        successful = sum(1 for r in self.results if r.success)
        avg_score = sum(r.score for r in self.results) / total_exercises
        avg_time = sum(r.time_taken for r in self.results) / total_exercises
        total_hints = sum(r.hints_used for r in self.results)
        
        return {
            "total_exercises": total_exercises,
            "successful": successful,
            "success_rate": successful / total_exercises,
            "average_score": avg_score,
            "average_time": avg_time,
            "total_hints_used": total_hints,
            "exercises_by_level": self._group_by_level()
        }
    
    def _group_by_level(self) -> Dict[str, Dict]:
        """Group results by exercise level"""
        level_stats = {}
        
        for i, exercise in enumerate(self.exercises):
            level = exercise.level.value
            if level not in level_stats:
                level_stats[level] = {
                    "total": 0,
                    "completed": 0,
                    "successful": 0,
                    "avg_score": 0.0
                }
            
            level_stats[level]["total"] += 1
            
            if i < len(self.results):
                result = self.results[i]
                level_stats[level]["completed"] += 1
                if result.success:
                    level_stats[level]["successful"] += 1
                level_stats[level]["avg_score"] += result.score
        
        # Calculate averages
        for level_data in level_stats.values():
            if level_data["completed"] > 0:
                level_data["avg_score"] /= level_data["completed"]
        
        return level_stats


def print_exercise_header(exercise: BaseExercise) -> None:
    """Print a formatted header for an exercise"""
    print("=" * 80)
    print(f"EXERCISE: {exercise.name}")
    print(f"Level: {exercise.level.value.replace('_', ' ').title()}")
    print(f"Difficulty: {exercise.difficulty.name}")
    print("=" * 80)
    print(f"Description: {exercise.description}")
    print()
    print("Learning Objectives:")
    for obj in exercise.learning_objectives:
        print(f"  • {obj}")
    print("=" * 80)


def print_exercise_result(result: ExerciseResult) -> None:
    """Print formatted exercise results"""
    print("\n" + "=" * 50)
    print("EXERCISE RESULTS")
    print("=" * 50)
    
    status = "✅ SUCCESS" if result.success else "❌ FAILED"
    print(f"Status: {status}")
    print(f"Score: {result.score:.2f}/1.00")
    print(f"Time: {result.time_taken:.2f} seconds")
    print(f"Hints used: {result.hints_used}")
    
    if result.errors:
        print("\nErrors:")
        for error in result.errors:
            print(f"  • {error}")
    
    if result.output:
        print(f"\nOutput: {result.output}")
    
    print("=" * 50)
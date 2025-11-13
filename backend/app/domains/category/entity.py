"""
Category Domain Entity
"""
from dataclasses import dataclass
from typing import Optional


@dataclass
class Category:
    """Category domain entity representing a product category"""

    id: Optional[int]
    name: str

    def __post_init__(self):
        """Validate category data"""
        if not self.name or not self.name.strip():
            raise ValueError("Category name cannot be empty")

        # Normalize name: title case and strip whitespace
        self.name = self.name.strip().title()
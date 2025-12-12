"""
Review Database Model
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.infrastructure.database.sqlite.session import Base


class ReviewModel(Base):
    """SQLAlchemy model for product reviews and ratings."""

    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Foreign keys
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False, index=True)
    user_id = Column(String(36), nullable=False, index=True)  # UUID from identity system
    user_name = Column(String(200), nullable=False)  # Denormalized for display (first_name + last_name)
    order_id = Column(Integer, ForeignKey('orders.id', ondelete='CASCADE'), nullable=False, index=True)

    # Review content
    rating = Column(Integer, nullable=True)  # 1-5 stars (optional)
    comment = Column(Text, nullable=True)  # Optional comment

    # Approval workflow
    is_approved = Column(Boolean, default=False, nullable=False, index=True)  # Comments need approval
    approved_by = Column(String(36), nullable=True)  # Product manager who approved
    approved_at = Column(DateTime(timezone=True), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    product = relationship("ProductModel", backref="reviews")
    order = relationship("OrderModel", backref="reviews")

    def __repr__(self):
        return f"<Review(id={self.id}, product_id={self.product_id}, user_id={self.user_id}, rating={self.rating}, approved={self.is_approved})>"

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database.sqlite.session import Base


class ProductModel(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    model = Column(String(100), nullable=False)
    serial_number = Column(String(100), unique=True, nullable=False)
    description = Column(String(500), nullable=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0, nullable=False)

    # Foreign key to categories table
    category_id = Column(Integer, ForeignKey('categories.id', ondelete='RESTRICT'), nullable=False, index=True)

    image = Column(String(500), nullable=True)
    rating = Column(Float, default=0.0, nullable=True)
    warranty_status = Column(String(100), nullable=True)
    distributor = Column(String(200), nullable=True)

    # Relationship to CategoryModel
    category = relationship("CategoryModel", backref="products", lazy="joined")

    def __repr__(self):
        return f"<Product(id={self.id}, name='{self.name}', price={self.price})>"
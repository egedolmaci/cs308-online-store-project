from pydantic import BaseModel, EmailStr, Field
from typing import Literal

Role = Literal["customer", "sales_manager", "product_manager", "support_agent"]

class UserBase(BaseModel):
    email: EmailStr
    role: Role = "customer"

class UserCreate(UserBase):
    password: str = Field(min_length=8)

class UserRead(UserBase):
    id: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Message(BaseModel):
    detail: str
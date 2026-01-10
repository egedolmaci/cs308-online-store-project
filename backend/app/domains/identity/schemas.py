from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional

Role = Literal["customer", "sales_manager", "product_manager", "support_agent"]

class UserCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)
    address: Optional[str] = Field(None, max_length=500)

class UserRead(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    role: Role
    address: Optional[str] = None
    tax_id: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Message(BaseModel):
    detail: str


class LoginResponse(BaseModel):
    user_id: str
    first_name: str
    last_name: str
    email: EmailStr
    role: Role
    address: Optional[str] = None
    tax_id: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    address: Optional[str] = Field(None, max_length=500)
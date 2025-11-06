from pydantic import BaseModel, EmailStr, Field
from typing import Literal

Role = Literal["customer", "sales_manager", "product_manager", "support_agent"]

class UserCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)

class UserRead(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    role: Role

class UserRead(BaseModel):
    id: str
    email: EmailStr
    role: Role

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
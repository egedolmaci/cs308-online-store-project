from fastapi import APIRouter, HTTPException, Depends, Response, Request, status
from typing import Optional, Iterable
from app.core.config import get_settings
from app.domains.identity.schemas import UserCreate, UserRead, LoginRequest, Message, LoginResponse
from app.domains.identity.use_cases import (
    register_user, authenticate_user,
    create_access_token, create_refresh_token,
    verify_token, get_user,
)

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
settings = get_settings()

ACCESS_COOKIE_NAME = "access_token"
REFRESH_COOKIE_NAME = "refresh_token"

def set_cookie(response: Response, name: str, value: str, max_age: Optional[int]):
    response.set_cookie(
        key=name,
        value=value,
        max_age=max_age,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        domain=settings.COOKIE_DOMAIN,
        path=settings.COOKIE_PATH,
    )

def clear_cookie(response: Response, name: str):
    response.delete_cookie(
        key=name,
        domain=settings.COOKIE_DOMAIN,
        path=settings.COOKIE_PATH,
    )

def get_current_user(request: Request):
    token: Optional[str] = request.cookies.get(ACCESS_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    payload = verify_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = get_user(payload.get("sub"))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user, payload.get("role")

def require_roles(*roles: Iterable[str]):
    def dep(user_with_role = Depends(get_current_user)):
        user, role = user_with_role
        if roles and role not in roles:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    return dep

@router.post("/register", response_model=UserRead, status_code=201)
def register(payload: UserCreate):
    try:
        user = register_user(
            first_name=payload.first_name,
            last_name=payload.last_name,
            email=payload.email,
            password=payload.password,  # default role "customer"
            address=payload.address,
        )
        return UserRead(id=user.id, first_name=user.first_name, last_name=user.last_name, email=user.email, role=user.role, address=user.address)
    except ValueError:
        raise HTTPException(status_code=400, detail="User already exists")

@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, response: Response):
    user = authenticate_user(payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access = create_access_token(user.id, user.role)
    refresh = create_refresh_token(user.id, user.role)

    set_cookie(response, ACCESS_COOKIE_NAME, access, max_age=60 * settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    set_cookie(response, REFRESH_COOKIE_NAME, refresh, max_age=60 * 60 * 24 * settings.REFRESH_TOKEN_EXPIRE_DAYS)

    return LoginResponse(
        user_id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        role=user.role,
        address=user.address,
    )

@router.post("/logout", response_model=Message)
def logout(response: Response):
    clear_cookie(response, ACCESS_COOKIE_NAME)
    clear_cookie(response, REFRESH_COOKIE_NAME)
    return Message(detail="Logged out")

@router.post("/refresh", response_model=Message)
def refresh(request: Request, response: Response):
    token: Optional[str] = request.cookies.get(REFRESH_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    payload = verify_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user = get_user(payload.get("sub"))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    new_access = create_access_token(user.id, user.role)
    set_cookie(response, ACCESS_COOKIE_NAME, new_access, max_age=60 * settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Message(detail="Refreshed")

@router.get("/me", response_model=LoginResponse)
def me(user_with_role = Depends(get_current_user)):
    user, role = user_with_role
    return LoginResponse(
        user_id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        role=user.role,
        address=user.address,
    )

# Example role-guarded usage (to add later):
# @router.get("/admin/reports", dependencies=[Depends(require_roles("sales_manager", "product_manager"))])
# def reports(): ...
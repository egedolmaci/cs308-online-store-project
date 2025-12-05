from fastapi import APIRouter, HTTPException, Depends
from app.domains.identity.schemas import UserUpdate, UserRead
from app.domains.identity.use_cases import update_user_profile
from app.api.endpoints.auth import get_current_user

router = APIRouter(prefix="/api/v1/users", tags=["users"])

@router.put("/{user_id}", response_model=UserRead)
def update_user(user_id: str, payload: UserUpdate, user_with_role = Depends(get_current_user)):
    current_user, role = user_with_role

    # Users can only update their own profile unless they have admin privileges
    if current_user.id != user_id and role not in ["product_manager", "sales_manager"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this user")

    updated_user = update_user_profile(
        user_id=user_id,
        first_name=payload.first_name,
        last_name=payload.last_name,
        address=payload.address,
    )

    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserRead(
        id=updated_user.id,
        first_name=updated_user.first_name,
        last_name=updated_user.last_name,
        email=updated_user.email,
        role=updated_user.role,
        address=updated_user.address,
    )
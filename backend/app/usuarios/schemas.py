
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    username: str = Field(
        min_length=1
    )
    full_name: str = Field(
        min_length=1
    )
    email: EmailStr
    password: str = Field(
        min_length=8
    )


class UserPublic(BaseModel):
    id: int
    username: str
    full_name: str
    email: EmailStr
    role: Literal["user", "admin"]
    disabled: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserAdmin(UserPublic):
    pass

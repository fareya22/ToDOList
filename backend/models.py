# models.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TodoBase(BaseModel):
    text: str
    completed: bool = False
    priority: Optional[int] = Field(default=1, ge=1, le=5)
    due_date: Optional[datetime] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[int] = Field(default=None, ge=1, le=5)
    due_date: Optional[datetime] = None

class TodoInDB(TodoBase):
    id: str

class TodoResponse(TodoInDB):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
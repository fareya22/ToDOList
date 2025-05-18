# routes.py
from fastapi import APIRouter, HTTPException, Query, Path, status
from database import collection
from models import TodoCreate, TodoUpdate, TodoResponse
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

def parse_mongo_doc(doc):
    """Convert MongoDB document to ToDo model format"""
    if doc:
        doc["id"] = str(doc.pop("_id"))
        return doc
    return None

@router.get("/todos", response_model=List[TodoResponse])
async def get_todos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    completed: Optional[bool] = None
):
    """
    Get all todos with optional filtering and pagination
    """
    try:
        query = {}
        if completed is not None:
            query["completed"] = completed
            
        todos = []
        cursor = collection.find(query).skip(skip).limit(limit)
        
        for todo in cursor:
            todos.append(parse_mongo_doc(todo))
            
        return todos
    except Exception as e:
        logger.error(f"Error fetching todos: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/todos/{todo_id}", response_model=TodoResponse)
async def get_todo(todo_id: str = Path(..., title="The ID of the todo to get")):
    """
    Get a specific todo by ID
    """
    try:
        todo = collection.find_one({"_id": ObjectId(todo_id)})
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        return parse_mongo_doc(todo)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        logger.error(f"Error fetching todo {todo_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_todo(todo: TodoCreate):
    """
    Create a new todo
    """
    try:
        now = datetime.utcnow()
        todo_dict = todo.dict()
        todo_dict["created_at"] = now
        todo_dict["updated_at"] = now
        
        result = collection.insert_one(todo_dict)
        
        # Get the created todo and return it
        created_todo = collection.find_one({"_id": result.inserted_id})
        return parse_mongo_doc(created_todo)
    except Exception as e:
        logger.error(f"Error creating todo: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/todos/{todo_id}", response_model=TodoResponse)
async def update_todo(
    todo: TodoUpdate,
    todo_id: str = Path(..., title="The ID of the todo to update")
):
    """
    Update a todo by ID
    """
    try:
        # Check if todo exists
        existing_todo = collection.find_one({"_id": ObjectId(todo_id)})
        if not existing_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        
        # Filter out None values to avoid overwriting with nulls
        update_data = {k: v for k, v in todo.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        # Update the todo
        collection.update_one(
            {"_id": ObjectId(todo_id)},
            {"$set": update_data}
        )
        
        # Get the updated todo and return it
        updated_todo = collection.find_one({"_id": ObjectId(todo_id)})
        return parse_mongo_doc(updated_todo)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        logger.error(f"Error updating todo {todo_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(todo_id: str = Path(..., title="The ID of the todo to delete")):
    """
    Delete a todo by ID
    """
    try:
        # Check if todo exists
        todo = collection.find_one({"_id": ObjectId(todo_id)})
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
            
        # Delete the todo
        collection.delete_one({"_id": ObjectId(todo_id)})
        return None
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        logger.error(f"Error deleting todo {todo_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
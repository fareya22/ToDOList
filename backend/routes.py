from fastapi import APIRouter, HTTPException
from database import collection
from models import ToDo
from bson import ObjectId


router = APIRouter()

@router.get("/todos")
def get_todos():
    todos = []
    for todo in collection.find():
        todo["id"] = str(todo["_id"])  
        del todo["_id"]               
        todos.append(todo)
    return todos


@router.post("/todos")
def create_todo(todo: ToDo):
    result = collection.insert_one(todo.dict())
    return {"message": "Todo Added"}

@router.put("/todos/{todo_id}")
def update_todo(todo_id: str, todo: ToDo):
    result = collection.update_one(
        {"_id":ObjectId(todo_id)},
        {"$set": todo.dict()}
    )
    return {"message": "Todo Updated"}

@router.delete("/todos/{todo_id}")
def delete_todo(todo_id: str):
    collection.delete_one(
        {"_id": ObjectId(todo_id)}
    )
    return {"message": "Todo deleted"}
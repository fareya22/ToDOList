from pydantic import BaseModel

class ToDo(BaseModel):
    id: str = None
    text: str
    completed: bool = False





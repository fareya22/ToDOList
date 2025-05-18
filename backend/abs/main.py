from fastapi import FastAPI
from backend.routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

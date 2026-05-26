from pydantic import BaseModel

class Message(BaseModel):
    msg: str

class PagedRequestData(BaseModel):
    offset: int
    limit: int

class PagedRequestQueryData(BaseModel):
    query: str
    offset: int
    limit: int
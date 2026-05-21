from sqlmodel import Session, SQLModel, create_engine
from decouple import config
from contextlib import contextmanager

engine = None
if config('db_connection_string').startswith('sqlite'):
    engine = create_engine(
        config('db_connection_string'),
        connect_args={
            'check_same_thread': False
        }
    )
elif config('db_connection_string').startswith('postgresql'):
    engine = create_engine(config('db_connection_string'))
    
def init_database():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
    
@contextmanager
def get_session_cm():
    gen = get_session()
    try:
        yield next(gen)
    finally:
        try:
            next(gen)
        except:
            pass
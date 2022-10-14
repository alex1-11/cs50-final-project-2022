from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
# https://realpython.com/python-sqlite-sqlalchemy/#working-with-sqlalchemy-and-python-objects

Base = declarative_base


task_tags = Table(
    "task_tags",
    Base.metadata,
    Column(")
)




user_settings
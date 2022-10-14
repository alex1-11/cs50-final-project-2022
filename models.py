from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
# https://realpython.com/python-sqlite-sqlalchemy/#working-with-sqlalchemy-and-python-objects

Base = declarative_base


task_tags = Table(
    "task_tags",
    Base.metadata,
    Column("task_id", Integer, ForeignKey("tasks.id")),
    Column("tag_id", Integer, ForeignKey("tags.id"))
)

user_settings = Table(
    "user_settings",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("setting_id", Integer, ForeignKey("settings.id")),
    Column("state", Integer)
)

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    hash = Column(String)
    settings = relationship(
        "Settings", secondary=user_settings, back_populates="users"
    )









from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
# https://realpython.com/python-sqlite-sqlalchemy/#working-with-sqlalchemy-and-python-objects

Base = declarative_base

# Possible problems with `back_populates="settings"` (not "setting")
# and with `id = Column(Integer, primary_key=True)` (not "user_id", etc. for all classes)


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

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    hash = Column(String)
    settings = relationship(
        "Setting", secondary=user_settings, back_populates="users"
    )

class Setting(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True)
    setting = Column(String)
    user = relationship(
        "User", secondary=user_settings, back_populates="settings"
    )

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True)
    created = Column(String)




    # TODO: How to set 


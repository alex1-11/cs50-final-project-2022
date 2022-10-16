from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
from app import db
# https://realpython.com/python-sqlite-sqlalchemy/#working-with-sqlalchemy-and-python-objects

Base = declarative_base()

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
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    status = Column(String)
    priority = Column(Integer)
    date = Column(String)
    datetime = Column(String)
    context_id = Column(Integer, ForeignKey("contexts.id"))
    project_id = Column(Integer, ForeignKey("projects.id"))
    note = Column(String)
    parent_id = Column(Integer),
    repeat = Column(String)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    created = Column(String)
    title = Column(String)
    status = Column(String)
    color = Column(String)
    section = Column(String)

class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True)
    title = Column(String)

class Context(Base):
    __tablename__ = "contexts"
    title = Column(String)

class Alarm(Base):
    __tablename__ = "alarms"
    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    datetime = Column(String)



    # TODO: How to set constraint on columns?
    # How to define default values for columns?


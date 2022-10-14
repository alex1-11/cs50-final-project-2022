from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from models import User, Setting, Task, Project, Tag, Context, Alarm
# from helpers import login_required, apology




class Task:
    def __init__(self, title, done=False, date=None, time=None,
                 context=None, project=None, priority=0, tags=None,
                 note=None, alarms=None, active=True, parent=None,
                 repeat=None, created='CURRENT_TIMESTAMP'):
        self.title = title
        self.done = done
        self.date = date
        self.time = time
        self.context = context
        self.project = project
        self.priority = priority
        self.tags = tags
        self.note = note
        self.alarms = alarms
        self.active = active
        self.parent = parent
        self.repeat = repeat
        self.created = created


class Project:
    def __init__(self, title, parent=None, active=True, color='#FFFFFF',
                 section=None):
        self.title = title
        self.parent = parent
        self.active = active
        self.color = color
        self.section = section

test = Task("Test task1")
print(test.parent)
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from models import User, Setting, Task, Project, Tag, Context, Alarm, task_tags, user_settings
# from helpers import login_required, apology
# from flask_sqlalchemy import SQLAlchemy


# Configure application (thanks to CS50 Finance problemset)
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Cofigure session to use filesystem (intead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure SQLAlchemy
db =
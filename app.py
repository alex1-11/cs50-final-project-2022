from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from functools import wraps
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

# TODO: Configure db for app using SQLAlchemy


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Decorate route for login
def login_required(f):
    """
    Decorates routes to require login.
    https://flask.palletsprojects.com/en/1.1.x/patterns/viewdecorators/
    CS50 Finance problemset
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function


@app.route("/")
@login_required
def index():
    """Show dashboard of today's tasks"""

    # TODO: Get user's tasks

    return render_template("index.html") #, tasks=tasks)

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            flash("Must provide usename")
            return login

        # Ensure password was submitted
        if not request.form.get("password"):
            flash("Must provide password")
            return login

        # TODO: Query database for username
        # rows = db.execute("SELECT * FROM users WHERE username = ?", str.lower(request.form.get("username")))

        # TODO: Ensure username exists and password is correct
        # if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
        #     return apology("invalid username and/or password", 403)

        # TODO: Remember which user has logged in
        # session["user_id"] = rows[0]["id"]
        # username = escape(username)

        # Redirect user to home page
        flash(f"Welcome, {username}!")
from flask import Flask, flash, redirect, render_template, request, session
import flask_session
from functools import wraps
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy import create_engine, select, update, delete
from sqlalchemy.orm import sessionmaker
from models import User, Setting, Task, Project, Tag, Context, Alarm
from models import task_tags, user_settings

import datetime
from sqlalchemy.dialects.sqlite import DATETIME

# Configure application (thanks to CS50 Finance problemset)
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Cofigure session to use filesystem (intead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
flask_session.Session(app)

# Configure db for app using SQLAlchemy
db_engine = create_engine("sqlite:///project.db", echo=True, future=True)
DbSession = sessionmaker(db_engine)


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Decorate route for login requirement
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


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form)
    if request.method == "POST":

        # Ensure username was submitted
        # TODO?: https://flask-wtf.readthedocs.io/en/1.0.x/form/#secure-form
        # ! https://flask.palletsprojects.com/en/2.2.x/patterns/wtforms/
        username = request.form.get("username")
        if not username:
            flash("Must provide usename")
            return render_template("login.html")

        # Ensure password was submitted
        if not request.form.get("password"):
            flash("Must provide password")
            return render_template("login.html")

        # Query database for username and check credentials
        with DbSession.begin() as db:
            selection = select(User).where(User.name == username)
            user = db.execute(selection).scalars().first()

            # Ensure username exists and password is correct
            if (not user or
                    not check_password_hash(
                        user.hash,
                        request.form["password"]
                    )
                ):
                # Then: Wrong credentials
                flash("Incorrect username/password")
                return render_template("login.html")

            # Remember which user has logged in
            session["user_id"] = user.id
            session["user_name"] = user.name

        # Redirect user to home page
        flash(f"Welcome, {username}!")
        return redirect("/")

    # GET clause
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out, close the session"""

    # Forget any user_id
    session.clear()

    # Redirect to login form
    return redirect("/login")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register new user"""

    if request.method == "POST":

        # Ensure username was submitted
        username = request.form.get("username")
        if not username:
            flash("Must provide usename")
            return redirect("/register")

        # Ensure password was submitted
        if not request.form.get("password"):
            flash("Must provide password")
            return redirect("/register")

        # Ensure password confirmation is matching
        if not request.form.get("password") == request.form.get("confirm"):
            flash("Passwords do not match")
            return redirect("/register")

        # Ensure username is not already taken
        with DbSession.begin() as db:
            selection = select(User).where(User.name == username)
            user_exists = db.execute(selection).scalars().first()
            if user_exists:
                flash("Sorry! The username is already taken")
                return redirect("/register")

        # Add new user to database
        with DbSession.begin() as db:
            newuser = User(
                name=username,
                hash=generate_password_hash(request.form.get("password")),
            )
            db.add(newuser)

        # Registration succed. Redirect to login
        flash("Registered. Now you can login into your account")
        return render_template("login.html")

    else:
        return render_template("register.html")


@app.route("/", methods=["GET", "POST"])
@login_required
def index():
    """Show dashboard of today's tasks, grouped by contexts"""
    if request.method == "POST":
        # print(">>>>",request.form["task_mark"])

        # Add new task
        if request.form.get("task_new_trigger") and request.form.get("task_new"):
            with DbSession.begin() as db:
                task_new = Task(
                    # Uses .strip() method to remove whitespaces from input
                    title=request.form.get("task_new").strip(),
                    # TODO: set default values for classes,
                    # add constraints
                    # TODO?: deconstruct project, context, tags,
                    # priority from title
                    user_id=session["user_id"],
                )
                db.add(task_new)
            return redirect("/")

        # Complete the task (can't complete/re-add frozen, binned tasks)
        if request.form.get("task_mark"):
            with DbSession.begin() as db:
                task = db.execute(
                    select(Task)
                    .where(Task.id == request.form["task_mark"])
                ).scalars().first()
                if task.status == "done":
                    db.execute(
                        update(Task)
                        .where(Task.id == task.id)
                        .values(status="active")
                    )
                elif task.status == "active":
                    db.execute(
                        update(Task)
                        .where(Task.id == task.id)
                        .values(status="done")
                    )
            return redirect("/")

        # Delete the task (moves task to "trash bin" which makes it possible to undo)
        if request.form.get("task_delete"):
            with DbSession.begin() as db:
                db.execute(
                    update(Task)
                    .where(Task.id == request.form["task_delete"])
                    # TODO: add _bin if no _bin yet https://www.w3schools.com/python/python_ref_string.asp
                    .values(status=Task.status + "_bin")
                )
            return redirect("/")

        # TODO: Restore the deleted task (removes "_bin" from end of status)
        # https://www.w3schools.com/python/python_ref_string.asp
        if request.form.get("task_restore"):
            with DbSession.begin() as db:
                db.execute(
                    update(Task)
                    .where(Task.status.endswith('_bin', autoescape=True))
                )

        # Empty trash bin. Permanently deletes tasks with "_bin" in status
        if request.form.get("bin_empty"):
            with DbSession.begin() as db:
                db.execute(
                    delete(Task)
                    .where(Task.status.endswith('_bin', autoescape=True))
                    .execution_options(synchronize_session=False)
                )
            return redirect("/")


        # TODO: Edit the task
        # ? Maybe collect data in front-end and
        # ? update it with time pattern to back end

        return redirect("/")
    # GET request shows the UI
    else:
        # TODO: Get user's tasks, grouped by contexts
        # TODO: ~AJAX~ for diff views. Use JS, fetch and JSON:
        # https://flask.palletsprojects.com/en/2.2.x/patterns/javascript/

        # Connect to db, load up tasks and show them out
        with DbSession.begin() as db:
            # TODO: join other tables into selection to pass info
            # about the project, context, tags etc.
            tasks = db.execute(select(Task)).scalars().all()
            if tasks:
                return render_template("index.html", tasks=tasks)
            else:
                flash("No tasks left")
                return render_template("index.html")


@app.route("/test", methods=["GET", "POST"])
@login_required
def test():
    """TEST ROUTE"""
    if request.method == "GET":
        render_template("test.html")

    if request.method == "POST":
        pass
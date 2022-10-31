from flask import Flask, flash, redirect, render_template, request, session, jsonify
import flask_session
from functools import wraps
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy import create_engine, select, update, delete, not_
from sqlalchemy.orm import sessionmaker
from models import User, Setting, Task, Project, Tag, Context, Alarm
from models import task_tags, user_settings, as_dict

from datetime import date
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
    """Show dashboard of  TODO: today's tasks, grouped by contexts"""
    if request.method == "POST":
        # print(">>>>",request.form["task_mark"])

        # Add new task (request comes from js fetch())
        if request.form.get("task_new"):
            # Prepare add-data depending on active view
            newdate = request.form.get('task_new_date')
            newstatus = None
            match request.form.get('view'):
                case 'today':
                    newdate = newdate if (newdate is not None) else date.today()
                case 'upcoming':
                    newdate = newdate if (newdate is not None) else date.today()
                case 'nodate':
                    pass
                case 'all':
                    pass
                case 'completed':
                    newstatus = 'done'
                case 'deleted':
                    newstatus = 'active_bin'

            with DbSession.begin() as db:
                # TODO?: deconstruct project, context, tags,
                # priority from title

                task_new = Task(
                    # Uses .strip() method to remove whitespaces from input
                    title=request.form.get("task_new").strip(),
                    user_id=session["user_id"],
                    date=newdate,
                    status=newstatus,
                )
                db.add(task_new)
                db.flush()
                return render_template("task.html", task=task_new)

        # Complete/undone the task (only active/done tasks)
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
                return render_template("task.html", task=task)

        # Delete/restore task
        # Moves task to "trash bin" which makes it possible to undo
        if request.form.get("task_delete"):
            with DbSession.begin() as db:
                task = db.execute(
                    select(Task)
                    .where(Task.id == request.form["task_delete"])
                ).scalars().first()
                # Restore if in bin
                # https://www.w3schools.com/python/python_ref_string.asp
                if task.status.endswith('_bin'):
                    string_status = task.status.replace('_bin', '')
                    db.execute(
                        update(Task)
                        .where(Task.id == task.id)
                        .values(status=string_status)
                        .execution_options(synchronize_session='fetch')
                    )
                elif not(task.status.endswith('_bin')):
                    db.execute(
                        update(Task)
                        .where(Task.id == request.form["task_delete"])
                        .values(status=Task.status + "_bin")
                        .execution_options(synchronize_session='fetch')
                    )
                else:
                    return None
                # Update task obj from db and render task template
                db.flush()
                task = db.execute(
                    select(Task)
                    .where(Task.id == request.form["task_delete"])
                ).scalars().first()
                return render_template("task.html", task=task)

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
        return None

    # GET request shows the UI
    else:
        # TODO: Get user's tasks, grouped by contexts
        # TODO: Views. Remake to use JS, fetch and JSON:
        # https://flask.palletsprojects.com/en/2.2.x/patterns/javascript/
        with DbSession.begin() as db:
            today = date.today()
            view = {
                "type": "today",
                "task_add": "visible"
            }
            tasks = db.execute(
                select(Task)
                .where(Task.date <= today, Task.status == 'active')
            ).scalars().all()
            if tasks:
                return render_template("index.html", tasks=tasks, view=view)
            else:
                return render_template("index.html", view=view)


@app.route("/view", methods=["POST"])
@login_required
def view():
    """Form html response with tasks list for fetch request"""
    # TODO: join other tables into selection to pass info
    # about the project, context, tags etc.

    # Connect to db, load up tasks and show them out
    tasks = None
    # Default view setting
    view = {
        "type": "today",
        "task_add": "visible"
    }
    with DbSession.begin() as db:
        view["type"] = request.form.get("view")
        print('>>>', view["type"], type(view["type"]))
        match view["type"]:
            case 'today':
                print('>>> case:', view["type"])
                today = date.today()
                tasks = db.execute(
                    select(Task)
                    .where(Task.date <= today, Task.status == 'active')
                    .order_by(Task.date)
                ).scalars().all()
            case 'upcoming':
                print('>>> case:', view["type"])
                today = date.today()
                tasks = db.execute(
                    select(Task)
                    .where(Task.date >= today, Task.status == 'active')
                    .order_by(Task.date)
                ).scalars().all()
            case 'nodate':
                print('>>> case:', view["type"])
                tasks = db.execute(
                    select(Task)
                    .where(Task.date == None, Task.status == 'active')
                ).scalars().all()
                pass
            case 'all':
                print('>>> case:', view["type"])
                tasks = db.execute(
                    select(Task)
                    .where(Task.status == 'active')
                ).scalars().all()
            case 'completed':
                print('>>> case:', view["type"])
                tasks = db.execute(
                    select(Task)
                    .where(Task.status == 'done')
                ).scalars().all()
            case 'deleted':
                print('>>> case:', view["type"])
                tasks = db.execute(
                    select(Task)
                    .where(Task.status.endswith('_bin', autoescape=True))
                ).scalars().all()
                view["task_add"] = "invisible"
            # Default case - show all tasks
            # TODO: make a setting dependance on default view
            case _:
                print('>>> case: _')
                tasks = None
        if tasks:
            return render_template("tasklist.html", tasks=tasks, view=view)
        else:
            view["type"] = ""
            return render_template("tasklist.html", view=view)



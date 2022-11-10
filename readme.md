# tskFLOW
#### Video Demo:  <URL HERE>
#### Description:
tskFLOW is a simple minimalistic todo application for tracking tasks and their due dates.
The app is made with several tools and programming languages:
- Python
- Flask
- Werkzeug.security
- SQLAlchemy
- SQLite3
- HTML
- CSS
- Bootstrap 5.2
- JavaScript
- Jinja templates

Back end (`/app.py`) is written in **Python** with use of few additational libraries:
- **Flask** framework for routing http requests;
- **Werkzeug.security** for hashing users' passwords;
- **SQLAlchemy** for interacting with app's database and having pythonic objects (classes) for users, tasks and stuff, which are defined in `/models.py` file.

App has its own database (`/project.db`), which was made with **SQLite3** (`/db-schema.sql`) contains:
- user data:
  - user names;
  - hashed passwords;
- tasks data:
  - titles;
  - due dates;
  - states (e.g. open tasks, done and deleted ones);
  - creation date and time.
  - *and tons of other properties, which have not found implementation as app's features yet and are to be inplemented in future development of this project, such as due time, contexts, projects, priority, tags, notes, alarms, frozen state, repeat patterns, completion datetime etc. Most of these are already taken into account, defined in `/models.py` with use of SQLAlchemy and made their way into project's database tables.*

Front end is made with use of **HTML, CSS, Bootstrap 5.2** and **JavaScript**. It also leverages the use of **Jinja2 templates** provided from Flask's backend side.

User starts at login page, from which he can go to registering form if he didn't created an account yet.
App uses Flask's message flashing to give needed feedback on user's wrong inputs during registration and logging-in.
Interface for logged-in users 

is made with use of Bootstrap's classes, basic grid system and few handy components such as offcanvas (for showing tasklists menu ) and drop down

Every Task is considered as a Python Class object and has a set of mandatory and optional attributes described further.



All the data provided by user into input forms at fontend gets fetched via JS with POST requests
- title, which speaks for itself;
- creation datetime - this info is recorded automatically by SQLite for informational purposes and is stored in database, but don't get displayed to user
In current stage of the project each task can have optional attributes:
- done ('False' by default)
- date ('None' by default) - to specify a due date for a task;
- time ('None' by default) - specify a due time;
- context ('None' by default) - where or with which tool a task can be done;
- project ('None' by default) - to group tasks under specific goal;
- priority ('0' by default) - speaks by itself, has 0 to 3 levels of priority;
- tags ('None' by default) - holds lists of tags to group tasks by persons, places, topics etc.;
- note ('None' by default) - allows to hold discription and notes related to task;
- alarms ('None' by default) - allows to set reminders on tasks;
- active ('True' by default) - allows to filter and remove tasks from certain views;
- parent ('None' by default) - allows to create sub-tasks and checklists;
- repeat ('None' by default) - allows to recreate a task for future date with recurrance pattern after complition;
- created ('CURRENT_TIMESTAMP') - writes down the date and time of creation.

There is also a Project class for classifying tasks to certain projects (aka big tasks, "elephants", lists, thematic backlogs etc.):
- title (the only mandatory)
- parent ('None' by default) - for allowing sub-projects and sub-lists;
- active ('True' by default) - allows to disable and freeze projects;
- color ('None' by default) - allows to visually customize projects and it's tasks;
- section ('None' by default) - allows to group projects;
- created ('CURRENT_TIMESTAMP') - writes down the date and time of creation.

**TODO:**
Database layer
    Maybe use `sqlalchemy`? https://stackoverflow.com/questions/2047814/is-it-possible-to-store-python-class-objects-in-sqlite
    Possible schema instance
    +----------+       +-------------+
    | List     |       | Task        |
    +----------+       +-------------+
    | id (pk)  <---+   | id (pk)     |
    | name     |   +---+ listid (fk) |
    |          |       | desc        |
    |          |       |             |
    +----------+       +-------------+
    Tables: users, tasks, contexts, projects, tags(!?) ?
    Many to many relationship!
    https://www.digitalocean.com/community/tutorials/how-to-use-many-to-many-database-relationships-with-flask-and-sqlite
    https://fmhelp.filemaker.com/help/18/fmp/en/index.html#page/FMP_Help%2Fmany-to-many-relationships.html%23

    ! Foreign keys doc: https://www.sqlite.org/foreignkeys.html
    ! sqlalchemy https://realpython.com/python-sqlite-sqlalchemy/#working-with-sqlalchemy-and-python-objects

    image.png
Task creation module
    quick add
    properties picker
        date and time picker
            detector for typing those properties
    tags picker
    project picker
Tasks view and different filtered views
    ! Use AJAX! and jquery(?) for updating div with GET requests
Task view and edit modules
Projects view
Project view and edit modules
    Frozen (inactive) projects section
User Settings module
    Auto-create alarm for due datetime
Tags module
Alarms module
Repeat module (and recurrance patterns)


**Ideas possible to implement in future:**
- auto detect due dates and time (in russian and english)
- google calendar synch
- gamification with points for completing tasks and leveling for users
- tasks and projects review routine
- custom (manual) ordering of projects/tasks (add position column)
- ability to export/import data to/from other task managers and todo apps (e.g. via .csv files)
- teams and teamwork, executors and liable employees
- ...
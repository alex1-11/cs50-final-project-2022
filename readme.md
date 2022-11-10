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

##### Starting pages
User starts at login page, from which he can go to registering form if he didn't created an account yet.
App uses Flask's message flashing to give needed feedback on user's wrong inputs during forms submitions.
After logging into account user gets to index route, which made as a single page with dynamically updated task lists.

##### Main interface, views, task lists,
GUI is made with use of Bootstrap's classes, basic grid system and few handy components and functions such as drop-downs (for task edit options), modal (for displaying warning about permanent deletion of tasks when 'Empty bin' button is pressed) and offcanvas (for hiding and showing tasklists menu on smaller screens), which made it responsive for using app on devices with different screen width.

##### Creating a task
In the end of each task list there is and input form for creating new tasks which consits of title, due date fields and the add button.
After adding new task data which was inputed by user gets packed and fetched by JS to backend (Flask) with POST request.
This data gets processed by `/` route which distinguishes which form and type of input is it, creates an instance of Task class object and inserts it into the database with use of SQLAlchemy library and SQLite. Then the jinja template of task is being generated and handled back to fetch-block at frontend (`/static/script.js`).
JS function takes the responce converts the data into `text` and adds the freshly created task as an HTML element, a row in the end of a table. Even empty task lists contain the undisplayed `tasklist_end` row for determing where JS should paste freshly added tasks.
Task-add function at backend is aware of current tasklist being viewed and will automatically assign today's date when user adds task at 'Today' and 'Upcoming' views if specific due date is not being provided. It also will automatically set the state of a task if the function is being called from 'Completed' or any other view.
The new task form is not displayed at 'Deleted' view.

##### Browsing todos: views on task lists
There is a sidebar on the left side of the GUI which gives ability to change the views of lists of tasks based on grouping tasks by certain properties:
- Today: active undone tasks with due dates on today and before today (overdue);
- Upcoming: active undone tasks with due dates starting from tommorow and further into future;
- No date: active undone tasks with no due dates set;
- Completed: tasks marked as done regardless of due date;
- Deleted: all the deleted tasks end here.

##### Completing and undoing the task
Task can be marked done/undone by clicking the mark before it's title. The appropriate toggles are processed at backend after Flask recieves certain form data, which will match with defined if-statements.

##### Editing the task
To see the menu with edit options use `...` sign on the right of each task or just right click on the row of the targeted task. JS will block standart context menu call when doing so and drop down the menu with edit options.
Available edit options are:
- Change title;
- Change due date;
- Delete / Restore task.
By clicking the change title or due date the appropriate section of the task will be turned by JS into input form with current values pretyped in it. Then you can cancel or apply changes. Canceling will toggle the JS script once again and hide the input form back.




##### Deleting and restoring a task, tash bin
A few points worth mentioning when deleting a task:
- When user tries to delete a task it won't get instantly deleted from database, instead it will be put into the 'trash bin';
- Deleted tasks can be restored from the trash bin;
- After clicking the delete option by mistake user will have chance to instantly restore the task without need to search for it in the Deleted list, cause it's title becomes muted, but will only disappear after refreshing the task list being viewed by changing it or clicking the refresh button at the top left corner of tasks list.
- The deleted state is defined by `.endswith('_bin')` method. On the deletion the backend will add '_bin' suffix after task's state attribute ('active_bin', 'done_bin'), which allows remembering from which state it was marked as deleted and gives ability to restore the original one by removing the string part containing '_bin'.
- Tasks can be permanently deleted by clicking the 'Empty bin' button on the bottom right of the task list, while at 'Deleted' view (button won't display if the bin is already empty).






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
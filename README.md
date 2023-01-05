# tskFLOW

#### Video Demo: https://youtu.be/####

#### Dependecies:
- Python3
- Python package installer (`sudo apt install python3-pip`)
- Flask (`pip install Flask`)
- Flask-Session (`pip install Flask-Session`)
- SQLAlchemy (`pip install -U Flask-SQLAlchemy`)

#### Description:
tskFLOW is a simple minimalistic todo application for tracking tasks and their due dates.
The app is made with several tools and programming languages:
- Python
- Flask
- Werkzeug.security
- SQLAlchemy
- SQLite3
- datetime
- HTML
- CSS
- Bootstrap 5.2
- JavaScript
- Jinja templates

**Backend** (`/app.py`) is written in **Python** with use of few additional libraries:
- **Flask** framework for routing http requests;
- **Werkzeug.security** for hashing users' passwords;
- **SQLAlchemy** for interacting with app's database and having pythonic objects (classes) for users, tasks and stuff, which are defined in `/models.py` file.

App has its own **database** (`/project.db`), which was made with **SQLite3** (`/db-schema.sql`), has different tables with one-to-many and many-to-many relationships and stores the following data:
- user data:
  - user names;
  - hashed passwords;
- tasks data:
  - titles;
  - due dates;
  - states (e.g. open tasks, done and deleted ones);
  - creation date and time.
  - *and tons of other properties, which have not found implementation as app's features yet and are to be implemented in future development of this project, such as due time, contexts, projects, priority, tags, notes, alarms, frozen state, repeat patterns, completion datetime etc. Most of these are already taken into account, defined in `/models.py` with use of SQLAlchemy and made their way into project's database tables.*

**Frontend** is made with use of **HTML, CSS, Bootstrap 5.2** and **JavaScript**. It also leverages the use of **Jinja2 templates** provided from Flask's backend side.

##### Starting pages
User starts at login page, from which he can go to registering form if he didn't create an account yet.
App uses Flask's message flashing to give needed feedback on user's wrong inputs during forms submissions.
After logging into account user gets to index route, which made as a single page with dynamically updated task lists.

##### Main interface, views, task lists
GUI is made with use of Bootstrap's classes, basic grid system and few handy components and functions such as drop-downs (for task edit options), modal (for displaying warning about permanent deletion of tasks when 'Empty bin' button is pressed) and offcanvas (for hiding and showing task lists menu on smaller screens), which made it responsive for using app on devices with different screen width.

##### Create a task
In the end of each task list there is and input form for creating new tasks which consist of title, due date fields and the add button.
After adding new task data which was inputted by user gets packed and fetched by JS to backend (Flask) with POST request.
This data gets processed by `/` route which distinguishes which form and type of input is it, creates an instance of Task class object and inserts it into the database with use of SQLAlchemy library and SQLite. Then the jinja template of task is being generated and handled back to fetch-block at frontend (`/static/script.js`).
JS function takes the response converts the data into `text` and adds the freshly created task as an HTML element, a row in the end of a table. Even empty task lists contain the hidden `tasklist_end` row to determine where JS should paste freshly added tasks.
Task-add function at backend is aware of current task list being viewed and will automatically assign today's date when user adds task at 'Today' and 'Upcoming' views if specific due date is not being provided. It also will automatically set the state of a task if the function is being called from 'Completed' or any other view.
The new task form is not displayed at 'Deleted' view.

##### Browse to-dos: views on task lists
There is a sidebar on the left side of the GUI which gives ability to change the views of lists of tasks based on grouping tasks by certain properties:
- Today: active undone tasks with due dates on today and before today (overdue);
- Upcoming: active undone tasks with due dates starting from today and further into future;
- No date: active undone tasks with no due dates set;
- All tasks: active undone tasks regardless of due date set;
- Completed: tasks marked as done regardless of due date set;
- Deleted: all the deleted tasks end here.

##### Complete and undone a task
Task can be marked done/undone by clicking the mark before it's title. The appropriate toggles are processed at backend after Flask receives certain form data, which will match with defined if-statements.

##### Edit a task
To see the menu with edit options use `...` sign on the right of each task or just right click on the row of the targeted task. JS will block standard context menu call when doing so and drop down the menu with edit options.
Available edit options are:
- Change title;
- Change due date;
- Delete / Restore task.
By clicking the change title or due date the appropriate section of the task will be turned by JS into input form with current values preset in it. Then you can cancel or apply changes. Canceling will toggle the JS script once again and hide the input form back.
After applying changes to task the data from form will be packed and send via JS's `fetch()` to backend, the task's info in DB will get updated, new `task.html` template will be generated and handled as response back to JS scope, which will update the whole row html element of edited task.

##### Delete and restore a task, empty trash bin
A few points worth mentioning when deleting a task:
- When user tries to delete a task, it won't get instantly deleted from database, instead it will be put into the 'trash bin';
- Deleted tasks can be restored from the trash bin;
- After clicking the delete option by mistake user will have chance to instantly restore the task without need to search for it in the Deleted list, cause it's title becomes muted, but will only disappear after refreshing the task list being viewed by changing it or clicking the refresh button at the top left corner of tasks list.
- The deleted state is defined by `.endswith('_bin')` method. On the deletion the backend will add '_bin' suffix after task's state attribute ('active_bin', 'done_bin'), which allows remembering from which state it was marked as deleted and gives ability to restore the original one by removing the string part containing '_bin'.
- Tasks can be permanently deleted by clicking the 'Empty bin' button on the bottom right of the task list, while at 'Deleted' view (button won't display if the bin is already empty).

##### JavaScript
Frontend of the app uses few JS functions provided with Bootstrap:
- Dropdown menu for edit options;
- Modal for warning confirmation on Emptying trash bin with deleted tasks;
- Offcanvas for making responsive view-picker (sidebar) on narrow screens.
There is also custom `/static/script.js` file. All the data provided by user into input forms at font end gets fetched via this JS with POST requests to backend.
The script also defines the list of actions possible to apply to a task and functions for placing and refreshing all the event listers on tasks, views, options and buttons. It has helper functions for these last purposes:
- `taskSetTriggers` which serves for setting triggers on all the buttons being used by app on each `task.html` template via looping through list of possible actions (`const actions`). All the actions on a task are distinguished from each other during the loop to 3 types of events:
    1) submission of forms with input data (if action's title includes 'form', then such form will contain text or date as extra data):
       - 'task_title_edit_form';
       - 'task_date_edit_form';
    2) clicks on toggles for toggling the edit forms (include 'toggle')
       - 'task_title_edit_toggle';
       - 'task_date_edit_toggle';
    3) clicks on buttons for all other simple actions:
       - 'task_delete';
       - 'task_mark'.
    Such typification helps having one controller (`taskAction()`) for fetching the data to backend.
- `taskSetTriggersAll` which loops through all the tasks with `taskSetTriggers` function and also sets triggers on view/tasklist level, such as new task form and view refresh button.
App's JS file also has functions that manage view changes, such as:
- `taskTitleEditToggle` for toggling form to edit titles and due dates of the tasks;
- `viewChange` which loads from database the list of tasks that met a certain criteria’s, updates the HTML-div with those tasks being rendered through the use of jinja templating and sets all the event listeners to keep the usability of all the buttons after changing the view.
Other JS functions are:
- `taskAddNew` for processing data inputted when creating new task (the process is described in the 'Create a task' section);
- `taskAction` which serves as a controller for all the actions being made with task (see the paragraph on `taskSetTriggers` function above). It distinguishes the input command initialized by user, loads the form data, including the task's id, being stored inside html-elements (value attributes for buttons and hidden type inputs for forms), then send the POST request to backend via `fetch('/', {...})`, and replaces the initial task's html element with the one provided in response, sets event listeners on updated task.

##### Jinja templates
Html templates are being stored inside `/templates/` folder and has the following hierarchy:
- `layout.html`
    - `login.html`
    - `register.html`
    - `index.html`
        - `tasklist.html`
        - `task.html`

##### Python: app.py, routes, models.py, classes
Backend is a classic Flask web-application with few **routes**:
- Decorative route for checking if the user is logged in or not;
- Login route;
- Register route;
- Index route, which has several if-conditions to distinguish separate actions to take with provided data and tasks and pack out the appropriate data from the database;
- View route to prepare task lists and provide them to frontend. Made with use of `match` statement added to Python with version 3.10, the analog to `switch` statement in other programming languages.

Every Task is considered as a Python Class object defined with help of SQLAlchemy in `/models.py` file, and has a set of mandatory and optional attributes described further.
- title - mandatory, speaks for itself (type: string text);
- creation datetime - mandatory, is created automatically by SQLite query for informational purposes and is stored in database, but don't get displayed to user;
- state - mandatory, describes a state of a task, possible values: active, done and active_bin, done_bin (for deleted tasks) (type: string text);

*The models.py file also consists of several classes, such as Setting, Project, Tag, Context, Alarm, apart from Task class also having several predefined attributes, which all have not found implementation as app's features at current stage yet, and are to be implemented someday in the future development of this project. See the `roadmap.md` for ideas of future development.*


--
***Thanks CS50 crew for making all this possible for me!***
--
*Best regards,*
*Alex1-11*

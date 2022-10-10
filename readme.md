GO ONE FEATURE AT A TIME !
Stop when satisfied with result!
No need to finish all the optional features!
______________________________________________________

A todo app inspired by David Allen's Getting things done® (GTD®), Todoist and numerous similar apps

Every Task is considered as a Class object and has mandatory attribute:
- title,
and optional attributes:
- done ('False' by default)
- date ('None' by default) - to specify a due date for a task;
- time ('None' by default) - specify a due time;
- context ('None' by default) - where or with which tool a task can be done;
- project ('None' by default) - to group tasks under specific goal;
- priority ('None' by default) - speaks by itself, has None and 3 levels of priority;
- tags ('None' by default) - holds lists of tags to group tasks by persons, places, topics etc.;
- note ('None' by default) - allows to hold discription and notes related to task;
- alarms ('None' by default) - allows to set reminders on tasks;
- active ('True' by default) - allows to filter and remove tasks from certain views;
- parent ('None' by default) - allows to create sub-tasks and checklists;
- repeat ('None' by default) - allows to recreate a task for future date with recurrance pattern after complition.

There is also a Project class for classifying tasks to certain projects (aka big tasks, "elephants", lists, thematic backlogs etc.):
- title (the only mandatory)
- parent ('None' by default) - for allowing sub-projects and sub-lists;
- active ('True' by default) - allows to disable and freeze projects;
- color (#FFFFFF white by default) - allows to visually customize projects and it's tasks;
- section ('None' by default) - allows to group projects;

**TODO:**
Alert module
Repeat module (and recurrance patterns)
Task creation module, quick add, properties picker and detector for typing those properties
Task view and edit modules
Project view and edit modules
    Frozen (inactive) projects section
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

**Ideas possible to implement in future:**
- auto detect due dates and time (in russian and english)
- google calendar synch
- gamification with points for completing tasks and leveling for users
- tasks and projects review routine
- custom (manual) ordering of projects/tasks
- ability to export/import data to/from other task managers and todo apps (e.g. via .csv files)
- teams and teamwork, executors and liable employees
- ...
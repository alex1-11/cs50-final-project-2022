# tskFLOW
#### The Roadmap
Shortlist:
- Task creation module
    - quick add
    - properties picker
        - date and time picker
            - detector for typing those properties
    - tags picker
    - project picker
- Tasks view and different filtered views
    - Use JS's fetch
- Task view and edit modules
-Projects view
- Project view and edit modules
    - Frozen (inactive) projects section
- User Settings module
    - Auto-create alarm for due datetime
- Tags module
- Alarms module
- Repeat module (and recurrance patterns)


##### Ideas possible to implement in future
- auto detect due dates and time (in russian and english)
- google calendar synch
- gamification with points for completing tasks and leveling for users
- tasks and projects review routine
- custom (manual) ordering of projects/tasks (add position column)
- ability to export/import data to/from other task managers and todo apps (e.g. via .csv files)
- teams and teamwork, executors and liable employees...

Each task could have optional attributes:
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

Project class for classifying tasks to certain projects (aka big tasks, "elephants", lists, thematic backlogs etc.):
- title (the only mandatory)
- parent ('None' by default) - for allowing sub-projects and sub-lists;
- active ('True' by default) - allows to disable and freeze projects;
- color ('None' by default) - allows to visually customize projects and it's tasks;
- section ('None' by default) - allows to group projects;
- created ('CURRENT_TIMESTAMP') - writes down the date and time of creation.


--
*Alex1-11*
GO ONE FEATURE AT A TIME !
Stop when satisfied with result!
No need to finish all the optional features!

A todo app inspired by David Alen's Getting things done(R), Todoist and numerous similar apps

Every Task is considered as a Class object and has mandatory attribute:
- title,
and optional attributes:
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
- active True
- color (#FFFFFF white by default)
- area


Alert module
Repeat module (and recurrance patterns)




Ideas possible to implement in future:
- auto detect due dates and time (in russian and english)
- google calendar synch
- gamification with points for completing tasks and leveling for users
- tasks and projects review routine
- custom (manual) ordering of projects/tasks
- ...
A todo app inspired by David Alen's Getting things done(R), Todoist and numerous similar apps

Every Task is considered as a Class object and has mandatory attribute:
- title,
and optional attributes:
- date ('None' by default) - to specify a due date for a task;
- time ('None' by default);
- context ('None' by default) - where or with which tool a task can be done;
- project ('None' by default) - to group tasks under specific goal;
- priority ('None' by default);
- tags ('None' by default);
- note ('None' by default);
- alarms ('None' by default);
- active ('True' by default);
- parent ('None' by default) - allows to create sub-tasks and checklists;
- repeat ('None' by default).

There is also a Project class for classifying tasks to certain projects (aka big tasks, "elephants", etc.):
- title (the only mandatory)
- parent
- active True,
- color (#FFFFFF white by default)
- area







Ideas possible to implement in future:
- gamification with points for completing tasks and leveling for users
- tasks and projects review routine
- ...
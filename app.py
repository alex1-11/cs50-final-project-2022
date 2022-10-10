class Task:
    def __init__(self, title, date=None, time=None, context=None,
                 project=None, priority=None, tags=None, note=None,
                 alarms=None, active=True):
        self.title = title
        self.date = date
        self.time = time
        self.context = context
        self.project = project
        self.priority = priority
        self.tags = tags
        self.note = note
        self.alarms = alarms
        self.active = active

    def rename(self, newtitle):
        self.title = newtitle

    def update(self, title, date, tags, project, context)
        self.

class Project:
    def __init__(self, title, parent=None, level=0, active=True, color='#FFFFFF'):
        self.title = title
        self.parent = parent
        self.level = level
        self.active = active
        self.color = color


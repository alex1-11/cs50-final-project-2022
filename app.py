class Task:
    def __init__(self, title, date=None, time=None, context=None,
                 project=None, priority=None, tags=None, note=None,
                 alarms=None, active=True, parent=None, repeat=None):
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
        self.parent = parent
        self.repeat = repeat


class Project:
    def __init__(self, title, parent=None, level=0, active=True,
                 color='#FFFFFF'):
        self.title = title
        self.parent = parent
        self.level = level
        self.active = active
        self.color = color

test = Task("Test task1")
print(test.parent)
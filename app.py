class Task:
    def __init__(self, title, date=None, time=None, context=None,
                 project=None, priority=None, tags=None, note=None, alarms=None):
        self.title = title
        self.date = date
        self.time = time
        self.context = context
        self.project = project
        self.priority = priority
        self.tags = tags
        self.note = note
        self.alarms = alarms

    def rename(self, newtitle):
        self.title = newtitle
        
    def update(self, title, date, tags, project, context)


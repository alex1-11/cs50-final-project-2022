class Task:
    def __init__(self, title, date, time, context, project, priority, tags, note, alarms):
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


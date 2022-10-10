class Task:
    def __init__(self, title, date, context, project, priority, tags, note):
        self.title = title
        self.duedate = date
        self.context = context
        self.project = project
        self.priority = priority
        self.tags = tags
        self.note = note
    def rename(self, newtitle):
        self.title = newtitle
    def update(self, title, date, tags, project, context)


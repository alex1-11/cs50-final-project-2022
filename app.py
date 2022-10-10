class Task:
    def __init__(self, title, date, context, project, tags):
        self.title = title
        self.duedate = date
        self.context = context
        self.project = project
        self.tags = tags
    def rename(self, newtitle):
        self.title = newtitle
    def update(self, title, date, tags, project, context)


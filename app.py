class Task:
    def __init__(self, title, date, tags):
        self.title = title
        self.duedate = date
        self.tags = tags
    def rename(self, newtitle):
        self.title = newtitle

task1 = Task('taskone', '2022-10-10', )
print(task1.title)
class Task:
    title = ""
    duedate = ""
    def __init__(self, title):
        self.title = title
    def rename(self, newtitle):
        self.title = newtitle

task1 = Task("do it")
print(task1.title)
task1.rename("New task title")
print(task1.title)

task2 = Task("init task creation")
print(task2.title)
class Task:
    title = "Do the work"
    duedate = "2022-10-10"
    def __init__(self, title):
        self.title = title
    def rename(self, newtitle):
        self.title = newtitle

task1 = Task()
print(task1.title)
task1.rename("New task title")
print(task1.title)

task2 = Task("init task creation")
print(task2.title)
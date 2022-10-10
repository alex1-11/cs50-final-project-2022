class Task:
    title = "Do the work"
    duedate = "2022-10-10"
    def rename(self, newtitle):
        self.title = newtitle

task1 = Task()
print(task1.title)

print(task1.rename("New task title").title)
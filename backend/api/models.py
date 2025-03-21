from django.db import models

class Student(models.Model):
    email = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=100, blank=True)  # Allow blank for manual override
    batch = models.CharField(max_length=10)
    branch = models.CharField(max_length=100)
    activated = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.name:  # Set name only if it's empty
            self.name = self.email
        super().save(*args, **kwargs)

class Course(models.Model):

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    professor = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    num_credits = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.name} ({self.code})"

class Course(models.Model):
    course_id = models.AutoField(primary_key=True) # auto incremeent primary key
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    professor = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} ({self.code})"
    
class CourseMetrics(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="ratings")
    content_toughness = models.IntegerField(default=0)  # 0-10 scale
    teaching_quality = models.IntegerField(default=0)  # 0-10 scale
    workload = models.IntegerField(default=0)           # 0-10 scale
    exam_difficulty = models.IntegerField(default=0)    # 0-10 scale
    grading_strictness = models.IntegerField(default=0) # 0-10 scale
    resources_provided= models.IntegerField(default=0)  # 0-10 scale
    recommendation = models.IntegerField(default=0)     # 0-10 scale
    grade_obtained = models.IntegerField(default=0)  # 0-10 scale
    contributor= models.ForeignKey(Student, on_delete=models.CASCADE, related_name="feedbacks")
    """
    student = Student.objects.get(email="student@example.com")
    student_feedbacks = student.feedbacks.all()  # Fetch all feedbacks given by this student
    """

    def __str__(self):
        return f"Rating for {self.course.name}"
    
class RatingDistribution(models.Model):
    course_metrics = models.ForeignKey(CourseMetrics, on_delete=models.CASCADE, related_name="distributions")
    category = models.CharField(max_length=50, choices=[("content_toughness", "Content Toughness"), ("workload", "Workload")])
    value = models.IntegerField()
    count = models.IntegerField()




class Resource(models.Model):
    resource_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="resources")
    name = models.CharField(max_length=100,default="link")
    remarks = models.CharField(max_length=255,default="") # type changed to remarks
    url = models.URLField()
    contributor = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="resources_shared",to_field="email")

    # to_field = email written as we have explicitally set email as primary key thus django does not create an id column
    is_anonymous = models.BooleanField(default=False)
    upvotes = models.PositiveIntegerField(default=0)
    downvotes = models.PositiveIntegerField(default=0)
    date_added = models.DateField(auto_now_add=True)

class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    contributor = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="comments",to_field="email")
    is_anonymous = models.BooleanField(default=False)
    upvotes = models.PositiveIntegerField(default=0)
    downvotes = models.PositiveIntegerField(default=0)
    date_posted = models.DateField(auto_now_add=True)

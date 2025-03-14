from django.db import models

class Person(models.Model):
    firstname = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.firstname} {self.surname}"

class Course(models.Model):
    course_id = models.AutoField(primary_key=True) # auto incremeent primary key
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    professor = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} ({self.code})"

class CourseMetrics(models.Model):
    course = models.OneToOneField(Course, on_delete=models.CASCADE, related_name="metrics")
    content_toughness_avg = models.FloatField()
    workload_avg = models.FloatField()
    recommended = models.PositiveIntegerField()
    not_recommended = models.PositiveIntegerField()

class RatingDistribution(models.Model):
    course_metrics = models.ForeignKey(CourseMetrics, on_delete=models.CASCADE, related_name="distributions")
    category = models.CharField(max_length=50, choices=[("content_toughness", "Content Toughness"), ("workload", "Workload")])
    value = models.IntegerField()
    count = models.IntegerField()

class Resource(models.Model):
    resource_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="resources")
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    url = models.URLField()
    contributor_name = models.CharField(max_length=255, null=True, blank=True)
    is_anonymous = models.BooleanField(default=False)
    upvotes = models.PositiveIntegerField(default=0)
    downvotes = models.PositiveIntegerField(default=0)
    date_added = models.DateField(auto_now_add=True)

class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    author_name = models.CharField(max_length=255, null=True, blank=True)
    is_anonymous = models.BooleanField(default=False)
    upvotes = models.PositiveIntegerField(default=0)
    downvotes = models.PositiveIntegerField(default=0)
    date_posted = models.DateField(auto_now_add=True)

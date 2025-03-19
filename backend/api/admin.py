from django.contrib import admin
from .models import Course, CourseMetrics, Resource, Comment

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "professor", "department", "num_credits")
    search_fields = ("name", "code", "professor", "department")
    list_filter = ("department", "num_credits")
    ordering = ("name",)
    """
    - **`list_display`** determines which fields appear as columns in the Django admin list view, 
    making it easier to browse and manage records efficiently.
      
    - **`search_fields`** enables a search box that allows admins to quickly find records based on specific fields 
    like name, code, professor, or department.  
    
    - **`list_filter`** adds filter options in the sidebar, helping admins narrow down records based on attributes such
     as department or number of credits. 
      
    - **`ordering`** specifies the default sorting order of records, typically by a chosen field like name, 
    ensuring a structured and easy-to-navigate list.
    """
@admin.register(CourseMetrics)
class CourseMetricsAdmin(admin.ModelAdmin):
    list_display = ("course", "content_toughness", "teaching_quality", "workload", "exam_difficulty",
                    "grading_strictness", "resources_provided", "recommendation", "grade_obtained", "contributor")
    list_filter = ("course", "grading_strictness", "recommendation")
    search_fields = ("course__name", "contributor__email")


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ("name", "course", "contributor","upvotes", "downvotes", "date_added")
    search_fields = ("name", "course__name", "contributor__email")
    list_filter = ("course", "is_anonymous", "date_added")
    ordering = ("-date_added",)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("course", "text", "contributor", "upvotes", "downvotes", "date_posted")
    search_fields = ("course__name", "text", "contributor__email")
    list_filter = ("course", "is_anonymous", "date_posted")
    ordering = ("-date_posted",)

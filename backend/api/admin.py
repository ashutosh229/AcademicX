from django.contrib import admin
from .models import Course, CourseMetrics, Resource, Comment, Student, ResourceVote, CommentVote

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "batch", "branch", "activated")  # Columns in the list view
    list_filter = ("batch", "branch", "activated")  # Filters on the right side
    search_fields = ("email", "name", "batch", "branch")  # Search bar fields
    ordering = ("batch", "branch", "email")  # Default ordering
    list_editable = ("activated",)  # Allows toggling activation directly from list view

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
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("id","name", "code", "professor", "department", "num_credits")
    search_fields = ("name", "code", "professor", "department")
    list_filter = ("department", "num_credits")
    ordering = ("name",)

@admin.register(CourseMetrics)
class CourseMetricsAdmin(admin.ModelAdmin):
    list_display = ("course", "content_toughness", "teaching_quality", "workload", "exam_difficulty",
                    "grading_strictness", "resources_provided", "recommendation", "grade_obtained", "contributor")
    list_filter = ("course", "grading_strictness", "recommendation")
    search_fields = ("course__name", "contributor__email")

    def get_model_perms(self, request):
        """Override model name in the admin panel"""
        return super().get_model_perms(request)

    def has_module_permission(self, request):
        self.model._meta.verbose_name_plural = "Course Feedbacks"  # Correct display name
        # This was done as admin page made it plural by default and displayed it as Course metricss
        return super().has_module_permission(request)


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ( "resource_id","course","name", "contributor","upvotes", "downvotes", "date_added")
    search_fields = ("name", "course__name", "contributor__email","resource_id")
    list_filter = ("course", "is_anonymous", "date_added")
    ordering = ("-date_added","resource_id")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("comment_id","course", "text", "contributor", "upvotes", "downvotes", "date_posted")
    search_fields = ("course__name", "comment_id", "contributor__email")
    list_filter = ("course", "is_anonymous", "date_posted")
    ordering = ("-date_posted","comment_id")


@admin.register(ResourceVote)
class ResourceVoteAdmin(admin.ModelAdmin):
    list_display = ("student", "resource", "vote_type")
    list_filter = ("vote_type",)
    search_fields = ("student__email", "resource__pk") # search by primary key

@admin.register(CommentVote)
class CommentVoteAdmin(admin.ModelAdmin):
    list_display = ("student", "comment", "vote_type")
    list_filter = ("vote_type",)
    search_fields = ("student__email", "comment__pk")
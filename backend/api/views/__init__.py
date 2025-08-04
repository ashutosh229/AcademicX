"""
When Do You Need __init__.py?
To make views/ a Python module

Without __init__.py, Python may not recognize views/ as a package in older Python versions (<3.3).
However, Django projects typically use Python 3+, where implicit namespace packages are supported, making __init__.py optional.
"""
from .course_views import *
from .student_views import *
from .comment_views import *
from .resource_views import *
from .misc_views import *
__all__ = [
    # Course-related views
    "create_course", "get_all_courses", "get_course_details","get_course_comments","get_course_feedbacks",
    "get_course_resources","add_comment","delete_comment", "add_resource","delete_resource", "give_course_feedback",

    # Student-related views
    "get_student_profile", "edit_student_name", "get_user_course_feedback",
    "activate_student", "delete_user_course_feedback","get_all_students",

    # Comment Voting APIs
    "upvote_comment", "remove_upvote_comment",
    "downvote_comment", "remove_downvote_comment",

    # Resource Voting APIs
    "upvote_resource", "remove_upvote_resource",
    "downvote_resource", "remove_downvote_resource",

    "get_analytics","warmup","real_user_ping"
]
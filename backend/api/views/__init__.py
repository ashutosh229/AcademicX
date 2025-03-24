"""
When Do You Need __init__.py?
To make views/ a Python module

Without __init__.py, Python may not recognize views/ as a package in older Python versions (<3.3).
However, Django projects typically use Python 3+, where implicit namespace packages are supported, making __init__.py optional.
"""
from .course_views import *
__all__ = ["create_course", "get_all_courses","get_course_details","add_comment","add_resource","give_course_feedback"]
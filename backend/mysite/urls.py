"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import *
from api.root import api_root


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api_root'),  # Root page
    path('insert_name/', insert_name_test, name='insert_name'),
    path('fetch_surname/<str:firstname>/', fetch_surname_test, name='fetch_surname'),
    # 'firstname' used in fetch_surname_test definintion
    # 'name = fetch_surname' used in root.py
    path('create_course/', create_course, name='create_course'),
    path('get_all_courses/', get_all_courses, name='get_all_courses'),

]
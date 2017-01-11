from django.conf.urls import url
from WhatsSup import views as app_view

urlpatterns = [
    url(r'^$', app_view.appIndex, name="homeApp"),
]
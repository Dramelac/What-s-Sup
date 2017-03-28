from django.conf.urls import url

from WhatsSup import views as app_view

urlpatterns = [
    url(r'^$', app_view.glob, name="app"),
    url(r'^$index/', app_view.index),
    url(r'^login/', app_view.login),
    url(r'^register/', app_view.register),
]

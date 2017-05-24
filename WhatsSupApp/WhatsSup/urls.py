from django.conf.urls import url

from WhatsSup import views as app_view

urlpatterns = [
    url(r'^index/', app_view.index, name="index"),
    url(r'^login/', app_view.login_view, name="login"),
    url(r'^logout/', app_view.logout_view, name="logout"),
    url(r'^register/', app_view.register, name="register"),
    url(r'^information/', app_view.information, name="information"),
    url(r'^chat/', app_view.chat, name="chat"),
    url(r'^store_pub_key/', app_view.store_pub_key, name="store_pub_key"),
    url(r'^get_pub_key/', app_view.get_pub_key, name="get_pub_key"),
    url(r'^search_user/', app_view.search_user, name="search_user"),
]

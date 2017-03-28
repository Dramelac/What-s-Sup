#coding:utf-8
from django.shortcuts import render

def index(request):
    return render(request, 'index.html')


def login(request):
    return render(request, 'login.html')


def register(request):
    return render(request, 'register.html')


def glob(request):
    # Affiche la page globale (qui va charger chat et contacts)
    titre = "coucou"
    return render(request, "global.html")


def chat(request):
    mon_titre = "Titre passé en variable"
    return render(request, "chat.html")


def contacts(request):
    mon_titre = "Titre passé en variable"
    return render(request, "chat.html")

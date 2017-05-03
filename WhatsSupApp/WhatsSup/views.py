#coding:utf-8
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
import re

def index(request):
    return render(request, 'index.html')


def login(request):
    return render(request, 'login.html')


def register(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return HttpResponseRedirect('/')
        return render(request, 'register.html')
    elif request.method == 'POST':
        pseudo = request.POST.get('pseudo', '')
        firstname = request.POST.get('firstname', '')
        lastname = request.POST.get('lastname', '')
        email = request.POST.get('email','').lower()
        psw1 = request.POST.get('password1','')
        psw2 = request.POST.get('password2','')
        if not pseudo or not firstname or not lastname or not email or not psw1 or not psw2:
            return render(request, 'register.html', {'error': 'Veuillez remplir tous les champs'})
        try:
            user = User.objects.get(username=pseudo)
            return render(request, 'register.html', {'error': 'Ce pseudo est déja utilisé'})
        except User.DoesNotExist:
            regex = re.compile(r"^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]+")
            if regex.match(email) is not None:
                if psw1==psw2:
                    if len(psw1)>=6:
                        user = User.objects.create_user(username=pseudo, lastname=lastname, firstname=firstname, email=email, password=psw1)
                        user = authenticate(username=pseudo, password=psw1)
                        if user and user.is_active:
                            login(request, user)
                            return HttpResponseRedirect('/')
                    else:
                        return render(request, 'register.html', {'error': 'Le mot de passe doit faire au moins 6 caractères'})
                else:
                    return render(request, 'register.html', {'error': 'Les mots de passe de sont pas identiques'})
            else:
                return render(request, 'register.html', {'error': 'L\'email n\'est pas valide'})
    else:
        return HttpResponseRedirect('/')



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

def information(request):
    return render(request, "information.html")
#coding:utf-8
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from models import *
import re
from django.db import IntegrityError

def index(request):
    return render(request, 'index.html')


def login_view(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return HttpResponseRedirect('/')
        return render(request, 'login.html')
    elif request.method == 'POST':
        pseudo = request.POST.get('pseudo', '')
        password = request.POST.get('password', '')
        user = authenticate(username=pseudo, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect('/')
        else:
            return render(request, 'login.html', {'error': 'Veuillez vérifier votre pseudo ou mot de passe', 'form': request.POST})
    else:
        return HttpResponseRedirect('/')

@login_required()
def logout_view(request):
    try:
        user = User.objects.get(id=request.user.id)
        db_pub_key = Pub_key.objects.get(user=user)
        db_pub_key.delete()
    except:
        pass
    logout(request)
    return HttpResponseRedirect('/')


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
            return render(request, 'register.html', {'error': 'Veuillez remplir tous les champs', 'form': request.POST})
        try:
            user = User.objects.get(username=pseudo)
            return render(request, 'register.html', {'error': 'Ce pseudo est déja utilisé', 'form': request.POST})
        except User.DoesNotExist:
            regex = re.compile(r"^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]+")
            if regex.match(email) is not None:
                if psw1==psw2:
                    if len(psw1)>=6:
                        User.objects.create_user(username=pseudo, last_name=lastname, first_name=firstname, email=email, password=psw1)
                        user = authenticate(username=pseudo, password=psw1)
                        if user is not None:
                            login(request, user)
                            return HttpResponseRedirect('/')
                        else:
                            return render(request, 'register.html',
                                          {'error': 'Erreur lors le la connexion.',
                                           'form': request.POST})
                    else:
                        return render(request, 'register.html', {'error': 'Le mot de passe doit faire au moins 6 caractères', 'form': request.POST})
                else:
                    return render(request, 'register.html', {'error': 'Les mots de passe de sont pas identiques', 'form': request.POST})
            else:
                return render(request, 'register.html', {'error': 'L\'email n\'est pas valide', 'form': request.POST})
    else:
        return HttpResponseRedirect('/')


@login_required()
def store_pub_key(request):
    if request.method == 'GET':
        return HttpResponse(status=404)
    elif request.method == 'POST':
        pub_key = request.POST.get('pub_key', '')
        if not pub_key:
            return HttpResponse(status=400)
        user = User.objects.get(id=request.user.id)
        try:
            Pub_key.objects.create(user=user, pub_key=pub_key)
        except IntegrityError:
            db_pub_key = Pub_key.objects.get(user=user)
            db_pub_key.pub_key = pub_key
            db_pub_key.save()
        except:
            return HttpResponse(status=500)
        return HttpResponse(status=200)
    else:
        return HttpResponseRedirect('/')

@login_required()
def get_pub_key(request):
    if request.method == 'GET':
        return HttpResponse(status=404)
    elif request.method == 'POST':
        user_id = request.POST.get('user_id', '')
        if not user_id:
            return HttpResponse(status=400)
        try:
            user = User.objects.get(id=user_id)
            db_pub_key = Pub_key.objects.get(user=user)
            return HttpResponse(db_pub_key.pub_key)
        except:
            return HttpResponse(status=404)
    else:
        return HttpResponseRedirect('/')

@login_required()
def chat(request):
    users = User.objects.all()
    return render(request, "chat.html", {'users': users})

def information(request):
    return render(request, "information.html")
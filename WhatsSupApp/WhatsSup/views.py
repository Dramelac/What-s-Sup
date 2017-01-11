from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def appIndex(request):
    return render(request, 'appHome.html')


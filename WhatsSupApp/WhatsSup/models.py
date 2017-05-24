from django.db import models
from django.contrib.auth.models import User

class Message(models.Model):
    author = models.CharField(max_length=200, unique=True)
    content = models.CharField(max_length=200)
    date = models.DateField()

class Pub_key(models.Model):
    user = models.OneToOneField(User)
    pub_key = models.CharField(max_length=3000)

from django.db import models


class Message(models.Model):
    author = models.CharField(max_length=200, unique=True)
    content = models.CharField(max_length=200)
    date = models.DateField()
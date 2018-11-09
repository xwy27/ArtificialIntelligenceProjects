# -*- coding: utf-8 -*-
from django.db import models
import json

class SAState(models.Model):
  id = models.IntegerField(primary_key=True, default=0)
  Process = models.FloatField(default=100)
  Temperature = models.FloatField(default = 0)
  Path = models.CharField(max_length=10000)

  def __str__(self):
    return "%d : (%f, %f)" % (self.id, self.Process, self.Temperature)

class LSState(models.Model):
  id = models.IntegerField(primary_key=True)
  Process = models.FloatField(default=100)
  Path = models.CharField(max_length=10000)

  def __str__(self):
    return "%d : %f" % (self.id, self.Process)
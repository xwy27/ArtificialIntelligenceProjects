# -*- coding: utf-8 -*-
from django.db import models

class City(models.Model):
  id = models.IntegerField(primary_key=True)
  X = models.IntegerField(default=0)
  Y = models.IntegerField(default=0)

  def __str__(self):
    return "%d : (%d, %d)" % (self.id, self.X, self.Y)
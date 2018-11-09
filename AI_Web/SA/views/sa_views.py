# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import (HttpRequest, HttpResponse, HttpResponseForbidden,
                         HttpResponseNotFound, JsonResponse, QueryDict)
# from django.db import *
from ..models import *
from .SimulatedAnnealing import SA_Step
# from LocalSearch import *

''' SA Part'''

def SA(request):
  '''
  return SA.html
  '''
  return render(request, 'SA.html')

def SA_origin(request):
  '''
  GET Method with no param
  
  Return json:
  {
    origin: {
      title: xxx,
      process: xxx,
      length: xxx,
      coordinate: [[xxx,xxx],[xxx,xxx],[xxx,xxx]]
    }
  }
  '''
  if request.method == 'GET':
    data = City.objects.all()
    coordinate = []
    for d in data:
      temp = []
      temp.append(d.X)
      temp.append(d.Y)
      coordinate.append(temp)

    cities = {
      'title': 'Origin',
      'process': 0,
      'length': 0,
      'coordinate': coordinate
    }
    return JsonResponse({
      'origin': cities
    })

def SA_step(request):
  SA = SA_Step()
  return JsonResponse({
    'SA': SA
  })
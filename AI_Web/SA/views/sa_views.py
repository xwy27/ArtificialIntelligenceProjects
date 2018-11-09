# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import (HttpRequest, HttpResponse, HttpResponseForbidden,
                         HttpResponseNotFound, JsonResponse, QueryDict)
# from django.db import *
from ..models import *
from .SimulatedAnnealing import (SA_Step, SA_Clear_Data)
from .LocalSearch import (LS_Step, LS_Clear_Data)

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
  temp = SA_Step()
  SA = {
    'title': 'Simulated Annealing',
    'process': temp[1],
    'coordinate': temp[0],
    'length': temp[2]
  }
  return JsonResponse({
    'SA': SA
  })

def SA_Clear(request):
  SA_Clear_Data()
  return JsonResponse({
    'success':  'Clear Successfully.'
  })
  

def LS_step(request):
  temp = LS_Step()
  LS = {
    'title': 'Local Search(Climbing)',
    'process': temp[1],
    'coordinate': temp[0],
    'length': temp[2]
  }
  return JsonResponse({
    'LS': LS
  })

def LS_Clear(request):
  LS_Clear_Data()
  return JsonResponse({
    'success':  'Clear Successfully.'
  })
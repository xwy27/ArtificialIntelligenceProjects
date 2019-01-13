# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import (HttpRequest, HttpResponse, HttpResponseForbidden,
                         HttpResponseNotFound, JsonResponse, QueryDict)
from ..models import *
from .GeneticAlgorithm import (GA_Step, GA_Clear_Data)

def GA(request):
  '''
  return GA.html
  '''
  return render(request, 'GA.html')

def GA_origin(request):
  '''
  Get the origin data

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

def GA_step(request):
  '''
  Get data of every one percentage for the SA algorithm

  GET Method with no param
  
  Return json:
  {
    SA: {
      title: xxx,
      process: xxx,
      length: xxx,
      coordinate: [[xxx,xxx],[xxx,xxx],[xxx,xxx]]
    }
  }
  '''
  temp = GA_Step()
  GA = {
    'title': 'Genetic algorithm',
    'process': temp[1],
    'coordinate': temp[0],
    'length': temp[2]
  }
  return JsonResponse({
    'GA': GA
  })

def GA_Clear(request):
  '''
  Clear data computed by previous GA steps
  '''
  GA_Clear_Data()
  return JsonResponse({
    'success':  'GA data clear Successfully.'
  })
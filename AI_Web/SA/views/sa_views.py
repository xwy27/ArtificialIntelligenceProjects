# -*- coding: utf-8 -*-
from django.shortcuts import render
# from django.db import *
from ..models import *
from django.http import (HttpRequest, HttpResponse, HttpResponseForbidden,
                         HttpResponseNotFound, JsonResponse, QueryDict)

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
      'coordinate': coordinate
    }
    return JsonResponse({
      'origin': cities
    })
# -*- coding: utf-8 -*-
from django.shortcuts import render
# from django.db import *
from ..models import *
from django.http import (HttpRequest, HttpResponse, HttpResponseForbidden,
                         HttpResponseNotFound, JsonResponse, QueryDict)

def Astar(request):
  return render(request, 'Astar.html')
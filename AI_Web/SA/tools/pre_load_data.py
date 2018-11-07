# -*- coding: utf-8 -*-

'''pre load default TSP city data into database'''

from django.db.transaction import atomic

from ..models import *

import os

@atomic
def atomic_save(items):
  for item in items:
    item.save()

# Load default city data
def load_cities(cities_folder_path, delete=False):
  if delete:
    print('\nDeleting all previous city data...')
    City.objects.all().delete()
    print('Deletion completes\n')

  print("Adding city data...\n")
  cities = []
  print("Loading %s ..." % cities_folder_path)
  for root, dirs, files in os.walk(cities_folder_path):
    for name in files:
      filePath = os.path.join(root, name)
      print("Loading %s ..." % filePath)

      flag = False
      try:
        with open(filePath, mode='rb') as f:
          for line in f:
            # Check dimension info
            if line.find(b'EDGE_WEIGHT_TYPE\n') != -1:
              if line.split(':')[-1].find(b'EUC_2D') == -1:
                raise Exception("Only two-dimension supported.")
            
            # Start process node
            if line.find(b'NODE_COORD_SECTION') != -1:
              flag = True
              continue
            if line.find(b'EOF') != -1:
              break
            if flag:
              s = str(line, encoding="utf-8")
              temp = s.split(" ")
              cities.append(City(
                id = temp[0],
                X = temp[1],
                Y = temp[2]
              ))

      except Exception as result:
        print("Err：%s" % result)
  
  print("\nSaving city data...")
  atomic_save(cities)
  print("Save complates")

def pre_load_data(currentPath):
  load_cities(os.path.join(currentPath, 'Cities'), True)

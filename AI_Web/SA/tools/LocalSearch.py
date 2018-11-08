import math, copy, random
# from ..models import *

# Get data from database
# points = City.objects.all()

# Get data from file
f = open('./Data/Cities/kroA150Pro.tsp', 'r')
points = [(int(lines.split()[0]), int(lines.split()[1]), int(lines.split()[2])) for lines in f.readlines()]
distance = []

def evaluate(listOfCities):
  '''
  evaluate: return the distance of the whole path
    - listOfCities: path of traveling cities
  '''
  semiResult = 0
  for x in range(1, len(points)):
    semiResult += distance[listOfCities[x-1] - 1][listOfCities[x] - 1]
  return semiResult

def getNeighborFieldSwitch2(listOfCities):
  '''
  getNeighborFieldSwitch: return the neighbor field of current result
    generated with swaping the order of every two cities
    - listOfCities: path of traveling cities
  '''
  semiResult = []
  for x in range(1, len(listOfCities) - 2):
    for y in range(x + 1, len(listOfCities) - 1):
      semiList = copy.deepcopy(listOfCities)
      semiList[x], semiList[y] = semiList[y], semiList[x]
      semiResult.append(semiList)
  return semiResult

def getNeighborFieldSwitch3(listOfCities):
  '''
  getNeighborFieldSwitch3: return the neighbor field of current result
    generated with swaping the order of every three cities
    - listOfCities: path of traveling cities
  '''
  semiResult = []
  for x in range(3, len(listOfCities) - 1):
    semiList = copy.deepcopy(listOfCities)
    semiList[x-2], semiList[x-1], semiList[x] = semiList[x], semiList[x-2], semiList[x-1]
    semiResult.append(semiList)
  return semiResult

def getNeighborFieldSwitch4(listOfCities):
  '''
  getNeighborFieldSwitch4: return the neighbor field of current result
    generated with roll the order of the whole list
    - listOfCities: path of traveling cities
  '''
  semiResult = []
  for x in range(2, len(listOfCities) - 1):
    semiList = listOfCities[x:] + listOfCities[:x]
    semiResult.append(semiList)
  return semiResult

def climb(listOfCities):
  '''
  climb: climbing
  '''
  bestScore = evaluate(listOfCities)

  semiResult1 = getNeighborFieldSwitch2(listOfCities)
  for semiResult in semiResult1:
    tempScore = evaluate(semiResult)
    if tempScore < bestScore:
      bestScore = tempScore
      listOfCities = semiResult
  
  semiResult2 = getNeighborFieldSwitch3(listOfCities)
  for semiResult in semiResult2:
    tempScore = evaluate(semiResult)
    if tempScore < bestScore:
      bestScore = tempScore
      listOfCities = semiResult

  semiResult3 = getNeighborFieldSwitch4(listOfCities)
  for semiResult in semiResult3:
    tempScore = evaluate(semiResult)
    if tempScore < bestScore:
      bestScore = tempScore
      listOfCities = semiResult
  
  return listOfCities, bestScore


# Calculate the distance between every two cities
for pointX in points:
  distance.append([])
  for pointY in points:
    if pointX[0] < pointY[0]:
      distance[-1].append(math.sqrt(pow(pointX[1] - pointY[1], 2) + pow(pointX[2] - pointY[2], 2)))
    elif pointX[0] == pointY[0]:
      distance[-1].append(0)
    else:
      distance[-1].append(distance[pointY[0] - 1][pointX[0] - 1])

# Initial result: [1, 2, ..., n, 1]
result = [x for x in range(1, len(points) + 1)]
result.append(1)

print(evaluate(result))

for counter in range(1, 1001):
  result, bestScore = climb(result)
  print(str(counter/10) + '%')
  print('Current score: ' + str(bestScore))
import math, copy, random
from datetime import datetime
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
  for _ in range(0, 1000):
    x = random.randint(1, len(listOfCities) - 2)
    y = random.randint(1, len(listOfCities) - 2)
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
  for _ in range(0, 1000):
    x = random.randint(1, len(listOfCities) - 2)
    y = random.randint(1, len(listOfCities) - 2)
    z = random.randint(1, len(listOfCities) - 2)
    if x != y and y != z and z != x:
      semiList = copy.deepcopy(listOfCities)
      semiList[z], semiList[y], semiList[x] = semiList[x], semiList[z], semiList[y]
      semiResult.append(semiList)
  return semiResult

def getNeighborFieldSwitch4(listOfCities):
  '''
  getNeighborFieldSwitch4: return the neighbor field of current result
    generated with roll the order of the whole list
    - listOfCities: path of traveling cities
  '''
  semiResult = []
  for _ in range(0, 1000):
    x = random.randint(1, len(listOfCities) - 2)
    semiList = [1] + listOfCities[x:len(listOfCities) - 1] + listOfCities[1:x] + [1]
    semiResult.append(semiList)
    y = random.randint(x, len(listOfCities) - 2)
    temp = listOfCities[x:y]
    temp.reverse()
    semiList = listOfCities[:x] + temp + listOfCities[y:]
    semiResult.append(semiList)

  return semiResult

def getNeighborFieldRandom(listOfCities):
  '''
  getNeighborFieldSwitch4: return the neighbor field of current result
    generated with roll the order of the whole list
    - listOfCities: path of traveling cities
  '''
  semiResult = []
  for _ in range(0, 1000):
    semiList = listOfCities[1:-1]
    random.Random(datetime.now()).shuffle(semiList)
    semiResult.append([1] + semiList + [1])
  return semiResult

def climb(listOfCities):
  '''
  climb: climbing
  '''
  bestScore = evaluate(listOfCities)

  semiResult1 = getNeighborFieldSwitch2(listOfCities)
  semiResult2 = getNeighborFieldSwitch3(listOfCities)
  semiResult3 = getNeighborFieldSwitch4(listOfCities)
  # semiResult4 = getNeighborFieldRandom(listOfCities)

  for semiResult in semiResult1:
    tempScore = evaluate(semiResult)
    if tempScore < bestScore:
      bestScore = tempScore
      listOfCities = semiResult
  
  for semiResult in semiResult2:
    tempScore = evaluate(semiResult)
    if tempScore < bestScore:
      bestScore = tempScore
      listOfCities = semiResult

  for semiResult in semiResult3:
    tempScore = evaluate(semiResult)
    if tempScore < bestScore:
      bestScore = tempScore
      listOfCities = semiResult
  
  # for semiResult in semiResult4:
  #   tempScore = evaluate(semiResult)
  #   if tempScore < bestScore:
  #     bestScore = tempScore
  #     listOfCities = semiResult
  
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

for counter in range(1, 400):
  result, bestScore = climb(result)
  print(str(counter/4) + '%')
  print('Current score: ' + str(bestScore))

print('100%')
print('Final Score: ' + str(bestScore))
print(result)
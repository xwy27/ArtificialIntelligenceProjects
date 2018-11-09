import math, copy, random, sys, time
from datetime import datetime
from ..models import *

# Get data from database
points = [[x.id, x.X, x.Y] for x in City.objects.all()]

# Get data from file
# f = open('./Data/Cities/kroA150Pro.tsp', 'r')
# points = [(int(lines.split()[0]), int(lines.split()[1]), int(lines.split()[2])) for lines in f.readlines()]
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
  semiList = listOfCities[1:-1]
  random.Random(datetime.now()).shuffle(semiList)
  semiResult.append([1] + semiList + [1])
  return semiResult

compareCounter = 0
temperature = 1850

def saClimb(listOfCities):
  '''
  climb: climbing
  '''
  global compareCounter
  global temperature
  bestScore = evaluate(listOfCities)

  

  semiResult1 = getNeighborFieldSwitch2(listOfCities)
  for semiResult in semiResult1:
    compareCounter = compareCounter + 1
    tempScore = evaluate(semiResult)
    deltaE = (tempScore - bestScore) 
    if deltaE < 0:
      bestScore = tempScore
      listOfCities = semiResult
    elif temperature != 0:
      r = random.random()
      if r < math.exp(-1 * deltaE / temperature):
        bestScore = tempScore
        listOfCities = semiResult
  
  semiResult2 = getNeighborFieldSwitch3(listOfCities)
  for semiResult in semiResult2:
    compareCounter = compareCounter + 1
    tempScore = evaluate(semiResult)
    deltaE = (tempScore - bestScore) 
    if deltaE < 0:
      bestScore = tempScore
      listOfCities = semiResult
    elif temperature != 0:
      r = random.random()
      if r < math.exp(-1 * deltaE / temperature):
        bestScore = tempScore
        listOfCities = semiResult

  semiResult3 = getNeighborFieldSwitch4(listOfCities)
  for semiResult in semiResult3:
    compareCounter = compareCounter + 1
    tempScore = evaluate(semiResult)
    deltaE = (tempScore - bestScore) 
    if deltaE < 0:
      bestScore = tempScore
      listOfCities = semiResult
    elif temperature != 0:
      r = random.random()
      if r < math.exp(-1 * deltaE / temperature):
        bestScore = tempScore
        listOfCities = semiResult

  # semiResult4 = getNeighborFieldRandom(listOfCities)
  # for semiResult in semiResult4:
  #   compareCounter = compareCounter + 1
  #   tempScore = evaluate(semiResult)
  #   deltaE = (tempScore - bestScore) 
  #   if deltaE < 0:
  #     bestScore = tempScore
  #     listOfCities = semiResult
  #   elif temperature != 0:
  #     r = random.random()
  #     if r < math.exp(-1 * deltaE / temperature):
  #       bestScore = tempScore
  #       listOfCities = semiResult

  if temperature > 0:
    temperature = temperature * 0.9999849
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

def SA_Cli():
  '''
  Cli version of SA_Cli
  '''
  global compareCounter
  global result
  global temperature
  print('Initial score: ' + str(evaluate(result)) + '\n')
  for x in range(0, 3):
    sys.stdout.write('\033[F\033[K')
    print(str(3 - x) + ' seconds to start local search...')
    time.sleep(1)
    
  sys.stdout.write('\033[F\033[K')
  print('-------Start local search-------\n\n\n\n')

  for counter in range(1, 400):
    for _ in range(1000):
      result, bestScore = saClimb(result)
    sys.stdout.write('\033[F\033[K\033[F\033[K\033[F\033[K\033[F\033[K')
    print('Processing: ' + str(counter/4) + '%')
    print('Temprature: ' + str(temperature))
    print(str(compareCounter) + ' times of operations has been taken.')
    print('Current score: ' + str(bestScore))

  sys.stdout.write('\033[F\033[K\033[F\033[K\033[F\033[K\033[F\033[K')
  print('Process finished: 100%')
  print(str(compareCounter) + ' times of operations has been taken in total.')
  print('Final Score: ' + str(bestScore))

def SA_Step():
  global temperature
  global points
  global result

  counter = 0

  try:
    tableItem = SAState.objects.get(id=0)
    if tableItem.counter < 100:
      counter = tableItem.Process
      temperature = tableItem.Temperature
      result = json.loads(tableItem.Path)
  except SAState.DoesNotExist:
    # Save data here
    tableItem = SAState(0, 0, temperature, json.dumps(result))
    tableItem.save()
 
  for _ in range(0, 1600):
    result, bestScore = saClimb(result)
  counter = counter + 1
  
  tableItem.Process = counter
  tableItem.Temperature = temperature
  tableItem.Path = json.dumps(result)
  tableItem.update()
  
  toReturn = []
  for city in result:
    toReturn.append([points[city - 1][1], points[city - 1][2]])
  
  return toReturn, counter, bestScore
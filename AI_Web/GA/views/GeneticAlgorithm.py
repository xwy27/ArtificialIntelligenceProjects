import math, copy, random, sys, time
from datetime import datetime
from ..models import *



def evaluate(listOfCities):
  '''
  evaluate: return the distance of the whole path
    - listOfCities: path of traveling cities
  '''
  semiResult = 0
  for x in range(1, len(points)):
    semiResult += distance[listOfCities[x-1] - 1][listOfCities[x] - 1]
  return semiResult


class Individual:
  def __init__(self, gene):
    self.gene = gene
    self.fitness = 0

  def updateFitness(self):
    self.fitness = 1.0 / evaluate(self.gene)
 
  def commaStr(self):
    res = [str(x) for x in self.gene]
    return ",".join(res)


class Population:
  def __init__(self,initgene):
    self.groupSize = 30
    self.mutationRate = 0.3
    self.crossoverRate = 0.6
    self.geneSize = 151
    self.initgene = initgene
    self.matingPool = []
    self.generation = 1
    self.result = Individual(initgene)
    self.result.updateFitness()
    #self.selectPool = []
    #self.ancients()

  def ancients(self):
    '''
    init population with random initgene
    '''
    self.matingPool = []
    for _ in range(2 * self.groupSize):
      tmpgene = getNeighborFieldRandom(self.initgene)[0]
      tmp = Individual(tmpgene)
      tmp.updateFitness()
      if tmp.fitness > self.result.fitness:
        self.result = tmp
      self.matingPool.append(tmp)

  def setResult(self, gene):
    self.result = Individual(gene)
    self.result.updateFitness()

  def getResult(self):
    return evaluate(self.result.gene)

  def getResultGene(self):
    return self.result.gene
  
  def setAll(self, data):
    if(data == ""):
      ancients()

    else:
      self.matingPool = []
      ind = data.split('$')
      for item in ind:
        gene = item.split(',')
        # print(gene)
        if len(gene) == 0:
          continue
        tmpind = Individual([int(x) for x in gene])
        tmpind.updateFitness()
        self.matingPool.append(tmpind)

  def getAll(self):
    result = ""
    for i in range(len(self.matingPool)):
      result += self.matingPool[i].commaStr()
      if i != (len(self.matingPool) - 1):
        result += "$"
    return result

  def selectOne(self):
    '''
    use tournament selection(put back), k = 2
    '''
    p1 = 0
    p2 = 0
    while(p1 == p2):
      p1 = random.randint(0, len(self.matingPool)-1)
      p2 = random.randint(0, len(self.matingPool)-1)
  
    if self.matingPool[p1].fitness >= self.matingPool[p2].fitness:
      #tmp = self.selectPool[p1]
      #del self.selectPool[p1]
      #print(tmp)
      return self.matingPool[p1]
    else:
      #tmp = self.matingPool[p2]
      #del self.selectPool[p2]
      return self.matingPool[p2]
     
  def crossover(self):
    '''
    multipoint crossover, k = 2
    parents remain in the pool
    '''
    if random.random() > self.crossoverRate:
      return None

    parenta = 0
    parentb = 0
    while(parenta == parentb):
      parenta = random.randint(0, self.groupSize-1)
      parentb = random.randint(0, self.groupSize-1)

    posa = random.randint(1, self.geneSize - 2)
    posb = random.randint(posa, self.geneSize - 2)

    tmpa = copy.deepcopy(self.matingPool[parenta].gene)
    tmpb = copy.deepcopy(self.matingPool[parentb].gene)

    # change tail
    atail = tmpa[posa:posb]
    tmpa[posa:posb] = tmpb[posa:posb]
    tmpb[posa:posb] = atail

    # record duplicate gene position
    adup = []
    bdup = []
    for i in range(1,posa):
      for j in range(posa,posb):
        if tmpa[i] == tmpa[j]:
          adup.append(j)
        if tmpb[i] == tmpb[j]:
          bdup.append(j)

    for i in range(posb,self.geneSize-1):
      for j in range(posa,posb):
        if tmpa[i] == tmpa[j]:
          adup.append(j)
        if tmpb[i] == tmpb[j]:
          bdup.append(j)


    # exchange duplicate position gene
    for i in range(len(adup)):
      tmpa[adup[i]], tmpb[bdup[i]] = tmpb[bdup[i]], tmpa[adup[i]]

    childa = Individual(tmpa)
    childb = Individual(tmpb)
    childa.updateFitness()
    childb.updateFitness()
    if(childa.fitness > self.result.fitness):
      self.result = childa
    if(childb.fitness > self.result.fitness):
      self.result = childb

    self.matingPool.append(childa)
    self.matingPool.append(childb)

    #self.matingPool[parenta] = childa
    #self.matingPool[parentb] = childb

  def mutation(self):
    '''
    use local search methods instead
    '''
    if random.random() > self.mutationRate:
      return None
    p = random.randint(0, len(self.matingPool)-1)
    
    res2 = getNeighborFieldSwitch2(self.matingPool[p].gene)[0]
    evl = evaluate(res2)
    choose = res2

    res3 = getNeighborFieldSwitch3(self.matingPool[p].gene)
    for res in res3:
      if(evaluate(res) < evl):
        evl = evaluate(res)
        choose = res
    res4 = getNeighborFieldSwitch4(self.matingPool[p].gene)
    for res in res4:
      if(evaluate(res) < evl):
        evl = evaluate(res)
        choose = res
    #resr = getNeighborFieldRandom(self.matingPool[p].gene)
    #for res in resr:
    #  if(evaluate(res) > evl):
    #    evl = evaluate(res)
    #    choose = res

    mutated = Individual(choose)
    mutated.updateFitness()
    del self.matingPool[p]
    self.matingPool.append(mutated)
    if mutated.fitness >= self.result.fitness:
      self.result = mutated

  def update(self):
    newPool = []
    newPool.append(self.result)
    #del self.selectPool[:]
    #self.selectPool = copy.deepcopy(self.matingPool)
    while len(newPool) <= self.groupSize:
        newPool.append(self.selectOne())
    self.matingPool = newPool
    for _ in range(self.groupSize):
      self.crossover()
    for _ in range(len(self.matingPool)):
      self.mutation()
    self.generation += 1



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


def GA_Cli():
  result = [x for x in range(1, len(points) + 1)]
  result.append(1)
  population = Population(result)
  print('Initial score: ' + str(evaluate(result)) + '\n')
  print('group size: '+str(population.groupSize)+'\n')
  print('mutation rate: '+str(population.mutationRate)+'\n')
  print('crossover rate: '+str(population.crossoverRate)+'\n')

  for x in range(0, 3):
    sys.stdout.write('\033[F\033[K')
    print(str(3 - x) + ' seconds to start local search...')
    time.sleep(1)
    
  sys.stdout.write('\033[F\033[K')
  print('-------Start local search-------\n\n\n\n')
  

  for counter in range(1, 400):
    for _ in range(10):
      population.update()
    sys.stdout.write('\033[F\033[K\033[F\033[K\033[F\033[K')
    print('Processing: ' + str(counter/4) + '%')
    print(str(population.generation) + ' times of operations has been taken.')
    print('Current score: ' + str(population.getResult()))

  sys.stdout.write('\033[F\033[K\033[F\033[K\033[F\033[K\033[F\033[K')
  print('Process finished: 100%')
  print(str(population.generation) + ' times of operations has been taken in total.')
  print('Final Score: ' + str(population.getResult()))


points = [[x.id, x.X, x.Y] for x in City.objects.all()]
#f = open('./kroA150Pro.tsp', 'r')
#points = [(int(lines.split()[0]), int(lines.split()[1]), int(lines.split()[2])) for lines in f.readlines()]
distance = []


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

#GA_Cli()

def GA_Step():
  global points

  result = [x for x in range(1, len(points) + 1)]
  result.append(1)
  population = Population(result)
  counter = 0

  try:
    tableItem = GAState.objects.get(id=0)
    if tableItem.Process < 100:
      counter = tableItem.Process
      population.generation = tableItem.Generations
      res = json.loads(tableItem.Path)
      population.setResult(res)
      population.setAll(tableItem.All)

  except GAState.DoesNotExist:
    # Save data here
    #population.ancients()
    tableItem = GAState(0, 0, 0, json.dumps(population.getResultGene()), population.getAll())
  
  # population = Population(result)
  for _ in range(0, 40):
    population.update()
  counter = counter + 1
  bestScore = population.getResult()

  tableItem.Process = counter
  tableItem.Generations = population.generation
  tableItem.Path = json.dumps(population.getResultGene())
  tableItem.All = population.getAll()
  tableItem.save()
  
  toReturn = []
  tmp = population.getResultGene()
  for city in tmp:
    toReturn.append([points[city - 1][1], points[city - 1][2]])
  
  return toReturn, counter, bestScore


def GA_Clear_Data():
  global points
  result = [x for x in range(1, len(points) + 1)]
  result.append(1)
  population = Population(result)
  population.ancients()
  tmpall = population.getAll()

  try:
    tableItem = GAState.objects.get(id=0)
    tableItem.Process = 0
    tableItem.Generations = 0
    tableItem.Path = json.dumps(result)
    tableItem.All = tmpall
  except GAState.DoesNotExist:
    # Save data here
    tableItem = GAState(0, 0, 0, json.dumps(result), tmpall)
  tableItem.save()

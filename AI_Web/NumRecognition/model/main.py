# -*- coding:utf-8 -*-
import neuralNetwork
import dataset
import math
import numpy as cupy
import sys
import struct
import os
import pickle

if os.path.exists("profile"):
    command = input("Do you want to load previous profile?(y/n)\n")
else:
    command = ""

if command != "y":
    hiddenNodes = input("How many nodes in the hidden layer do you want to use? (recommand: 144)\n")
    studySpeed = input("How large gradient step distance do you want to use? (recommand: 0.0003)\n")
    net = neuralNetwork.NeuralNetwork([784, int(hiddenNodes), 10], float(studySpeed))

    m = 0
    caseCount = 0
    matchCount = 0

    images = dataset.parseDSImage('data/trImage')
    labels = dataset.parseDSLabel('data/trLabel')

    for index, value in enumerate(images[0]):
        caseCount = caseCount + 1
        res = net.forword(value)
        label = cupy.zeros((1, 10))
        targetDig = labels[0][index]
        if res.max() == res[0][targetDig]:
            matchCount = matchCount + 1
        label[0][targetDig] = 1
        loss = net.loss(label, res)

        E = (loss ** 2).sum() / 2
        m += E

        print(index, ': ', E)
        print('Case Count: ', caseCount)
        print('Match Count: ', matchCount)
        print('Match Rate: ', matchCount / caseCount)

        net.backPropagation(loss)
else:
    with open("profile", "rb") as f:
        net = pickle.load(f)

command = input("Continue and have a test?(y/n)\n")

if command == "y":
    m = 0
    caseCount = 0
    matchCount = 0

    images = dataset.parseDSImage('data/teImage')
    labels = dataset.parseDSLabel('data/teLabel')
    for index, value in enumerate(images[0]):
        caseCount = caseCount + 1
        res = net.forword(value)
        label = cupy.zeros((1, 10))
        targetDig = labels[0][index]
        if res.max() == res[0][targetDig]:
            matchCount = matchCount + 1
        label[0][targetDig] = 1
        loss = net.loss(label, res)

        E = (loss ** 2).sum() / 2
        m += E

        print(index, ': ', E)
        print('Case Count: ', caseCount)
        print('Match Count: ', matchCount)
        print('Match Rate: ', matchCount / caseCount)

    # Try to check profile
    if os.path.exists("grade"):
        with open("grade", "rb") as f:
            grade = pickle.load(f)
        if (grade < matchCount / caseCount):
            with open("grade", "wb") as f:
                pickle.dump(matchCount / caseCount, f)
            with open("profile", "wb") as f:
                pickle.dump(net, f)
    else:
        with open("grade", "wb") as f:
            pickle.dump(matchCount / caseCount, f)
        with open("profile", "wb") as f:
            pickle.dump(net, f)


    print('FINAL: ', m / images[3])
# -*- coding:utf-8 -*-
import neuralNetwork
import dataset
import math
import numpy as cupy
import sys
import struct

net = neuralNetwork.NeuralNetwork([784, 64, 10], 0.00023)

while True:
 
    imagePath = input('Imagepath: ')
    labelPath = input('Labelpath: ')

    m = 0
    caseCount = 0
    matchCount = 0

    if len(imagePath) == 0 or len(labelPath) == 0:
        imagePath = 'data/trImage'
        labelPath = 'data/trLabel'
        images = dataset.parseDSImage(imagePath)
        labels = dataset.parseDSLabel(labelPath)
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
        imagePath = 'data/teImage'
        labelPath = 'data/teLabel'
        images = dataset.parseDSImage(imagePath)
        labels = dataset.parseDSLabel(labelPath)
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

    print('FINAL: ', m / images[3])
# -*- coding:utf-8 -*-
import neuralNetwork
import dataset
import math

net = neuralNetwork.NeuralNetwork([784, 256, 1], 0.2)

images = dataset.parseDSImage('./data/train-images.idx3-ubyte')
labels = dataset.parseDSLabel('./data/train-labels.idx1-ubyte')


for index, value in enumerate(images[0]):
    res = net.forword(value)
    loss = net.loss(labels[0], res)

    E = 0
    for l in loss:
        E += math.pow(l, 2)
    E /= 2

    print(index, ': ', E)

    net.backPropagation(loss)
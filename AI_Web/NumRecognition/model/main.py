# -*- coding:utf-8 -*-
import neuralNetwork
import dataset
import math
import cupy
import struct

net = neuralNetwork.NeuralNetwork([784, 64, 10], 0.2)

while True:

    imagePath = input('Imagepath: ')
    labelPath = input('Labelpath: ')
    imagePath = imagePath if len(imagePath) != 0 else 'data/train-images-idx3-ubyte'
    labelPath = labelPath if len(labelPath) != 0 else 'data/train-labels-idx1-ubyte'
    images = dataset.parseDSImage('data/train-images-idx3-ubyte')
    labels = dataset.parseDSLabel('data/train-labels-idx1-ubyte')

    m = 0

    for index, value in enumerate(images[0]):
        res = net.forword(struct.unpack('B' * len(value), value))
        label = cupy.zeros((1, 10))
        label[0][struct.unpack('B', labels[0][index])] = 1
        loss = net.loss(label, res)

        E = (loss ** 2).sum() / 2
        m += E

        print(index, ': ', E)

        net.backPropagation(loss)

    print('FINAL: ', m / images[3])
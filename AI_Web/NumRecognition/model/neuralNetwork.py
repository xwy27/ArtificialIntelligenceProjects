# -*- coding:utf-8 -*-
import numpy as np
import math
import copy

class NeuralNetwork(object):
    
    def __init__(self, layers, speed):
        self.input_nodes = layers[0]
        self.hidden_nodes = layers[1]
        self.output_nodes = layers[2]

        self.weight = []
        # weight from input to hidden
        temp = [[0 for _ in range(layers[1])] for _ in range(layers[0])]
        self.weight.append(temp)
        # weight from hidden to output
        temp = [[0 for _ in range(layers[2])] for _ in range(layers[1])]
        self.weight.append(temp)

        self.bias = []
        # bias for hidden
        temp = [0 for _ in range(layers[1])]
        self.bias.append(temp)
        # bias for output
        temp = [0 for _ in range(layers[2])]
        self.bias.append(temp)

        self.hidden = []
        self.data = []
        self.speed = speed
    
    def sigmod(self, z):
        return 1.0/(1.0+np.exp(-z))
    
    def forword(self, data):
        if len(data) != self.input_nodes:
            print('FORWORD: size mismatch')
            return
        # calculate the hidden layer
        self.hidden = []
        self.data = data
        for h in range(self.hidden_nodes):
            temp = 0
            for index, value in enumerate(data):
                temp += value * self.weight[0][index][h]
            temp += self.bias[0][h]
            self.hidden.append(temp)
        
        # calculate the output layer
        self.hidden = [self.sigmod(t) for t in self.hidden]
        res = []
        for o in range(self.output_nodes):
            temp = 0
            for index, value in enumerate(self.hidden):
                temp += value * self.weight[1][index][o]
            temp += self.bias[1][o]
            res.append(temp)
        return res
    
    def loss(self, target, output):
        if len(target) != len(output):
            print('LOSS: size mismatch')
            return
        e = []
        for index, value in enumerate(target):
            e.append(value - output[index])
        return e
    
    def backPropagation(self, loss):
        # Copy the origin weight
        oriWeight = copy.deepcopy(self.weight)

        # Computing new weight between hidden and output layer
        for k in range(self.output_nodes):
            self.bias[1][k] = self.bias[1][k] + self.speed * loss[k]
            for j in range(self.hidden_nodes):
                self.weight[1][j][k] = oriWeight[1][j][k] + self.speed * self.hidden[j] * loss[k]
        
        # Computing new weight between input and hidden layer
        for j in range(self.hidden_nodes):
            outputSum = 0
            for k in range(self.output_nodes):
                outputSum += oriWeight[1][j][k] * loss[k]
            self.bias[0][j] = self.bias[0][j] + self.speed * self.hidden[j] * (1 - self.hidden[j]) * outputSum
            for i in range(self.input_nodes):
                self.weight[0][i][j] = oriWeight[0][i][j] + self.speed * self.hidden[j] * (1 - self.hidden[j]) * self.data[i] * outputSum
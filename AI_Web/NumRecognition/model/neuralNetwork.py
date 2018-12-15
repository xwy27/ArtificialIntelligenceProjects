# -*- coding:utf-8 -*-
import numpy as np
import cupy as cp
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
        self.weight = cp.array(self.weight)

        self.bias = []
        # bias for hidden
        temp = [0 for _ in range(layers[1])]
        self.bias.append(temp)
        # bias for output
        temp = [0 for _ in range(layers[2])]
        self.bias.append(temp)
        self.bias = cp.array(self.bias)

        self.hidden = []
        self.data = []
        self.speed = speed
    
    def sigmod(self, z):
        return (cp.exp(z * -1) + 1) ** -1

    def forword(self, data):
        if len(data) != self.input_nodes:
            print('FORWORD: size mismatch')
            return
        # calculate the hidden layer
        self.hidden = []
        self.data = cp.array(data)

        right = cp.array(self.weight[0])
        b = cp.array(self.bias[0])
        self.hidden = self.data.dot(right) + b
        # for h in range(self.hidden_nodes):
        #     temp = 0
        #     for index, value in enumerate(data):
        #         temp += value * self.weight[0][index][h]
        #     temp += self.bias[0][h]
        #     self.hidden.append(temp)
        
        # calculate the output layer
        self.hidden = self.sigmod(self.hidden)
        # self.hidden = [self.sigmod(t) for t in self.hidden]

        res = self.hidden.dot(self.weight[1]) + self.bias[1]
        # res = []
        # for o in range(self.output_nodes):
        #     temp = 0
        #     for index, value in enumerate(self.hidden):
        #         temp += value * self.weight[1][index][o]
        #     temp += self.bias[1][o]
        #     res.append(temp)
        return res.tolist()
    
    def loss(self, target, output):
        if len(target) != len(output):
            print('LOSS: size mismatch')
            return
        
        left = cp.array(target)
        right = cp.array(output)
        e = left - right
        # e = []
        # for index, value in enumerate(target):
        #     e.append(value - output[index])
        return e.tolist()
    
    def backPropagation(self, loss):
        # Copy the origin weight
        oriWeight = copy.deepcopy(self.weight)

        l = cp.array(loss)
        lt = l.transpose()
        ht = self.hidden.transpose()

        outputFactor = self.speed * self.hidden * (self.hidden * -1 + 1) * (self.weight[1].dot(lt).transpose())
        self.bias[0] = self.bias[0] + outputFactor
        self.weight[0] = self.weight[0] + self.data.transpose() * outputFactor
        # for j in range(self.hidden_nodes):
        #     outputSum = 0
        #     for k in range(self.output_nodes):
        #         outputSum += oriWeight[1][j][k] * loss[k]
        #     self.bias[0][j] = self.bias[0][j] + self.speed * self.hidden[j] * (1 - self.hidden[j]) * outputSum
        #     for i in range(self.input_nodes):
        #         self.weight[0][i][j] = oriWeight[0][i][j] + self.speed * self.hidden[j] * (1 - self.hidden[j]) * self.data[i] * outputSum

        self.bias[1] = self.bias[1] + self.speed * l
        self.weight[1] = self.weight[1] + self.speed * ht * l
        # Computing new weight between hidden and output layer
        # for k in range(self.output_nodes):
        #     self.bias[1][k] = self.bias[1][k] + self.speed * loss[k]
        #     for j in range(self.hidden_nodes):
        #         self.weight[1][j][k] = oriWeight[1][j][k] + self.speed * self.hidden[j] * loss[k]
        
        # Computing new weight between input and hidden layer
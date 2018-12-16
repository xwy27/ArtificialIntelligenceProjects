# -*- coding:utf-8 -*-
import cupy as cp
import math
import copy

class NeuralNetwork(object):
    
    def __init__(self, layers, speed):
        self.input_nodes = layers[0]
        self.hidden_nodes = layers[1]
        self.output_nodes = layers[2]

        # # weight from input to hidden
        # self.ihWeight = [[0.0 for _ in range(layers[1])] for _ in range(layers[0])]
        self.ihWeight = cp.random.rand(self.input_nodes, self.hidden_nodes) * 2 * speed - speed
        
        # # weight from hidden to output
        # self.hoWeight = [[0.0 for _ in range(layers[2])] for _ in range(layers[1])]
        self.hoWeight = cp.random.rand(self.hidden_nodes, self.output_nodes) * 2 * speed - speed

        # # bias for hidden
        # self.hBias = [[0.0 for _ in range(layers[1])]]
        self.hBias = cp.random.rand(1, self.hidden_nodes) * 2 * speed - speed

        # # bias for output
        # self.oBias = [[0.0 for _ in range(layers[2])]]
        self.oBias = cp.random.rand(1, self.output_nodes) * 2 * speed - speed

        self.hidden = []
        self.data = []
        self.speed = speed
    
    def sigmod(self, z):
        return (cp.exp(z * -1) + 1) ** -1

    def forword(self, data):
        if len(data) != self.input_nodes:
            print('FORWORD: size mismatch')
            return
        self.data = cp.array([data])

        # calculate the hidden layer
        # right = cp.array(self.ihWeight)
        # b = cp.array(self.hBias)
        self.hidden = self.data.dot(self.ihWeight) + self.hBias
        # for h in range(self.hidden_nodes):
        #     temp = 0
        #     for index, value in enumerate(data):
        #         temp += value * self.ihWeight[index][h]
        #     temp += self.hBias[h]
        #     self.hidden.append(temp)
        
        # calculate the output layer
        self.hidden = self.sigmod(self.hidden)
        # self.hidden = [self.sigmod(t) for t in self.hidden]

        res = self.hidden.dot(self.hoWeight) + self.oBias
        # res = []
        # for o in range(self.output_nodes):
        #     temp = 0
        #     for index, value in enumerate(self.hidden):
        #         temp += value * self.hoWeight[index][o]
        #     temp += self.oBias[o]
        #     res.append(temp)
        return res
    
    def loss(self, target, output):
        if len(target[0]) != len(output[0]):
            print('LOSS: size mismatch')
            return

        e = target - output
        # e = []
        # for index, value in enumerate(target):
        #     e.append(value - output[index])
        return e
    
    def backPropagation(self, loss):
        # Copy the origin weight
        # oriWeight = copy.deepcopy(self.weight)

        l = loss
        lt = l.transpose()
        ht = self.hidden.transpose()

        outputFactor = self.speed * (self.hidden - self.hidden ** 2) * (self.hoWeight.dot(lt).transpose())
        self.hBias = self.hBias + outputFactor
        self.ihWeight = self.ihWeight + self.data.transpose() * outputFactor
        # for j in range(self.hidden_nodes):
        #     outputSum = 0
        #     for k in range(self.output_nodes):
        #         outputSum += orihoWeight[j][k] * loss[k]
        #     self.hBias[j] = self.hBias[j] + self.speed * self.hidden[j] * (1 - self.hidden[j]) * outputSum
        #     for i in range(self.input_nodes):
        #         self.ihWeight[i][j] = oriihWeight[i][j] + self.speed * self.hidden[j] * (1 - self.hidden[j]) * self.data[i] * outputSum

        self.oBias = self.oBias + self.speed * l
        self.hoWeight = self.hoWeight + self.speed * ht * l
        # Computing new weight between hidden and output layer
        # for k in range(self.output_nodes):
        #     self.oBias[k] = self.oBias[k] + self.speed * loss[k]
        #     for j in range(self.hidden_nodes):
        #         self.hoWeight[j][k] = orihoWeight[j][k] + self.speed * self.hidden[j] * loss[k]
        
        # Computing new weight between input and hidden layer
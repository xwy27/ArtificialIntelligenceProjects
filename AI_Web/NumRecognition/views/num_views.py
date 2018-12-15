from django.shortcuts import render

# Create your views here.

import numpy as np
import math
class NeuralNetwork(object):
    
    def __init__(self, layers):
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
    
    def sigmod(self, z):
        return 1.0/(1.0+np.exp(-z))
    
    def sigmod_deriva(self, z):
        y = self.sigmod(z)
        return y * (1-y)
    
    def forword(self, data):
        if len(data) != self.input_nodes:
            print('FORWORD: size mismatch')
            return
        # calculate the hidden layer
        hidden = []
        for h in range(self.hidden_nodes):
            temp = 0
            for index, value in enumerate(data):
                temp += value * self.weight[0][index][h]
            temp += self.bias[0][h]
            hidden.append(temp)
        
        # calculate the output layer
        hidden = [self.sigmod(t) for t in hidden]
        res = []
        for o in range(self.output_nodes):
            temp = 0
            for index, value in enumerate(hidden):
                temp += value * self.weight[1][index][o]
            temp += self.bias[1][o]
            res.append(temp)
        return res
    
    def loss(self, target, output):
        if len(target) != len(output):
            print('LOSS: size mismatch')
            return
        e = 0
        for index, value in enumerate(target):
            e += math.pow((value - output[index]), 2)
        return e/2
    
    # def backPropagation(self, loss):
        
                

            

    

# -*- coding:utf-8 -*-
import os
import os.path

def parseDSImage(pathToDS):
  '''
  This function is used to parse the DS file at the given path to get images.
  Paramater: 
    - pathToDS: string path to indicate the file
  Return Value:
    - pixels: array of type bytes, every byte is a pixel
    - height: height of each image
    - width:  width of each image 
    - count:  number of images 
  '''
  if not os.path.exists(pathToDS):
    raise IOError
  with open(pathToDS) as f:
    f.read(4) # unused magic number

    count = int.from_bytes(f.read(4), byteorder='big')
    print('Parsing Image DS - Image count: ' + str(count))

    height = int.from_bytes(f.read(4), byteorder='big')
    print('Parsing Image DS - Image height: ' + str(height))
    width = int.from_bytes(f.read(4), byteorder='big')
    print('Parsing Image DS - Image width: ' + str(width))

    pixels = []
    for _ in range(count):
      pixels.append(f.read(height * width))

  return (pixels, height, width, count)

def parseDSLabel(pathToDS):
  '''
  This function is used to parse the DS file at the given path to get labels.
  Paramater: 
    - pathToDS: string path to indicate the file
  Return Value:
    - lables: array of type bytes, every byte is a pixel
    - count:  number of labels
  '''
  if not os.path.exists(pathToDS):
    raise IOError
  with open(pathToDS) as f:
    f.read(4) # unused magic number

    count = int.from_bytes(f.read(4), byteorder='big')
    print('Parsing Label DS - Label count: ' + str(count))

    lables = []
    for _ in range(count):
      lables.append(f.read(1))

  return (lables, count)
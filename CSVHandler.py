#!/usr/bin/env python
# -*- coding: utf-8 -*-

Path_to_csv = r"C:\Users\yoav\Desktop\DB.csv"

import csv
import sys
import matplotlib.pyplot as plt


temp = []
setDB = {}
dict = {'1793': 10, '1920': 7, '1599': 15 , '1800' : 30}



lists = sorted(dict.items()) # sorted by key, return a list of tuples

x, y = zip(*lists) # unpack a list of pairs into two tuples

plt.plot(x, y)
plt.show()
#
# plt.bar(range(len(dict)), dict.values(), align='center')
# plt.xticks(range(len(dict)), dict.keys())
#
# plt.show()

# with open(Path_to_csv, 'r+') as f:
#     reader = csv.reader(f)
#     i = 0
#     for row in reader:
#         if i == 0:
#             pass
#         else:
#             value = int(row[2])
#             print value
#             temp.append(value)
#         i+=1
# #
# #         # for cell in row:
# #         #    rowBuilder = rowBuilder + str(cell) + ","
# #         # print rowBuilder[:-1]
#
# # pyplot.plot(range(len(temp)), temp)
# # pyplot.show()

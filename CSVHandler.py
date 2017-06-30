#!/usr/bin/env python
# -*- coding: utf-8 -*-

Path_to_csv = r""

import csv
import sys

with open(Path_to_csv, 'r+') as f:
    reader = csv.reader(f)
    for row in reader:
        print row
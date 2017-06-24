#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import re
import sys
# import MySQLdb # for later use


# found = 0
orig_stdout = sys.stdout
list = []


def get_output_path(original_path):
    split = re.split(r"\\", original_path)
    end = split.pop()
    pre_end = split.pop()
    output_txt = r"C:\Users\yoav\Desktop\ben_yehuda\outputs" + "\\" + str(pre_end) + "\\" + str(end)
    return output_txt


def get_output_dir(original_path):
    split = re.split(r"\\", original_path)
    split.pop()
    pre_end = split.pop()
    output_txt = r"C:\Users\yoav\Desktop\ben_yehuda\outputs" + "\\" + str(pre_end)
    return output_txt


def filter_beginning(input_dir):
    for subdir, dirs, files in os.walk(input_dir):
        for filename in files:
            found = 0
            if filename.endswith(".txt"):
                path = os.path.join(input_dir, subdir, filename)
                out = get_output_path(path)
                out_dir = get_output_dir(path)
                if os.path.exists(out_dir) == 0:
                    os.mkdir(out_dir)
                try:
                    with open(path) as f:
                        for line in f:
                            if found == 1:
                                g = open(out, 'w')
                                sys.stdout = g
                                for row in f:
                                    print row
                                break
                            if word in line:
                                found = 1
                except Exception as e:
                    list.append(path)
                    print str(e)


if __name__ == '__main__':

    word = "יומן הרשת של פרויקט בן-יהודה"
    input_dir = r"C:\Users\yoav\Downloads\benyehuda_sep2016_dump_with_nikkud_utf8"
    filter_beginning(input_dir=input_dir)
    sys.stdout.close()
    sys.stdout = orig_stdout
    print list
    print "1"
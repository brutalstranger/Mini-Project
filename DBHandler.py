#!/usr/bin/env python
# -*- coding: utf-8 -*-

import MySQLdb
import sys
import csv
import math
import os


def create_main_table():
    cur = db.cursor()
    sql = """CREATE TABLE IF NOT EXISTS main (
         word VARCHAR(30),
         id int ,
         unique(id),
         PRIMARY KEY (word));"""
    cur.execute(sql)


def create_second_table():
    cur = db.cursor()
    sql = """CREATE TABLE IF NOT EXISTS occurrences (
             id int NOT NULL,
             year int,
             count INT )"""
    cur.execute(sql)


def strip_commas(word):
    toClean = [',','"','.','..','...','!','?',":" , ";"]
    for ch in toClean:
        word = word.translate(None,ch)
    return word


def insert_to_occurrences(id , year):
    cur = db.cursor()
    sql = "select count from occurrences where id = '" + str(id) + "' and year = '" + str(year) + "'"
    print sql
    if cur.execute(sql) == 0:
        sql = "insert into occurrences (id , year , count) values ( '" + str(id) + "' , " + "'" + str(year) + "' , 1 )"
        print sql
        cur.execute(sql)
        db.commit()
    else:
        db.commit()
        for row in cur.fetchall():
            count = row[0]
        count += 1
        sql = "update occurrences set count = '" + str(count) + "' where id = '" + str(id) + "' and year = '" + str(year) + "'"
        print sql
        cur.execute(sql)
        db.commit()



def get_words_from_txt():
    directory = r"C:\Users\yoav\Desktop\ben_yehuda\runTest"
    for path, subdirs, files in os.walk(directory):
        i = 0
        for filename in files:
            if filename.endswith(".txt"):
                author = get_author_from_text(os.path.join(path, filename))
                year = authorToYear[author]
                txt = file(os.path.join(path, filename)).read()
                for word in txt.split():
                    try:
                        word = strip_commas(word)
                        word = str(word)
                        i = i + 1
                        print word
                        cur = db.cursor()
                        sql = """INSERT INTO main(id , word)
                                VALUES ('""" + str(i) + """' , ' """ + word + "');"
                        print sql
                        cur.execute(sql)
                        db.commit()
                        id = find_id_by_word(word)
                    except:
                        print word + "error"
                    insert_to_occurrences(id, year)


def select_query():
    original_stdout = sys.stdout
    path = "C:\Users\yoav\Desktop\out.txt"
    f = open(path , 'w')
    sys.stdout = f
    sql = "select * from main;"
    cur = db.cursor()
    cur.execute(sql)
    results = cur.fetchall()
    for row in results:
        print row[0]
        print row[1]
    sys.stdout = original_stdout


def find_id_by_word(word):
    word = " " + word
    cur = db.cursor()
    sql = "select id from main where word = '" + word + " ';"
    print sql
    cur.execute(sql)
    results = cur.fetchall()
    for row in results:
        id = row[0]
    return id

def get_author_from_text(path_to_text):
    path = str(path_to_text).split('\\')
    path.pop()
    author = path.pop()
    return author


def calculate_year(birth,death):
    differnce = int(death) - int(birth)
    newNum = int(birth) + (differnce/2)
    return int(math.floor(newNum / 10.0)) * 10

def fill_in_dict():
    path_to_csv = r"C:\Users\yoav\Desktop\DB.csv"
    with open(path_to_csv, 'r+') as f:
        firstRow = True
        reader = csv.reader(f)
        for row in reader:
            if firstRow:
                firstRow = False
                pass
            else:
                authorToYear[row[0]] = calculate_year(row[2],row[3])


if __name__ == '__main__':
    authorToYear = dict()
    db = MySQLdb.connect(host="localhost",  # your host, usually localhost
                         user="root",  # your username
                         passwd="1234",  # your password
                         db="YOAV")
    fill_in_dict()

    # create_main_table()
    # create_second_table()
    #get_words_from_txt()
    select_query()


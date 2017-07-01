#!/usr/bin/env python
# -*- coding: utf-8 -*-

import MySQLdb
import demjson

db = MySQLdb.connect(host="localhost",  # your host, usually localhost
                     user="root",  # your username
                     passwd="1234",  # your password
                     db="YOAV")

# you must create a Cursor object. It will let
#  you execute all the queries you need
cur = db.cursor()

data = [{'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}]
json = demjson.encode(data)

sql = """INSERT INTO try2(word , txts) VALUES  ('adfsa' , '""" + str(json) + "')"
# print sql
try:
    # Execute the SQL command
    cur.execute(sql)
    # Commit your changes in the database
    # db.commit()
    # Use all the SQL you like
    # cur = db.cursor()
    cur.execute("SELECT * FROM try2")
    for row in cur.fetchall():
        print row
        print str(row[0]).decode('utf-8')
except:
    # Rollback in case there is any error
    db.rollback()

db.close()
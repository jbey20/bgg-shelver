#!/usr/bin/python3
from tinydb import TinyDB, Query

class Database:
    def __init__(self):
       self.db = TinyDB('db.json')

    def insert(self, gid, vid, l, w, h, category):
        game = {'game ID': gid,
                'version ID': vid,
                ': {l,w,h}
                }
        self.db.insert(game)

    def clean(self):
        self.db.truncate()

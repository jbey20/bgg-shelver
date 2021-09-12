#!/usr/bin/python3
import db
import xml.etree.ElementTree as ET
import requests

response = requests.get('https://www.boardgamegeek.com/xmlapi2/thing?id=8107&versions=1')

tree = ElementTree.fromstring(response.content)







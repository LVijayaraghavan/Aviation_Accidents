#!/usr/bin/env python
# coding: utf-8

# In[36]:


import requests
from bs4 import BeautifulSoup as soup
import lxml

from splinter import Browser
import pandas as pd
import matplotlib.pyplot as plt

import html5lib
import splinter
import time
import datetime as dt
import os

from sqlalchemy import create_engine
import numpy as np


# In[37]:


import pandas as pd
import sqlite3


# In[38]:


#engine = create_engine('sqlite:///db/aviation_accidents.sqlite')


# In[41]:


def get_mil_cnt(engine):
    mp_df = pd.read_sql("select * from Historical_accidents",engine)
    mp_df['Operator']=mp_df['Operator'].str.upper()
    mp_df['Military'] = mp_df.Operator.str.contains('MILITARY')|mp_df.Operator.str.contains('AIR FORCE')
    mp_df['Passenger'] = mp_df.Military == False
    mp_df = mp_df.loc[:, ['Year', 'Military', 'Passenger']]
    mp_df= mp_df.groupby(['Year'])[['Military', 'Passenger']].aggregate(np.count_nonzero)
    mp_df.reset_index(level=0, inplace=True)
    return mp_df

def get_mil_pass_fatal(engine):
    mp_df = pd.read_sql("select * from Historical_accidents",engine)
    mp_df['Operator']=mp_df['Operator'].str.upper()
    mp_df['Military'] = mp_df.Operator.str.contains('MILITARY')|mp_df.Operator.str.contains('AIR FORCE')
    mp_df['Passenger'] = mp_df.Military == False
    passenger_df= mp_df.loc[mp_df['Passenger'] ==True]
    pass_df=pd.DataFrame()
    m_df=pd.DataFrame()
    mil_df=mp_df.loc[mp_df['Military']==True]
    Military_cnt=mil_df["Fatalities"].sum()
    passenger_cnt=passenger_df["Fatalities"].sum()
    Count_list=[]
    Count_list.append(Military_cnt)
    Count_list.append(passenger_cnt)
    return(Count_list)



def get_text(engine):
    from nltk import tokenize
    from sqlalchemy import create_engine
    import pandas as pd
    import nltk
    nltk.download('punkt')
    import json
    from nltk.tokenize import word_tokenize
    from nltk.corpus import stopwords
    from collections import Counter
    mp_df = pd.read_sql("select * from Historical_accidents",engine)
    mp_df = pd.read_sql("select * from Historical_accidents",engine)
    text = str(mp_df["Summary"].tolist())
    words=word_tokenize(text)
    # words=[word for word in words if len(word) > 3]
    # words_freq=Counter(words)
    # words_json=[{'text': words,'weight':words_freq}]
    ret_words=[]
    for word in words:
        if (len(word) > 3):
            words_freq=Counter(words)
            ret_words.append({"text":word,"weight":words_freq})
    return(ret_words)
  







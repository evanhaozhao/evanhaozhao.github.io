---
title: "Identifying Chairman's Experience"
permalink: /research/identifying_chairmans_experience/
author_profile: true
date: 2022-09-27
excerpt: "Codes for identifying chairman's experience from unstructured iFind CV, making the data ready for the political network matching. *See* Chen, Wei and Gu, Xian and Hasan, Iftekhar and Zhao, Hao and Zhu, Yun, [Political Network and Muted Insider Trading](http://dx.doi.org/10.2139/ssrn.4230854) (September 27, 2022). Available at SSRN: [http://dx.doi.org/10.2139/ssrn.4230854](http://dx.doi.org/10.2139/ssrn.4230854)"
---

Thid post is a demonstration for identifying chairman's experience from unstructured iFind CV, making the data ready for the political network matching by Python or any other statistical tool.

**Paper:** Chen, Wei and Gu, Xian and Hasan, Iftekhar and Zhao, Hao and Zhu, Yun, [Political Network and Muted Insider Trading](http://dx.doi.org/10.2139/ssrn.4230854) (September 27, 2022). Available at SSRN: [http://dx.doi.org/10.2139/ssrn.4230854](http://dx.doi.org/10.2139/ssrn.4230854)

**Notebook:** [identify_network.ipynb](https://github.com/evanhaozhao/Political-network-and-muted-insider-trading/blob/main/identify_network.ipynb)

***

<h1>Table of Contents<span class="tocSkip"></span></h1>
<ul class="toc-item"><li><span><a href="#network-identification-demo" data-toc-modified-id="Network-Identification-Demo-1"><span class="toc-item-num">1&nbsp;&nbsp;</span>Network Identification Demo</a></span><ul class="toc-item"><li><span><a href="#requirements" data-toc-modified-id="Requirements-1.1"><span class="toc-item-num">1.1&nbsp;&nbsp;</span>Requirements</a></span></li><li><span><a href="#the-ifind-chairman-data" data-toc-modified-id="The-iFind-chairman-data-1.2"><span class="toc-item-num">1.2&nbsp;&nbsp;</span>The iFind chairman data</a></span></li><li><span><a href="#experience-extraction-from-biography" data-toc-modified-id="Experience-extraction-from-biography-1.3"><span class="toc-item-num">1.3&nbsp;&nbsp;</span>Experience extraction from biography</a></span><ul class="toc-item"><li><span><a href="#stopwords-list" data-toc-modified-id="Stopwords-list-1.3.1"><span class="toc-item-num">1.3.1&nbsp;&nbsp;</span>Stopwords list</a></span></li><li><span><a href="#segmentation-and-tagging" data-toc-modified-id="Segmentation-and-tagging-1.3.2"><span class="toc-item-num">1.3.2&nbsp;&nbsp;</span>Segmentation and tagging</a></span></li><li><span><a href="#function-for-extraction" data-toc-modified-id="Function-for-extraction-1.3.3"><span class="toc-item-num">1.3.3&nbsp;&nbsp;</span>Function for extraction</a></span></li><li><span><a href="#extraction-from-chairmans-data" data-toc-modified-id="Extraction-from-chairman's-data-1.3.4"><span class="toc-item-num">1.3.4&nbsp;&nbsp;</span>Extraction from chairman's data</a></span></li></ul></li><li><span><a href="#construction-of-experience-dataset" data-toc-modified-id="Construction-of-experience-dataset-1.4"><span class="toc-item-num">1.4&nbsp;&nbsp;</span>Construction of experience dataset</a></span><ul class="toc-item"><li><span><a href="#function-for-location-searching" data-toc-modified-id="Function-for-location-searching-1.4.1"><span class="toc-item-num">1.4.1&nbsp;&nbsp;</span>Function for location searching</a></span></li><li><span><a href="#function-for-acronym-verifcation" data-toc-modified-id="Function-for-acronym-verifcation-1.4.2"><span class="toc-item-num">1.4.2&nbsp;&nbsp;</span>Function for acronym verifcation</a></span></li><li><span><a href="#function-for-experience-data-construction" data-toc-modified-id="Function-for-experience-data-construction-1.4.3"><span class="toc-item-num">1.4.3&nbsp;&nbsp;</span>Function for experience data construction</a></span></li></ul></li></ul></li></ul>

# Network Identification Demo

## Requirements


```python
import re
import pandas as pd
import numpy as np

import jieba # Chinese word segmentation module
import jieba.posseg as pseg # tagging segmented words with label
import paddle # PaddlePaddle deep learning framework for segmentation and tagging

paddle.enable_static() # in PaddlePaddle 2.x, need to change the dynamic graph mode to static
jieba.enable_paddle()

import jionlp as jio # alternative text tagging tool

import advertools as adv # stopwords including Chinese

from bs4 import BeautifulSoup # web scraping location info of organizations
import requests

from tqdm.notebook import tqdm
tqdm.pandas()
```

## The iFind chairman data

**Data structure**

In the original iFind chairman dataset, each row stores a chairman's detailed information, including:

|Column|Renamed column|Description|Type|
|---|---|---|---|
|证券代码|stockid|The 6-digit stock number plus the stock exchange code|String|
|证券简称|firm_name|The short version of the name of the chairman's company|String|
|董事长任次|c_tenure|The number of the chairman in numerical order|String|
|董事长姓名|c_name|The chairman's name|String|
|任职日期|start_chair|The starting date of the chairman's position|String|
|离职日期|end_chair|The end date of the chairman's position|String|
|性别|c_gender|Chairman's gender (binary)|String|
|国籍|c_nation|Chairman's nationality|String|
|学历|c_max_degree|Chairman's highest level of degree or education|String|
|出生年份|c_birth|Chairman's year of birth|String|
|个人简历|c_bio|The brief lifetime summary of the chairman|String|

The brief lifetime summary of chairmen (`c_bio`) is in an irregular and unstructured manner. We programmed it in a way that it automatically splits the keywords from sentences and extracts the information we need to build the social connection map and put them into categories and eventually the features in the dataset.

***


```python
# a small randomly sampled data for demonstration
df_c = pd.read_csv("https://raw.github.com/evanhaozhao/misc-data-test/main/chairman_cv_randsample.csv", index_col=0)

df_c = df_c.dropna()
df_c.rename(columns = {"证券代码":"stockid",
                       "证券简称":"firm_name",
                       "董事长任次":"c_tenure",
                       "董事长姓名":"c_name",
                       "任职日期":"start_chair",
                       "离职日期":"end_chair",
                       "性别":"c_gender",
                       "国籍":"c_nation",
                       "学历":"c_max_degree",
                       "出生年份":"c_birth",
                       "个人简历":"c_bio"}, inplace = True)
```


```python
print("The sample data includes %s chairmen" %len(df_c.index))
df_c.head(3) # display the first three rows
```

    The sample data includes 100 chairmen





<div style="height:400px;overflow:auto;">
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>stockid</th>
      <th>firm_name</th>
      <th>c_tenure</th>
      <th>c_name</th>
      <th>start_chair</th>
      <th>end_chair</th>
      <th>c_gender</th>
      <th>c_nation</th>
      <th>c_max_degree</th>
      <th>c_birth</th>
      <th>c_bio</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>002776.SZ</td>
      <td>柏堡龙</td>
      <td>第1任(现任)</td>
      <td>陈伟雄</td>
      <td>2015-03-25</td>
      <td>2018-03-24</td>
      <td>男</td>
      <td>中国</td>
      <td>--</td>
      <td>1978</td>
      <td>陈伟雄先生,中国国籍,无永久境外居留权,出生于1978年。2006年11月至2009年4月曾...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>300383.SZ</td>
      <td>光环新网</td>
      <td>第1任(现任)</td>
      <td>耿殿根</td>
      <td>2012-11-30</td>
      <td>2019-01-21</td>
      <td>男</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1956</td>
      <td>耿殿根,中国国籍,曾拥有加拿大永久居留权,已于2014年12月放弃,男,汉族,毕业于美国德克...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>300021.SZ</td>
      <td>大禹节水</td>
      <td>第1任(现任)</td>
      <td>王栋</td>
      <td>2005-01-12</td>
      <td>2017-04-30</td>
      <td>男</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1964</td>
      <td>王栋,男,1964年生,中国国籍,无境外居留权,中共党员,硕士研究生,教授级高级工程师、国务...</td>
    </tr>
  </tbody>
</table>
</div>



## Experience extraction from biography

### Stopwords list

The Chinese stopwords list we use is from `advertools` ([documentation](https://advertools.readthedocs.io/en/master/advertools.stopwords.html)).

***
**Should we remove stopwords?**

Though we choose both removing and not removing stopwords as our options, and theoretically removing stopwords helps the segmentation function of `jieba` to identify word class more precisely, there are still some concerns about removing stopwords.

- Our main purpose is to extract the information we need from an unstructured paragraph, instead of tokenization. Keeping stopwords will not affect the extraction of proper nouns, but removing stopwords will. For example, some stopwords provider (such as [`stopwordsiso`](https://pypi.org/project/stopwordsiso/)) includes "年 (year)" and "月 (month)" in the list, and removing such words makes us unable to identify the year using simple regex or `jieba`. For instance, "1990年5月至92年4月" now become "19905至924". Another example would be removing "大 (big)" from "大学 (university)". Surely we can manually remove these words from the list, but it is not only time-consuming but also hard for us to identify whether keeping other Chinese character in the stopwords list has the potential risk of blurring the meaning of proper nouns.

- Most of the chairman's biography does not include the Chinese word in the stopwords at all. For instance, a large portion of stopwords are modal particles and daily languages, such as "啊哟 (whoa)", "老老实实 (honestly)", "果真 (indeed)". These words can barely exist in chairman's biography. 

Therefore, for removing stopwords option, we only remove the special characters and punctuations (Chinese paragraph does not have spacings) such as "#", "！", "。". Doing so will not affect the word class identification, and make the paragraph cleaner for other textual analysis.


```python
stopword_list = list(sorted(adv.stopwords['chinese']))
stopword_list = stopword_list[0:21] + stopword_list[35:121] + stopword_list[-1:1730:-1]

print("There are %s stopwords in the list, for instance, %s" %(len(stopword_list), stopword_list[0:5]))
```

    There are 267 stopwords in the list, for instance, ['!', '"', '#', '$', '%']


### Segmentation and tagging

We use `jieba` ([documentation](https://github.com/fxsjy/jieba)) and `PaddlePaddle` ([documentation](https://www.paddlepaddle.org.cn/en)) to extract the organizations and places for each of the chairman's biography. 

If no location is in the experience nor can be identified from organizations, we further try `jionlp` ([documentation](https://github.com/dongrixinyu/JioNLP/blob/master/README_en.md)) as an alternative solution to identify location from organizations. `jieba` without paddle mode on can also recognize and tag the location from organizations, but the accuracy is much lower than that of `jionlp`.

`jieba` uses a prefix dictionary structure to build a directed acyclic graph (DAG) for all possible word combinations and then uses dynamic programming to find the most probable combination through the word frequency. We use this Python module to tokenize Chinese sentences into shorter pre-set strings preparing for the final structured dataset. In the `paddle` mode, `jieba` automatically splits the text into phrases with meaningful labels, such as locations, organization names, and time (see table below).

- *Labels for word classes*

|标签 (Label)|含义 (Meaning)|标签 (Label)|含义 (Meaning)|标签 (Label)|含义 (Meaning)|标签 (Label)|含义 (Meaning)|
|---|---|---|---|---|---|---|---|
|n  |普通名词 (noun) |f	|方位名词 (location noun) |s	|处所名词 (place noun)	|t	|时间 (time) |
|nr	|人名	(person)    |ns	|地名 (location)	|nt	|机构名 (organization)	|nw	|作品名 (name of work)|
|nz	|其他专名 (other proper nouns) |v	|普通动词 (verb)	|vd	|动副词 (converb)	|vn	|名动词 (gerund)|
|a	|形容词 (adjective)	|ad	|副形词 (adj-adv)	|an	|名形词 (adnoun)|d	|副词 (adverb)|
|m	|数量词 (measure word)	|q	|量词	(quantifier) |r	|代词	(pronoun) |p	|介词 (preposition)|
|c	|连词	(conjunction) |u	|助词	(particle)|xc	|其他虚词 (function word)	|w 	|标点符号 (punctuation)|

- *Labels for proper nouns*

|标签 (Label)|含义 (Meaning)|标签 (Label)|含义 (Meaning)|标签 (Label)|含义 (Meaning)|标签 (Label)|含义 (Meaning)|
|---|---|---|---|---|---|---|---|
|PER|人名 (person)	|LOC	|地名 (location)	|ORG	|机构名 (organization)	|TIME	|时间 (time)|


```python
# an example of using "jieba" tagging function with paddle mode on

test_words = "1950年8月出生。1968年至72年，湖北财经学院本科；1970年5月在北京加入中国共产党。"
for stopword in stopword_list:
    test_words = test_words.replace(stopword, "") # remove stopwords
    
words = pseg.cut(test_words,use_paddle=True) 

translation = ["1950 August", "born", "1968", "to", "(19)72", "Hubei University of Finance and Economics", 
               "bachelor", "1970 May", "in", "Beijing", "join", "CCP"]

idx=0
print("['jieba' tagging with paddle mode on]")
for word, flag in words:
    print('%s (%s) [%s]' % (word, translation[idx], flag))
    idx+=1
```

    ['jieba' tagging with paddle mode on]
    1950年8月 (1950 August) [TIME]
    出生 (born) [v]
    1968年 (1968) [TIME]
    至 (to) [v]
    72年 ((19)72) [TIME]
    湖北财经学院 (Hubei University of Finance and Economics) [ORG]
    本科 (bachelor) [n]
    1970年5月 (1970 May) [TIME]
    在 (in) [p]
    北京 (Beijing) [LOC]
    加入 (join) [v]
    中国共产党 (CCP) [ORG]


As shown in the results above, the location is not identified from the experience of "Hubei University of Finance and Economics". Therefore, we will try `jionlp` to extract location from the organization. 

`jieba` with paddle mode off can perform similar identification of locations from organizations, but with lower accurary. Therefore, we use `jionlp` for this task. In other words, `jieba` with paddle mode off will identify more places as locations, even some institutions, but `jionlp` will only identify places at city, province, or country level.


```python
test_loc = {"湖北财经学院": 
            "(Hubei University of Finance and Economics)"}
print("[(alternative) 'jionlp' extract loc from org]")
test_locdict = jio.recognize_location(list(test_loc.keys())[0])
test_loclist = [test_locdict[key] for key in test_locdict.keys() if test_locdict[key] and key!="others"]
if test_loclist != []:
    loc_listval = list(test_loclist[0][0][0].values())
    test_loctxt = "/".join(list(sorted(set(loc for loc in loc_listval if loc), key=loc_listval.index)))
print("The location of %s %s is %s" %(list(test_loc.keys())[0], list(test_loc.values())[0], test_loctxt))
```

    [(alternative) 'jionlp' extract loc from org]
    The location of 湖北财经学院 (Hubei University of Finance and Economics) is 湖北省


### Function for extraction



**Description** of `extract_bio(experience, use_paddle=True, remove_stopword=True)`

The function `extract_bio` can identify the **start/end year** of the corresponding experience of a chairman from an unstructured biography, then extract the basic information, including the **organization** and **location** of the experience. We will deal with missing values, link types (whether education or work), the degree level (for edu link), and the position level (for work link) in the following steps.

The arguments include:

- `experience`: take a string of a chairman's biography.
- `use_paddle=True`: the default setting is `True`, indicating the `Paddle` mode is on for text segmentation and tagging. If `False`, the `jieba` will also perform the similar text segmentation and tagging functions, less time-consuming but also with less proper nouns identified. For instance, the abbreviation for some univeristies will not be recognized as organization.
- `remove_stopword=True`: the default setting is `True`, will remove all the special characters and punctuations in the stopword list from `advertools`. The reasons for not using the entire stopword are: (1) we focus on extraction rather than textual analysis; (2) the stopword list can drop some parts of the whole phrase or Chinese words, which then become unrecognizable for `jieba`; (3) unlike the paragraph in English, most of the chairman's biographies in Chinese do not contain the words in the stopword list.

***
**Structure** of `extract_bio`

> - Remove spacings, special characters (if `use_paddle=True`) and punctuations (if `use_paddle=True`) from chairman's biography.
> - Replace the short expression (2-digit) of the end year by the full expression (4-digit). For instance, "1990年7月1日至96年5月" will be converted to "1990年7月1日至1996年5月".
> - Identify the year before each experience. For instance, the "1990" will be identified from "1990年7月，...".
> - We initially assume an experience is a sentence split by full stops, then try to identify the pattern of years in the sentence in case there is more than one experience. For each experience, use a dictionary to store the information:
>> - If both starting year and end year exist, for instance, "1990年7月1日至1996年5月，...", they will be separately stored under the keys `bio_start` and `bio_end`. The key `c_experience` is used to store the corresponding experience using parsed texts. `orgs` and `place` are used to store the corresponding organization(s) and place(s) during the experience.
>> - If only one year exists, identify whether the year is the starting year or end year by some keywords. The experience will not be included if any of the words "出生 (born)","月生 (born in...month)","年生 (born in...year)","日生 (born in...day)" exists.
>>> - If any of the words such as "毕业" (graduate), "结业" (graduate), "完成" (complete), "结束" (end), "离职" (resign), "退休" (retire) or expression "获\|取\|得 (get)...学位 (degree)" exists, the year will be regarded as the end year.
>>> - If no such words indicating the year is the end year, the year will be classified as the starting year.
>> - If no year exists, extract the experience from each sentence, and regard start/end year as missing values.
>>> - If there is only one organization for each sentence (split by dot), the sentence will be regarded as one experience to extract information.
>>> - If there is more than one organizations for each sentence: (1) if every sub-sentence (split by comma) has one organization, each sub-sentence will be treated as one experience to extract information; (2) if not all sub-sentence (split by comma) has organizations, the entire sentence will be treated as one experience to extract information.
> - For all the location extraction above, if the experience does not contain location but has organization, the location will be treated as missing. In this situation, `jieba` cannot accurately recognize location in the organization, thus we try to use `jionlp` to complement this step and extract the location from the organization.
***


```python
def extract_bio(experience, use_paddle=True, remove_stopword=True):
    if type(experience) != str:
        experience = str(experience)
    
    if remove_stopword: # remove stopwords
        stopword_list = list(sorted(adv.stopwords['chinese']))
        stopword_list = stopword_list[0:21] + stopword_list[35:121] + stopword_list[-1:1730:-1]
        for punc in ["，", "。"]:
            stopword_list.remove(punc)
        for stopword in stopword_list:
            experience = experience.replace(stopword, "")
    experience = experience.replace(" ", "")
    
    # convert 2-digit year to 4-digit year
    twodigit_year = re.findall(r"(?<=\D)\d{2}年", experience, re.IGNORECASE | re.DOTALL | re.MULTILINE)
    century = re.findall(r"\d{4}年(?=.{0,4}\D\d{2}年)", experience, re.IGNORECASE | re.DOTALL | re.MULTILINE)
    try:
        for year in twodigit_year:
            experience = experience.replace("至"+year, "至"+century[twodigit_year.index(year)][0:2]+year)
    except:
        pass
        
    bio_list = []
    split_exp = experience.replace("，", "/").split("。")       
    for exp in split_exp: # for each sentence (split by dot)          
        reyear_list = []
        reyear_list = re.split(r"(\d{4}年)", exp.replace("/",""), re.IGNORECASE | re.DOTALL | re.MULTILINE) # split by year
        if reyear_list and re.compile(r"\d{4}年").search("".join(reyear_list)): # if the bio has year
            i = 0
            while i < len(reyear_list):

                bio_dict = {}
                bio_dict["bio_start"] = ""
                bio_dict["bio_end"] = ""
                bio_dict["c_experience"] = ""
                bio_dict["orgs"] = ""
                bio_dict["place"] = ""

                if re.compile(r"\d{4}年").search(reyear_list[i]): # if the element has year
                    try:
                        # if the experience has both start and end year
                        if "至" in reyear_list[i+1] and len((reyear_list[i+1]).replace("月","").replace("至","").replace(r"\d*",""))<=2: 
                            try:
                                year_list = re.findall(r"(\d{4}年)", 
                                                       reyear_list[i]+reyear_list[i+1]+reyear_list[i+2], 
                                                       re.IGNORECASE | re.DOTALL | re.MULTILINE)

                                bio_dict["bio_start"] = year_list[0].replace("年", "")
                                bio_dict["bio_end"] = year_list[1].replace("年", "")
                                bio_dict["c_experience"] = reyear_list[i]+reyear_list[i+1]+reyear_list[i+2]+reyear_list[i+3].replace(" ", "").replace("/", "")

                                org_set = set()
                                plc_set = set()
                                try:
                                    org_dict = pseg.cut(reyear_list[i+3], use_paddle=use_paddle)
                                    for k, v in org_dict:
                                        if (v=="nt" or v=="ORG") and len(k)>1:
                                            org_set.add(k)
                                        if (v=="ns" or v=="LOC") and len(k)>1:
                                            plc_set.add(k)

                                    if len(plc_set)==0: # if no place extracted 
                                        loc_dict = {}
                                        loc_list = []
                                        loc_txt = ""                              
                                        try:
                                            loc_dict = jio.recognize_location(reyear_list[i+3])
                                            loc_list = [loc_dict[key] for key in loc_dict.keys() if loc_dict[key] and key!="others"]
                                            if loc_list != [] and len(loc_list[0]) < 3:
                                                try:
                                                    loc_listval = list(loc_list[0][1][0].values())
                                                    loc_txt = "/".join(list(sorted(set(loc for loc in loc_listval if loc), key=loc_listval.index)))
                                                except:
                                                    loc_listval = list(loc_list[0][0][0].values())
                                                    loc_txt = "/".join(list(sorted(set(loc for loc in loc_listval if loc), key=loc_listval.index)))
                                     
                                            plc_set.add(loc_txt)
                                        except:
                                            pass

                                except:
                                    pass

                                bio_dict["orgs"] = "/".join(list(org_set))
                                bio_dict["place"] = "/".join(list(plc_set))

                                i += 2

                            except:
                                pass
                            
                            if bio_dict["c_experience"] != "" and bio_dict["bio_start"] != "" and bio_dict["orgs"] != "":                   
                                bio_list.append(bio_dict)    

                        # if the experience has either start or end year
                        else:
                            if any(item in reyear_list[i+1] for item in ["毕业","结业","完成","结束","离职","退休"]) or re.compile(r"[获|取|得]+\w*?学位").search(reyear_list[i+1]):
                                bio_dict["bio_start"] = ""
                                bio_dict["bio_end"] = reyear_list[i].replace("年", "")
                            else:
                                bio_dict["bio_start"] = reyear_list[i].replace("年", "")
                                bio_dict["bio_end"] = ""
                            bio_dict["c_experience"] = reyear_list[i]+reyear_list[i+1].replace(" ", "").replace("/", "")

                            org_set = set()
                            plc_set = set()
                            try:
                                org_dict = pseg.cut(reyear_list[i+1], use_paddle=use_paddle)
                                for k, v in org_dict:
                                    if (v=="nt" or v=="ORG") and len(k)>1:
                                        org_set.add(k)
                                    if (v=="ns" or v=="LOC") and len(k)>1:
                                        plc_set.add(k)

                                if len(plc_set)==0: # if no place extracted 
                                    loc_dict = {}
                                    loc_list = []
                                    loc_txt = ""                              
                                    try:
                                        loc_dict = jio.recognize_location(reyear_list[i+1])
                                        loc_list = [loc_dict[key] for key in loc_dict.keys() if loc_dict[key] and key!="others"]
                                        if loc_list != [] and len(loc_list[0]) < 3:
                                            try:
                                                loc_listval = list(loc_list[0][1][0].values())
                                                loc_txt = "/".join(list(sorted(set(loc for loc in loc_listval if loc), key=loc_listval.index)))
                                            except:
                                                loc_listval = list(loc_list[0][0][0].values())
                                                loc_txt = "/".join(list(sorted(set(loc for loc in loc_listval if loc), key=loc_listval.index)))

                                        plc_set.add(loc_txt)
                                    except:
                                        pass
                            except:
                                pass
                            bio_dict["orgs"] = "/".join(list(org_set))
                            bio_dict["place"] = "/".join(list(plc_set))

                            if all(item not in bio_dict["c_experience"] for item in ["出生","月生","年生","日生"]) and bio_dict["orgs"] != "":                   
                                bio_list.append(bio_dict)

                    except:
                        pass      

                i += 1

        else: # if there is no year in bio
            
            try:
                org_set = set()
                plc_set = set()
                organization_dict = pseg.cut(exp, use_paddle=use_paddle)
                for k, v in organization_dict:
                    if (v=="nt" or v=="ORG") and len(k)>1:
                        org_set.add(k)
                        exp = exp.replace(k, k+"*")
                    if (v=="ns" or v=="LOC") and len(k)>1:
                        plc_set.add(k)

                if len(plc_set)==0: # if no place extracted 
                    loc_dict = {}
                    loc_list = []
                    loc_txt = ""                              
                    try:
                        loc_dict = jio.recognize_location(exp)
                        loc_list = [loc_dict[key] for key in loc_dict.keys() if loc_dict[key] and key!="others"]
                        if loc_list != [] and len(loc_list[0]) < 3:
                            try:
                                loc_listval = list(loc_list[0][1][0].values())
                                loc_txt = "/".join(list(sorted(set(loc for loc in loc_listval if loc), key=loc_listval.index)))
                            except:
                                loc_listval = list(loc_list[0][0][0].values())
                                loc_txt = "/".join(list(sorted(set(loc for loc in loc_listval if loc), key=loc_listval.index)))

                        plc_set.add(loc_txt)
                    except:
                        pass

                if len(org_set)==1: # if each sentence has only 1 orgs
                    bio_dict = {}
                    bio_dict["bio_start"] = ""
                    bio_dict["bio_end"] = ""
                    bio_dict["c_experience"] = exp.replace("/", "").replace("*", "")
                    bio_dict["orgs"] = "".join(list(org_set))
                    bio_dict["place"] = "".join(list(plc_set))

                    if bio_dict["orgs"] != "":
                        bio_list.append(bio_dict)

                elif len(org_set)>1: # if each sentence has more than 1 orgs
                    exp_comma = exp.split("/")
                    if all("*" in item for item in exp_comma): # if all sub-sentences (comma) have orgs
                        for exp_comma_i in exp_comma:
                            org_set2 = set()
                            plc_set2 = set()
                            organization_dict2 = pseg.cut(exp_comma_i, use_paddle=use_paddle)
                            for k, v in organization_dict2:
                                if (v=="nt" or v=="ORG") and len(k)>1:
                                    org_set2.add(k)
                                if (v=="ns" or v=="LOC") and len(k)>1:
                                    plc_set2.add(k)

                            if len(plc_set2)==0: # if no place extracted 
                                loc_dict = {}
                                loc_list = []
                                loc_txt = ""                              
                                try:
                                    loc_dict = jio.recognize_location(exp_comma_i)
                                    loc_list = [loc_dict[key] for key in loc_dict.keys() if loc_dict[key] and key!="others"]
                                    if loc_list != [] and len(loc_list[0]) < 3:
                                        try:
                                            loc_listval = list(loc_list[0][1][0].values())
                                            loc_txt = "/".join(list(sorted(set(loc for loc in loc_listval if loc), key=loc_listval.index)))
                                        except:
                                            loc_listval = list(loc_list[0][0][0].values())
                                            loc_txt = "/".join(list(sorted(set(loc for loc in loc_listval if loc), key=loc_listval.index)))

                                    plc_set2.add(loc_txt)
                                except:
                                    pass

                            bio_dict = {}
                            bio_dict["bio_start"] = ""
                            bio_dict["bio_end"] = ""
                            bio_dict["c_experience"] = exp_comma_i.replace("*", "")
                            bio_dict["orgs"] = "/".join(list(org_set2))
                            bio_dict["place"] = "/".join(list(plc_set2))

                            if bio_dict["orgs"] != "":
                                bio_list.append(bio_dict)

                    else: # if not all sub-sentences (comma) have orgs
                        org_set2 = set()
                        plc_set2 = set()
                        organization_dict2 = pseg.cut(exp, use_paddle=use_paddle)
                        for k, v in organization_dict2:
                            if (v=="nt" or v=="ORG") and len(k)>1:
                                org_set2.add(k)
                            if (v=="ns" or v=="LOC") and len(k)>1:
                                plc_set2.add(k)

                        if len(plc_set2)==0: # if no place extracted 
                            loc_dict = {}
                            loc_list = []
                            loc_txt = ""
                            try:
                                loc_dict = jio.recognize_location(exp)
                                loc_list = [loc_dict[key] for key in loc_dict.keys() if loc_dict[key] and key!="others"]
                                if loc_list != [] and len(loc_list[0]) < 3:
                                    try:
                                        loc_listval = list(loc_list[0][1][0].values())
                                        loc_txt = "/".join(list(sorted(set(loc for loc in loc_listval if loc), key=loc_listval.index)))
                                    except:
                                        loc_listval = list(loc_list[0][0][0].values())
                                        loc_txt = "/".join(list(sorted(set(loc for loc in loc_listval if loc), key=loc_listval.index)))

                                plc_set2.add(loc_txt)
                            except:
                                pass

                        bio_dict = {}
                        bio_dict["bio_start"] = ""
                        bio_dict["bio_end"] = ""
                        bio_dict["c_experience"] = exp.replace("/", "").replace("*", "")
                        bio_dict["orgs"] = "/".join(list(org_set2))
                        bio_dict["place"] = "/".join(list(plc_set2))

                        if bio_dict["orgs"] != "":
                            bio_list.append(bio_dict)

            except:
                pass

    return bio_list

```

***
**Demonstration** of `extract_bio`

Here I provide three biography examples to test `extract_bio`. Here is some highlights of the results:

- `test_bio`: (1) the "1970年8月出生 (born in August 1970)" is not treated as experience and is ignored; (2) the "1990年至94年 (year 1990-94)" is identified as the start year = "1990" and the end year = "1994"; (3) in the "1997年于南大获取硕士学位 (get master degree from NJU)", 1997 is classified as the end year ("get the master degree"), and the abbreviation of Nanjing University (南大/NJU) is recognized as an organization; (4) in the "在建行工作 (work at the CCB)", the abbreviation for China Construction Bank (建行/CCB) is recognized as an organization.

- `test_bio1`: contains the same information from the `test_bio`, but without year before each experience (a small portion of chairman's biographies look like this). In this situation, the start/end year are missing values. The biography contains 3 sentences (split by full stops), but the function extracts 4 experiences from it. This is because even though "本科位于清华大学，硕士毕业于南大 (bachelor is at THU, master graduated from NJU)" is in the same sentence, they are telling different experiences, split by a comma.

- `test_bio2`: unlike the previous examples, this is a real biography randomly selected from all chairman's CVs. (1) "1960年生 (born in 1960)" is not extracted as an experience; (2) "自2013年4月加入本行 (join our bank from April 2013)" is not extracted as an experience because there is no clear organization in this sentence (only "our bank"). The clearer information on this is at the end of the paragraph (appointed as the chairman and non-executive director of BOC Hong Kong (Holdings) Limited and Bank of China (Hong Kong) Limited since 4 June 2013), this time the experience is extracted; (3) `jieba` recognize the "湖北财经学院 (Hubei University of Finance and Economics)" as an organization, and `jionlp` identify the location of the organization as "湖北省 (Hubei Province)".

We will deal with missing dates and places, link types (whether education or work), the degree type (for edu link), the organization's abbreviation, and the position level (for work link) in the following steps.


```python
test_bio = "1970年8月出生。有3年在军队的服役经历，1990年5月在北京加入中国共产党。1990年至94年清华大学本科，1997年于南 \
            大获取硕士学位。1997年至2001年来到天津，在建行工作。"

test_bio1 = "有3年在军队的服役经历，曾在北京加入中国共产党。本科位于清华大学，硕士毕业于南大。目前位于天津，在建行与农行 \
             都工作过。"

test_bio2 = "田国立先生，1960年生,自2013年4月加入本行。2010年12月至2013年4月担任中信集团副董事长兼总经理,其间曾兼任中 \
             信银行董事长、非执行董事。1999年4月至2010年12月历任中国信达资产管理公司副总裁、总裁,中国信达资产管理股份有 \
             限公司董事长。1997年7月至1999年4月任中国建设银行行长助理，1994年7月至1997年7月任中国建设银行总行营业部总 \
             经理，1993年1月至1994年7月任中国建设银行北京市分行副行长。1983年7月至1993年1月在中国建设银行多个岗位工作，\
             先后担任支行副行长、支行行长。1983年毕业于湖北财经学院,获学士学位。自2013年6月4日起获委任为中银香港（控股）\
             有限公司及中国银行（香港）有限公司的董事长及非执行董事。"
```


```python
pd.DataFrame(extract_bio(test_bio))
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>bio_start</th>
      <th>bio_end</th>
      <th>c_experience</th>
      <th>orgs</th>
      <th>place</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1990</td>
      <td></td>
      <td>1990年5月在北京加入中国共产党</td>
      <td>中国共产党</td>
      <td>北京</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1990</td>
      <td>1994</td>
      <td>1990年至1994年清华大学本科</td>
      <td>清华大学</td>
      <td></td>
    </tr>
    <tr>
      <th>2</th>
      <td></td>
      <td>1997</td>
      <td>1997年于南大获取硕士学位</td>
      <td>南大</td>
      <td></td>
    </tr>
    <tr>
      <th>3</th>
      <td>1997</td>
      <td>2001</td>
      <td>1997年至2001年来到天津在建行工作</td>
      <td>建行</td>
      <td>天津</td>
    </tr>
  </tbody>
</table>
</div>




```python
pd.DataFrame(extract_bio(test_bio1))
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>bio_start</th>
      <th>bio_end</th>
      <th>c_experience</th>
      <th>orgs</th>
      <th>place</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td></td>
      <td></td>
      <td>有3年在军队的服役经历曾在北京加入中国共产党</td>
      <td>中国共产党</td>
      <td>北京</td>
    </tr>
    <tr>
      <th>1</th>
      <td></td>
      <td></td>
      <td>本科位于清华大学</td>
      <td>清华大学</td>
      <td></td>
    </tr>
    <tr>
      <th>2</th>
      <td></td>
      <td></td>
      <td>硕士毕业于南大</td>
      <td>南大</td>
      <td></td>
    </tr>
    <tr>
      <th>3</th>
      <td></td>
      <td></td>
      <td>目前位于天津在建行与农行都工作过</td>
      <td>建行/农行</td>
      <td>天津</td>
    </tr>
  </tbody>
</table>
</div>




```python
pd.DataFrame(extract_bio(test_bio2))
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>bio_start</th>
      <th>bio_end</th>
      <th>c_experience</th>
      <th>orgs</th>
      <th>place</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2010</td>
      <td>2013</td>
      <td>2010年12月至2013年4月担任中信集团副董事长兼总经理其间曾兼任中信银行董事长非执行董事</td>
      <td>中信集团/中信银行</td>
      <td></td>
    </tr>
    <tr>
      <th>1</th>
      <td>1999</td>
      <td>2010</td>
      <td>1999年4月至2010年12月历任中国信达资产管理公司副总裁总裁中国信达资产管理股份有限公...</td>
      <td>中国信达资产管理股份有限公司/中国信达资产管理公司</td>
      <td>中国</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1997</td>
      <td>1999</td>
      <td>1997年7月至1999年4月任中国建设银行行长助理</td>
      <td>中国建设银行</td>
      <td>中国</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1994</td>
      <td>1997</td>
      <td>1994年7月至1997年7月任中国建设银行总行营业部总经理</td>
      <td>中国建设银行总行营业部</td>
      <td>中国</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1993</td>
      <td>1994</td>
      <td>1993年1月至1994年7月任中国建设银行北京市分行副行长</td>
      <td>北京市分行/中国建设银行</td>
      <td>北京市</td>
    </tr>
    <tr>
      <th>5</th>
      <td>1983</td>
      <td>1993</td>
      <td>1983年7月至1993年1月在中国建设银行多个岗位工作先后担任支行副行长支行行长</td>
      <td>中国建设银行</td>
      <td>中国</td>
    </tr>
    <tr>
      <th>6</th>
      <td></td>
      <td>1983</td>
      <td>1983年毕业于湖北财经学院获学士学位</td>
      <td>湖北财经学院</td>
      <td>湖北省</td>
    </tr>
    <tr>
      <th>7</th>
      <td>2013</td>
      <td></td>
      <td>2013年6月4日起获委任为中银香港控股有限公司及中国银行香港有限公司的董事长及非执行董事</td>
      <td>中银香港控股有限公司/中国银行香港有限公司</td>
      <td>香港特别行政区</td>
    </tr>
  </tbody>
</table>
</div>



### Extraction from chairman's data

Then, we apply the `extract_bio` function to our main chairman's dataset. A new column `c_biotoken` will be generated to store a list of experience dictionaries for each chairman.


```python
df_c["c_biotoken"] = df_c.progress_apply(lambda x: extract_bio(x["c_bio"], use_paddle=True), axis=1)
```

```python
df_c.head(3)
```




<div style="height:400px;overflow:auto;">
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>stockid</th>
      <th>firm_name</th>
      <th>c_tenure</th>
      <th>c_name</th>
      <th>start_chair</th>
      <th>end_chair</th>
      <th>c_gender</th>
      <th>c_nation</th>
      <th>c_max_degree</th>
      <th>c_birth</th>
      <th>c_bio</th>
      <th>c_biotoken</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>002776.SZ</td>
      <td>柏堡龙</td>
      <td>第1任(现任)</td>
      <td>陈伟雄</td>
      <td>2015-03-25</td>
      <td>2018-03-24</td>
      <td>男</td>
      <td>中国</td>
      <td>--</td>
      <td>1978</td>
      <td>陈伟雄先生,中国国籍,无永久境外居留权,出生于1978年。2006年11月至2009年4月曾...</td>
      <td>[{'bio_start': '2009', 'bio_end': '', 'c_exper...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>300383.SZ</td>
      <td>光环新网</td>
      <td>第1任(现任)</td>
      <td>耿殿根</td>
      <td>2012-11-30</td>
      <td>2019-01-21</td>
      <td>男</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1956</td>
      <td>耿殿根,中国国籍,曾拥有加拿大永久居留权,已于2014年12月放弃,男,汉族,毕业于美国德克...</td>
      <td>[{'bio_start': '', 'bio_end': '2014', 'c_exper...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>300021.SZ</td>
      <td>大禹节水</td>
      <td>第1任(现任)</td>
      <td>王栋</td>
      <td>2005-01-12</td>
      <td>2017-04-30</td>
      <td>男</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1964</td>
      <td>王栋,男,1964年生,中国国籍,无境外居留权,中共党员,硕士研究生,教授级高级工程师、国务...</td>
      <td>[{'bio_start': '', 'bio_end': '', 'c_experienc...</td>
    </tr>
  </tbody>
</table>
</div>




```python
pd.DataFrame(df_c.groupby("c_name").get_group("赵敏")["c_biotoken"].iloc[0])
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>bio_start</th>
      <th>bio_end</th>
      <th>c_experience</th>
      <th>orgs</th>
      <th>place</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td></td>
      <td>1982</td>
      <td>1982年1月毕业于西安理工大学自动化专业获工学学士学位</td>
      <td>西安理工大学</td>
      <td>陕西省/西安市</td>
    </tr>
    <tr>
      <th>1</th>
      <td></td>
      <td>1992</td>
      <td>1992年7月毕业于重庆大学自动化专业获得工学硕士学位</td>
      <td>重庆大学</td>
      <td>重庆市</td>
    </tr>
    <tr>
      <th>2</th>
      <td></td>
      <td>2008</td>
      <td>2008年12月毕业于清华大学EMB获得工商管理硕士学位</td>
      <td>清华大学</td>
      <td></td>
    </tr>
    <tr>
      <th>3</th>
      <td>1982</td>
      <td>1995</td>
      <td>1982年至1995年任西安重型机械研究所高级工程师从事工业自动化设计工作参加多项国家重点科...</td>
      <td>西安重型机械研究所</td>
      <td>陕西省/西安市</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1995</td>
      <td>1996</td>
      <td>1995年至1996年任中外合资德马格冶金设备技术有限公司电气总工</td>
      <td>中外合资德马格冶金设备技术有限公司</td>
      <td></td>
    </tr>
    <tr>
      <th>5</th>
      <td>1997</td>
      <td>2000</td>
      <td>1997年至2000年任西安伟德控制工程有限责任公司总经理</td>
      <td>西安伟德控制工程有限责任公司</td>
      <td>陕西省/西安市</td>
    </tr>
    <tr>
      <th>6</th>
      <td>2001</td>
      <td></td>
      <td>2001年与邢连鲜女士创立西安宝德自动化股份有限公司历任总经理执行董事现任西安宝德自动化股份...</td>
      <td>西安宝德自动化股份有限公司</td>
      <td>陕西省/西安市</td>
    </tr>
  </tbody>
</table>
</div>



***
Randomly browsing the extracted experience


```python
pd.DataFrame(df_c["c_biotoken"].iloc[46])
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>bio_start</th>
      <th>bio_end</th>
      <th>c_experience</th>
      <th>orgs</th>
      <th>place</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1991</td>
      <td>1999</td>
      <td>1991年9月至1999年7月历任北京铁路局天津分局天津东车辆段技术室主任副段长段长党委副书记</td>
      <td>北京铁路局天津分局</td>
      <td>天津东</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1999</td>
      <td>2002</td>
      <td>1999年7月至2002年3月任北京铁路局车辆处处长</td>
      <td>北京铁路局</td>
      <td>北京市</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2002</td>
      <td>2004</td>
      <td>2002年3月至2004年6月任铁道部运输指挥中心运输局装备部副主任</td>
      <td>铁道部运输指挥中心运输局装备部</td>
      <td></td>
    </tr>
    <tr>
      <th>3</th>
      <td>2004</td>
      <td>2005</td>
      <td>2004年6月至2005年3月任郑州铁路局西安分局分局长</td>
      <td>郑州铁路局西安分局</td>
      <td></td>
    </tr>
    <tr>
      <th>4</th>
      <td>2005</td>
      <td>2008</td>
      <td>2005年3月至2008年3月任西安铁路局局长党委副书记</td>
      <td>西安铁路局</td>
      <td>陕西省/西安市</td>
    </tr>
    <tr>
      <th>5</th>
      <td>2008</td>
      <td>2008</td>
      <td>2008年3月至2008年9月任北京铁路局局长党委副书记</td>
      <td>北京铁路局</td>
      <td>北京市</td>
    </tr>
    <tr>
      <th>6</th>
      <td>2008</td>
      <td>2010</td>
      <td>2008年9月至2010年4月任铁道部运输局副局长兼装备部主任自</td>
      <td>铁道部运输局</td>
      <td></td>
    </tr>
    <tr>
      <th>7</th>
      <td>2010</td>
      <td></td>
      <td>2010年4月起任太原铁路局局长党委副书记</td>
      <td>太原铁路局</td>
      <td>山西省/太原市</td>
    </tr>
  </tbody>
</table>
</div>




```python
rand_idx = np.random.randint(df_c.index[0], df_c.index[-1])
print("[Index] %s" % rand_idx)
pd.DataFrame(df_c["c_biotoken"].iloc[rand_idx])
```

    [Index] 75





<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>bio_start</th>
      <th>bio_end</th>
      <th>c_experience</th>
      <th>orgs</th>
      <th>place</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2004</td>
      <td></td>
      <td>2004年创办了香港蓝思科技并担任董事至今</td>
      <td>香港蓝思科技</td>
      <td>香港特别行政区</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2010</td>
      <td></td>
      <td>2010年创办了蓝思国际香港3D并担任董事至今同年12月创办了三维科技并担任董事长兼总经理至今</td>
      <td>蓝思国际</td>
      <td>香港</td>
    </tr>
  </tbody>
</table>
</div>



## Construction of experience dataset

### Function for location searching

**Concerns**

Two concerns about the location extraction in our text segmentation step are:

- Missing location. If the location is not clearly mentioned in the experience, we can also extract location information from the branch organizations, because most of the chairman's biography include the location of the branch in the experience. For instance, "中国银行（香港）有限公司 (Bank of China (Hong Kong) Limited)" has "香港 (Hong Kong)" in the company's name, "中国建设银行天津市分行 (China Construction Bank Tianjin Branch)" has "天津" in the name. However, if the chairman worked at the headquarters, some biographies do not mention the location or even the "总部 (headquarters)" in the description of organizations. 

- Unspecific location. If the location is not mentioned below province level but only country level, the extraction function will identify the location at country level. For instance, the location of "中国建设银行 (China Construction Bank)" will be "中国 (China)". This extraction is too vague for our location matching.

***
**Description** of `find_loc(org, engine="wikipedia")`

The function takes the organization name (string), then search the name on `Wikipedia (China)` or `Baidu`. It will find the most relevant searching result, and identify the location of the organization in the right sidebar of the article page.

The default setting of the search engine is `Wikipedia`.


```python
def find_loc(org, engine="wikipedia"):   
    
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}
    
    if engine=="wikipedia":
        
        url_prefix = "https://zh.wikipedia.org" # Wikipedia (Chinese)
        url_search = "/w/index.php?search="
        url_suffix = "&title=Special:搜索&profile=advanced&fulltext=1&ns0=1"
       
        drop_list = re.findall(r"\w{2}部", org, re.IGNORECASE | re.DOTALL | re.MULTILINE)
        for word in drop_list:
            org = org.replace(word, "")

        full_url = url_prefix + url_search + org + url_suffix

        request_html = requests.get(full_url, headers=headers)
        html_text = BeautifulSoup(request_html.text, "lxml")

        all_li = html_text.find_all("li")

        loc_txt = ""
        try:
            all_a = all_li[4].find_all("a")
            search_redirect = url_prefix + "/zh-cn/" + all_a[0]["href"].split("/")[2]

            redirect_html = requests.get(search_redirect, headers=headers)
            redirect_text = BeautifulSoup(redirect_html.text, "lxml")

            all_table = redirect_text.find_all("table", {"class": "infobox"})

            if all_table==[]:
                tbl_li = redirect_text.find_all("li")
                tbl_a = tbl_li[0].find_all("a")
                search_redirect = url_prefix + "/zh-cn/" + tbl_a[0]["href"].split("/")[2]

                redirect_html = requests.get(search_redirect, headers=headers)
                redirect_text = BeautifulSoup(redirect_html.text, "lxml")

                all_table = redirect_text.find_all("table", {"class": "infobox"})

            raw_loctxt = "".join(re.findall(r"(?=地址|总部|地点|址|位|置|所在).{30}", 
                                            all_table[0].get_text(),
                                            re.IGNORECASE | re.DOTALL | re.MULTILINE))

            loc_dict = jio.recognize_location(raw_loctxt)
            loc_list = [loc_dict[key] for key in loc_dict.keys() if loc_dict[key] and key!="others"]
            if loc_list != []:
                loc_listval = list(loc_list[0][0][0].values())
                loc_txt = "/".join(list(sorted(set(loc for loc in loc_listval if loc), key=loc_listval.index)))

        except:
            pass
    
    if engine=="baidu":
        
        baidu_url = "https://baike.baidu.com"
        url_prefix = "https://baike.baidu.com/search?word=" # Baidu (Chinese)
        url_suffix = "&pn=0&rn=0&enc=utf8"
        full_url = url_prefix + org + url_suffix

        request_html = requests.get(full_url, headers=headers)
        html_text = BeautifulSoup(request_html.text, "lxml")

        all_dd = html_text.find_all("dd")
        
        loc_txt = ""
        try:
            dd_idx = 0
            while dd_idx < 5:
                all_a = all_dd[dd_idx].find_all("a")
                if all_a[0]["class"]==["result-title"]:
                    break
                dd_idx += 1
            
            a_ref = all_a[0]["href"]
            if any(a_ref.startswith(preffix) for preffix in ["http", "www"]):
                search_redirect = a_ref
            else:
                search_redirect = baidu_url + a_ref

            redirect_html = requests.get(search_redirect, headers=headers)
            redirect_text = BeautifulSoup(redirect_html.text, "lxml")
                        
            dt_list = redirect_text.find_all("dt", {"class": "basicInfo-item name"})
            dd_list = redirect_text.find_all("dd", {"class": "basicInfo-item value"})
            pre_list = []
            for key in dt_list:
                if any(word in key.get_text() for word in ["地址","地点","总部","址","位","置","所在"]):
                    pre_list.append(dd_list[dt_list.index(key)].get_text())

            loc_dict = jio.recognize_location("".join(pre_list)[0:30])
            loc_list = [loc_dict[key] for key in loc_dict.keys() if loc_dict[key] and key!="others"]
            if loc_list != []:
                loc_listval = list(loc_list[0][0][0].values())
                loc_txt = "/".join(list(sorted(set(loc for loc in loc_listval if loc), key=loc_listval.index)))

        except:
            pass

    return loc_txt

```

***
We can use the function `find_loc` to fill the missing location and replace the unspecific location such as "中国 (China)".


```python
find_loc_list = []

test_unilist = ["清华大学", "南大", "兰大", "伊拉斯姆斯大学"]
test_colist = ["中信集团/中信银行", "中国建设银行总行营业部", "摩根大通", "大疆"]

for element in test_unilist+test_colist:
    find_loc_dict = {}
    find_loc_dict["org"] = element
    find_loc_dict["wikipedia"] = find_loc(element, engine="wikipedia")
#     find_loc_dict["baidu"] = find_loc(element, engine="baidu")
    find_loc_list.append(find_loc_dict)

pd.DataFrame(find_loc_list)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>org</th>
      <th>wikipedia</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>清华大学</td>
      <td>北京市/海淀区</td>
    </tr>
    <tr>
      <th>1</th>
      <td>南大</td>
      <td>江苏省/南京市/鼓楼区</td>
    </tr>
    <tr>
      <th>2</th>
      <td>兰大</td>
      <td>甘肃省/兰州市/城关区</td>
    </tr>
    <tr>
      <th>3</th>
      <td>伊拉斯姆斯大学</td>
      <td>荷兰/鹿特丹</td>
    </tr>
    <tr>
      <th>4</th>
      <td>中信集团/中信银行</td>
      <td>北京市/朝阳区</td>
    </tr>
    <tr>
      <th>5</th>
      <td>中国建设银行总行营业部</td>
      <td>北京市/西城区</td>
    </tr>
    <tr>
      <th>6</th>
      <td>摩根大通</td>
      <td>美国/纽约</td>
    </tr>
    <tr>
      <th>7</th>
      <td>大疆</td>
      <td>广东省/深圳市/南山区</td>
    </tr>
  </tbody>
</table>
</div>



### Function for acronym verifcation

**Description** of `check_abbr(orgs, engine="wikipedia")`

The function takes the organization name (string), then search the name on `Wikipedia (China)` or `Baidu`. It will find the most relevant searching result, and identify if the organization is in its full name.

The default setting of the search engine is `Wikipedia`.


```python
def check_abbr(orgs, engine="wikipedia"):
    
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}
    
    if engine=="wikipedia":

        url_prefix = "https://zh.wikipedia.org" # Wikipedia (Chinese)
        url_search = "/w/index.php?search="
        url_suffix = "&title=Special:搜索&profile=advanced&fulltext=1&ns0=1"

        org_list = orgs.split("/")
        full_namelist = []
        for org_raw in org_list:

            full_name = org_raw
            org = org_raw
            drop_list = re.findall(r"\w{2}部", org, re.IGNORECASE | re.DOTALL | re.MULTILINE)
            for word in drop_list:
                org = org.replace(word, "")

            full_url = url_prefix + url_search + org + url_suffix

            request_html = requests.get(full_url, headers=headers)
            html_text = BeautifulSoup(request_html.text, "lxml")

            all_li = html_text.find_all("li")

            try:
                all_a = all_li[4].find_all("a")     
                search_redirect = url_prefix + "/zh-cn/" + all_a[0]["href"].split("/")[2]

                redirect_html = requests.get(search_redirect, headers=headers)
                redirect_text = BeautifulSoup(redirect_html.text, "lxml")

                first_p = redirect_text.find_all("p")[0].get_text()
                title = redirect_text.find_all("title")[0].get_text().replace(" - 维基百科，自由的百科全书", "")

                if org==title and len(org)<=3 and "可能指" in first_p: # still in search page
                    title2 = ""
                    try:
                        tbl_li = redirect_text.find_all("li")
                        tbl_a = tbl_li[0].find_all("a")
                        search_redirect = url_prefix + "/zh-cn/" + tbl_a[0]["href"].split("/")[2]

                        redirect_html = requests.get(search_redirect, headers=headers)
                        redirect_text = BeautifulSoup(redirect_html.text, "lxml")

                        title2 = redirect_text.find_all("title")[0].get_text().replace(" - 维基百科，自由的百科全书", "")
                    except:
                        pass  

                    if org!=title2 and title2!="":
                        full_name = title2 + "/" + org_raw
                    elif org==title2:
                        full_name = org_raw

                else:
                    full_name = title + "/" + org_raw

            except:
                pass

            full_namelist.append(full_name)
    
    if engine=="baidu":
        
        baidu_url = "https://baike.baidu.com"
        url_prefix = "https://baike.baidu.com/search?word=" # Baidu (Chinese)
        url_suffix = "&pn=0&rn=0&enc=utf8"
        
        org_list = orgs.split("/")
        full_namelist = []
        for org in org_list:

            full_name = org
            full_url = url_prefix + org + url_suffix
            request_html = requests.get(full_url, headers=headers)
            html_text = BeautifulSoup(request_html.text, "lxml")
            all_dd = html_text.find_all("dd")
            
            try:
                dd_idx = 0
                while dd_idx < 5:
                    all_a = all_dd[dd_idx].find_all("a")
                    if all_a[0]["class"]==["result-title"]:
                        break
                    dd_idx += 1

                a_ref = all_a[0]["href"]
                if any(a_ref.startswith(preffix) for preffix in ["http", "www"]):
                    search_redirect = a_ref
                else:
                    search_redirect = baidu_url + a_ref

                redirect_html = requests.get(search_redirect, headers=headers)
                redirect_text = BeautifulSoup(redirect_html.text, "lxml")
                title = redirect_text.find_all("title")[0].get_text().replace("_百度百科", "")
                
                full_name = title + "/" + org

            except:
                pass

            full_namelist.append(full_name)
   
    adj_list = "/".join(full_namelist)
    adj_name = "/".join(list(sorted(set(adj_list.split("/")), key=adj_list.split("/").index)))
    
    return adj_name

```


```python
check_abbr_list = []

test_unilist = ["清华大学", "南大", "兰大", "伊拉斯姆斯大学"]
test_colist = ["中信集团/中信银行", "中国建设银行总行营业部", "摩根大通", "大疆"]

for element in test_unilist+test_colist:
    check_abbr_dict = {}
    check_abbr_dict["previous"] = element
    check_abbr_dict["wikipedia"] = check_abbr(element, engine="wikipedia")
#     check_abbr_dict["baidu"] = check_abbr(element, engine="baidu")
    check_abbr_list.append(check_abbr_dict)

pd.DataFrame(check_abbr_list)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>previous</th>
      <th>wikipedia</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>清华大学</td>
      <td>清华大学</td>
    </tr>
    <tr>
      <th>1</th>
      <td>南大</td>
      <td>南京大学/南大</td>
    </tr>
    <tr>
      <th>2</th>
      <td>兰大</td>
      <td>兰州大学/兰大</td>
    </tr>
    <tr>
      <th>3</th>
      <td>伊拉斯姆斯大学</td>
      <td>鹿特丹伊拉斯姆斯大学/伊拉斯姆斯大学</td>
    </tr>
    <tr>
      <th>4</th>
      <td>中信集团/中信银行</td>
      <td>中国中信集团/中信集团/中信银行</td>
    </tr>
    <tr>
      <th>5</th>
      <td>中国建设银行总行营业部</td>
      <td>中国建设银行/中国建设银行总行营业部</td>
    </tr>
    <tr>
      <th>6</th>
      <td>摩根大通</td>
      <td>摩根大通</td>
    </tr>
    <tr>
      <th>7</th>
      <td>大疆</td>
      <td>大疆创新/大疆</td>
    </tr>
  </tbody>
</table>
</div>



### Function for experience data construction

**Purpose of this step**

We follow the below procedure to match the experience of chairmen and politicians:

![matching_cp](https://raw.github.com/evanhaozhao/evanhaozhao.github.io/master/images/matching_cp.png)

First, the politician's experience is already in an organized manner, with the year range, location, and other related information stored in an structured dataset. In order to match the experience of chairmen with that of politicians by **year range**, **location**, and **the rank of position** in a minimum manual work required manner, we need to make the adjustments for the chairman dataframe we have:

**1. For education**

- Adding the level/name of the degree, including keywords "Junior High School", "High School", "Secondary School", "Junior College", "Bachelor", "Master", "PhD", "Undergraduate", "Graduate", "MBA", "EMBA", "Public School Study Abroad", "Visiting Scholar", "On-the-job study", "Student", "Degree"

- Replacing missing start/end years. If one of the start and end year is missing, we fill it with an assumed range of year: "Undergraduate": 4 years, "Master": 2 years, "PhD": 3 years, "Junior High School": 3 years, "High School": 3 years, "Secondary School": 3 years, "Junior College": 3 years, "MBA": 2 years, "Government-sponsored study abroad": 2 years, "Visiting scholar": 2 years, "On-the-job study": 2 years. If both start and end years are missing, besides the assumption of year range we made, we also assume Undergraduate study starts at 18, Postgraduate at 23, while Doctoral at 30. This step would not affect how we build network but help us identify how our education links are connected through classmates and alumni channel.

- Verifying if the organization's name is acronym. To reduce the manual works, we use `check_abbr` function powered by search engines to identify whether the organizations is an acronym. The word length in the below example for an organization's name to be treated as an acronym is equal or less than 3 characters.

- Replacing the location of organizations if location is "中国 (China)" or missing. If the location is "China" or a missing value, it is not specific enough for the matching. We will fill them using `find_loc` function.


**2. For work:**

- Identifing if the chairman worked in a governmental position, including "Deputy Director", "Secretary of the Party Committee", "President", "Deputy Director", "Member of the Party Committee", "Section Chief", "Minister", "Deputy Secretary of the Party Committee", "Section Member", "Member of the Standing Committee of the Party Committee", "Member of the Party Group", "Secretary of the League Committee", "Deputy Minister", "Deputy Section Chief", "Vice President", "Deputy Secretary of the League Committee", "Deputy Secretary of the Discipline Inspection Committee", "Deputy Chief of Section ", "Chairman of the Labor Union", "Deputy Captain", "Deputy Secretary of the Party Group", "Secretary of the Party Group", "Deputy Secretary", "Chief of Section", "Deputy Director", "Secretary of the Discipline Inspection Commission", "Officer", "Alternate Member", "Secretary of the Party Branch", "Branch Secretary".

- Identifing whether the governmental position of the chairman is senior. Senior positions include "Deputy Director", "President", "Vice President", "Director", "Minister", "Deputy Secretary of the Party Committee", "Deputy Secretary of the League", "Standing Committee of the Party Committee", "Secretary of the League", "Deputy Minister", "Deputy Secretary of the Discipline Inspection Commission", "Deputy Secretary of the Party Group", "Secretary of the Party Group", "Deputy Secretary", "Secretary of the Discipline Inspection Commission", "Cadre", "Party Branch Secretary", "Branch Secretary".

- Replacing missing start/end years. First we will try to fill the missing start/end years using the end/start years of the previous/next experience. But if there is no experience before or after, we assume the junior job starts at 25 and ends at 35, and senior from 35 to 55.

- Identify if the organization's name is acronym using `check_abbr`.

- Replacing location if location is "中国" or missing `find_loc`.

***

**Description** of `expand_bio(df, cv_type="chairman", return_type="edu", fillna=True, engine="wikipedia", abbr_limit=None)`

The function makes the above adjustments for the chairman's experience dataframe.

**Arguments**

- `df`: the chairman's dataframe initially extracted from the bio.
- `cv_type="chairman"`: the group type of people of the dataframe. Take `"chairman"` (default) or `"politician"`. Here we focus on the experience of chairman.
- `return_type="edu"`: take `"edu"` or `"work"` this will determine whether the return data is about the chairman's experience of education or work. 
- `fillna=True`: if `True` (default), the missing value of the year range, organization and location will be filled.
- `engine="wikipedia"`: because the N/A filling requires the assistance of search engines, the function provides two options: `"wikipedia"` (default) and `"baidu"`.
- `abbr_limit=None`: the limit of the number of characters that will be treated as abbreviations or acronym. The default setting is `None`, meaning all the name of organizations will be searched and identified. To make the process more efficient, the examples below set the limit to 3 characters. Thus, only organizations with name less than 3 characters will go through the identification process.



```python
def expand_bio(df, cv_type="chairman", return_type="edu", fillna=True, engine="wikipedia", abbr_limit=None):
    
    if cv_type=="chairman":
        name_suff = "c_"
    elif cv_type=="politician":
        name_suff = "p_"
    
    token_col = name_suff + "biotoken"
    bio_col = name_suff + "bio"
    experience_key = name_suff + "experience"
    degree_newcol = name_suff + "degree"
    rank_newcol = name_suff + "rank"
    senior_newcol = name_suff + "senior"
               
    bio_list = []
            
    degree_list = ["初中", "高中", "中专", "大专", "学士", "硕士", "博士", "本科", "研究生", "MBA", "EMBA", 
                   "公派留学", "访问学者", "在职学", "学员", "学位"]
    gov_list = ["副局长","党委书记","委员", "院长", "副处长","党委委员", "科长", "局长","部长","党委副书记",
                "科员", "党委常委", "党组成员" ,"处长", "团委书记", "副部长", "副科长", "副院长", "团委副书记",
                "纪委副书记","副主任科员", "工会主席", "副队长", "厅长", "党组副书记", "党组书记", "副书记", 
                "主任科员", "副厅长", "纪委书记", "干部", "候补委员", "党支部书记", "支部书记", "副司长", "司长"]
    senior_list = ["副局长","院长", "副院长", "局长","部长","党委副书记","团委副书记","党委常委", "团委书记",
                   "副部长", "纪委副书记", "厅长", "党组副书记", "党组书记", "副书记", "纪委书记", "干部", 
                   "党支部书记", "支部书记", "司长"]
    
    for idx in range(0, len(df)): # for each index in df
        
        for token_dict in tqdm(df[token_col].iloc[idx]): # for each experience of an chairman
            
            tokendict_idx = df[token_col].iloc[idx].index(token_dict) # the index of the experience
            
            # select education experience only
            if return_type=="edu" and any(item in token_dict["orgs"] for item in ["大学","学院"]) \
                                  and any(item in token_dict[experience_key] for item in degree_list):   
                
                level_set = set()
                for item in degree_list[0:-2]:
                    if item in token_dict[experience_key]:
                        item = item.replace("学士","本科").replace("硕士研究生","硕士").replace("在职学","在职")
                        level_set.add(item)
                        
                token_dict[degree_newcol] = "/".join(list(level_set)) # store the level of degree
                
                for col in df.columns:
                    if not col.startswith(bio_col):
                        token_dict[col] = df[col].iloc[idx]
                
                if fillna:
                    
                    # 1. fill the start/end year
                    length_dict = {"本科":4, "硕士":2, "博士":3, "初中":3, "高中":3, "中专":3, "大专":3, 
                                   "MBA":2, "公派留学":2, "访问学者":2, "在职":2}                        
                    
                    if not token_dict["bio_end"]:
                        if token_dict["bio_start"]:
                            end_year = int(token_dict["bio_start"])
                            for k, v in length_dict.items():
                                if k in token_dict["c_degree"]:
                                    end_year += v
                            if end_year == int(token_dict["bio_start"]):
                                end_year += 2
                                
                        if not token_dict["bio_start"]: 
                            for k, v in length_dict.items():
                                if k in token_dict["c_degree"]:
                                    if k == "本科": 
                                        token_dict["bio_start"] = 18
                                        end_year = int(token_dict["bio_start"])+v
                                    if k == "硕士": 
                                        token_dict["bio_start"] = 23
                                        end_year = int(token_dict["bio_start"])+v
                                    if k == "博士": 
                                        token_dict["bio_start"] = 30
                                        end_year = int(token_dict["bio_start"])+v    
                            
                        token_dict["bio_end"] = str(end_year)

                    if not token_dict["bio_start"]:

                        start_year = int(token_dict["bio_end"])
                        for k, v in length_dict.items():
                            if k in token_dict["c_degree"]:
                                start_year -= v
                        if start_year == int(token_dict["bio_end"]):
                            start_year -= 2
                        token_dict["bio_start"] = str(start_year)
                    
                    # 2. verify the acronym, abbreviation, or synonym
                    if not abbr_limit:
                        token_dict["orgs"] = check_abbr(token_dict["orgs"], engine="wikipedia")
                    else:
                        if len(token_dict["orgs"]) <= abbr_limit:
                            token_dict["orgs"] = check_abbr(token_dict["orgs"], engine="wikipedia")
                    
                    # 3. fill the missing or unspecific location
                    if not token_dict["place"] or token_dict["place"]=="中国":
                        token_dict["place"] = find_loc(token_dict["orgs"], engine="wikipedia")
                    
                bio_list.append(token_dict)
                
            if return_type=="work" and all(item not in token_dict[experience_key] for item in degree_list):     
                
                position_list = []
                for item in gov_list:
                    if item in token_dict[experience_key]:
                        position_list.append(item)
                token_dict[rank_newcol] = "/".join(position_list)
                
                seniorlevel_list = []
                for item in senior_list:
                    if item in token_dict[experience_key]:
                        seniorlevel_list.append(item)
                token_dict[senior_newcol] = "/".join(seniorlevel_list)
                        
                for col in df.columns:
                    if not col.startswith(bio_col):
                        token_dict[col] = df[col].iloc[idx]
           
                if fillna:
                
                    # 1. fill the start/end year
                    if not token_dict["bio_start"]: # starting year missing
                        try:
                            token_dict["bio_start"] = df[token_col].iloc[idx][tokendict_idx-1]["bio_end"]
                        except:
                            if not token_dict[senior_newcol]:
                                token_dict["bio_start"] = str(int(token_dict[name_suff+"birth"])+25)
                            else:
                                token_dict["bio_start"] = str(int(token_dict[name_suff+"birth"])+35)
                            
                    if not token_dict["bio_end"]: # end year missing
                        try:
                            token_dict["bio_end"] = df[token_col].iloc[idx][tokendict_idx+1]["bio_start"]
                        except:
                            if not token_dict[senior_newcol]:
                                token_dict["bio_end"] = str(int(token_dict[name_suff+"birth"])+35)
                            else:
                                token_dict["bio_end"] = str(int(token_dict[name_suff+"birth"])+55)
                    
                    # 2. verify the acronym, abbreviation, or synonym
                    if not abbr_limit:
                        token_dict["orgs"] = check_abbr(token_dict["orgs"], engine="wikipedia")
                    else:
                        if len(token_dict["orgs"]) <= abbr_limit:
                            token_dict["orgs"] = check_abbr(token_dict["orgs"], engine="wikipedia")
                    
                    # 3. fill the missing or unspecific location
                    if not token_dict["place"] or token_dict["place"]=="中国":
                        token_dict["place"] = find_loc(token_dict["orgs"], engine="wikipedia")

                bio_list.append(token_dict)

            
    bio_df = pd.DataFrame(bio_list)
    
    return bio_df

```


```python
test_df_c = df_c.sample(n=3, random_state=1)
test_df_c
```




<div style="height:400px;overflow:auto;">
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>stockid</th>
      <th>firm_name</th>
      <th>c_tenure</th>
      <th>c_name</th>
      <th>start_chair</th>
      <th>end_chair</th>
      <th>c_gender</th>
      <th>c_nation</th>
      <th>c_max_degree</th>
      <th>c_birth</th>
      <th>c_bio</th>
      <th>c_biotoken</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>80</th>
      <td>600455.SH</td>
      <td>博通股份</td>
      <td>第6任(现任)</td>
      <td>王萍</td>
      <td>2015-03-23</td>
      <td>2017-08-27</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1975</td>
      <td>王萍,女,1975年10月出生,中共党员,硕士研究生学历,会计师.1998年7月西北大学会计...</td>
      <td>[{'bio_start': '', 'bio_end': '1998', 'c_exper...</td>
    </tr>
    <tr>
      <th>84</th>
      <td>300023.SZ</td>
      <td>宝德股份</td>
      <td>第1任(现任)</td>
      <td>赵敏</td>
      <td>2009-04-28</td>
      <td>2018-08-02</td>
      <td>男</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1957</td>
      <td>赵敏先生:1957年12月出生,高级工程师,中国国籍,无其他国家或地区永久居留权。1982年...</td>
      <td>[{'bio_start': '', 'bio_end': '1982', 'c_exper...</td>
    </tr>
    <tr>
      <th>33</th>
      <td>300300.SZ</td>
      <td>汉鼎股份</td>
      <td>第1任(现任)</td>
      <td>吴艳</td>
      <td>2010-04-01</td>
      <td>--</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1981</td>
      <td>吴艳,女,董事长,1981年出生,硕士,经济师。2009年6月至2010年4月任汉鼎信息科技...</td>
      <td>[{'bio_start': '2009', 'bio_end': '2010', 'c_e...</td>
    </tr>
  </tbody>
</table>
</div>




```python
df_edu_c = expand_bio(test_df_c, cv_type="chairman", return_type="edu", engine="wikipedia", abbr_limit=3)
df_edu_c
```

<div style="height:400px;overflow:auto;">
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>bio_start</th>
      <th>bio_end</th>
      <th>c_experience</th>
      <th>orgs</th>
      <th>place</th>
      <th>c_degree</th>
      <th>stockid</th>
      <th>firm_name</th>
      <th>c_tenure</th>
      <th>c_name</th>
      <th>start_chair</th>
      <th>end_chair</th>
      <th>c_gender</th>
      <th>c_nation</th>
      <th>c_max_degree</th>
      <th>c_birth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1994</td>
      <td>1998</td>
      <td>1998年7月西北大学会计学专业本科毕业</td>
      <td>西北大学</td>
      <td>陕西省/西安市/碑林区</td>
      <td>本科</td>
      <td>600455.SH</td>
      <td>博通股份</td>
      <td>第6任(现任)</td>
      <td>王萍</td>
      <td>2015-03-23</td>
      <td>2017-08-27</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1975</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2008</td>
      <td>2010</td>
      <td>2010年7月香港理工大学工商管理硕士毕业</td>
      <td>香港理工大学</td>
      <td>香港特别行政区</td>
      <td>硕士</td>
      <td>600455.SH</td>
      <td>博通股份</td>
      <td>第6任(现任)</td>
      <td>王萍</td>
      <td>2015-03-23</td>
      <td>2017-08-27</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1975</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1978</td>
      <td>1982</td>
      <td>1982年1月毕业于西安理工大学自动化专业获工学学士学位</td>
      <td>西安理工大学</td>
      <td>陕西省/西安市</td>
      <td>本科</td>
      <td>300023.SZ</td>
      <td>宝德股份</td>
      <td>第1任(现任)</td>
      <td>赵敏</td>
      <td>2009-04-28</td>
      <td>2018-08-02</td>
      <td>男</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1957</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1990</td>
      <td>1992</td>
      <td>1992年7月毕业于重庆大学自动化专业获得工学硕士学位</td>
      <td>重庆大学</td>
      <td>重庆市</td>
      <td>硕士</td>
      <td>300023.SZ</td>
      <td>宝德股份</td>
      <td>第1任(现任)</td>
      <td>赵敏</td>
      <td>2009-04-28</td>
      <td>2018-08-02</td>
      <td>男</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1957</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2006</td>
      <td>2008</td>
      <td>2008年12月毕业于清华大学EMB获得工商管理硕士学位</td>
      <td>清华大学</td>
      <td>北京市/海淀区</td>
      <td>硕士</td>
      <td>300023.SZ</td>
      <td>宝德股份</td>
      <td>第1任(现任)</td>
      <td>赵敏</td>
      <td>2009-04-28</td>
      <td>2018-08-02</td>
      <td>男</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1957</td>
    </tr>
  </tbody>
</table>
</div>




```python
df_work_c = expand_bio(test_df_c, cv_type="chairman", return_type="work", engine="wikipedia", abbr_limit=3)
df_work_c
```

<div style="height:400px;overflow:auto;">
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>bio_start</th>
      <th>bio_end</th>
      <th>c_experience</th>
      <th>orgs</th>
      <th>place</th>
      <th>c_rank</th>
      <th>c_senior</th>
      <th>stockid</th>
      <th>firm_name</th>
      <th>c_tenure</th>
      <th>c_name</th>
      <th>start_chair</th>
      <th>end_chair</th>
      <th>c_gender</th>
      <th>c_nation</th>
      <th>c_max_degree</th>
      <th>c_birth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1998</td>
      <td>2011</td>
      <td>1998年7月参加工作先后任职于西安交通大学产业集团总公司财务部会计西安交大思源科技股份有限...</td>
      <td>西安交大博通资讯股份有限公司/西安交通大学产业集团总公司财务部会计西安交大思源科技股份有限公...</td>
      <td>陕西省/西安市</td>
      <td>部长</td>
      <td>部长</td>
      <td>600455.SH</td>
      <td>博通股份</td>
      <td>第6任(现任)</td>
      <td>王萍</td>
      <td>2015-03-23</td>
      <td>2017-08-27</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1975</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2011</td>
      <td>2010</td>
      <td>2011年6月30日分别被选举为西安交大博通资讯股份有限公司第二届第三届第四届董事会董事</td>
      <td>西安交大博通资讯股份有限公司</td>
      <td>陕西省/西安市</td>
      <td></td>
      <td></td>
      <td>600455.SH</td>
      <td>博通股份</td>
      <td>第6任(现任)</td>
      <td>王萍</td>
      <td>2015-03-23</td>
      <td>2017-08-27</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1975</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2010</td>
      <td>2010</td>
      <td>2010年9月10日担任西安交通大学城市学院第二届董事会董事</td>
      <td>西安交通大学城市学院</td>
      <td>陕西省/西安市</td>
      <td></td>
      <td></td>
      <td>600455.SH</td>
      <td>博通股份</td>
      <td>第6任(现任)</td>
      <td>王萍</td>
      <td>2015-03-23</td>
      <td>2017-08-27</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1975</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1982</td>
      <td>1995</td>
      <td>1982年至1995年任西安重型机械研究所高级工程师从事工业自动化设计工作参加多项国家重点科...</td>
      <td>西安重型机械研究所</td>
      <td>陕西省/西安市</td>
      <td></td>
      <td></td>
      <td>300023.SZ</td>
      <td>宝德股份</td>
      <td>第1任(现任)</td>
      <td>赵敏</td>
      <td>2009-04-28</td>
      <td>2018-08-02</td>
      <td>男</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1957</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1995</td>
      <td>1996</td>
      <td>1995年至1996年任中外合资德马格冶金设备技术有限公司电气总工</td>
      <td>中外合资德马格冶金设备技术有限公司</td>
      <td>上海市/浦东新区</td>
      <td></td>
      <td></td>
      <td>300023.SZ</td>
      <td>宝德股份</td>
      <td>第1任(现任)</td>
      <td>赵敏</td>
      <td>2009-04-28</td>
      <td>2018-08-02</td>
      <td>男</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1957</td>
    </tr>
    <tr>
      <th>5</th>
      <td>1997</td>
      <td>2000</td>
      <td>1997年至2000年任西安伟德控制工程有限责任公司总经理</td>
      <td>西安伟德控制工程有限责任公司</td>
      <td>陕西省/西安市</td>
      <td></td>
      <td></td>
      <td>300023.SZ</td>
      <td>宝德股份</td>
      <td>第1任(现任)</td>
      <td>赵敏</td>
      <td>2009-04-28</td>
      <td>2018-08-02</td>
      <td>男</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1957</td>
    </tr>
    <tr>
      <th>6</th>
      <td>2001</td>
      <td>1992</td>
      <td>2001年与邢连鲜女士创立西安宝德自动化股份有限公司历任总经理执行董事现任西安宝德自动化股份...</td>
      <td>西安宝德自动化股份有限公司</td>
      <td>陕西省/西安市</td>
      <td></td>
      <td></td>
      <td>300023.SZ</td>
      <td>宝德股份</td>
      <td>第1任(现任)</td>
      <td>赵敏</td>
      <td>2009-04-28</td>
      <td>2018-08-02</td>
      <td>男</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1957</td>
    </tr>
    <tr>
      <th>7</th>
      <td>2009</td>
      <td>2010</td>
      <td>2009年6月至2010年4月任汉鼎信息科技股份有限公司董事</td>
      <td>汉鼎信息科技股份有限公司</td>
      <td>浙江省/杭州市</td>
      <td></td>
      <td></td>
      <td>300300.SZ</td>
      <td>汉鼎股份</td>
      <td>第1任(现任)</td>
      <td>吴艳</td>
      <td>2010-04-01</td>
      <td>--</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1981</td>
    </tr>
    <tr>
      <th>8</th>
      <td>2010</td>
      <td>2010</td>
      <td>2010年4月至今任汉鼎信息科技股份有限公司董事长</td>
      <td>汉鼎信息科技股份有限公司</td>
      <td>浙江省/杭州市</td>
      <td></td>
      <td></td>
      <td>300300.SZ</td>
      <td>汉鼎股份</td>
      <td>第1任(现任)</td>
      <td>吴艳</td>
      <td>2010-04-01</td>
      <td>--</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1981</td>
    </tr>
    <tr>
      <th>9</th>
      <td>2010</td>
      <td>2010</td>
      <td>2010年6月至2010年12月任浙江汉爵科技有限公司总经理</td>
      <td>浙江汉爵科技有限公司</td>
      <td>浙江省</td>
      <td></td>
      <td></td>
      <td>300300.SZ</td>
      <td>汉鼎股份</td>
      <td>第1任(现任)</td>
      <td>吴艳</td>
      <td>2010-04-01</td>
      <td>--</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1981</td>
    </tr>
    <tr>
      <th>10</th>
      <td>2010</td>
      <td>2012</td>
      <td>2010年6月至今任浙江汉爵科技有限公司执行董事</td>
      <td>浙江汉爵科技有限公司</td>
      <td>浙江省</td>
      <td></td>
      <td></td>
      <td>300300.SZ</td>
      <td>汉鼎股份</td>
      <td>第1任(现任)</td>
      <td>吴艳</td>
      <td>2010-04-01</td>
      <td>--</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1981</td>
    </tr>
    <tr>
      <th>11</th>
      <td>2012</td>
      <td>2013</td>
      <td>2012年9月至今任上海汉鼎信息技术有限公司董事</td>
      <td>上海汉鼎信息技术有限公司</td>
      <td>上海市</td>
      <td></td>
      <td></td>
      <td>300300.SZ</td>
      <td>汉鼎股份</td>
      <td>第1任(现任)</td>
      <td>吴艳</td>
      <td>2010-04-01</td>
      <td>--</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1981</td>
    </tr>
    <tr>
      <th>12</th>
      <td>2013</td>
      <td>2014</td>
      <td>2013年10月至今浙江汉动信息科技有限公司董事长</td>
      <td>浙江汉动信息科技有限公司</td>
      <td></td>
      <td></td>
      <td></td>
      <td>300300.SZ</td>
      <td>汉鼎股份</td>
      <td>第1任(现任)</td>
      <td>吴艳</td>
      <td>2010-04-01</td>
      <td>--</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1981</td>
    </tr>
    <tr>
      <th>13</th>
      <td>2014</td>
      <td>2014</td>
      <td>2014年8月至今任浙江搜道网络技术有限公司董事</td>
      <td>浙江搜道网络技术有限公司</td>
      <td>浙江省</td>
      <td></td>
      <td></td>
      <td>300300.SZ</td>
      <td>汉鼎股份</td>
      <td>第1任(现任)</td>
      <td>吴艳</td>
      <td>2010-04-01</td>
      <td>--</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1981</td>
    </tr>
    <tr>
      <th>14</th>
      <td>2014</td>
      <td>2014</td>
      <td>2014年10月任汉鼎国际发展有限公司首任董事</td>
      <td>汉鼎国际发展有限公司</td>
      <td>北京市/海淀区</td>
      <td></td>
      <td></td>
      <td>300300.SZ</td>
      <td>汉鼎股份</td>
      <td>第1任(现任)</td>
      <td>吴艳</td>
      <td>2010-04-01</td>
      <td>--</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1981</td>
    </tr>
    <tr>
      <th>15</th>
      <td>2014</td>
      <td>2012</td>
      <td>2014年2月任汉鼎宇佑集团有限公司董事</td>
      <td>汉鼎宇佑集团有限公司</td>
      <td></td>
      <td></td>
      <td></td>
      <td>300300.SZ</td>
      <td>汉鼎股份</td>
      <td>第1任(现任)</td>
      <td>吴艳</td>
      <td>2010-04-01</td>
      <td>--</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1981</td>
    </tr>
    <tr>
      <th>16</th>
      <td>2012</td>
      <td>2016</td>
      <td>2012年12月至今任浙江汉鼎宇佑影视传媒有限公司执行董事</td>
      <td>浙江汉鼎宇佑影视传媒有限公司</td>
      <td>浙江省</td>
      <td></td>
      <td></td>
      <td>300300.SZ</td>
      <td>汉鼎股份</td>
      <td>第1任(现任)</td>
      <td>吴艳</td>
      <td>2010-04-01</td>
      <td>--</td>
      <td>女</td>
      <td>中国</td>
      <td>硕士</td>
      <td>1981</td>
    </tr>
  </tbody>
</table>
</div>



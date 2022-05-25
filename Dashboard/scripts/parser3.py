#!/usr/bin/env python
# coding: utf-8

from bs4 import BeautifulSoup
import pandas as pd
import requests
import time
import re

url = ('http://www.imdb.com/search/title?count=200&view=simple'
       '&boxoffice_gross_us=1,&title_type=feature&release_date={year}')

headers = {
    'Accept-Language': 'en-US',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}


def get_movies(year):
    '''Get list of movies released in <year>.'''
    movies_html = requests.get(url.format(year=year), headers=headers).content
    soup = BeautifulSoup(movies_html, 'html.parser')
    movies = soup.find_all('a', href=re.compile('adv_li_tt'))

    return ['http://www.imdb.com' + m['href'] for m in movies]


def go_to_movie(url):
    '''Get IMDb page of a movie.'''
    movie_html = requests.get(url, headers=headers).content

    return movie_html


def get_genre(soup):
    genres = {'genre1': '',
        'genre2': '',
        'genre3': '',
        'genre4': '',
        'genre5':''}
    wrapper = soup.find('div', {'data-testid': re.compile('genres')})
    idx=1
    if wrapper:
        genre_list = wrapper.find_all('span')
        for genre in genre_list:
            key = 'genre'+str(idx)
            genres[key]=genre.text
            idx=idx+1
    return genres
        

def get_votes(soup):
    try:
        wrapper = soup.find('div', {'class': re.compile('sc-7ab21ed2-3 dPVcnq')}).text
    except AttributeError:
        return None

    if 'K' in wrapper:
        votes = float(wrapper.replace('K', '')) * 1000
    elif 'M' in wrapper:
        votes = float(wrapper.replace('M', '')) * 1000000
    else:
        votes = float(wrapper)
    return votes


def get_money(soup, type):
    try:
        wrapper = soup.find('span', text=type).findNext('div')
        money = wrapper.find('span').text

        return money
    except AttributeError:
        return None


def get_company(soup):
    wrapper = soup.find('a', text='Production companies')

    if not wrapper:
        wrapper = soup.find('a', text='Production company')

    try:
        company = wrapper.findNext('div').find('a').text
    except AttributeError:
        return None

    return company


def get_release_date(soup):
    try:
        wrapper = soup.find('a', text='Release date').findNext('div')
        release_date = wrapper.find('a').text

        return release_date
    except AttributeError:
        return None


def get_runtime(soup):
    try:
        wrapper = soup.find('span', text='Runtime').findNext('div')
    except AttributeError:
        return None
    runtime = wrapper.text.split()
    #runtime = wrapper.find('span').text.split()
    if len(runtime) >=3:
        hours = int(runtime[0].replace('h', '')) * 60
        #minutes = int(runtime[1].replace('min', ''))
        minutes = int(runtime[2].replace('min', ''))

        return hours + minutes
    elif 'h' in runtime[1]:
        return int(runtime[0]) * 60
    elif 'min' in runtime[1]:
        return int(runtime[0])


def get_star(soup):
    stars = {'star1': '',
        'star2': '',
        'star3': '',
        'star4': '',
        'star5':''}
    wrapper = soup.find('a', text='Stars')
    if not wrapper:
        wrapper = soup.find('a', text='Star')
    if not wrapper:
        wrapper = soup.find('span', text='Stars')
    if not wrapper:
        wrapper = soup.find('span', text='Star')
    try:
        ul = wrapper.findNext('ul')
        stars_href = ul.find_all('a')
        idx = 1
        for star in stars_href:
            key = 'star'+str(idx)
            stars[key]=star.text
            idx=idx+1
        return stars
    except AttributeError:
        return None

    try:
        return wrapper.find('a').text
    except AttributeError:
        return None


def get_writer(soup):
    try:
        writer = soup.find('a', {'href': re.compile('tt_ov_wr')}).text
    except AttributeError:
        return None

    if writer == 'Writers':
        try:
            wrapper = soup.find('a', text='Writers').findNext('div')
        except AttributeError:
            wrapper = soup.find('span', text='Writers').findNext('div')
        writer = wrapper.find('a').text

    return writer


def get_country(soup):
    wrapper = soup.find('span', text='Country of origin')
    if not wrapper:
        wrapper = soup.find('span', text='Countries of origin')

    try:
        wrapper = wrapper.findNext('div')
    except AttributeError:
        return None

    try:
        return wrapper.find('a').text
    except AttributeError:
        return None


def get_score(soup):
    wrapper = soup.find('div', {'data-testid': re.compile('hero-rating-bar__aggregate-rating__score')})
    if wrapper:
        score = wrapper.find('span').text
        return score
    #wrapper = soup.find('span', {'class': re.compile('RatingScore')})
    if not wrapper:
        return None
    else:
        return float(wrapper.text)


def scrap_titlebar(soup, year):
    '''Get name, rating, genre, year, release date, score and votes of a movie.'''
    #name = soup.find('h1', {'class': re.compile('TitleHeader')}).text.strip()
    name = soup.find('h1', {'data-testid': re.compile('hero-title-block__title')}).text.strip()
    # genre = get_genre(soup)
    score = get_score(soup)
    votes = get_votes(soup)
    released = get_release_date(soup)
    try:
        rating = soup.find('a', {'href': re.compile('tt_ov_pg')}).text
    except AttributeError:
        rating = None

    titlebar = {
        'name': name,
        'rating': rating,
        # 'genre': genre,
        'year': year,
        'released': released,
        'score': score,
        'votes': votes
    }

    return titlebar


def scrap_crew(soup):
    '''Get director, writer and star of a movie.'''
    try:
        director = soup.find('a', {'href': re.compile('tt_ov_dr')}).text
    except AttributeError:
        director = None
    writer = get_writer(soup)
    #star = get_star(soup)
    #print(star)

    crew = {
        'director': director,
        'writer': writer,
        #'star': star
    }

    return crew


def scrap_details(soup):
    '''Get country, budget, gross, production co. and runtime of a movie.'''
    country = get_country(soup)
    gross = get_money(soup, type='Gross worldwide')
    budget = get_money(soup, type='Budget')
    company = get_company(soup)
    runtime = get_runtime(soup)
    if budget:
        if not '$' in budget:
            budget = None
        else:
            try:
                budget = float(budget.split()[0].replace('$', '').replace(',', ''))
            except ValueError:
                budget = None

    if gross:
        gross = float(gross.replace('$', '').replace(',', ''))

    details = {
        'country': country,
        'budget': budget,
        'gross': gross,
        'company': company,
        'runtime': runtime
    }

    return details


def scrap_accolades(soup):
    '''Get name, rating, genre, year, release date, score and votes of a movie.'''
    winsnum = 0
    nominationsnum = 0
    try:
        winsstr = soup.find('div', {'data-testid': re.compile('awards')}).text.strip()
    except AttributeError:
        winsstr = None
    if winsstr:
        wins_nospace = ''.join(winsstr.split())
        wins=re.findall(r"(\d+)wins", wins_nospace)

        if wins:
            winsnum = int(wins[0])

        nominations=re.findall(r"(\d+)nominations", wins_nospace)
        if nominations:
            nominationsnum = int(nominations[0])
    accolades = {
        'wins': winsnum,
        'nominations':nominationsnum,
    }

    return accolades



def write_csv(data, name = 'moviesnew.csv' ):
    '''Write list of dicts to csv.'''
    df = pd.DataFrame(data)
    df.to_csv(name, index=False)


def getmoviesdata(start, end):
    for year in range(start, end):
        all_movie_data = []
        movies = get_movies(year)
        for movie_url in movies:
            try:
                movie_data = {}
                movie_html = go_to_movie(movie_url)
                soup = BeautifulSoup(movie_html, 'html.parser')
                movie_data.update(scrap_titlebar(soup, year))
                movie_data.update(scrap_crew(soup))
                movie_data.update(scrap_details(soup))
                movie_data.update(scrap_accolades(soup))
                movie_data.update(get_genre(soup))
                movie_data.update(get_star(soup))
                #print(movie_data)
                all_movie_data.append(movie_data)
                # time.sleep(1)
            except Exception as e:
                print(year, movie_url)
                quit()
        print(year, 'done.')
        write_csv(all_movie_data, name='moviesnew%d.csv'%(year))


# from parser3 import *
getmoviesdata(1975, 1977)
# getmoviesdata(1983, 1984)
# getmoviesdata(1984, 1991)
# getmoviesdata(1991, 1998)
# getmoviesdata(1998, 2005)
# getmoviesdata(2005, 2012)
# getmoviesdata(2012, 2023)
# getmoviesdata(2021, 2023)




# https://github.com/danielgrijalva/movie-stats/blob/master/Kernels/5%20Day%20Data%20Challenge%2C%20Day%204.ipynb
# https://www.imdb.com/interfaces/
# https://www.kaggle.com/datasets/unanimad/the-oscar-award
# https://www.kaggle.com/danielgrijalvas/movies
# https://d3-graph-gallery.com/graph/choropleth_hover_effect.html
# https://www.informationisbeautiful.net/visualizations/the-hollywood-insider/
# https://d3-graph-gallery.com/graph/line_brushZoom.html
# https://d3-graph-gallery.com/graph/choropleth_hover_effect.html
# https://d3-graph-gallery.com/line.html

from os.path import exists
import pandas
import pickle
from difflib import SequenceMatcher
import numpy as np 


def normalize(X):
	return (X - X.mean()) / X.std()


def normalize2(X):
	return X - X.min() 

def normalize3(X):
	return (X - X.min()) / (X.max() - X.min())


def saving_pickle(data, file_name):
    pickle.dump(data, open(file_name + ".p", 'wb'))

    
def loading_pickle(file_name):
    return pickle.load(open(file_name + ".p", 'rb'))
       

def computing_accolades(looping, name, dict, year, winner, win=None, film_dest=None ):
	for row in looping.iterrows():		
		d = row[1][name]
		film_src=row[1]['name'] 
		if d:
			if d in winner:
				if d not in dict[year][name] :
					dict[year][name][d] = [0,0]					
				dict[year][name][d][1] += 1
				if win == "true":
					dict[year][name][d][0] += 1
			else:
				match = SequenceMatcher(None, winner, d)
				match_ratio = match.ratio()
				if film_dest and film_src:
					match_film = SequenceMatcher(None, film_src, film_dest)
					film_ratio = match_film.ratio()
				else:
					film_ratio = 1
				if match_ratio > 0.75:
					if match_ratio >= 0.95 and film_ratio >= 0.95  :
						if d not in dict[year][name] :
							dict[year][name][d] = [0,0]					
						dict[year][name][d][1] += 1
						if win == "true":
							dict[year][name][d][0] += 1
					elif film_ratio >= 0.96:
						if d not in dict[year][name] :
							dict[year][name][d] = [0,0]					
						dict[year][name][d][1] += 1
						if win == "true":
							dict[year][name][d][0] += 1
					else:
						if match_film.ratio() > 0.5:
							print(winner,"-" ,film_dest, "\t", d, "-", film_src, match.ratio(), match_film.ratio())


def load_accolades(name="director", loading=False):
	if loading:
		accolades  = loading_pickle("data/accolades")
	X_director = []
	director_dict = {}
	all_directors = None
	for year in range(1970, 2022):
		affected_rows = year +1 
		last_set = []
		for director in accolades[year][name]:
			last_set.append(director)
			if director not in director_dict:
				director_dict[director] = [0,0]
			director_dict[director][0] += accolades[year][name][director][0]
			director_dict[director][1] += accolades[year][name][director][1]
			X_director.append([affected_rows, director, director_dict[director][0], director_dict[director][1]])
		if year == 1970:
			all_directors = set(last_set)
		else:
			for director in all_directors:
				if director in last_set:
					continue
				else:
					X_director.append([affected_rows, director, director_dict[director][0], director_dict[director][1]])
			all_directors= all_directors.union(set(last_set))
	X_director = pandas.DataFrame (X_director, columns = ['year', name, "%s_win"%(name), "%s_nomination"%(name)])
	return X_director


def convert_dtypes(df, floating, strings, integer):
	for col in floating:
		df = df[df[col] != "Unknown"]
		df[col] = df[col].astype(float)
	for col in strings:
		if col != "name" and col not in "country":
			df[col] = df[col].astype(str).str.lower().str.strip().str.replace('é','e')
			df = df[df[col] != "Unknown"]
	for col in ["country", "name"]:
		df[col] = df[col].astype(str).str.strip().str.replace('é','e')
	for col in integer:
		df = df[df[col] != "Unknown"]
		# df[col] = df[col].astype(str).astype(float).astype('Int64')
		df[col] = df[col].astype(str).astype(float)
	return df


def handle_accolades(X):
	X["accolades"] = X['writer_nomination']
	X["accolades"] += X['star1_nomination']
	X["accolades"] += X['director_nomination']
	X["accolades"] += X['star2_nomination']
	X["accolades"] += X['star3_nomination']
	X["accolades"] +=  2 * X['writer_win']
	X["accolades"] +=  2 * X['director_win']
	X["accolades"] +=  2 * X['star1_win']
	X["accolades"] +=  2 * X['star2_win']
	X["accolades"] +=  2 * X['star3_win']
	X = X.drop(['writer_nomination', 'star1_nomination', 'director_nomination'], 1)
	X = X.drop(['star2_nomination', 'star3_nomination'], 1)	
	X = X.drop(['writer', 'star1', 'director', 'star2', 'star3'],1) 	
	X = X.drop(['director_win', 'writer_win', 'star1_win', 'star2_win', 'star3_win'],1) 	
	return X



def handle_budget_profit_nominations(X):
	X.dropna(subset=["budget"], how='all', inplace=True)
	# X["budget"].min()
	# X["budget"].max()
	# 50.0
	# 356 000 000.0
	X['nominations'] = X['nominations'] + 2 * X['wins']
	X['nominations'] = np.log(X['nominations'] + 1)
	# X['nominations'].min()
	# X['nominations'].max()
	# X['nominations'].describe()
	# X.dropna(subset=["profit"], how='all', inplace=True)
	X["profit"] = X["profit"].fillna(0)
	X["profit"]  = X["profit"] / X ["profit"].max()
	X["nature_profit"] = 0 
	X["nature_profit"][X["profit"] > 0]  = 1
	X["nature_profit"][X["profit"] < 0]  = -1
	X['nominations'] = normalize3(X['nominations'])
	X["profit"] = normalize3(X["profit"])
	X["budget_category"] = 0
	filter = (X["budget"] <= 3000000)
	X.loc[X[  filter  ].index , "budget_category"] = 0
	filter = (X["budget"] <= 10000000) & (X["budget"] > 3000000)
	X.loc[X[  filter  ].index , "budget_category"] = 1
	filter = (X["budget"] > 10000000) & (X["budget"] <= 20000000)
	X.loc[X[  filter  ].index , "budget_category"] = 2
	filter = (X["budget"] > 20000000) & (X["budget"] <= 50000000)
	X.loc[X[  filter  ].index , "budget_category"] = 3
	filter = (X["budget"] > 50000000) 
	X.loc[X[  filter  ].index , "budget_category"] = 4
	X["budget"] = np.log(X["budget"])
	# budget_data[budget_data["budget_category"] == 0]["budget"].min()
	# budget_data[budget_data["budget_category"] == 0]["budget"].max()
	# X['nominations'].max()
	# X['nominations'].min()
	# X["profit"].max()
	# X["profit"].min()
	X = X.drop(['gross', 'wins'],1)
	return X 



def handle_genre(X):
	count_of_genres1 = X.groupby("genre1").count()["score"]
	count_of_genres2 = X.groupby("genre2").count()["score"]
	count_of_genres3 = X.groupby("genre3").count()["score"]
	nrows = count_of_genres1.sum()
	genres = set(count_of_genres1.index).union(set(count_of_genres2.index)).union(set(count_of_genres3.index))
	total ={}
	for genre in genres:
		total[genre] = 0
		if genre in count_of_genres1:
			total[genre] += count_of_genres1[genre] 
		if genre in count_of_genres2:
			total[genre] += count_of_genres2[genre] 
		if genre in count_of_genres3:
			total[genre] += count_of_genres3[genre] 
	del total['nan']
	removable = []
	for genre in total:
		if total[genre] < nrows * .02:
			print(genre)
			removable.append(genre)
	X = X[~X["genre1"].isin(removable)]
	X = X[~X["genre2"].isin(removable)]
	X = X[~X["genre3"].isin(removable)]
	X = X.drop(["genre4", "genre5"],1)
	return X , total


def process_genre_summary(df_movies):
	count_of_genres1 = df_movies.groupby("genre1").count()["score"]
	count_of_genres2 = df_movies.groupby("genre2").count()["score"]
	count_of_genres3 = df_movies.groupby("genre3").count()["score"]
	genres = set(count_of_genres1.index).union(set(count_of_genres2.index)).union(set(count_of_genres3.index))
	total ={}
	for genre in genres:
		total[genre] = 0
		if genre in count_of_genres1:
			total[genre] += count_of_genres1[genre] 
		if genre in count_of_genres2:
			total[genre] += count_of_genres2[genre] 
		if genre in count_of_genres3:
			total[genre] += count_of_genres3[genre] 
	print(total)


def handle_companies(X):
	count_of_company = X.groupby("company").count()["score"]
	less_than_two = list(count_of_company[count_of_company <= 2 ].index)
	filter = (X["company"].isin(less_than_two)) 
	X.loc[X[  filter  ].index , "company"] = "less_than_two"
	print(len(X["company"].unique()))
	filter = (count_of_company > 2) & (count_of_company <= 5)
	two_five = list(count_of_company[filter].index)
	filter = (X["company"].isin(two_five))  
	X.loc[X[  filter  ].index , "company"] = "two_five"
	print(len(X["company"].unique()))
	filter = (count_of_company > 5) & (count_of_company <= 10)
	five_ten = list(count_of_company[filter].index)
	filter = (X["company"].isin(five_ten))  
	X.loc[X[  filter  ].index , "company"] = "five_ten"
	print(len(X["company"].unique()))
	return X



def handle_gender(X, load_from_scratch=False):
	if load_from_scratch:
		gender = pandas.read_csv("data/name.basics.tsv", delimiter="\t")
		star1 = X["star1"].unique()
		star2 = X["star2"].unique()
		star3 = X["star3"].unique()
		filter = (gender["primaryName"].isin(star1)) | (gender["primaryName"].isin(star2)) |  (gender["primaryName"].isin(star3)) 
		gender = gender[filter]
		gender = gender[["primaryName", "birthYear", "deathYear", "primaryProfession"]]
		gender.to_csv("data/genderINFO.csv", header='true')
	else:
		gender = pandas.read_csv("data/genderINFO.csv")
	gender_info_dict = {}
	gender = gender.fillna("-1")
	def apply_on_each_row(row):
		if "actor" in row["primaryProfession"]:
			if row["primaryName"] in gender_info_dict:
				gender_info_dict[row["primaryName"]].append("M")
			else:
				gender_info_dict[row["primaryName"]] =["M"]
		elif "actress"	in row["primaryProfession"]:
			if row["primaryName"] in gender_info_dict:
				gender_info_dict[row["primaryName"]].append("F")
			else:
				gender_info_dict[row["primaryName"]] =["F"]
	_ = gender.apply(apply_on_each_row, 1)
	with open("data/male_actors.txt" , "r") as f:
		male_names = f.readlines()	
		for name in male_names:
			gender_info_dict[name.strip()] = 'M'
	with open("data/female_actors.txt" , "r") as f:
		female_names = f.readlines()	
		for name in female_names:
			gender_info_dict[name.strip()] = 'F'
	for ele in gender_info_dict:
		gender_info_dict[ele] = set(gender_info_dict[ele])
		if len(gender_info_dict[ele]) == 1:
			gender_info_dict[ele] = list(gender_info_dict[ele])[0]
		else:
			gender_info_dict[ele] = "-1"
	star1_gender = list(X["star1"].map(gender_info_dict))
	X["star1_gender"] = star1_gender
	# X[X["star1_gender"].isna()]["star1"]
	star2_gender = list(X["star2"].map(gender_info_dict))
	X["star2_gender"] = star2_gender
	# X[X["star2_gender"].isna()]["star2"]
	star3_gender = list(X["star3"].map(gender_info_dict))
	X["star3_gender"] = star3_gender
	# X[X["star3_gender"].isna()]["star3"]
	star1_f_count = list(X["star1_gender"].map({"M":0, "F":1}))
	star2_f_count = list(X["star2_gender"].map({"M":0, "F":1}))
	star3_f_count = list(X["star3_gender"].map({"M":0, "F":1}))
	X["female_count"] = star1_f_count 
	X["female_count"] += star2_f_count
	X["female_count"] += star3_f_count
	X = X.drop(["star1_gender", "star2_gender", "star3_gender"],1)
	return X



def handle_rating_runtime(X):
	count_of_rating = X.groupby("rating").count()["score"]
	ratings = X['rating'].unique()
	nrows = count_of_rating.sum()
	qualified_rating = count_of_rating[count_of_rating > nrows * 0.005]	
	X = X[X["rating"].isin(qualified_rating.index)]
	return X


def profit_normalization_for_size(X):
	X["nature_profit"] = (X["profit"] > 0).replace({False: -1, True: 1})
	X["nature_profit"][X["profit"].isna()] = 0
	X["profit"] = X["profit"].fillna(1e-6) 
	postive_index = (X["nature_profit"] == 1)
	negative_index = (X["nature_profit"] == -1)
	X.loc[negative_index, "profit"] = abs(X.loc[negative_index, "profit"])
	X["profit"] = np.log(X["profit"])
	X[postive_index]["profit"].min()
	X[postive_index]["profit"].max()
	# 13557.0
	# 2610379794.0
	X[negative_index]["profit"].min()
	X[negative_index]["profit"].max()
	# -158031147.0
	# -6478.0
	# cycle_plot_data["profit"][cycle_plot_data["profit"] == cycle_plot_data["profit"].min()]
	# 5985   -158031147.0
	postive_index = postive_index[postive_index].index
	negative_index = negative_index[negative_index].index
	X.loc[postive_index, "profit"] = normalize(X.loc[postive_index, "profit"])	
	X.loc[negative_index, "profit"] = normalize(X.loc[negative_index, "profit"])	
	# X.loc[postive_index, "profit"].min()
	# X.loc[postive_index, "profit"].mean()
	# X.loc[postive_index, "profit"].max()
	# -0.5764060892954515 , 0 , 14.012408535779215, 
	# X.loc[negative_index, "profit"].min()
	# X.loc[negative_index, "profit"].mean()
	# X.loc[negative_index, "profit"].max()
	# -0.9,  0 , 11.436635798664552
	X.loc[postive_index, "profit"] = normalize2(X.loc[postive_index, "profit"])
	X.loc[postive_index, "profit"] +=1e-6
	X.loc[negative_index, "profit"] = normalize2(X.loc[negative_index, "profit"])
	X.loc[negative_index, "profit"] +=1e-6
	# dropping na will remove 1 quater points
	X = X.dropna()
	print(X.corr(), X.loc[postive_index, ["profit", "score"]].corr())



def calculate_supporting_accolades():
	accolades = {}
	for year in range(1970, 2022):
		print(year)
		accolades[year] = {}
		accolades[year]["director"] = {}
		accolades[year]["writer"] = {}
		accolades[year]["star1"] = {}
		accolades[year]["star2"] = {}
		accolades[year]["star3"] = {}
		df_o = df_oscars[df_oscars["year_ceremony"] == year+1]
		df_o= df_o.fillna(0)
		df_m = df_movies[df_movies["year"] == year]
		df_m = df_m.fillna(0)
		df_m_director= df_m[['director', 'name']].drop_duplicates()
		df_m_writer= df_m[['writer', 'name']].drop_duplicates()
		df_m_star1= df_m[['star1', 'name']].drop_duplicates()
		df_m_star2= df_m[['star2', 'name']].drop_duplicates()
		df_m_star3= df_m[['star3', 'name']].drop_duplicates()
		def apply_on_each_row(row):
			computing_accolades(looping=df_m_director, name="director", dict=accolades, year=year, winner=row['name'], win=row['winner'], film_dest=row['film'] )
			computing_accolades(looping=df_m_writer, name="writer", dict=accolades, year=year, winner=row['name'], win=row['winner'], film_dest=row['film'])
			computing_accolades(looping=df_m_star1, name="star1", dict=accolades, year=year, winner=row['name'], win=row['winner'], film_dest=row['film'])
			computing_accolades(looping=df_m_star2, name="star2", dict=accolades, year=year, winner=row['name'], win=row['winner'], film_dest=row['film'])
			computing_accolades(looping=df_m_star3, name="star3", dict=accolades, year=year, winner=row['name'], win=row['winner'],  film_dest=row['film'])
		_ = df_o.apply(apply_on_each_row, 1)
	saving_pickle(accolades, "data/accolades")



############################# load all movies ##########################################
#########################################################################################################
df_movies = None
for year in range(1970, 2023):
	df_year =pandas.read_csv('data/movies/moviesnew%d.csv'%(year))
	if type(df_movies) == type(None):
		df_movies = df_year
	else:
		df_movies = df_movies.append(df_year, ignore_index=True)

df_movies = df_movies.drop(['star4', 'star5'], 1)
print(len(df_movies))
# 8566

############################# handle gender ##########################################
#########################################################################################################
df_movies = handle_gender(df_movies)
print(len(df_movies))
# 8566

############################# Cleanup ##########################################
#########################################################################################################

strings = ['released', 'name', 'rating', 'genre1', 'genre2', 'genre3', 'director', 'writer', 'company', 'country', \
'star1', 'star2', 'star3']
integer = ['year', 'votes', 'runtime', 'wins', 'nominations']
floating = ['score', 'budget', 'gross']
df_movies = convert_dtypes(df_movies, floating, strings, integer)
df_movies['profit'] = df_movies['gross'] - df_movies['budget']
# print(df_movies[['profit', "nominations", "wins", "score"]].corr())
print(len(df_movies))
# 8566

###################################### timeline ######################################
######################################################################################s
df_movies["decade"] = 0
for start in [1970, 1980, 1990, 2000, 2010, 2020]:
	decade = start
	filter = (df_movies["year"] >= start) & (df_movies["year"] < start + 10)
	df_movies.loc[df_movies[  filter  ].index , "decade"] = decade

months_embedding = {'january': "Jan" , 'february':"Feb", 'march':"Mar", 
	'april': "Apr", 'may':"May", 'june': "Jun", 'july':"Jul",
	'august': "Aug", 'september': "Sep", 'october': 'Oct', 'november': 'Nov',
	'december': 'Dec'} 

df_movies.dropna(subset=['released'], how='all', inplace=True)
temp = df_movies["released"].str.split(',', expand=True)[0].str.split(' ', expand=True)
months = list(temp[0].map(months_embedding))
df_movies["months"] = months
# df_movies.groupby(["months"]).count()["name"]
df_movies.dropna(subset=['months'], how='all', inplace=True)
print(len(df_movies))
# 8548

# temp = df_movies["released"].str.split(',', expand=True)[0].str.split(' ', expand=True)
# temp[1] = temp[1].astype(str).astype(float).astype('Int64')
# filter = (temp[1] >= 1) & (temp[1] <= 31)
# temp = temp[filter]
# df_movies = df_movies[filter]
# df_movies["days"] = temp[1]
df_movies = df_movies.drop(["released"], 1)

###################################### acoolades ######################################
######################################################################################
df_oscars =pandas.read_csv("data/the_oscar_award.csv")
df_oscars["winner"] = df_oscars["winner"].astype(str).str.lower().str.strip()
df_oscars["year_film"] = df_oscars["year_film"].astype(str).astype(float).astype('Int64')
df_oscars["year_ceremony"] = df_oscars["year_ceremony"].astype(str).astype(float).astype('Int64')
df_oscars["name"] = df_oscars["name"].astype(str).str.lower().str.strip()
df_oscars["name"] = df_oscars["name"].str.replace('screenplay by','')
df_oscars["name"] = df_oscars["name"].str.replace('written by','')
df_oscars["name"] = df_oscars["name"].str.replace('Score by','')
df_oscars["name"] = df_oscars["name"].str.replace('Music by','')
df_oscars["name"] = df_oscars["name"].str.replace('Lyrics by','')
df_oscars["name"] = df_oscars["name"].str.replace('Adaptation by','')

X_director = load_accolades(name="director", loading= True)
X_writter = load_accolades(name="writer",  loading= True)
X_star1 = load_accolades(name="star1" , loading= True)
X_star2 = load_accolades(name="star2",  loading= True)
X_star3 = load_accolades(name="star3",  loading= True)
temp  = pandas.merge(df_movies, X_director, how="left", on=["director", "year"])
temp = pandas.merge(temp, X_writter, how="left", on=["writer", "year"])
temp = pandas.merge(temp, X_star1, how="left", on=["star1", "year"])
temp = pandas.merge(temp, X_star2, how="left", on=["star2", "year"])
temp = pandas.merge(temp, X_star3, how="left", on=["star3", "year"])
df_movies = temp
# df_movies[["star3", "star3_nomination", "star3_win"]].dropna().drop_duplicates() 
df_movies.loc[df_movies[  df_movies['director_win'].isna()  ].index , "director_win"] = 0
df_movies.loc[df_movies[  df_movies['director_nomination'].isna()  ].index , "director_nomination"] = 0
df_movies.loc[df_movies[  df_movies['writer_win'].isna()  ].index , "writer_win"] = 0
df_movies.loc[df_movies[  df_movies['writer_nomination'].isna()  ].index , "writer_nomination"] = 0
df_movies.loc[df_movies[  df_movies['star3_nomination'].isna()  ].index , "star3_nomination"] = 0
df_movies.loc[df_movies[  df_movies['star3_win'].isna()  ].index , "star3_win"] = 0
df_movies.loc[df_movies[  df_movies['star2_nomination'].isna()  ].index , "star2_nomination"] = 0
df_movies.loc[df_movies[  df_movies['star2_win'].isna()  ].index , "star2_win"] = 0
df_movies.loc[df_movies[  df_movies['star1_nomination'].isna()  ].index , "star1_nomination"] = 0
df_movies.loc[df_movies[  df_movies['star1_win'].isna()  ].index , "star1_win"] = 0

df_movies = df_movies.drop(["year"], 1)
df_movies = handle_accolades(df_movies)
print(len(df_movies))
# 8548

###################################### Profit, Budget, Nominations ######################################
######################################################################################

df_movies = handle_budget_profit_nominations(df_movies)
print(len(df_movies))
# 5978 

###################################### Rating & Runtime ######################################
######################################################################################

df_movies = handle_rating_runtime(df_movies)
print(len(df_movies))
# 5874
############################# Country code assign ##########################################
#########################################################################################################

country_code = pandas.read_csv("data/country_code.csv")
country_code = country_code.drop(["population", "Unnamed: 3"], 1)
country_code = country_code.rename(columns={"name": "country", "id": "country_code"})
country_code["country"] = country_code["country"].astype(str).str.strip()
df_movies = pandas.merge(df_movies, country_code, on=["country"])


countries = df_movies.groupby(["country"]).count()['name']
countries = countries[countries <=2]
to_be_removed = countries.index
filter = ~ (df_movies["country"].isin(to_be_removed))
df_movies = df_movies[filter]
print(len(df_movies))
df_movies = df_movies.drop(['country'], 1)
# 5829


###################################### genre ######################################
######################################################################################

df_movies, total = handle_genre(df_movies)
print(len(df_movies))
# 5615

###################################### Conclusion ######################################
######################################################################################



# Acoolades of movie == 1 * nomination + 2 * win --> log (x + 1) --> standization
# profit of movie == 1/ max profit --> standization

# low budget == <= 3 000 000
# 3,000,000 < low mid budget == <= 10000000
# 10,000,000 < mid budget == <= 20000000
# 20,000,000 < high budget == <= 50000000
# 50,000,000 < high budget 

columns_so_far = ['name', 'country_code', 'profit', 'nominations']
columns_so_far += ['score', 'budget', 'nominations', 'profit', 'accolades', 'budget_category']
columns_so_far += ["score", 'genre1', 'genre2', 'genre3', 'profit', 'nominations']
columns_so_far += ["months", 'profit', 'decade', 'nominations']
columns_so_far += ["female_count", 'profit', 'nominations']
columns_so_far += ['runtime', 'rating', 'profit', 'nominations', "nature_profit"]
columns_so_far = list(set(columns_so_far))
df_movies = df_movies[columns_so_far]

df_movies = df_movies.reset_index().set_index("index")
df_movies = df_movies.dropna()
# df_movies.groupby(["country_code"]).count()["profit"]

# stratified sampling on USA and budget range
us_movies_to_be_removed = df_movies[df_movies["country_code"] == "USA"]
print(len(us_movies_to_be_removed))
us_movies_to_be_removed = us_movies_to_be_removed.groupby('budget_category', group_keys=False).apply(lambda x: x.sample(frac=0.9))
us_movies_to_be_removed = us_movies_to_be_removed.index
filter = ~df_movies.index.isin(us_movies_to_be_removed) 
df_movies = df_movies[filter]
# 3334
print(len(df_movies))

if False:
	df_movies.to_csv("data/movies.csv", header='true')

print(df_movies.corr())

process_genre_summary(df_movies)

import pdb
pdb.set_trace()

filter = (df_movies["budget_category"] == 2) & (df_movies["nominations"] > 0.3 ) & (df_movies["accolades"] > 0.3 ) 
df_movies[filter].drop(["female_count", "budget", "budget_category", "months", "rating", "accolades", 'nature_profit', 'country_code', 'score', 'accolades', 'decade', 'budget_category'],1)

# df_movies[df_movies["country_code"] == "NZL"]
filter = (df_movies["rating"] == "r") & (df_movies["nominations"] > 0.3 ) & (df_movies["decade"] > 2009 )
df_movies[filter].drop(["female_count", "budget", "budget_category", "months", "rating", "accolades", 'nature_profit', 'country_code', 'score', 'accolades', 'decade', 'budget_category'],1)

# Index(['score', 'votes',  'company', 'runtime'


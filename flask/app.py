import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/moviesBechdel.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Samples_Metadata = Base.classes.movies_data
Samples = Base.classes.movies_id
#Bechdel = Base.classes.current_bechdel
Genres = Base.classes.genres_clean


@app.route("/")
def index():
	"""Return the homepage."""
	return render_template("index.html")
	


@app.route("/genres")
def genres():
	"""Return a list of genres."""

	# Use Pandas to perform the sql query
	stmt = db.session.query(Genres).statement.distinct()
	genres = pd.read_sql_query(stmt, db.session.bind)
	
	print(genres)
	
	return jsonify(list(genres.genres))
	
@app.route("/bechdel/<genres>")
def bechdel(genres):
	"""Return the MetaData for bechdel."""
	
	# Use Pandas to perform the sql query
	stmt = db.session.query(Samples_Metadata).statement
	df = pd.read_sql_query(stmt, db.session.bind)
	
	sel = [
		Samples_Metadata.genres,
		Samples_Metadata.id,
		Samples_Metadata.movie_title,
		Samples_Metadata.title_year,
		Samples_Metadata.bechdelRating,
	]
	
	#allBechdelRatings = db.session.query(*sel).all()
	
	results = db.session.query(*sel).filter(Samples_Metadata.genres == genres).all()
	
	# Create a dictionary entry for each row of metadata information
	sample_metadata = {}
	for result in results:
		sample_metadata["genres"] = result[0]
		sample_metadata["imdbid"] = result[1]
		sample_metadata["title"] = result[2]
		sample_metadata["year"] = result[3]
		sample_metadata["bechdelRating"] = result[4]

	#bechdata = {
		#"imdbid": allBechdelRatingsPie.values.tolist(),
		#"title": allBechdelRatingsPie.title.values.tolist(),
		#"year": allBechdelRatingsPie.year.tolist(),
		#"bechdelRating": allBechdelRatingsPie.bechdelRating.tolist(),
	#}

	# Return a list of the column names (sample names)
	print(sample_metadata)
	#return jsonify(bechdata)
	return jsonify(sample_metadata)
	
	#data = {
	#	"bechdelRating": allBechdelRatingsPie.bechdelRating.values.tolist()
	#}
	#return jsonify(allBechdelRatingsPie)


@app.route("/samples/<genres>")
def samples(genres):
	"""Return `otu_ids`, `otu_labels`,and `sample_values`."""
	stmt = db.session.query(Samples_Metadata).statement
	df = pd.read_sql_query(stmt, db.session.bind)

	sel = [
		Samples_Metadata.genres,
		Samples_Metadata.id,
		Samples_Metadata.movie_title,
		Samples_Metadata.title_year,
		Samples_Metadata.gross,
		Samples_Metadata.bechdelRating,
	]


	# Filter the data based on the sample number and
	# only keep rows with values above 1
	sample_data = allBechdelRatings = db.session.query(*sel).all()
	# Sort the data
	#sorted_sample_data = sample_data.sort_values(by=[sample, "id", "label"], ascending=False)
	# Format the data to send as json
	#data = {
		#"otu_ids": sorted_sample_data.id.values.tolist(),
		#"sample_values": sorted_sample_data[sample].values.tolist(),
		#"otu_labels": sorted_sample_data.label.tolist(),
	#}
	return jsonify(sample_data)


if __name__ == "__main__":
	app.run()

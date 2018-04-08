import tweepy
import json
import sys
import flask
from flask_cors import CORS
import numbers

app = flask.Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

def authenticate():
    keys = json.loads(open('./cred.json').read())
    auth = tweepy.OAuthHandler(keys['consumer_key'], keys['consumer_secret'])
    auth.set_access_token(keys['access_token_key'], keys['access_token_secret'])
    return tweepy.API(auth)

@app.route('/data/<query>')
def getData(query):
    coords = []
    try:
        for tweet in tweepy.Cursor(authenticate().search, q=query, count=100).items(2000):
            if tweet.place is not None:
                coords.append(tweet.place.full_name)
        return json.dumps(coords)
    except tweepy.RateLimitError:
        return json.dumps("Whoops, rate limit exceeded!")
    except tweepy.TweepError as err:
        return json.dumps(err.message[0]['message'])

if __name__ == '__main__':
    app.run(debug=False, port=5000)
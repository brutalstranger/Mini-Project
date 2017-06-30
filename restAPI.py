from flask import Flask
print "hi"
app = Flask(__name__)

@app.route("/")
def hello():
    print "!"
    return "Hello World!"


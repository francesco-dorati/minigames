from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
  return render_template('index.html')


@app.route('/tris')
def tris():
  return render_template('tris.html')

# @app.route('/tris/create-lobby', methods=['POST'])
# def tris_create_lobby():


@app.route('/tris/<code>')
def tris_lobby(code):
  return code


if __name__ == 'main':
  app.run()
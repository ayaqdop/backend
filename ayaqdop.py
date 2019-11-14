import os
import json
from uuid import uuid4
from datetime import datetime
from flask import Flask, request, make_response, jsonify, render_template
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get('FLASK_SECRET', 'Secret!')
CORS(app, origins=["http://localhost:8000", "https://ayaqdop.com"], supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins='*', cors_credentials=True)

users = []


@app.route("/")
def home():
    return render_template("index.html", users=users)

@app.route("/uuid", methods=["POST"])
def create_uuid():
    id = str(uuid4())
    users.append({
        "id": id,
        "in_game": False,
        "connection_time": datetime.now()
    })
    response = make_response()
    response.headers.add("Set-Cookie", f"uuid={id}; SameSite=None; Secure")
    return response

@app.route("/init", methods=["POST"])
def init_game():
    with open("game.json", "r") as f:
        game = json.load(f)
    return make_response(game)

@socketio.on("connect")
def connect():
    sid = request.sid
    users.append({
        "id": sid,
        "in_game": False,
        "connection_time": datetime.now()
    })
    socketio.emit("sid", { "sid": sid }, room=sid)
    print("Connected")


@socketio.on('server')
def server(msg):
    socketio.emit('client', msg)


@socketio.on('disconnect')
def disconnect():
    print('Disconnected')


@socketio.on('send_moves')
def move(msg):
    recipient = msg["to"]
    socketio.emit("receive_moves", msg["game"], room=recipient)


if __name__ == "__main__":
    socketio.run(app)

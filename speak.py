from flask import Flask, request, jsonify
from flask_cors import CORS
import pyttsx3

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/speak', methods=['POST'])
def speak():
    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text or len(text.strip()) == 0:
            return jsonify(status="error", message="Text is empty or undefined."), 400

        engine = pyttsx3.init()
        engine.say(text)
        engine.runAndWait()

        return jsonify(status="success", message="Speech played successfully.")
    except Exception as e:
        return jsonify(status="error", message=str(e)), 500

if __name__ == '__main__':
    app.run(port=5002, debug=True)

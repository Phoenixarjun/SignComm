from flask import Flask, request, jsonify
from google import genai
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("API_KEY")



app = Flask(__name__)

# More permissive CORS configuration
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

client = genai.Client(api_key=API_KEY)

@app.route('/gemini', methods=['POST', 'OPTIONS'])
def generate_content():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'success'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
        
    try:
        data = request.get_json()
        words = data.get('prompt', '')
        
        if not words:
            return jsonify({'error': 'No words provided'}), 400
        
        prompt = f"""You are an expert sign language translator. Your task is to:
                    1. Take these individual sign language predictions: {words}
                    2. Combine them into a complete, grammatically correct sentence
                    3. Add appropriate punctuation
                    4. Maintain the original meaning while making it sound natural
                    5. If the words don't form a coherent thought, and make sure that the words are also in the sentece and if you cant make meaning out of it then just make the words as a meaningful sentence if there is words like only hello,peace,me means return like hello Im in peace like that do for other sentence as well and add punctuations to it.
                    6. Output only the final sentence without additional commentary"""
        response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=prompt
        )
        
        result = jsonify({
            'generated_text': response.text,
            'status': 'success'
        })
        result.headers.add('Access-Control-Allow-Origin', '*')
        return result
        
    except Exception as e:
        error = jsonify({
            'error': str(e),
            'status': 'error'
        })
        error.headers.add('Access-Control-Allow-Origin', '*')
        return error, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
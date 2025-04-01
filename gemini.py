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
        
        prompt = f"""You are an expert sign language translator with extensive experience in analyzing and converting sign language predictions into coherent sentences. Your task is to take the following individual sign language predictions and process them according to specified rules to create a grammatically correct sentence.
                    Here are the individual sign language predictions: {words}
                    Analyze the context based on the following rules:

                    If the input contains What/Who/Where/How/When/Why, determine the correct interrogative word suitable for the sentence.
                    If the input specifies Present, Past, or Future, adjust the verb tense accordingly.
                    If the input includes Singular or Plural, use the appropriate verb form (e.g., "is" vs. "are").
                    If the input defines First, Second, or Third Person, apply the correct pronouns and verb agreement (e.g., "I" vs. "He" vs. "They").
                    Combine the words into a complete, grammatically correct sentence with proper punctuation.
                    Maintain the original meaning while making it sound natural.
                    If the words don't form a coherent thought, ensure that the words are still included in the sentence meaningfully.
                    If the input contains only a few unrelated words (e.g., "Hello, Peace, Me"), construct a meaningful short sentence instead (e.g., "Hello, I am at peace.").
                    Output only the final sentence without any additional explanation."""
        
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
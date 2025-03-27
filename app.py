import subprocess
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__, template_folder='./frontend', static_folder='./frontend')
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return render_template('components/sign.html')

@app.route('/run_test', methods=['POST'])
def run_test():
    try:
        # Run sign.py and capture output
        result = subprocess.run(['python', 'sign.py'], capture_output=True, text=True)
        
        if result.returncode == 0:
            sign_output = result.stdout.strip()
            
            # First return sign.py output immediately
            response = jsonify({
                'result': sign_output,
                'status': 'success'
            })
            return response
            
        else:
            return jsonify({
                'error': result.stderr.strip(),
                'status': 'error'
            }), 500
            
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/process_with_gemini', methods=['POST'])
def process_with_gemini():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        
        if not prompt:
            return jsonify({'error': 'No prompt provided', 'status': 'error'}), 400
        
        # Process with Gemini
        gemini_response = requests.post(
            'http://127.0.0.1:5001/gemini',
            json={'prompt': prompt},
            headers={'Content-Type': 'application/json'}
        )
        
        if gemini_response.status_code == 200:
            gemini_data = gemini_response.json()
            return jsonify({
                'generated_text': gemini_data.get('generated_text', ''),
                'status': 'success'
            })
        else:
            return jsonify({
                'error': 'Gemini processing failed',
                'status': 'error'
            }), 500
            
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
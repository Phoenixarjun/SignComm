import subprocess
from flask import Flask, render_template, jsonify

app = Flask(__name__, template_folder='./frontend', static_folder='./frontend')

@app.route('/')
def home():
    return render_template('components/sign.html')  # Ensure correct path

@app.route('/run_test', methods=['POST'])
def run_test():
    try:
        # Run sign.py and capture both output & errors
        result = subprocess.run(['python', 'sign.py'], capture_output=True, text=True)
        
        if result.returncode == 0:
            return jsonify({'result': result.stdout.strip()})
        else:
            return jsonify({'error': result.stderr.strip()}), 500  # Return stderr for debugging
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

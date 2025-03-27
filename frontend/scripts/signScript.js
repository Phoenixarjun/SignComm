const toggleBtn = document.querySelector('.toggle_btn');
const navbar = document.querySelector('.navbar');

toggleBtn.addEventListener('click', function () {
    navbar.classList.toggle('open');
});

// Check for valid result before calling speak.py
document.getElementById('speakerButton').addEventListener('click', function () {
    const resultContainer = document.getElementById('resultContainer');
    const resultText = resultContainer.querySelector('p')?.textContent.trim() || '';

    if (resultText.length > 0) {
        fetch('http://127.0.0.1:5002/speak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: resultText }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Speech played successfully.');
            } else {
                console.error('Error in playing speech:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        resultContainer.innerHTML = `<p style="color: red;">Please generate text before using the speaker.</p>`;
    }
});



document.getElementById('runTestBtn').addEventListener('click', function () {
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.textContent = 'Processing...';

    fetch('/run_test', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        loadingMessage.textContent = '';
        const resultContainer = document.getElementById('resultContainer');
        
        if (data.result) {
            return fetch('http://127.0.0.1:5001/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: data.result }),
            })
            .then(geminiResponse => {
                if (!geminiResponse.ok) throw new Error(`Gemini API error! status: ${geminiResponse.status}`);
                return geminiResponse.json();
            });
        } else {
            resultContainer.innerHTML = `<p style="color: red;">${data.error}</p>`;
            throw new Error(data.error);
        }
    })
    .then(geminiData => {
        const resultContainer = document.getElementById('resultContainer');
        resultContainer.innerHTML = `<p>${geminiData.generated_text}</p>`;
    })
    .catch(error => {
        console.error('Error:', error);
        const resultContainer = document.getElementById('resultContainer');
        resultContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        loadingMessage.textContent = 'Error occurred. Please try again.';
    });
});
const toggleBtn = document.querySelector('.toggle_btn');
const navbar = document.querySelector('.navbar');
const startButton = document.getElementById('startButton');  // Changed from startBtn
const stopButton = document.getElementById('stopButton');    // Changed from stopBtn
const videoContainer = document.querySelector('.video-container');
const resultContainer = document.getElementById('resultContainer');
const loadingMessage = document.getElementById('loadingMessage');
const videoFeed = document.getElementById('videoFeed');
const speakerButton = document.getElementById('speakerButton');

// Toggle navbar for mobile
toggleBtn.addEventListener('click', function () {
    navbar.classList.toggle('open');
});

// Start sign recognition
startButton.addEventListener('click', async function () {
    try {
        loadingMessage.textContent = 'Starting recognition...';
        startButton.disabled = true;
        stopButton.disabled = false;
        
        const response = await fetch('/start_recognition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (data.status === 'started') {
            // Start showing video feed
            videoFeed.src = "/video_feed";
            loadingMessage.textContent = 'Recognition started - perform signs in front of camera';
        } else {
            loadingMessage.textContent = 'Recognition already running';
            startButton.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        loadingMessage.textContent = 'Error starting recognition';
        startButton.disabled = false;
    }
});

// Stop sign recognition and process with Gemini
stopButton.addEventListener('click', async function () {
    try {
        loadingMessage.textContent = 'Processing results...';
        stopButton.disabled = true;
        
        const response = await fetch('/stop_recognition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Stop video feed
            videoFeed.src = "";
            
            // Display results
            console.log(recognized_signs);
            // resultContainer.innerHTML = `
            //     <h3>Recognized Signs:</h3>
            //     <p>${data.recognized_signs || 'No signs recognized'}</p>
            //     <h3>Gemini Response:</h3>
            //     <p>${data.generated_text}</p>
            // `;
            resultContainer.innerHTML = `<p>${data.generated_text}</p>`
            
            // Update translation input if exists
            const fromText = document.querySelector('.from-text');
            if (fromText) {
                fromText.value = data.generated_text;
            }
            
            loadingMessage.textContent = 'Recognition completed';
        } else {
            throw new Error(data.error || 'Unknown error occurred');
        }
    } catch (error) {
        console.error('Error:', error);
        resultContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        loadingMessage.textContent = 'Error processing results';
    } finally {
        startButton.disabled = false;
    }
});

// Text-to-speech functionality
speakerButton.addEventListener('click', function () {
    // Get the last paragraph in resultContainer (Gemini response)
    const resultParagraphs = resultContainer.querySelectorAll('p');
    const resultText = resultParagraphs.length > 0 ? 
        resultParagraphs[resultParagraphs.length - 1].textContent.trim() : '';

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
        resultContainer.innerHTML += `<p style="color: red;">Please generate text before using the speaker.</p>`;
    }
});

// Disable stop button initially
stopButton.disabled = true;
document.addEventListener('DOMContentLoaded', () => {
    const jobDescriptionTextarea = document.getElementById('job-description');
    const analyzeBtn = document.getElementById('analyze-btn');
    const loadingElement = document.getElementById('loading');
    const resultElement = document.getElementById('result');
    const predictionElement = document.getElementById('prediction');
    const confidenceElement = document.getElementById('confidence');

    analyzeBtn.addEventListener('click', async () => {
        const jobDescription = jobDescriptionTextarea.value.trim();
        
        if (!jobDescription) {
            alert('Please enter a job description to analyze.');
            return;
        }

        // Show loading and hide previous results
        loadingElement.classList.remove('hidden');
        resultElement.classList.add('hidden');
        
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: jobDescription }),
            });

            if (!response.ok) {
                throw new Error('Server responded with an error');
            }

            const data = await response.json();
            
            // Update UI with the prediction
            predictionElement.textContent = data.prediction;
            
            // Add appropriate styling based on the prediction
            if (data.prediction === 'Real Job Posting') {
                predictionElement.className = 'real';
            } else {
                predictionElement.className = 'fake';
            }

            // Update confidence information
            let confidenceHtml = `
                <div>Confidence: ${data.confidence}%</div>
                <div>Probabilities:</div>
                <div>Real: ${data.probabilities.real}%</div>
                <div>Fake: ${data.probabilities.fake}%</div>
                <div>Raw Prediction: ${data.raw_prediction}</div>
            `;

            // Add red flags if any were found
            if (data.red_flags && data.red_flags.length > 0) {
                confidenceHtml += `
                    <div class="red-flags">
                        <div class="red-flags-title">Red Flags Detected:</div>
                        <ul>
                            ${data.red_flags.map(flag => `<li>${flag}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            confidenceElement.innerHTML = confidenceHtml;

            // Hide loading and show results
            loadingElement.classList.add('hidden');
            resultElement.classList.remove('hidden');
            
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while analyzing the job description. Please try again.');
            loadingElement.classList.add('hidden');
        }
    });
});

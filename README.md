# Fake Job Posting Detector

This web application uses machine learning to analyze job descriptions and identify potential fake job postings. It's built with Flask for the backend API and vanilla JavaScript for the frontend.

## Features

- Paste any job description to analyze it for signs of fraud
- Real-time analysis using a trained machine learning model
- Simple and easy-to-use interface

## How It Works

The application uses a supervised machine learning model trained on a dataset of real and fake job postings. It analyzes the text content of job descriptions using TF-IDF (Term Frequency-Inverse Document Frequency) vectorization and classifies them as either legitimate or fraudulent.

## Setup and Installation

1. Make sure you have Python 3.6+ installed
2. Install the required packages:
   ```
   pip install flask joblib scikit-learn
   ```
3. Clone or download this repository

## Running the Application

1. Navigate to the project directory
2. Run the Flask application:
   ```
   python app.py
   ```
3. Open your web browser and go to `http://127.0.0.1:5000`

## Files in this Project

- `app.py` - Flask application that serves the frontend and provides the prediction API
- `index.html` - Frontend HTML interface
- `styles.css` - CSS styles for the frontend
- `script.js` - JavaScript code for handling user interactions and API calls
- `fake_job_model.pkl` - Trained machine learning model
- `tfidf_vectorizer.pkl` - TF-IDF vectorizer used for text preprocessing

## Note

This is an educational tool and should not be the sole basis for determining if a job posting is legitimate. Always use caution when applying for jobs online and research the company thoroughly. 
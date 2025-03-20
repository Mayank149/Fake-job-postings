from flask import Flask, request, jsonify, render_template, send_from_directory
import joblib
import os
import numpy as np
import re

app = Flask(__name__)

# Load trained model and vectorizer
model = joblib.load("fake_job_model.pkl")
tfidf = joblib.load("tfidf_vectorizer.pkl")

def check_red_flags(text):
    red_flags = [
        r'\$[\d,]+[\s]*\+[\s]*weekly',
        r'no experience required',
        r'no skills needed',
        r'no interview',
        r'urgent hiring',
        r'limited spots',
        r'work from home',
        r'start earning today',
        r'click (here|now|below)',
        r'apply now',
        r'instant money',
        r'earn money fast',
        r'work from anywhere',
        r'no experience',
        r'no degree required',
        r'no background check',
        r'no resume needed'
    ]
    
    text = text.lower()
    matches = []
    
    for flag in red_flags:
        if re.search(flag, text):
            matches.append(flag)
    
    return matches

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    job_description = data.get("description", "")

    # Check for red flags first
    red_flags = check_red_flags(job_description)
    
    if red_flags:
        return jsonify({
            "prediction": "Fake Job Posting",
            "raw_prediction": 1,
            "confidence": 100.0,
            "probabilities": {
                "real": 0.0,
                "fake": 100.0
            },
            "red_flags": red_flags
        })

    # If no red flags, use the ML model
    input_tfidf = tfidf.transform([job_description])
    raw_prediction = model.predict(input_tfidf)[0]
    probabilities = model.predict_proba(input_tfidf)[0]
    confidence = max(probabilities) * 100
    prediction_label = "Fake Job Posting" if raw_prediction == 1 else "Real Job Posting"

    return jsonify({
        "prediction": prediction_label,
        "raw_prediction": int(raw_prediction),
        "confidence": round(confidence, 2),
        "probabilities": {
            "real": round(probabilities[0] * 100, 2),
            "fake": round(probabilities[1] * 100, 2)
        },
        "red_flags": []
    })

if __name__ == '__main__':
    app.run(debug=True)

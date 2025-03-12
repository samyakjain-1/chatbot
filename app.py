from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://samyakjain-1.github.io"}})


# Load your Groq API key from environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

@app.route("/api/chat", methods=["POST"])
def proxy_to_groq():
    try:
        user_data = request.get_json()

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                { "role": "system", "content": "You are a warm and empathetic mental health support chatbot." },
                { "role": "user", "content": user_data.get("message", "") }
            ]
        }

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload
        )

        groq_response = response.json()
        bot_reply = groq_response["choices"][0]["message"]["content"]

        return jsonify({ "reply": bot_reply })

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

if __name__ == "__main__":
    app.run(debug=True)

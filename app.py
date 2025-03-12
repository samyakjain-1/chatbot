from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

# Load Groq API key from environment variable
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

@app.route("/", methods=["GET"])
def home():
    return "✅ Mental Health Chatbot API is running."

@app.route("/api/chat", methods=["POST"])
def proxy_to_groq():
    try:
        user_data = request.get_json()
        print("📩 Incoming Message:", user_data)

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "system", "content": "You are a warm and empathetic mental health support chatbot."},
                {"role": "user", "content": user_data.get("message", "")}
            ]
        }

        print("📤 Sending payload to GROQ API...")
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
        print("✅ Received response from GROQ API")

        groq_response = response.json()
        bot_reply = groq_response["choices"][0]["message"]["content"]
        print("💬 Bot Reply:", bot_reply)

        return jsonify({"reply": bot_reply})

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("🚀 Starting Flask server...")
    app.run(debug=True)

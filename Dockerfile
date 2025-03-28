# Use an official lightweight Python image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy only requirements file first to leverage Docker caching
COPY requirements.txt requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files
COPY . .

# Expose the port Flask runs on
EXPOSE 5000

# Set environment variable to prevent Python from buffering output
ENV PYTHONUNBUFFERED=1

# Start the Flask application
CMD ["python", "app.py"]

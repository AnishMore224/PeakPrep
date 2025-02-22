# Use an official Python base image with Debian (supports apt-get)
FROM python:3.11-slim

# Install required system dependencies (poppler-utils for pdf2image)
RUN apt-get update && apt-get install -y poppler-utils

# Set the working directory in the container
WORKDIR /app

# Copy the project files into the container
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port
EXPOSE $PORT

# Start the Flask app
CMD ["gunicorn", "-b", "0.0.0.0:$PORT", "ChatBot:app"]

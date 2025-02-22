# Use an official Python base image with Debian
FROM python:3.11-slim

# Install required system dependencies (poppler-utils for pdf2image)
RUN apt-get update && apt-get install -y poppler-utils

# Set the working directory in the container
WORKDIR /

# Copy the project files into the container
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 5000 (Render sets PORT automatically, but we ensure a default)
ENV PORT=5000
EXPOSE 5000

# Start the Flask app using the correct port
CMD ["sh", "-c", "gunicorn -b 0.0.0.0:${PORT} ChatBot:app"]

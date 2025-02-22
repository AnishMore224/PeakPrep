# Use an official Python base image with Debian (supports apt-get)
FROM python:3.11-slim

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    poppler-utils \
    libgl1-mesa-glx \
    libglib2.0-0

# Set the working directory in the container
WORKDIR /app

# Copy the project files into the container
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port
ENV PORT=5000
EXPOSE 5000

# Start the Flask app using Gunicorn
CMD ["sh", "-c", "gunicorn -b 0.0.0.0:${PORT} ChatBot:app"]

# PeakPrep

PeakPrep is a comprehensive platform designed to assist students in preparing for technical interviews, coding contests, and resume building. The platform includes various features such as a resume builder, coding contest management, and resources for interview preparation.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Resume Builder**: Create and download professional resumes in PDF format.
- **Coding Contests**: Participate in coding contests and view results.
- **Interview Preparation**: Access resources for technical interviews, including articles, videos, and practice problems.
- **Open Source Projects**: Discover and contribute to open source projects.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB

### Backend (Server)

1. Navigate to the `server` directory:
    ```bash
    cd server
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and add the necessary environment variables:
    ```env
    JWT_SECRET=your_jwt_secret
    MONGO_URI=your_mongodb_uri
    ```

4. Start the server:
    ```bash
    npm run dev
    ```

### Frontend (Client)

1. Navigate to the `client` directory:
    ```bash
    cd client
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

### Flask API

1. Navigate to the `Flask-API` directory:
    ```bash
    cd Flask-API
    ```

2. Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Start the Flask server:
    ```bash
    flask run
    ```

## Usage

- Access the frontend at `http://localhost:5173`.
- Use the backend API at `http://localhost:3030`.
- Use the Flask API at `http://localhost:5000`.

## Project Structure

```
PeakPrep/
├── client/                 # Frontend React application
│   ├── public/             # Public assets
│   ├── src/                # Source code
│   ├── package.json        # Frontend dependencies
│   └── ...                 # Other frontend files
├── server/                 # Backend Node.js application
│   ├── src/                # Source code
│   ├── package.json        # Backend dependencies
│   └── ...                 # Other backend files
├── Flask-API/              # Flask API for additional functionalities
│   ├── models/             # Model files
│   ├── src/                # Source code
│   ├── requirements.txt    # Python dependencies
│   └── ...                 # Other Flask API files
└── README.md               # Project README file
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
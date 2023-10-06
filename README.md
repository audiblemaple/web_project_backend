# SolidClock Backend

This is the backend server for the [SolidClock Website](https://solid-clock.onrender.com), written in Node.js. It powers the core functionalities, enabling the management and monitoring of employee clock-in times, user authentication, email operations, and more.

## Features

- **User Authentication**: Handles sign up, login, and password reset operations.
- **Data Management**: Manages employee clock-in times, attendance logs, and monthly report data.
- **Email Operations**: Can send emails for various purposes, such as password reset instructions or notifications.
- **Password Management**: Provides features to reset or change user passwords.
- **API Endpoints**: Exposes various API endpoints for the frontend to interact with the backend services.

## Dependencies

The project relies on the following dependencies:

- **bcrypt** (version 5.1.0): Library for password hashing and salting.
- **body-parser** (version 1.20.2): Middleware for parsing incoming request bodies.
- **dotenv** (version 16.3.1): Loads environment variables from a `.env` file into `process.env`.
- **express** (version 4.18.2): Fast and minimalist web framework for Node.js.
- **html-to-text** (version 9.0.5): Converts HTML content to plain text.
- **jsonwebtoken** (version 9.0.1): Implements JSON Web Tokens for user authentication.
- **mongoose** (version 7.3.1): Elegant MongoDB object modeling for Node.js.
- **nodemailer** (version 4.7.0): Sends emails from Node.js applications.
- **pug** (version 3.0.2): Template engine for rendering HTML views.
- **validator** (version 13.9.0): Library for validating and sanitizing user input.

Please refer to the official documentation of each dependency for more detailed information on how to use them within the project.

## Contributors

- [Lior Jigalo](https://github.com/audiblemaple)
- [Gilad Segal](https://github.com/giladsegal10)

## Links
**API Documentation:** TODO...

Feel free to open an issue or send a pull request if you have suggestions, improvements, or security concerns. We appreciate all the feedback!

## TODO
- Add automatic shift cancelation for all users at midnight in case they forgot to end shift.
- Add functionality to edit shift times.
- Improve email templates for better user experience.
- Add more comprehensive logging and error handling.
- Optimize database queries for faster response times.


(Note: Adjust TODOs as needed)

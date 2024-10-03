Welcome to Quizinator

Hello! Welcome to Quizinator.
It is a simple quiz app where users can register and log in, select topics, and answer questions related to them.
The admin can add questions to each of the topics in the database.


=======================================================================================
Backend Setup

This app uses Node.js, Express.js, and MongoDB, along with several dependencies, including bcrypt, bcryptjs, body, colors, cors, dotenv, express, jsonwebtoken, mongoose, morgan, nodemon, and parser.
Cloning and Running the App

To clone and run this app, follow these steps:

First, clone the repository and navigate to the project directory. Then, run the command to install all necessary dependencies:
npm install bcrypt bcryptjs body colors cors dotenv express jsonwebtoken mongoose morgan nodemon parser

Next, create a .env file in the root directory and add the necessary environment variables, such as your PORT ,MongoDB URI and JWT secret.

Finally, use Nodemon to start the server with the command : npm run server

==========================================================================================
Frontend Setup

This app uses Vite with React and several dependencies, including Ant Design, Axios, React Router, and React Toastify.

To set up the frontend, follow these steps:
1)Navigate to the Frontend Directory: Make sure you're in the frontend project directory.

2)Install Dependencies: Run the command to install all necessary dependencies
    npm install antd axios react react-dom react-icons react-router-dom react-toastify
    
3)Install Development Dependencies: Additionally, install the development dependencies with the command:

npm install --save-dev @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite

4)Run the Development Server: Start the Vite development server with the command: npm run dev


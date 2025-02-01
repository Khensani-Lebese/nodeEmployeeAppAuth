# nodeEmployeeAppAuth

This repository contains the backend and frontend for the Employee App, where you can manage employee data and perform CRUD operations.

# Accessing the Backend
1. Navigate to the /server folder
To get started with the backend, navigate to the /server folder from your terminal:

`cd server`

# Install Dependencies
Before starting the backend, ensure all dependencies are installed:

`npm install`

# Run the Backend Server
Once dependencies are installed, you can run the backend server using the following command:

`npm start`

This will start the server on localhost and you'll be able to access the API and interact with it for managing employee data.

Similarly,For frontend, install dependencies
`npm install`

# Run the Froontend Server
Once dependencies are installed, you can run the frontend server using the following command:

`npm run dev`




# Adding an Admin on Firebase Admin Console

To manage user roles and privileges, you need to create an admin on the Firebase Admin Console. Follow the steps below to add an admin:

Step 1: Go to Firebase Console
Visit the Firebase Console.

Select your project.
Step 2: Access Firebase Authentication
In the left sidebar, click on Authentication.
Navigate to the Users tab.

Step 3: Add a New User
Click on Add User in the top right corner.
Fill in the user details (email, password, etc.).

Step 4: Set Custom Claims for Admin Role
After creating the user, you will need to add custom claims to their account to grant admin privileges.

Open Firebase Functions in the console (from the left sidebar).
In your server's Firebase Admin SDK, use the following code to add a custom claim for admin privileges:
javascript

<pre javascript ```const admin = require('firebase-admin');
admin.initializeApp();

const addAdminRole = (uid) => {
  return admin.auth().setCustomUserClaims(uid, { admin: true })
    .then(() => {
      console.log('User is now an admin:', uid);
    });
};```</pre>

Step 5: Test the Admin Role
Once the custom claims are set, the user will have admin privileges. You can check this by attempting to access admin routes in the app.


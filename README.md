Setup Locally:

Clone Repository
https://github.com/VotersHQ/votersWaitlist.git
cd to project

BACKEND SETUP
1. Navigate to the backend folder:
cd backend

2. Install dependencies:
npm install

3. Create a .env file in the backend folder and add your environment variables:

MONGODB_URI=mongodb+srv://votershq:votershq@cluster0.6hme41x.mongodb.net/votershq?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=votershq

5. Start the backend server:
npm start

The backend server should now be running on http://localhost:5000.


FRONTEND SETUP
1. Navigate to the frontend folder OR open a new terminal:
cd ../frontend or cd frontend

2. Install dependencies:
npm install

3. Create a .env file in the frontend folder and add your environment variables:
VITE_REACT_APP_FRONTEND_URL=http://localhost:3000

VITE_REACT_APP_BASE_URL=http://localhost:5000

VITE_REACT_APP_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/1FAIpQLSfYfLQOlXhGti2yk27tpjA763oEKAMHnDg1ASsNq__AH14Lwg/viewform?usp=sf_link


5. Start the frontend development server:
npm run dev

The frontend application should now be running on http://localhost:3000.



DEPLOY TO VERCEL

Deploy Backend
1. Create a new project on Vercel.

2. Link your GitHub repository to the Vercel project.

3. Set up environment variables on Vercel:
   . Go to the project settings.
   . Under the "Environment Variables" section, add the same variables as in your .env file:
MONGODB_URI=mongodb+srv://votershq:votershq@cluster0.6hme41x.mongodb.net/votershq?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=votershq

4.Deploy the project. Vercel will automatically detect the backend folder and deploy it.


Deploy Frontend
1. Create another new project on Vercel.

2. Link your GitHub repository to the Vercel project.

3. In the project settings, under the "Build & Development Settings" section, set the following:
   . Root Directory: frontend
   . Build Command: npm run build
   
4. Set up environment variables on Vercel:
   . Go to the project settings.
   . Under the "Environment Variables" section, add the same variables as in your .env file:
VITE_REACT_APP_FRONTEND_URL=http://localhost:3000
VITE_REACT_APP_BASE_URL=http://localhost:5000

5. Deploy the project. Vercel will automatically build and deploy the frontend application.






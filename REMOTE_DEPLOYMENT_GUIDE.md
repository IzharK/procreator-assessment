# Remote Backend Deployment Guide (100% Free / No Credit Card)

To make your Service Booking MVP work anywhere in the world, we need to host the Node.js API on a public server. **Render.com** is the best option because it connects directly to your GitHub and does not require a credit card for its free tier.

---

## 🚀 Step 1: Deploy Node.js Backend to Render

1.  **Sign Up**: Go to [Render.com](https://render.com/) and sign up using your GitHub account.
2.  **Create Service**: Once logged in, click **"New +"** and select **"Web Service"**.
3.  **Connect Repo**: 
    - Select **"Build and deploy from a Git repository"**.
    - Connect your GitHub account (if not already done) and select your MVP Service Booking repository.
4.  **Configure Deployment**:
    - **Name**: `service-booking-api` (or any unique name).
    - **Branch**: `main` (or whichever branch you just pushed).
    - **Root Directory**: `apps/api` > [!IMPORTANT] This is crucial since we are in a monorepo!
    - **Environment**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `node index.js`
    - **Instance Type**: **Free** (select the $0/month tier).

5.  **Environment Variables**:
    Scroll down to the "Environment Variables" section and click **"Add Environment Variable"**. Add the following:
    - **Key**: `MONGODB_URI`
    - **Value**: *(Paste your MongoDB Atlas Connection String from `apps/api/.env`)*
    - **Key**: `JWT_SECRET`
    - **Value**: *(Paste your JWT secret string)*
    - **Key**: `PORT`
    - **Value**: `10000` *(Render prefers port 10000)*

6.  Click **"Create Web Service"**. Render will now build and deploy your backend. It takes about 2-3 minutes.

---

## 🌍 Step 2: Ensure MongoDB Connections Work Remotely

Since your backend is now running on a cloud server (Render) and not your local computer, MongoDB Atlas needs to allow Render to connect to it.

1.  Go to your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2.  On the left sidebar under Security, click **Network Access**.
3.  Click **"Add IP Address"**.
4.  Select **"Allow Access from Anywhere"** (`0.0.0.0/0`).
    - *Note: Since Render assigns dynamic IPs to their free tier, this is the easiest way to ensure the connection never drops.*
5.  Click **Confirm**. Once the status says "Active", your remote backend is perfectly connected to your database!

---

## 🔗 Step 3: Get Your Live URL

1.  Go back to your Render Dashboard.
2.  Near the top of your web service page, you will see a URL that looks like this:
    `https://service-booking-api-abc.onrender.com`
3.  **Copy this URL!**

---

## 🛑 What's Next?

Once you have your live Render URL, **paste it here in our chat!** 

Once you give me the URL, I will automatically:
- Execute **Step 3**: Update the React Web Panel to read from your new remote API.
- Execute **Step 4**: Update the Flutter Mobile App to communicate dynamically with the live cloud backend instead of `localhost`.

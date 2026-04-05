# MongoDB Atlas Setup Guide

Follow these steps to create your free MongoDB database and get the connection string (URI) for the **Service Booking Platform**.

---

## ☁️ Step 1: Create a MongoDB Atlas Account
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  Sign up for a free account.
3.  Once logged in, click **"Create"** under the "Deploy a cloud database" section.

---

## 🏗️ Step 2: Create a Free Cluster
1.  Select the **"M0"** (Free Tier) cluster option.
2.  Choose a provider (AWS, Google Cloud, or Azure) and a region near you (e.g., `us-east-1` or `ap-south-1`).
3.  Name your cluster (e.g., `ServiceBookingCluster`) or leave the default `Cluster0`.
4.  Click **"Create Deployment"**.

---

## 🔐 Step 3: Security Setup (Crucial)
Atlas will prompt you to set up security before you can use the database.

1.  **Database User**: 
    - Create a username (e.g., `dbAdmin`).
    - Create a strong password (or click "Autogenerate"). 
    - **Keep this password safe!** You will need it for your connection string.
    - Click **"Create User"**.

2.  **IP Access List**:
    - You must allow your computer to connect to Atlas.
    - Click **"Add My Current IP Address"**.
    - > [!TIP]
      > For development simplicity (not for production!), you can add `0.0.0.0/0` to allow access from any IP address. This is helpful if your IP changes or if you are testing on mobile emulators.

3.  Click **"Finish and Close"**.

---

## 🔗 Step 4: Get Your Connection String
1.  On the Atlas Dashboard, find your cluster and click the **"Connect"** button.
2.  Select **"Drivers"** (since we are using Node.js).
3.  Look for the **"Connection String"** label. It will look like this:
    `mongodb+srv://<db_username>:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
4.  **Copy the link.**

---

## 📝 Step 5: Update Your Project
1.  Open your project in VS Code.
2.  Navigate to `apps/api/` and open your `.env` file (create it if you haven't).
3.  Paste your connection string into the `MONGODB_URI` variable:
    ```env
    MONGODB_URI=mongodb+srv://dbAdmin:YOUR_PASSWORD@cluster0.abcde.mongodb.net/service-booking-mvp?retryWrites=true&w=majority
    ```
4.  > [!IMPORTANT]
    > Replace `<db_password>` with the actual password you created in Step 3. 
    > Also, I recommend adding `service-booking-mvp` after the `.net/` and before the `?` to automatically name your database.

---

## ✅ Step 6: Verify Connection
1.  Open a terminal in `apps/api`.
2.  Run `node index.js`.
3.  If successful, you will see:
    `✅ Connected to MongoDB Atlas`

> [!CAUTION]
> Never commit your `.env` file with your real password to GitHub. Ensure `.gitignore` includes `.env`.

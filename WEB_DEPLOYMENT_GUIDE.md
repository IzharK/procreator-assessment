# Web Admin Deployment Guide (100% Free / No Credit Card)

To host your React Web Admin Panel publicly, we will use **Netlify**. Since you already have an account, this is the most efficient choice for your workflow.

---

## 🚀 Step 1: Deploy Web Panel to Netlify

1.  **Log In**: Sign in to your [Netlify Dashboard](https://app.netlify.com/).
2.  **Add New Site**: Click **"Add new site"** and select **"Import an existing project"**.
3.  **Connect Repo**: 
    - Choose **GitHub** as your provider.
    - Select your MVP Service Booking repository.
4.  **Configure Build Settings**:
    - **Base directory**: `apps/web`  > [!IMPORTANT] This is necessary for our monorepo!
    - **Build command**: `npm run build`
    - **Publish directory**: `dist` (This is where Vite puts the finished files)
5.  **Environment Variables**: *(Optional)* Your `App.jsx` already points to the live Render backend, so no environment variables are needed for basic functionality.
6.  Click **"Deploy service-booking-admin"**. Netlify will now build your site and generate a live URL.

---

## ⚡ Step 2: Access Your Live Dashboard

1.  Once the "Site deploy in progress" bar turns green and says "Published", your site is live!
2.  The live URL will look something like:
    `https://service-booking-admin-abc.netlify.app/`
3.  **Copy the link!**

---

## 🏁 Final Step: Record Your Progress

1.  **Paste your live Netlify URL here in our chat!**
2.  Once you give me the URL, I will:
    - Update the **[FINAL_WALKTHROUGH.md](./FINAL_WALKTHROUGH.md)** and **[README.md](./README.md)** with the new link.
    - Finalize your project summary.

---

> [!TIP]
> Since you have already updated your `App.jsx` to use the remote Render backend, your live Vercel dashboard will work perfectly "out of the box"—allowing you to manage services and bookings from any browser in the world!

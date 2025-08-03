# 🎓 IIT Bhilai Student Forum

> A centralized platform for IIT Bhilai students to share course feedback, contribute learning resources, and engage with peers through gamified interactions.

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 📘 About

The **IIT Bhilai Student Forum** is a comprehensive and interactive platform built exclusively for the IIT Bhilai community. It enables students to:

- Share **feedback** and **comments** on courses
- Upload and explore **resources**
- Interact with a **gamified system** of badges and rewards
- View course analytics via **data visualizations**
- Manage their **profiles**
- Experience a clean **role-based UI**, including a special guest user view

Only IIT Bhilai students with valid institute IDs can log in through **Google OAuth**, ensuring a secure and private environment for authentic contributions and engagement.

---

## ✨ Features

- 🗣️ **Course Feedback** – Share ratings and thoughts on courses you've taken
- 💬 **Comments Section** – Open discussion for each course
- 📁 **Resource Hub** – Upload and access notes, books, PDFs, etc.
- 🔐 **Google OAuth 2.0** – Institute-only login using IIT Bhilai email
- 👥 **Role-Based Access Control** – Different views for guest and student users
- 🏅 **Gamification & Rewards** – Earn badges for contributing resources and reviews
- 👤 **Profile Management** – View and manage your contributions and badges
- 📊 **Visual Metrics** – Graphs, charts, and speedometers showing feedback analytics
- 📈 **Admin Analytics** – Platform-wide stats including total users, unique courses, and total feedbacks
- 🔎 **Filters & Search** – Quickly find specific courses or resources
- 🌐 **Fully Responsive** – Optimized UI across devices

---

## 📸 Screenshots


---

## 🧰 Tech Stack

![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=nextdotjs&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?logo=tailwindcss&logoColor=white&style=for-the-badge)
![ShadCN UI](https://img.shields.io/badge/-ShadCN%20UI-DD6B20?logo=react&logoColor=white&style=for-the-badge)
![Django REST Framework](https://img.shields.io/badge/-Django%20REST-092E20?logo=django&logoColor=white&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge)
![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?logo=supabase&logoColor=white&style=for-the-badge)
![Google OAuth](https://img.shields.io/badge/-Google%20OAuth-4285F4?logo=google&logoColor=white&style=for-the-badge)
![JWT](https://img.shields.io/badge/-JWT-000000?logo=jsonwebtokens&logoColor=white&style=for-the-badge)

---

## ⚙️ Installation

# Clone the repo
```bash
git clone https://github.com/ashutosh229/AcademicX.git
```

### 🚧 Backend

# Navigate into the backend directory
```bash
cd AcademicX
cd backend
```

# Create and activate virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Linux/MacOs
venv\Scripts\activate # On Windows
```

# Install dependencies
```bash
pip install -r requirements.txt
```

# Set up the environment variables 
```bash
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
NEXTAUTH_SECRET= 
```

# Run the migrations 
```bash 
python manage.py migrate 
``` 

# Run the server 
```bash 
python manage.py runserver
```

### 💻 Frontend

# Navigate to the frontend directory
```bash
cd AcademicX
cd frontend
```

# Install dependencies
```bash
npm install 
```

# Set up the environment variables 
```bash
NEXTAUTH_URL=""
NEXTAUTH_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

# Run the server 
```bash
npm run dev --debug 
```

--- 

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the codebase and submit the pull requests for the changes you want to contribute.

--- 

## 📄 License

This project is licensed under the **MIT License**.
> Read the full license text here: [MIT License](LICENSE)

--- 

## 📬 Contact

If you have any questions, suggestions, or just want to connect, feel free to reach out:

- **Name:** Ashutosh Kumar Jha  
- **Email:** ashutoshj@iitbhilai.ac.in 
- **LinkedIn:** [Linkedin](https://www.linkedin.com/in/ashutosh-kumar-jha-601098280)  
- **GitHub:** [GitHub](https://github.com/ashutosh229)  

---

> 💬 I’m always open to collaboration, feedback, or just a good tech conversation!
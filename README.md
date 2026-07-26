# 🚀 AI Job Board

> A modern AI-powered full-stack Job Board platform that enables recruiters to create intelligent job postings and candidates to discover and apply for opportunities through a responsive web application.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-blue?logo=githubactions)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## 📖 Overview

AI Job Board is a full-stack recruitment platform built with modern web technologies. It provides a seamless experience for both recruiters and job seekers while demonstrating production-style architecture, secure authentication, RESTful APIs, CI/CD automation, and deployment.

The application was developed as a technical assessment to demonstrate full-stack software engineering skills, clean project architecture, and modern development workflows.

---

# ✨ Features

## 👨‍💼 Recruiter

- Secure authentication
- Create job postings
- Edit existing jobs
- Delete job postings
- View recruiter dashboard
- Manage posted jobs
- AI-assisted job description generation
- AI skills extraction
- AI-powered content assistance

---

## 👩‍💻 Candidate

- User Registration
- Secure Login
- Browse available jobs
- Search jobs
- View detailed job information
- Apply for jobs
- Responsive mobile-friendly interface

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- React Router
- Axios
- CSS3

---

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt
- REST APIs

---

## DevOps

- Git
- GitHub
- GitHub Actions
- Vercel

---

# 🏗 System Architecture

```
                    React + Vite
                          │
                     REST API Calls
                          │
                    Express.js Server
                          │
                    Authentication
                          │
                      MongoDB Atlas
```

---

# 📂 Project Structure

```
AI-Job-Board
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   └── index.js
│   │
│   ├── .env.example
│   └── package.json
│
├── .github
│   └── workflows
│       └── ci.yml
│
├── README.md
├── DELIVERY.md
└── package.json
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/manojpalugula/AI-job-board.git

cd AI-job-board
```

---

## Install Dependencies

```bash
npm install

cd client
npm install

cd ../server
npm install
```

---

# ⚙ Environment Variables

Create

```
server/.env
```

using

```
server/.env.example
```

Example

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

---

# ▶ Running the Project

Start both frontend and backend

```bash
npm run dev
```

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|----------|-------------------------|
| POST | /api/auth/register |
| POST | /api/auth/login |

---

## Jobs

| Method | Endpoint |
|----------|-------------------|
| GET | /api/jobs |
| GET | /api/jobs/:id |
| POST | /api/jobs |
| PATCH | /api/jobs/:id |
| DELETE | /api/jobs/:id |

---

## Applications

| Method | Endpoint |
|----------|----------------------|
| POST | /api/applications |
| GET | /api/applications |

---

## AI

| Method | Endpoint |
|----------|----------------|
| POST | /api/ai/generate |
| POST | /api/ai/summarize |
| POST | /api/ai/match |

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Environment Variable Configuration
- REST API Validation
- Secure Database Connection

---

# 🔄 CI/CD Pipeline

GitHub Actions automatically performs:

- Install dependencies
- Build project
- Verify application builds successfully
- Maintain consistent deployment workflow

---

# ☁ Deployment

Frontend

**Vercel**

Backend

**Node.js / Express**

Database

**MongoDB Atlas**

---

# 📸 Screenshots

Add screenshots before submitting.

```
docs/

home.png

login.png

dashboard.png

jobs.png

ai-generator.png
```

Example

```markdown
## Home

![Home](docs/home.png)

## Dashboard

![Dashboard](docs/dashboard.png)

## AI Generator

![AI](docs/ai-generator.png)
```

---

# 💼 Business Value

The platform simplifies the recruitment process by providing:

- Faster job posting workflow
- Centralized job management
- Secure authentication
- AI-assisted content generation
- Responsive user experience
- Scalable full-stack architecture

---

# 🚀 Future Improvements

- Resume Upload
- Resume Parsing using AI
- AI Resume Ranking
- Interview Scheduling
- Email Notifications
- Company Profiles
- Saved Jobs
- Job Recommendations
- Admin Dashboard
- Analytics Dashboard

---

# 🧪 Testing

To verify the application:

- Register a new account
- Login
- Create a job
- Browse jobs
- Search jobs
- Apply for a job
- Test AI features
- Verify protected routes

---

# 👨‍💻 Author

**Palugula Manoj Kumar**

Software Developer

GitHub

https://github.com/manojpalugula

LinkedIn

(Add your LinkedIn profile)

---

# 📄 License

This project is intended for educational purposes and technical assessment submission.

---

## ⭐ Thank You

Thank you for reviewing this project.

This application demonstrates modern full-stack development practices including React, Node.js, Express, MongoDB, REST APIs, JWT Authentication, CI/CD with GitHub Actions, deployment, and AI-assisted functionality.

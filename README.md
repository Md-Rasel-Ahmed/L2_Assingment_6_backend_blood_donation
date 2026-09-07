# 🩸 LifeFlow - Real-time Emergency Blood Donation Platform API

An industry-standard, scalable, and secure RESTful API for a real-time emergency blood donation matching platform. Built with **Node.js**, **TypeScript**, **Express.js**, and **Prisma ORM** with **PostgreSQL**.

---

## 📌 Project Overview

LifeFlow backend powers an emergency blood donation network connecting patients in urgent need with eligible nearby donors. It features real-time donor matching based on geographic proximity, role-based access control (RBAC), and automated eligibility locks (90-day minimum interval between donations).

---

## 🛠️ Tech Stack & Prerequisites

### Tech Stack:

- **Language & Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL & Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: `zod`
- **Password Hashing**: `bcryptjs`

### Prerequisites:

Make sure you have the following installed on your local system:

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [PostgreSQL](https://www.postgresql.org/) database server
- [Git](https://git-scm.com/)

---

## 🛣️ API Endpoints Reference

### 1. Authentication (`/api/v1/auth`)

| Method | Endpoint                | Description                                                | Access        |
| :----- | :---------------------- | :--------------------------------------------------------- | :------------ |
| `POST` | `/singup`               | Register a new user (Donor or Patient)                     | Public        |
| `POST` | `/login`                | Authenticate user & return JWT token                       | Public        |
| `GET`  | `/verify-email`         | Email Verify After Singup                                  | Public        |
| `GET`  | `/forgot-password`      | Send Email Verify When Forgot Password                     | Authenticated |
| `GET`  | `reset-password`        | Set New Password After Verify OTP                          | Authenticated |
| `GET`  | `google/login/callback` | Redirect Google Callback URL When Try To Login With Google | Public        |

### 1. User (`/api/v1/users`)

| Method  | Endpoint   | Description        | Access        |
| :------ | :--------- | :----------------- | :------------ |
| `GET`   | `/get-me`  | Fetching User Info | Authenticated |
| `PATCH` | `/edit-me` | Edit User Info     | Authenticated |

### 2. Patient Operations (`/api/v1/patient`)

| Method  | Endpoint                               | Description                                     | Access  |
| :------ | :------------------------------------- | :---------------------------------------------- | :------ |
| `POST`  | `/blood-requests`                      | Create a new emergency blood request            | Patient |
| `GET`   | `/my-requests`                         | View all blood requests created by the patient  | Patient |
| `GET`   | `/blood-requests/:id/responses`        | View list of donors who responded to a request  | Patient |
| `POST`  | `/blood-requests/:id/confirm-donation` | Confirm blood donation & lock donor for 90 days | Patient |
| `PATCH` | `/blood-requests/:id/status`           | Update Blood Request Status                     | Patient |
| `GET`   | `/blood-requests`                      | Get All Blood Request                           | Public  |
| `PATCH` | `bloodRequiest/:id`                    | Update Blood Request                            | Patient |

### 3. Donor Operations (`/api/v1/donor`)

| Method  | Endpoint                          | Description                                            | Access |
| :------ | :-------------------------------- | :----------------------------------------------------- | :----- |
| `PATCH` | `/donor-profile/availability/:id` | Toggle donor availability status (`isAvailable`)       | Donor  |
| `GET`   | `/matching-requests`              | View active blood requests matching blood group & area | Donor  |
| `POST`  | `/requests/:id/respond`           | Accept or decline a blood request                      | Donor  |
| `POST`  | `/bloodRequest/:id/accept`        | Accept blood request                                   | Donor  |
| `POST`  | `/donor-profile`                  | Create Donor Profile For Accepet Donation Request      | Donor  |
| `GET`   | `/donation-history`               | View donor's donation history and stats                | Donor  |

### 4. Admin Management (`/api/v1/admin`)

| Method   | Endpoint              | Description                                          | Access |
| :------- | :-------------------- | :--------------------------------------------------- | :----- |
| `GET`    | `/dashboard-stats`    | System overview analytics and donation counts        | Admin  |
| `GET`    | `/all-users`          | List all registered users with filter options        | Admin  |
| `GET`    | `/all-donor`          | List all registered donor with filter options        | Admin  |
| `GET`    | `/blood-requests`     | List all verified blood requests with filter options | Admin  |
| `PATCH`  | `/user-status`        | Suspend or reactivate user accounts                  | Admin  |
| `DELETE` | `/blood-requests/:id` | Remove fake or spam blood requests                   | Admin  |
| `DELETE` | `/users/:email`       | Remove fake or spam users                            | Admin  |

---

## ⚙️ Complete Step-by-Step Installation & Setup Guide

### Step 1: Clone the Repository

Open your terminal and clone the project to your local machine:

```bash
git clone [https://github.com/Md-Rasel-Ahmed/L2_Assingment_6_backend_blood_donation](https://github.com/Md-Rasel-Ahmed/L2_Assingment_6_backend_blood_donation)
cd L2_Assingment_6_backend_blood_donation
```

### Step 2: Install Dependencies

Open your terminal and write:

```bash
npm install
```

### Step 3: Configure Environment Variables

Open your project create .env file on the root:

### Step 4: Database Setup & Prisma Migrations & Generate

```
npx prisma migrate dev --name init
npx prisma generate

```

### Step 5: Start the Development Server

```
npm run dev

```

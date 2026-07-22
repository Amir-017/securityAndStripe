<div align="center">

# 🛡️ Security Stripe

**A full-stack authentication & payments playground — built to show real security patterns, not just "hello world" auth.**

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Passport](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=white)

</div>

---

## 📖 About this project

This project is not just another CRUD app. It's a reference implementation I built for myself (and for other developers) to see how a **real authentication system** and a **real payment flow** work together inside a NestJS + React app.

It covers:
- Local login (email + password) with hashed passwords
- Social login with **Google**, **GitHub**, and **LinkedIn**
- JWT-based sessions
- Role-based authorization (not just "logged in or not")
- A working Stripe Checkout integration in test mode

If you're learning backend security, OAuth, or Stripe, feel free to clone this, break it, and rebuild it. That's exactly why it's public.

---

## ✨ Features

- 🔐 **Multiple auth strategies** — Local, Google, GitHub, LinkedIn (all pluggable through Passport)
- 🪪 **JWT authentication** — stateless sessions using access tokens
- 🛂 **Authorization guards** — role-based access control (`@Roles()` decorator + `RolesGuard`)
- 💳 **Stripe integration** — dynamic checkout sessions (test mode) with success/cancel flows
- 🗄️ **MongoDB + Mongoose** — clean schema-based data layer
- ✅ **Validation everywhere** — DTOs with `class-validator`, so bad requests never reach your business logic
- 🎨 **Modern frontend** — React 19, Vite, Tailwind CSS v4, React Router v7

---

## 🧰 Tech Stack

**Backend**
- [NestJS 11](https://nestjs.com/) — Node.js framework
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [Passport.js](https://www.passportjs.org/) — local, Google, GitHub, LinkedIn strategies
- [JWT](https://jwt.io/) for session tokens
- [Stripe](https://stripe.com/) for payments
- [class-validator](https://github.com/typestack/class-validator) / [class-transformer](https://github.com/typestack/class-transformer)
- [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing

**Frontend**
- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Router v7](https://reactrouter.com/)
- [Axios](https://axios-http.com/)

---

## 📁 Project Structure

```
Security_Stripe/
├── client/                        # React frontend
│   └── src/
│       ├── Api/
│       │   └── axios.js           # Axios instance / base config
│       ├── auth/
│       │   └── success.jsx        # Handles redirect after OAuth login
│       ├── components/
│       │   └── NavBar.jsx
│       ├── Pages/
│       │   ├── Login_Register.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Payment_Success_cancel/
│       │   │   ├── Cancel.jsx
│       │   │   └── Success.jsx
│       │   └── Home.jsx
│       ├── App.jsx
│       └── main.jsx
│
└── server/                        # NestJS backend
    └── src/
        ├── auth/
        │   ├── decorators/
        │   │   └── roles.decorator.ts
        │   ├── dto/
        │   ├── Guards/
        │   │   ├── jwtGuard.ts
        │   │   └── roles.guard.ts
        │   ├── Strategies/
        │   │   ├── githubStrategy.ts
        │   │   ├── googleStrategy.ts
        │   │   ├── jwtStrategy.ts
        │   │   └── localStrategy.ts
        │   ├── auth.controller.ts
        │   ├── auth.module.ts
        │   └── auth.service.ts
        │
        ├── payments/
        │   ├── dto/
        │   ├── payments.controller.ts
        │   ├── payments.module.ts
        │   └── payments.service.ts
        │
        ├── users/
        │   ├── dto/
        │   ├── schemas/
        │   │   └── userSchema.ts
        │   ├── users.controller.ts
        │   ├── users.module.ts
        │   └── users.service.ts
        │
        ├── app.module.ts
        └── main.ts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A [Stripe](https://dashboard.stripe.com/register) account (test mode is free, no card needed)
- OAuth apps set up for the providers you want to use (Google / GitHub / LinkedIn)

### 1. Clone the repo

```bash
git clone https://github.com/Amir-017/Security_Stripe.git
cd Security_Stripe
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Set up environment variables

Create a `.env` file inside `server/` with the following:

```env
# App
PORT=3000
CLIENT_URL=http://localhost:5173

# Database
DATABASE_URL=mongodb://localhost:27017/securityStripe

# JWT
JWT_SECRET=your_jwt_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=xxxxx
GITHUB_CLIENT_SECRET=xxxxx
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=xxxxx
LINKEDIN_CLIENT_SECRET=xxxxx
LINKEDIN_CALLBACK_URL=http://localhost:3000/auth/linkedin/callback

# Stripe (test mode)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### 4. Run the project

```bash
# Terminal 1 — backend
cd server
npm run start:dev

# Terminal 2 — frontend
cd client
npm run dev
```

The backend runs on `http://localhost:3000` and the frontend on `http://localhost:5173`.

---

## 🔑 Auth Endpoints

| Method | Route | What it does |
|---|---|---|
| `POST` | `/auth/register` | Create a new account (local) |
| `POST` | `/auth/login` | Log in with email + password |
| `GET` | `/auth/google` | Start Google OAuth flow |
| `GET` | `/auth/google/callback` | Google redirects here after login |
| `GET` | `/auth/github` | Start GitHub OAuth flow |
| `GET` | `/auth/github/callback` | GitHub redirects here after login |
| `GET` | `/auth/linkedin` | Start LinkedIn OAuth flow |
| `GET` | `/auth/linkedin/callback` | LinkedIn redirects here after login |

## 💳 Payments Endpoints

| Method | Route | What it does |
|---|---|---|
| `POST` | `/payments/checkout` | Creates a Stripe Checkout session and returns a redirect URL |

### Testing payments

Use Stripe's official test cards — no real money is ever involved:

| Scenario | Card number |
|---|---|
| ✅ Successful payment | `4242 4242 4242 4242` |
| ❌ Card declined | `4000 0000 0000 0002` |
| ❌ Insufficient funds | `4000 0000 0000 9995` |
| 🔐 Requires 3D Secure | `4000 0025 0000 3155` |

Any future expiry date and any 3-digit CVC will work.

---

## 🧭 Roadmap

- [ ] Add Microsoft login
- [ ] Add refresh token rotation
- [ ] Add rate limiting on auth routes
- [ ] Deploy with Docker

---

## ➕ Adding a New Auth Strategy (Step by Step)

Want to add a new login provider (Facebook, Microsoft, Discord, etc.)? Here's exactly how this project is structured to make that easy.

### Backend

**1. Register an OAuth app with the provider**

Go to the provider's developer portal, create a new app, and set the callback URL to:
```
http://localhost:3000/auth/<provider>/callback
```
Copy the Client ID and Client Secret they give you.

**2. Add the credentials to `.env`**

```env
<PROVIDER>_CLIENT_ID=xxxxx
<PROVIDER>_CLIENT_SECRET=xxxxx
<PROVIDER>_CALLBACK_URL=http://localhost:3000/auth/<provider>/callback
```

**3. Install the Passport strategy package**

```bash
npm install passport-<provider>
```

**4. Create the strategy file**

Add a new file in `server/src/auth/Strategies/<provider>Strategy.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-<provider>';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class <Provider>Strategy extends PassportStrategy(Strategy, '<provider>') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('<PROVIDER>_CLIENT_ID'),
      clientSecret: configService.get<string>('<PROVIDER>_CLIENT_SECRET'),
      callbackURL: configService.get<string>('<PROVIDER>_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // this is where you'd find-or-create the user in your database
    return profile;
  }
}
```

**5. Register the strategy in `auth.module.ts`**

```typescript
import { <Provider>Strategy } from './Strategies/<provider>Strategy';

@Module({
  providers: [AuthService, /* ...other strategies */, <Provider>Strategy],
})
export class AuthModule {}
```

**6. Add the two routes in `auth.controller.ts`**

```typescript
@Get('<provider>')
@UseGuards(AuthGuard('<provider>'))
async <provider>Login() {
  // this route just redirects to the provider's login page
}

@Get('<provider>/callback')
@UseGuards(AuthGuard('<provider>'))
async <provider>Callback(@Req() req, @Res() res) {
  const token = this.authService.generateJwt(req.user);
  return res.redirect(`${this.configService.get('CLIENT_URL')}/auth/success?token=${token}`);
}
```

**7. Save the user in your database**

Inside `validate()` (or inside the callback), check if the user already exists by email or provider ID. If not, create a new user through `UsersService`. This keeps your `users` collection as the single source of truth, no matter which provider someone logged in with.

### Frontend

**1. Add a login button**

You don't call this with `fetch` or `axios` — OAuth needs a real browser redirect, so just link to the backend route directly:

```jsx
<button onClick={() => window.location.href = 'http://localhost:3000/auth/<provider>'}>
  Continue with <Provider>
</button>
```

**2. Handle the redirect back**

After a successful login, the backend redirects the browser to:
```
http://localhost:5173/auth/success?token=xxxxx
```

In `client/src/auth/success.jsx`, read the token from the URL, save it, and send the user to the home page:

```jsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, []);

  return <p>Signing you in...</p>;
}
```

**3. Attach the token to future requests**

In `client/src/Api/axios.js`, add an interceptor so every request carries the token automatically:

```javascript
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

That's it — the new provider now works exactly like Google, GitHub, and LinkedIn do in this project.

---

## 👤 Author

**Amir**

- GitHub: [@Amir-017](https://github.com/Amir-017)
- LinkedIn: [Amir Whdan](https://www.linkedin.com/in/amir-whdan-5b4148261/)

---

## 📄 License

This project is open source and available for learning purposes. Feel free to fork it, break it, and use it in your own portfolio.

<div align="center">

If this helped you understand auth or Stripe a little better, a ⭐ on the repo would mean a lot.

</div>
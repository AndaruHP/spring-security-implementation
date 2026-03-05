# Angular Frontend - Spring Security Integration

Aplikasi Angular yang terintegrasi dengan Spring Security Backend.

## Fitur

- **JWT Authentication** - Login/Register dengan username/password
- **OAuth2 Integration** - Login dengan Google dan GitHub
- **Route Guards** - Proteksi halaman berdasarkan auth status
- **HTTP Interceptor** - Otomatis attach JWT token ke setiap request

## Prasyarat

- Node.js 18+
- npm atau yarn
- Angular CLI 17+

## Cara Menjalankan

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Pastikan Backend Berjalan
```bash
cd ../spring-security-implementation
docker-compose up -d
mvn spring-boot:run
```

### 3. Jalankan Frontend
```bash
cd frontend
ng serve
```

Akses aplikasi di: `http://localhost:4200`

### 4. Testing

**Test 1: Login dengan JWT**
- Buka `http://localhost:4200/login`
- Login dengan: `admin` / `password123`
- Harus redirect ke Dashboard

**Test 2: OAuth2 Google**
- Klik "Login with Google"
- Complete OAuth2 flow
- Harus redirect ke Dashboard dengan token

**Test 3: Register**
- Klik link "Register" di halaman login
- Isi form registrasi
- Harus redirect ke login setelah success

**Test 4: Protected Route**
- Coba akses `/dashboard` tanpa login
- Harus redirect ke `/login`

## Struktur Folder

```
src/app/
├── components/
│   ├── login/           # Login form + OAuth2 buttons
│   ├── register/        # Registration form
│   ├── dashboard/       # Protected page (after login)
│   └── oauth2-callback/ # Handle OAuth2 redirect
├── guards/
│   └── auth.guard.ts    # Route protection
├── interceptors/
│   └── auth.interceptor.ts  # JWT token attachment
├── models/
│   └── auth.model.ts    # TypeScript interfaces
├── services/
│   └── auth.service.ts  # Authentication logic
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

## API Endpoints (Backend)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | JWT login |
| `/api/auth/register` | POST | User registration |
| `/api/protected/hello` | GET | Protected test endpoint |
| `/oauth2/authorization/google` | GET | OAuth2 Google |
| `/oauth2/authorization/github` | GET | OAuth2 GitHub |

## Troubleshooting

**Error: CORS**
- Pastikan proxy.conf.json sudah diupdate di angular.json
- Restart `ng serve`

**Error: Token tidak tersimpan**
- Cek localStorage di browser DevTools
- Pastikan tidak ada error saat login

**Error: Routes tidak berfungsi**
- Pastikan AuthGuard sudah benar di-import
- Cek console browser untuk error

## Default Test Users

| Username | Password | Email |
|----------|----------|-------|
| admin | password123 | admin@example.com |
| user1 | password123 | user1@example.com |
| user2 | password123 | user2@example.com |

## Tech Stack

- Angular 17+
- Angular Material (UI)
- RxJS (Reactive Programming)
- TypeScript 5+

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

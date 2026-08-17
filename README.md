# Mini Contact Book

A private address book for professional or personal contacts. Each user
registers/logs in and only ever sees their own contacts. The UI shows a
searchable, alphabetized list on the left and full contact details on the
right.

## Stack

- **Backend:** Django 5 + Django REST Framework, JWT auth (`djangorestframework-simplejwt`)
- **Frontend:** React 18 + Vite, `react-router-dom`, `axios`

## Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env          # adjust as needed

python manage.py migrate
python manage.py createsuperuser   # optional, for /admin/
python manage.py runserver
```

The API runs at `http://127.0.0.1:8000/`.

### Key endpoints

| Method | Endpoint                  | Description                    |
|--------|----------------------------|---------------------------------|
| POST   | `/api/auth/register/`      | Create an account               |
| POST   | `/api/auth/login/`         | Get access/refresh JWT tokens   |
| POST   | `/api/auth/refresh/`       | Refresh an access token         |
| GET    | `/api/auth/me/`            | Current user info               |
| GET    | `/api/contacts/`           | List contacts (`?search=`)      |
| POST   | `/api/contacts/`           | Create a contact                |
| GET    | `/api/contacts/:id/`       | Retrieve a contact              |
| PUT    | `/api/contacts/:id/`       | Update a contact                |
| DELETE | `/api/contacts/:id/`       | Delete a contact                |

All `/api/contacts/` endpoints require a `Bearer` access token and are
scoped to `request.user` — contacts are never visible across accounts.

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173/` and expects the API at
`http://127.0.0.1:8000/api` (override with a `VITE_API_URL` env var if
needed).

## Data model

```
Contact
├── name       (required)
├── email
├── phone
├── company
└── owner      (FK -> auth user, set automatically from the JWT)
```

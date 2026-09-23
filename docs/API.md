# 🔐 Vault API Documentation

Questo documento specifica tutte le API REST del backend Spring Boot di Vault.
Base URL: `http://localhost:8080/api`

---

## 📋 Indice

1. Registrazione
2. Login
3. Profilo Utente
4. Formato Errori
5. Autenticazione JWT

---

## 1. Registrazione

Crea un nuovo utente nel sistema.

**Endpoint:** `POST /api/auth/register`

**Headers:**

    Content-Type: application/json

**Body:**

    {
      "username": "simone",
      "email": "simone@example.com",
      "password": "SuperSecret123!"
    }

**Validazione:**
- `username`: obbligatorio, 3-50 caratteri
- `email`: obbligatoria, formato email valido
- `password`: obbligatoria, minimo 8 caratteri

**Risposta Successo (201 Created):**

    {
      "message": "Utente registrato con successo"
    }

**Errori:**
- `400 Bad Request` → Validazione fallita (vedi sezione 4)
- `409 Conflict` → Email o username già registrati

---

## 2. Login

Autentica un utente e restituisce un token JWT.

**Endpoint:** `POST /api/auth/login`

**Headers:**

    Content-Type: application/json

**Body:**

    {
      "email": "simone@example.com",
      "password": "SuperSecret123!"
    }

**Risposta Successo (200 OK):**

    {
      "token": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzaW1vbmUiLCJpYXQiOjE3OTAxNTQ2MTMsImV4cCI6MTc5MDI0MTAxM30...",
      "username": "simone"
    }

**Il token JWT:**
- Scade dopo 24 ore
- Va passato nell'header `Authorization` di tutte le richieste protette
- Formato: `Bearer <token>`

**Errori:**
- `400 Bad Request` → Validazione fallita
- `401 Unauthorized` → Credenziali non valide (email o password sbagliate)

---

## 3. Profilo Utente

Restituisce i dati dell'utente autenticato.

**Endpoint:** `GET /api/users/me`

**Headers:**

    Authorization: Bearer <token>

**Risposta Successo (200 OK):**

    {
      "id": 1,
      "username": "simone",
      "email": "simone@example.com",
      "createdAt": "2026-09-23T10:55:11.469635"
    }

**Errori:**
- `403 Forbidden` → Token mancante, invalido o scaduto

---

## 4. Formato Errori

### Errore generico (400 / 401 / 409 / 500)

    {
      "error": "Descrizione dell'errore"
    }

### Errore di validazione (400 Bad Request)

Quando fallisce la validazione dei campi (email storta, password corta...):

    {
      "error": "Validazione fallita",
      "fields": {
        "username": "Lo username deve avere tra 3 e 50 caratteri",
        "email": "Formato email non valido",
        "password": "La password deve avere almeno 8 caratteri"
      }
    }

### JSON malformato (400 Bad Request)

    {
      "error": "JSON non valido o malformato"
    }

---

## 5. Autenticazione JWT

### Come usare il token

Dopo il login, salva il token ricevuto e usalo in tutte le richieste protette:

    GET /api/users/me
    Authorization: Bearer eyJhbGciOiJIUzM4NCJ9...

### Gestione token

- **Durata:** 24 ore
- **Rinnovo:** non ancora implementato (futuro)
- **Logout:** il frontend cancella il token da localStorage

### Endpoint protetti

Tutti gli endpoint TRANNE `/api/auth/**` richiedono un token JWT valido nell'header `Authorization`.

---

## 🚀 Esempio di flusso completo

1. **Registrazione** → POST /api/auth/register → 201 Created
2. **Login** → POST /api/auth/login → 200 OK + token
3. **Profilo** → GET /api/users/me con header Authorization → 200 OK + dati utente

---

## 📝 Note per il frontend (Angular)

1. Salva il token in `localStorage` dopo il login
2. Usa un HttpInterceptor per aggiungere automaticamente `Authorization: Bearer <token>` a tutte le richieste
3. Se ricevi 401 o 403 → token scaduto/invalido → riporta l'utente al login
4. Per gli errori di validazione usa il campo `fields` per mostrare i messaggi sotto le caselle del form

---

## 🔜 Prossime API (da implementare)

- Categorie (CRUD)
- PasswordEntry (il vault)
- Generatore password
- Ricerca
- Export/Import vault
# 🔐 Vault API Documentation

Questo documento specifica tutte le API REST del backend Spring Boot di Vault.
Base URL: `http://localhost:8080/api`

---

## 📋 Indice

1. Registrazione
2. Login
3. Profilo Utente
4. Categorie
5. Formato Errori
6. Autenticazione JWT

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
- `400 Bad Request` → Validazione fallita (vedi sezione 5)
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

## 4. Categorie

Tutte le operazioni sulle categorie richiedono l'header:

    Authorization: Bearer <token>

Ogni utente vede e può modificare **solo le proprie categorie**. Tentare di accedere a categorie di altri utenti restituisce `403 Forbidden`.

### 4.1 Elenco categorie

Restituisce tutte le categorie dell'utente, ordinate alfabeticamente.

**Endpoint:** `GET /api/categories`

**Risposta Successo (200 OK):**

    [
      { "id": 1, "name": "Social" },
      { "id": 2, "name": "Lavoro" }
    ]

### 4.2 Crea categoria

**Endpoint:** `POST /api/categories`

**Headers:**

    Content-Type: application/json
    Authorization: Bearer <token>

**Body:**

    { "name": "Social" }

**Validazione:**
- `name`: obbligatorio, massimo 50 caratteri

**Risposta Successo (201 Created):**

    { "id": 1, "name": "Social" }

**Errori:**
- `400 Bad Request` → Validazione fallita (nome vuoto o troppo lungo)

### 4.3 Modifica categoria

**Endpoint:** `PUT /api/categories/{id}`

**Headers:**

    Content-Type: application/json
    Authorization: Bearer <token>

**Body:**

    { "name": "Social Media" }

**Risposta Successo (200 OK):**

    { "id": 1, "name": "Social Media" }

**Errori:**
- `400 Bad Request` → Validazione fallita
- `403 Forbidden` → La categoria esiste ma appartiene a un altro utente
- `404 Not Found` → Categoria inesistente

### 4.4 Elimina categoria

**Endpoint:** `DELETE /api/categories/{id}`

**Headers:**

    Authorization: Bearer <token>

**Risposta Successo (204 No Content):** nessuna risposta

**Errori:**
- `403 Forbidden` → La categoria esiste ma appartiene a un altro utente
- `404 Not Found` → Categoria inesistente

---

## 5. Formato Errori

### Errore generico (400 / 401 / 403 / 404 / 500)

    {
      "error": "Descrizione dell'errore"
    }

### Errore di validazione (400 Bad Request)

Quando fallisce la validazione dei campi (email storta, password corta, nome vuoto...):

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

## 6. Autenticazione JWT

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

1. **Registrazione** → `POST /api/auth/register` → 201 Created
2. **Login** → `POST /api/auth/login` → 200 OK + token
3. **Profilo** → `GET /api/users/me` con header Authorization → 200 OK + dati utente
4. **Crea categoria** → `POST /api/categories` con token → 201 Created
5. **Lista categorie** → `GET /api/categories` con token → 200 OK + elenco

---

## 📝 Note per il frontend (Angular)

1. Salva il token in `localStorage` dopo il login
2. Usa un HttpInterceptor per aggiungere automaticamente `Authorization: Bearer <token>` a tutte le richieste
3. Se ricevi 401 o 403 → token scaduto/invalido → riporta l'utente al login
4. Per gli errori di validazione usa il campo `fields` per mostrare i messaggi sotto le caselle del form
5. Per le categorie mostra i messaggi `403` come "Non hai i permessi per questa categoria"

---

## 🔜 Prossime API (da implementare)

- PasswordEntry (il vault)
- Generatore password
- Ricerca
- Export/Import vault
- Refresh token JWT
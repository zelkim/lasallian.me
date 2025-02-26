# Lasallian.me

## Development

```bash
node index.js
```

### File Structure

* `index.js` - the main entrypoint of the API
* `routes/` - all http-related things, uses services, return status codes
* `services/` (also known as `handlers`) - all business logic, uses db operations (CRUD), map db objects to models
* `models/` - all domain-related objects

## Endpoints

### POST `/user/register`

* Creates user credentials and links to user info.
* Follows the `models/UserCredentials` schema.

> [!NOTE]
> Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character 

* sample request body:
```json
{
    "credentials": {
        "email": "zel_kim@dlsu.edu.ph",
        "password": "usapnatayoulitpls:(" 
    }
}
```

- via `curl`:
```bash
curl -X POST localhost:3000/user/register -H "Content-Type: application/json" -d '{"credentials": {"email": "test123@dlsu.edu.ph", "password": "Qwerty123!"}}'
```

* sample response:
```json
{
    "status": "ok",
    "session_token": "token-here",
    "user": {
        "credentials": {
            "email": "zel_kim@dlsu.edu.ph",
            "password": "..."
        },
        "meta": {
            "created_at": "2025-01-30T05:06:55.095Z",
            "updated_at": "2025-01-30T05:06:55.095Z"
        },
        "_id": "679b08ef4c305e30723ea908",
        "__v": 0
    }
}
```

### POST `/user/setup`

* Requires JWT session token as `Authorization: Bearer <JWT>` header
* Follows the `models/UserInfo` schema.
* sample request body:

```json
{
    "credentials": "679b08ef4c305e30723ea908"
    "vanity": {
        "display_photo": "photolink",
        "cover_photo": "photolink",
        "badges": []
    },
    "info": {
        "name": {
            "first": "Zel",
            "last": "Kim"
        },
        "username": "@zelkim9",
        "batchid": "123",
        "birthdate": "2004-11-10T00:00:00.000Z",
        "program": "BSCS-ST",
        "bio": "something bio",
        "links": {
            "linkedin": "linkany",
            "facebook": "linkany",
            "instagram": "linkany",
            "other": []
        }
    },
}
```

- via `curl`:
```bash
curl -X POST localhost:3000/user/setup \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT-from-register-or-login>" \
-d '{
"vanity": {
    "display_photo": "photolink",
    "cover_photo": "photolink",
    "badges": []
},
"info": {
    "name": {
    "first": "Test",
    "last": "User"
    },
    "username": "@testuser",
    "batchid": "123",
    "program": "BSCS-ST",
    "bio": "Test bio",
    "links": {
    "linkedin": "",
    "facebook": "",
    "instagram": "",
    "other": []
    }
}
}'
```

* sample response:

> [!NOTE]
> the `credentials` field here should match the credentials' `_id` returned on `/user/register` or `/user/login` 

```json
{
  "status": "ok",
  "user": {
    "credentials": "67bf6181633a58782901247c",
    "vanity": {
      "display_photo": "photolink",
      "cover_photo": "photolink",
      "badges": []
    },
    "info": {
      "name": {
        "first": "Test",
        "last": "User"
      },
      "username": "@testuser",
      "batchid": "123",
      "program": "BSCS-ST",
      "bio": "Test bio",
      "links": {
        "linkedin": "",
        "facebook": "",
        "instagram": "",
        "other": []
      }
    },
    "meta": {
      "created_at": "2025-02-26T18:47:25.218Z",
      "updated_at": "2025-02-26T18:47:25.218Z"
    },
    "_id": "67bf61bd633a58782901247e",
    "__v": 0
  }
}
```

### POST `/user/login`

* Authenticates user and returns session token to be used for Authorization Header.

- example request:
```bash
curl -X POST localhost:3000/user/login -H "Content-Type: application/json" -d \
'{"credentials": {"email": "test123@dlsu.edu.ph", "password": "Qwerty123!"}}'
# returns session token to be used for Authorization Header
```

- sample response:

> [!NOTE]
> the `credentials` field here should match the credentials' `_id` returned on `/user/register` or `/user/login` 

```json
{
  "status": "ok",
  "session_token": "<JWT-from-login>",
  "user": {
    "credentials": "67bf6181633a58782901247c",
    "vanity": {
      "display_photo": "photolink",
      "cover_photo": "photolink",
      "badges": []
    },
    "info": {
      "name": {
        "first": "Test",
        "last": "User"
      },
      "links": {
        "linkedin": "",
        "facebook": "",
        "instagram": "",
        "other": []
      },
      "username": "@testuser",
      "batchid": "123",
      "program": "BSCS-ST",
      "bio": "Test bio"
    },
    "meta": {
      "created_at": "2025-02-26T18:47:25.218Z",
      "updated_at": "2025-02-26T18:47:25.218Z"
    },
    "_id": "67bf61bd633a58782901247e",
    "__v": 0
  }
}
```
```

### GET /post/normal

- example request:
```bash
curl -X GET localhost:3000/post/normal -H "Authorization: Bearer <token>"
```

### POST /post/normal
- creates a post with author as the authenticated user
- needs `token`

- example request:
```bash
curl -X POST localhost:3000/post/normal -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d \
'{"title": "second post hehe", "content": "hihi test content here"}'
```

### GET /post/normal/:id
- gets specific post, given it's `id`

- example request:
```bash
curl -X GET localhost:3000/post/normal/<post-id> -H "Authorization: Bearer <token>"
```

### DELETE /post/normal/:id
- deletes a specific post, given it's `id`

- example request:
```bash
curl -X DELETE localhost:3000/post/normal/<post-id> -H "Authorization: Bearer <token>"
```

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
* sample request body:

> [!NOTE]
> Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character 

```json
{
    "credentials": {
        "email": "zel_kim@dlsu.edu.ph",
        "password": "usapnatayoulitpls:(" 
    }
    "info": "679b08ef4c305e30723ea908"
}
```

* sample response:
```json
{
    "status": "ok",
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

* Follows the `models/UserInfo` schema.
* sample request body:

```json
{
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

* sample response:
```json
{
    "status": "ok",
    "user": {
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
        "meta": {
            "created_at": "2025-01-30T05:06:55.095Z",
            "updated_at": "2025-01-30T05:06:55.095Z"
        },
        "_id": "679b08ef4c305e30723ea908",
        "__v": 0
    }
}
```

### POST `/user/login`

* Authenticates user and returns session token to be used for Authorization Header.

- example request:
```bash
curl -X POST localhost:3000/user/login -H "Content-Type: application/json" -d \
'{"credentials": {"email": "test@dlsu.edu.ph", "password": "test123!"}}'
# returns session token to be used for Authorization Header
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

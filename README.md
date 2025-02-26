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

* Follows the `models/UserCredentials` schema.
* sample request body:

```json
{
  "credentials": {
    "email": "zel_kim@dlsu.edu.ph",
    "password": "usapnatayoulitpls:(" 
  }
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
        "vanity": {
            "badges": []
        },
        "info": {
            "name": {
                "first": "Zel",
                "last": "Kim"
            },
            "batchid": "123",
            "birthdate": "2004-11-10T00:00:00.000Z",
            "links": {
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

### POST `/user/setup`

* Follows the `models/UserInfo` schema.
* sample request body:

```json
{
  "info": {
    "name": {
      "first": "Zel",
      "last": "Kim"
    },
    "batchid": "123",
    "birthdate": "2004-11-10"
  }
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
        "vanity": {
            "badges": []
        },
        "info": {
            "name": {
                "first": "Zel",
                "last": "Kim"
            },
            "batchid": "123",
            "birthdate": "2004-11-10T00:00:00.000Z",
            "links": {
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

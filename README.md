# Lasallian.me

## Development

```bash
node index.js
```

### File Structure

- `index.js` - the main entrypoint of the API
- `routes/` - all http-related things, uses services, return status codes
- `services/` (also known as `handlers`) - all business logic, uses db operations (CRUD), map db objects to models
- `models/` - all domain-related objects

# API Documentation

## Authentication

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

- sample response:

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

# Posts

### GET /post/all

- Gets all posts
- mainly for testing

- example request:
```bash
curl -X GET localhost:3000/post/all
```

- response:

> [!IMPORTANT]
> The `author._id` for each post determines who owns the post

```json
[
  {
    "meta": {
      "created_at": "2025-03-04T11:19:11.061Z",
      "updated_at": "2025-03-04T11:19:11.061Z"
    },
    "_id": "67c6e1af4911dd82e8dabb78",
    "title": "second post hehe",
    "content": "hihi test content here",
    "media": [],
    "author": {
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
      "_id": "67bf5b7efd7bafc4558be3bc"
    },
    "__v": 0
  },
  {
    "meta": {
      "created_at": "2025-03-04T11:20:10.770Z",
      "updated_at": "2025-03-04T11:20:10.770Z"
    },
    "_id": "67c6e1ea4911dd82e8dabb89",
    "title": "ANOTHER POST by test2",
    "content": "content example something",
    "media": [],
    "author": {
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
      "_id": "67bf5b7efd7bafc4558be3bc"
    },
    "__v": 0
  },
  {
    "meta": {
      "created_at": "2025-03-04T11:22:41.892Z",
      "updated_at": "2025-03-04T11:22:41.892Z"
    },
    "_id": "67c6e2814911dd82e8dabb94",
    "title": "POST by test101",
    "content": "yes yes content example something",
    "media": [],
    "author": {
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
      "_id": "67bf5d822d93557c2e6aee28"
    },
    "__v": 0
  }
]
```

### GET /post/normal

- Gets all normal posts made by the current authenticated user

- example request:

```bash
curl -X GET localhost:3000/post/normal -H "Authorization: Bearer <token>"
```

- response:
```json
[
  {
    "meta": {
      "created_at": "2025-03-04T11:19:11.061Z",
      "updated_at": "2025-03-04T11:19:11.061Z"
    },
    "_id": "67c6e1af4911dd82e8dabb78",
    "title": "second post hehe",
    "content": "hihi test content here",
    "media": [],
    "author": {
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
      "_id": "67bf5b7efd7bafc4558be3bc"
    },
    "__v": 0
  },
  {
    "meta": {
      "created_at": "2025-03-04T11:20:10.770Z",
      "updated_at": "2025-03-04T11:20:10.770Z"
    },
    "_id": "67c6e1ea4911dd82e8dabb89",
    "title": "ANOTHER POST by test2",
    "content": "content example something",
    "media": [],
    "author": {
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
      "_id": "67bf5b7efd7bafc4558be3bc"
    },
    "__v": 0
  }
]
```

### POST /post/normal

- creates a post with author as the authenticated user
- needs `token`

- example request:

```bash
curl -X POST localhost:3000/post/normal -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d \
'{"title": "POST by test101", "content": "yes yes content example something"}'
```

- response:
```json
{
  "status": "success",
  "savedPost": {
    "title": "POST by test101",
    "content": "yes yes content example something",
    "media": [],
    "meta": {
      "created_at": "2025-03-04T11:22:41.892Z",
      "updated_at": "2025-03-04T11:22:41.892Z"
    },
    "author": "67bf5d822d93557c2e6aee28",
    "_id": "67c6e2814911dd82e8dabb94",
    "__v": 0
  }
}
```

### GET /post/normal/:id

- gets specific post, given the post `_id`

- example request:

```bash
curl -X GET localhost:3000/post/normal/<post-id> -H "Authorization: Bearer <token>"

# example
curl -X GET localhost:3000/post/normal/67c6e2814911dd82e8dabb94 -H "Authorization: Bearer <token>"
```

- response:
```json
{
  "meta": {
    "created_at": "2025-03-04T11:22:41.892Z",
    "updated_at": "2025-03-04T11:22:41.892Z"
  },
  "_id": "67c6e2814911dd82e8dabb94",
  "title": "POST by test101",
  "content": "yes yes content example something",
  "media": [],
  "author": {
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
    "_id": "67bf5d822d93557c2e6aee28"
  },
  "__v": 0
}
```

### PUT `/post/normal/:id`

- updates a specific post.
- needs `JWT token`

- requires `title` (string) and `content` (Object) to be updated
- optional: `media` (string array) field

- example request:

> [!NOTE]
> `content` is of type `Object` so the structure is like this

```bash
# without media
curl -X PUT "http://localhost:3000/post/normal/<post-id>" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <token>" \
-d '{
  "title": "Updated Post Title",
  "content": {"text": "Updated post content"}
}'

# with media
curl -X PUT "http://localhost:3000/post/normal/<post-id>" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <token>" \
-d '{
  "title": "Updated Post Title with media",
  "content": {"text": "Updated post content with media"},
  "media": ["url string here"]
}'
```

- response **without** the optional `media` field:

```json
{
  "status": "success",
  "post": {
    "meta": {
      "created_at": "2025-03-04T11:22:41.892Z",
      "updated_at": "2025-03-04T11:50:45.892Z"
    },
    "_id": "67c6e2814911dd82e8dabb94",
    "title": "Updated Post Title",
    "content": {
      "text": "Updated post content"
    },
    "media": [],
    "author": {
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
      "_id": "67bf5d822d93557c2e6aee28"
    },
    "__v": 0
  }
}
```
- response **with** the optional `media` field

```

- response **with** the optional `media` field
```json
{
  "status": "success",
  "post": {
    "meta": {
      "created_at": "2025-03-04T11:22:41.892Z",
      "updated_at": "2025-03-04T11:54:22.043Z"
    },
    "_id": "67c6e2814911dd82e8dabb94",
    "title": "Updated Post Title",
    "content": {
      "text": "Updated post content"
    },
    "media": ["url string here"],
    "author": {
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
      "_id": "67bf5d822d93557c2e6aee28"
    },
    "__v": 0
  }
}
```

### DELETE /post/normal/:id

- deletes a specific post, given the post `_id` path parameter

- example request:

```bash
curl -X DELETE localhost:3000/post/normal/<post-id> -H "Authorization: Bearer <token>"
```

- response:
```json
{
  "status": "success",
  "message": "Post deleted successfully."
}
```

# Organization

### Create a New Organization

**Endpoint:**

```
POST /org/
```

**Description:**
Creates a new organization.

**Request Body:**

```json
{
  "name": "string",
  "acronym": "string",
  "description": "string",
  "contact": {
    "email": "string",
    "phone": "string"
  },
  "socials": {
    "facebook": "string",
    "twitter": "string",
    "website": "string"
  }
}
```

**Response:**

```json
{
  "_id": "string",
  "name": "string",
  "acronym": "string",
  "description": "string",
  "contact": {
    "email": "string",
    "phone": "string"
  },
  "socials": {
    "facebook": "string",
    "twitter": "string",
    "website": "string"
  }
}
```

---

### Get an Organization by ID

**Endpoint:**

```
GET /org/:id
```

**Description:**
Retrieves an organization by its unique ID.

**Response:**

```json
{
  "_id": "string",
  "name": "string",
  "acronym": "string",
  "description": "string",
  "contact": {
    "email": "string",
    "phone": "string"
  },
  "socials": {
    "facebook": "string",
    "twitter": "string",
    "website": "string"
  }
}
```

---

### Get an Organization by Acronym

**Endpoint:**

```
GET /org/acronym/:acronym
```

**Description:**
Retrieves an organization by its acronym.

**Response:**

```json
{
  "_id": "string",
  "name": "string",
  "acronym": "string",
  "description": "string",
  "contact": {
    "email": "string",
    "phone": "string"
  },
  "socials": {
    "facebook": "string",
    "twitter": "string",
    "website": "string"
  }
}
```

---

### Update an Organization

**Endpoint:**

```
PUT /org/:id
```

**Description:**
Updates an existing organization.

**Request Body:** _(Only include fields to update)_

```json
{
  "name": "string",
  "acronym": "string",
  "description": "string",
  "contact": {
    "email": "string",
    "phone": "string"
  },
  "socials": {
    "facebook": "string",
    "twitter": "string",
    "website": "string"
  }
}
```

**Response:**

```json
{
  "_id": "string",
  "name": "string",
  "acronym": "string",
  "description": "string",
  "contact": {
    "email": "string",
    "phone": "string"
  },
  "socials": {
    "facebook": "string",
    "twitter": "string",
    "website": "string"
  }
}
```

---

### Delete an Organization

**Endpoint:**

```
DELETE /org/:id
```

**Description:**
Deletes an organization by its unique ID.

**Response:**

```json
{
  "message": "Organization deleted successfully"
}
```

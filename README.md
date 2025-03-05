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

- **Request:**
```json
{
    "credentials": {
        "email": "test101@dlsu.edu.ph",
        "password": "Qwerty123!"
    }
}
```

**Request (via `curl`):**
```bash
curl -X POST localhost:3000/user/register -H "Content-Type: application/json" -d '{"credentials": {"email": "test101@dlsu.edu.ph", "password": "Qwerty123!"}}'
```

**Response:**
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

**Request:**
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

**Response:**

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

**Request:**
```bash
curl -X POST localhost:3000/user/login -H "Content-Type: application/json" -d \
'{"credentials": {"email": "test101@dlsu.edu.ph", "password": "Qwerty123!"}}'

# output: returns session token to be used for Authorization Header
```

**Response:**

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

**Request:**
```bash
curl -X GET localhost:3000/post/all
```

**Response:**

> [!IMPORTANT]
> The `author._id` for each post determines who owns the post

```json
[
  {
    "meta": {
      "created_at": "2025-03-04T11:22:41.892Z",
      "updated_at": "2025-03-04T11:54:22.043Z"
    },
    "type": "normal",
    "visibility": "public",
    "_id": "67c6e2814911dd82e8dabb94",
    "title": "Updated Post Title",
    "content": {
      "text": "Updated post content"
    },
    "media": [
      "url string here"
    ],
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
  },
  {
    "meta": {
      "created_at": "2025-03-05T05:53:07.925Z",
      "updated_at": "2025-03-05T05:53:07.925Z"
    },
    "_id": "67c7e6c340f3e5260fc1089c",
    "title": "title, content, and type normal by test101",
    "content": {
      "text": "yes yes content example something"
    },
    "media": [],
    "type": "normal",
    "visibility": "public",
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
  },
]
```

### GET /post/normal

- Gets **ALL NORMAL** posts made by the current authenticated user

**Request:**
```bash
curl -X GET localhost:3000/post/normal -H "Authorization: Bearer <token>"
```

**Response:**
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

### GET /post/normal/:id

- gets specific post, given the post `_id` as path parameter

**Request:**
```bash
curl -X GET localhost:3000/post/normal/<post-id> -H "Authorization: Bearer <token>"

# example request with post's _id as path parameter
curl -X GET localhost:3000/post/normal/67c6e2814911dd82e8dabb94 -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
    "meta": {
      "created_at": "2025-03-05T05:53:07.925Z",
      "updated_at": "2025-03-05T05:53:07.925Z"
    },
    "_id": "67c7e6c340f3e5260fc1089c",
    "title": "title, content, and type normal by test101",
    "content": {
      "text": "yes yes content example something"
    },
    "media": [],
    "type": "normal",
    "visibility": "public",
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

### POST /post

- creates a post with author as the authenticated user
- needs `Authorization: Bearer token` in request headers

- requires 3 fields: `title` (string), `content` (object), `type` (only: `normal` (default), `project`, or `event`) in the request body
- optional fields: `visibility` (only: `public` (default), `organization`, `private`)

> [!IMPORTANT]
> This route is used to create **ALL TYPES** of post

**Request (via `curl`):**
```bash
# all required fields
curl -X POST localhost:3000/post/normal -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d \
'{"title": "POST by test101", "content": {"text": "yes yes content example something"}, "type": "normal"}'

# with visibility field
curl -X POST localhost:3000/post/normal -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d \
'{"title": "POST by test101", "content": {"text": "yes yes content example something"}, "type": "normal", "visibility": "public"}'
```
**Request:**
```json
{
    "title": "POST by test101",
    "content": {
        "text": "yes yes content example something"
    },
    "type": "normal"
}

    // with visibility field
{
    "title": "POST by test101",
    "content": {
        "text": "yes yes content example something"
    },
    "type": "normal",
    "visibility": "public"
}
```


**Response:**
```json
{
  "status": "success",
  "savedPost": {
    "title": "2 wow ANOTHER title, content, and type normal by test101",
    "content": {
      "text": "yes yes content example something"
    },
    "media": [],
    "type": "normal",
    "visibility": "public",
    "meta": {
      "created_at": "2025-03-05T06:05:42.969Z",
      "updated_at": "2025-03-05T06:05:42.969Z"
    },
    "author": "67bf5d822d93557c2e6aee28",
    "_id": "67c7e9b634e511d4d78edc94",
    "__v": 0
  }
}
```


### PUT `/post/:id`

- updates a specific post given the post's `_id` in the path parameter
- needs `Authorization: Bearer <token>` in the request headers

- *required fields in request body:*
    - `title` (string)
    - `content` (Object)

- *optional fields in request body:*
    - `media` (string array)
    - `type` (only: `normal` (default), `project`, or `event`)
    - `visibility` (only: `public` (default), `organization`, `private`)

**Request:**

> [!IMPORTANT]
> `content` is of type `Object` so the structure is like this

```bash
# all required fields (title and content only)
curl -X PUT "http://localhost:3000/post/<post-id>" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <token>" \
-d '{
  "title": "Updated Post Title",
  "content": {"text": "Updated post content"}
}'

# with optional fields
curl -X PUT "http://localhost:3000/post/<post-id>" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <token>" \
-d '{
  "title": "NEW Updated Post Title with media",
  "content": {"text": "NEW Updated post content with media"},
  "media": ["url string here"],
  "visibility": "private",
  "type": "normal",
}'
```

**Response (with all required fields: title and content):**

```json
{
  "status": "success",
  "post": {
    "meta": {
      "created_at": "2025-03-05T06:05:42.969Z",
      "updated_at": "2025-03-05T06:20:23.682Z"
    },
    "_id": "67c7e9b634e511d4d78edc94",
    "title": "NEW Updated Post Title",
    "content": {
      "text": "NEW Updated post content"
    },
    "media": [
      "url string here"
    ],
    "type": "normal",
    "visibility": "public",
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

**Response (with the optional fields):**
```json
{
  "status": "success",
  "post": {
    "meta": {
      "created_at": "2025-03-05T06:33:36.461Z",
      "updated_at": "2025-03-05T06:45:54.846Z"
    },
    "_id": "67c7f04093bca7c3aa369100",
    "title": "NEW Updated Post Title",
    "content": {
      "text": "NEW Updated post content"
    },
    "media": [
      "url string here"
    ],
    "type": "normal",
    "visibility": "private",
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

### DELETE /post/:id

- deletes a specific post, given the post `_id` path parameter

**Request:**
```bash
curl -X DELETE localhost:3000/post/normal/<post-id> -H "Authorization: Bearer <token>"
```

**Response:**
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

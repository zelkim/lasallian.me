# Lasallian.me

# Table of Contents

- [Lasallian.me](#lasallianme)
  - [Development](#development)
    - [File Structure](#file-structure)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
    - [POST /user/register](#post-userregister)
    - [POST /user/setup](#post-usersetup)
    - [POST /user/login](#post-userlogin)
    - [GET /user](#get-user)
    - [GET /user/:id](#get-userid)
    - [POST /user/get-by-email](#post-userget-by-email)
  - [Posts](#posts)
    - [GET /post/all](#get-postall)
    - [GET /post/hashtag/:tag](#get-posthashtagtag)
    - [GET /post/normal](#get-postnormal)
    - [GET /post/project](#get-postproject)
    - [GET /post/event](#get-postevent)
    - [GET /post/normal/:id](#get-postnormalid)
    - [GET /post/project/:id](#get-postprojectid)
    - [GET /post/event/:id](#get-posteventid)
  - [Generic Post Routes](#generic-post-routes)
    - [POST /post](#post-post)
    - [PUT /post/:id](#put-postid)
    - [DELETE /post/:id](#delete-postid)
  - [Hashtag Routes](#hashtag-routes)
    - [GET /hashtag/:tag](#get-hashtagtag)
  - [Organization](#organization)
    - [Create a New Organization](#create-a-new-organization)
    - [Get Organization by ID](#get-organization-by-id)
    - [Get Organization by Acronym](#get-organization-by-acronym)
    - [Update Organization](#update-organization)
    - [Delete Organization](#delete-organization)
    - [Add Member to Organization](#add-member-to-organization)
    - [Get Organization Members](#get-organization-members)

---

## Development

```bash
node index.js
```

---

### File Structure

- `index.js` - the main entrypoint of the API
- `routes/` - all http-related things, uses services, return status codes
- `services/` (also known as `handlers`) - all business logic, uses db operations (CRUD), map db objects to models
- `models/` - all domain-related objects

---

# API Documentation

## Authentication

> [!IMPORTANT]
> FLOW goes like this:
> `/user/register` -> need `/user/setup` -> then `/user/login` -> get valid final session_token from login route

> [!NOTE]
> 1. the `session_token` from the `/user/register` is "INCOMPLETE" and valid only for the `/user/setup` route
> 2. use the valid, final `session_token` from the `/user/login` to access other routes

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
            "email": "test101@dlsu.edu.ph",
            "password": "hashed-password"
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

---

### POST `/user/setup`

* Requires JWT session token as `Authorization: Bearer <JWT>` header
* Follows the `models/UserInfo` schema.

**Request:**
```json
// required fields only
{
    "info": {
        "name": {
            "first": "Test",
            "last": "User"
        },
        "username": "@testuser",
        "batchid": "123",
        "program": "BSCS-ST",
    }
}

// full
{
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
}
```

**Request (via `curl`):**
```bash
# required fields only
curl -X POST localhost:3000/user/setup \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT-from-register-or-login>" \
-d '{
    "info": {
        "name": {
            "first": "Test",
            "last": "User"
        },
        "username": "@testuser",
        "batchid": "123",
        "program": "BSCS-ST",
    }
}'

# full
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

---

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

---

### GET /user

* Gets the currently authenticated user's information
* Requires JWT session token as `Authorization: Bearer <JWT>` header

**Request (via `curl`):**
```bash
curl -X GET localhost:3000/user -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "credentials": {
    "email": "test@dlsu.edu.ph"
  },
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
  }
}
```

---

### GET /user/:id

* Gets user information by user ID
* Requires JWT session token as `Authorization: Bearer <JWT>` header

**Request (via `curl`):**
```json
curl -X GET localhost:3000/user/<user-id> -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "credentials": {
    "_id": "67bf6181633a58782901247c",
    "email": "test@dlsu.edu.ph"
  },
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
  "_id": "67bf61bd633a58782901247e"
}
```

---

### POST /user/get-by-email

* Gets user information by email address
* Requires JWT session token as `Authorization: Bearer <JWT>` header

**Request:**
```json
// requires Authorization: Bearer <JWT>
{
    "email": "w2helloworld@dlsu.edu.ph"
}
```

**Request (via `curl`):**
```bash
curl -X POST localhost:3000/user/get-by-email \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <token>" \
-d '{"email": "w2helloworld@dlsu.edu.ph"}'
```

**Response:**
```json
{
  "credentials": {
    "_id": "67c846968e9f541dfe96893c",
    "email": "w2helloworld@dlsu.edu.ph"
  },
  "vanity": {
    "badges": []
  },
  "info": {
    "name": {
      "first": "w2helloworld",
      "last": "YES"
    },
    "links": {
      "other": []
    },
    "username": "@w2helloworld",
    "batchid": "123",
    "program": "BSIT"
  },
  "meta": {
    "created_at": "2025-03-05T12:46:05.075Z",
    "updated_at": "2025-03-05T12:46:05.075Z"
  },
  "_id": "67c8478d8e9f541dfe96893e"
}
```

---

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

---

### GET /post/hashtag/:tag

* Gets all posts containing the specified hashtag
* Requires JWT session token as `Authorization: Bearer <JWT>` header

**Request (via `curl`):**
```bash
curl -X GET localhost:3000/post/hashtag/<hashtag> -H "Authorization: Bearer <token>"

# example with "test" hashtag
curl -X GET localhost:3000/post/hashtag/test -H "Authorization: Bearer <token>"
```

**Response:**
```json
// with "test" hashtag
[
  {
    "meta": {
      "created_at": "2025-03-07T06:21:18.952Z",
      "updated_at": "2025-03-07T06:21:18.952Z"
    },
    "_id": "67ca905ed2ec1cc0267c90c7",
    "title": "Post with hashtags 3",
    "content": {
      "text": "Testing hastag post #test #javascript"
    },
    "media": [],
    "type": "normal",
    "visibility": "public",
    "author": {
      "vanity": {
        "badges": []
      },
      "info": {
        "name": {
          "first": "w2helloworld",
          "last": "YES"
        },
        "links": {
          "other": []
        },
        "username": "@w2helloworld",
        "batchid": "123",
        "program": "BSIT"
      },
      "_id": "67c8478d8e9f541dfe96893e"
    },
    "hashtags": [
      {
        "tag": "#test",
        "_id": "67ca905ed2ec1cc0267c90c8"
      },
      {
        "tag": "#javascript",
        "_id": "67ca905ed2ec1cc0267c90c9"
      }
    ],
    "__v": 0
  },
  {
    "meta": {
      "created_at": "2025-03-07T06:45:57.545Z",
      "updated_at": "2025-03-07T06:45:57.545Z"
    },
    "_id": "67ca96256d1229bbc5009f47",
    "title": "Post with hashtags 4",
    "content": {
      "text": "Testing hastag post 2#test"
    },
    "media": [],
    "type": "normal",
    "visibility": "public",
    "author": {
      "vanity": {
        "badges": []
      },
      "info": {
        "name": {
          "first": "w2helloworld",
          "last": "YES"
        },
        "links": {
          "other": []
        },
        "username": "@w2helloworld",
        "batchid": "123",
        "program": "BSIT"
      },
      "_id": "67c8478d8e9f541dfe96893e"
    },
    "hashtags": [
      {
        "tag": "#test",
        "_id": "67ca96256d1229bbc5009f48"
      }
    ],
    "__v": 0
  }
]
```

---

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

---

### GET /post/project

- Gets **ALL PROJECT** posts made by the current authenticated user
- Needs `Authorization: Bearer <token>` in request headers
- Returns array of project posts where the authenticated user is the author

**Request:**
```bash
curl -X GET localhost:3000/post/project -H "Authorization: Bearer <token>"
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
    "title": "Personal Portfolio Website",
    "content": {
      "text": "A showcase of my web development skills",
      "technologies": ["React", "TailwindCSS"],
      "github": "https://github.com/username/portfolio"
    },
    "media": ["screenshot1.jpg", "screenshot2.jpg"],
    "type": "project",
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
    "title": "Mobile App Project",
    "content": {
      "text": "A cross-platform mobile application",
      "technologies": ["React Native", "Firebase"],
      "playstore": "https://play.google.com/store/apps/details?id=com.example"
    },
    "media": ["app-preview.gif"],
    "type": "project",
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
      "_id": "67bf5b7efd7bafc4558be3bc"
    },
    "__v": 0
  }
]
```

---

### GET /post/event

- Gets **ALL EVENT** posts made by the current authenticated user
- Needs `Authorization: Bearer <token>` in request headers
- Returns array of event posts where the authenticated user is the author
- Includes organization details for each event
- Only returns events that are either public or belong to the user's organization

**Request:**
```bash
curl -X GET localhost:3000/post/event -H "Authorization: Bearer <token>"
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
    "title": "Tech Talk 2025",
    "content": {
      "text": "Join us for an evening of technology insights",
      "date": "2025-04-15T18:00:00.000Z",
      "venue": "Andrew Building Room 1880",
      "registration_link": "https://example.com/register"
    },
    "media": ["event-poster.jpg"],
    "type": "event",
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
      "_id": "67bf5b7efd7bafc4558be3bc"
    },
    "organization": {
      "vanity": {
        "display_photo": "org-logo.jpg",
        "cover_photo": "org-banner.jpg",
        "badges": []
      },
      "info": {
        "name": "La Salle Computer Society",
        "acronym": "LSCS",
        "founding": "1990-01-01T00:00:00.000Z",
        "bio": "DLSU's premier computing society"
      },
      "_id": "67bf5d822d93557c2e6aee30"
    },
    "__v": 0
  }
]
```

---

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

---

### GET /post/project/:id

- Gets a specific project post, given the post `_id` as path parameter
- Needs `Authorization: Bearer <token>` in request headers
- Will only return posts of type "project"

**Request:**
```bash
curl -X GET localhost:3000/post/project/<post-id> -H "Authorization: Bearer <token>"

# example request with post's _id as path parameter
curl -X GET localhost:3000/post/project/67c6e2814911dd82e8dabb94 -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
    "meta": {
      "created_at": "2025-03-05T05:53:07.925Z",
      "updated_at": "2025-03-05T05:53:07.925Z"
    },
    "_id": "67c7e6c340f3e5260fc1089c",
    "title": "My Portfolio Project",
    "content": {
      "text": "Project description here",
      "technologies": ["React", "Node.js"]
    },
    "media": ["project-screenshot.jpg"],
    "type": "project",
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
---

### GET /post/event/:id

- Gets a specific event post, given the post `_id` as path parameter
- Needs `Authorization: Bearer <token>` in request headers
- Will only return posts of type "event"
- Includes organization details since events are organization-specific

**Request:**
```bash
curl -X GET localhost:3000/post/event/<post-id> -H "Authorization: Bearer <token>"

# example request with post's _id as path parameter
curl -X GET localhost:3000/post/event/67c6e2814911dd82e8dabb94 -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
    "meta": {
      "created_at": "2025-03-05T05:53:07.925Z",
      "updated_at": "2025-03-05T05:53:07.925Z"
    },
    "_id": "67c7e6c340f3e5260fc1089c",
    "title": "Annual Tech Conference",
    "content": {
      "text": "Join us for our annual tech conference!",
      "date": "2025-04-01T09:00:00.000Z",
      "location": "Henry Sy Sr. Hall"
    },
    "media": ["event-banner.jpg"],
    "type": "event",
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
    "organization": {
      "vanity": {
        "display_photo": "org-photo.jpg",
        "cover_photo": "org-cover.jpg",
        "badges": []
      },
      "info": {
        "name": "La Salle Computer Society",
        "acronym": "LSCS",
        "founding": "1990-01-01T00:00:00.000Z",
        "bio": "DLSU's premier computing society"
      },
      "_id": "67bf5d822d93557c2e6aee30"
    },
    "__v": 0
}
```

## Generic Post Routes

- for creating a post regardless of type: `POST /post`
- for updating a post: `PUT /post/:id`
- for deleting a post: `DELETE /post/:id`

---

### POST /post

- creates a post with author as the authenticated user
- needs `Authorization: Bearer token` in request headers

- *required fields in request body:*
    - `content` (Object)

- *optional fields in request body:*
    - `title` (string)
    - `media` (string array)
    - `type` (only: `normal`, `project`, or `event`) - by default this is set to be `normal`
    - `visibility` (only: `public`, `organization`, `private`) - by default this is set to be `public`

> [!IMPORTANT]
> This route is used to create **ALL TYPES** of post

**Request (via `curl`):**
```bash
# all required fields
curl -X POST localhost:3000/post -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d \
'{"content": {"text": "yes yes content example something"}}'

# with optional fields
curl -X POST localhost:3000/post -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d \
'{"content": {"text": "yes yes content example something"}, "title": "POST by test101", "type": "normal", "visibility": "public", "media": ["url string test2"]}'
```
**Request:**
```json
// with only required fields
{
    "content": {
        "text": "yes yes content example something"
    },
}

// with optional fields
{
    "content": {
        "text": "yes yes content example something"
    },
    "title": "POST by test101",
    "type": "normal",
    "visibility": "public",
    "media": ["url string test2"]
}
```


**Response:**
```json
// with only required fields
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

// with optional fields
{
  "status": "success",
  "savedPost": {
    "title": "test2 AGAIN new post normal required fields",
    "content": {
      "text": "PROJECT econtentyes yes content example something"
    },
    "media": [
      "url string test2"
    ],
    "type": "normal",
    "visibility": "public",
    "meta": {
      "created_at": "2025-03-05T08:02:54.117Z",
      "updated_at": "2025-03-05T08:02:54.117Z"
    },
    "author": "67bf5b7efd7bafc4558be3bc",
    "_id": "67c8052ed1b60e6d549582cc",
    "__v": 0
  }
}
```

---

### PUT `/post/:id`

- updates a specific post given the post's `_id` in the path parameter
- needs `Authorization: Bearer <token>` in the request headers

- *required fields in request body:*
    - `title` (string)
    - `content` (Object)

- *optional fields in request body:*
    - `media` (string array)
    - `type` (only: `normal`, `project`, or `event`) - by default this is set to be `normal`
    - `visibility` (only: `public`, `organization`, `private`) - by default this is set to be `public`

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

---

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

# Hashtag Routes

### GET /hashtag/:tag

* Searches for hashtags matching the given tag
* Requires JWT session token as `Authorization: Bearer <JWT>` header

**Request:**
```bash
curl -X GET localhost:3000/hashtag/test -H "Authorization: Bearer <token>"
```

**Response:**
```json
[
  {
    "tag": "#test",
    "postCount": 2,
    "posts": [
      {
        "postId": "67ca905ed2ec1cc0267c90c7",
        "title": "Post with hashtags 3",
        "type": "normal",
        "visibility": "public"
      },
      {
        "postId": "67ca96256d1229bbc5009f47",
        "title": "Post with hashtags 4",
        "type": "normal",
        "visibility": "public"
      }
    ]
  }
]
```

# Organization

## Create a New Organization

**Endpoint:**
```
POST /org/
```

**Description:**
* Creates a new organization. 
* Requires  `Authorization: Bearer <JWT>` header

**Request Body:**
```json
{
    "info": {
        "name": "Sample Organization",
        "acronym": "SORG",
        "founding": "2024-03-01",
        "bio": "A sample organization for testing",
        "links": {
            "linkedin": "https://linkedin.com/sampleorg",
            "facebook": "https://facebook.com/sampleorg",
            "instagram": "https://instagram.com/sampleorg",
            "other": ["https://other-link.com"]
        }
    },
    "vanity": {
        "display_photo": "https://example.com/display.jpg",
        "cover_photo": "https://example.com/cover.jpg",
        "badges": []
    }
}
```

**Response:**
```json
{
    "status": "ok",
    "msg": "Organization created.",
    "data": {
        "vanity": {
            "display_photo": "https://example.com/display.jpg",
            "cover_photo": "https://example.com/cover.jpg",
            "badges": []
        },
        "info": {
            "name": "Sample Organization",
            "acronym": "SORG",
            "founding": "2024-03-01T00:00:00.000Z",
            "bio": "A sample organization for testing",
            "links": {
                "linkedin": "https://linkedin.com/sampleorg",
                "facebook": "https://facebook.com/sampleorg",
                "instagram": "https://instagram.com/sampleorg",
                "other": ["https://other-link.com"]
            }
        },
        "members": [],
        "meta": {
            "created_at": "2024-03-07T06:21:18.952Z",
            "updated_at": "2024-03-07T06:21:18.952Z"
        },
        "_id": "67ca905ed2ec1cc0267c90c7"
    }
}
```

## Get Organization by ID

**Endpoint:**
```
GET /org/:id
```

**Response:**
```json
{
  "status": "ok",
  "data": {
    "vanity": {
      "badges": [],
      "display_photo": "https://example.com/new-display.jpg"
    },
    "info": {
      "links": {
        "other": [],
        "linkedin": "https://linkedin.com/updated",
        "facebook": "https://facebook.com/updated"
      },
      "name": "Updated Organization Name",
      "acronym": "SORG",
      "bio": "Updated organization description"
    },
    "meta": {
      "created_at": "2025-03-06T11:05:39.032Z",
      "updated_at": "2025-03-06T15:35:10.546Z"
    },
    "_id": "67c981837c12b0d3b83b702d",
    "members": [
      "67c9c0aec3169561f04ecf77"
    ],
    "__v": 0
  }
}
```

## Get Organization by Acronym

**Endpoint:**
```
GET /org/acronym/:acronym
```

**Response:**
Same format as Get Organization by ID.

## Update Organization

**Endpoint:**
```
PUT /org/:id
```

**Description:**
Updates an existing organization. Requires authentication.

**Request Body:** (include only fields to update)
```json
{
    "info": {
        "name": "Updated Organization Name",
        "acronym": "SORG",
        "bio": "Updated organization description",
        "links": {
            "linkedin": "https://linkedin.com/updated",
            "facebook": "https://facebook.com/updated"
        }
    },
    "vanity": {
        "display_photo": "https://example.com/new-display.jpg"
    }
}
```

**Response:**
```json
{
    "status": "success",
    "organization": {
        // Updated organization object
    }
}
```

## Delete Organization

**Endpoint:**
```
DELETE /org/:id
```

**Description:**
Deletes an organization. Requires authentication.

**Response:**
```json
{
    "status": "success",
    "message": "Organization deleted successfully."
}
```

## Add Member to Organization

**Endpoint:**
```
POST /org/:orgId/members
```

**Description:**
Adds the authenticated user as a member of the organization.

**Request Body:** (optional)
```json
{
    "position": "MEM"  // Optional: Default is "MEM"
}
```

**Response:**
```json
{
    "status": "success",
    "member": {
        "author": "user_id",
        "org": "org_id",
        "joindate": "2024-03-07T06:21:18.952Z",
        "position": "MEM",
        "meta": {
            "created_at": "2024-03-07T06:21:18.952Z",
            "updated_at": "2024-03-07T06:21:18.952Z"
        }
    }
}
```

## Get Organization Members

**Endpoint:**
```
GET /org/:orgId/members
```

**Description:**
Gets all members of an organization. Requires authentication.

**Response:**
```json
{
  "status": "success",
  "count": 1,
  "members": [
    {
      "_id": "67c9c0aec3169561f04ecf77",
      "user": {
        "vanity": {
          "badges": []
        },
        "info": {
          "name": {
            "first": "w2helloworld",
            "last": "YES"
          },
          "links": {
            "other": []
          },
          "username": "@w2helloworld",
          "batchid": "123",
          "program": "BSIT"
        },
        "meta": {
          "created_at": "2025-03-05T12:46:05.075Z",
          "updated_at": "2025-03-05T12:46:05.075Z"
        },
        "_id": "67c8478d8e9f541dfe96893e"
      },
      "position": "MEM",
      "joindate": "2025-03-06T15:35:10.481Z",
      "meta": {
        "created_at": "2025-03-06T15:35:10.481Z",
        "updated_at": "2025-03-06T15:35:10.481Z"
      }
    }
  ]
}
```

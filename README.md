# Lasallian.me

## Development

### File Structure

* `index.js` - the main entrypoint of the API
* `routes/` - all http-related things, uses services, return status codes
* `services/` (also known as `handlers`) - all business logic, uses db operations (CRUD), map db objects to models
* `models/` - all domain-related objects
* `config/` - everything third-party related configs (database connection, auth, etc.)

## Endpoints

### POST `/user/register`
* Follows the `models/User` schema.
* sample request body:
```json
{
  "credentials": {
    "email": "zel_kim@dlsu.edu.ph",
    "password": "usapnatayoulitpls:(" 
  },
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

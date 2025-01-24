# Lasallian.me

## Development

### File Structure

* `index.js` - the main entrypoint of the API
* `routes/` - all http-related things, uses services, return status codes
* `services/` (also known as `handlers`) - all business logic, uses db operations (CRUD), map db objects to models
* `models/` - all domain-related objects
* `config/` - everything third-party related configs (database connection, auth, etc.)

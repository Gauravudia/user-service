
### README for User Service

```markdown
# User Service

This service handles user-related operations such as sign-up, login, and user management.

## Prerequisites

- Node.js
- PostgreSQL
- Docker (optional, for running PostgreSQL in a container)

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd user-service
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

## Configuration

Create a `.env` file in the root directory and set the environment variables:
```env
DB_USER=gaurav
DB_HOST=localhost
DB_NAME=user_service_db
DB_PASSWORD=gaurav
DB_PORT=5436
JWT_SECRET=your_jwt_secret
PORT=3001
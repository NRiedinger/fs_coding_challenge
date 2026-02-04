# Smart Support Inbox
This project was created as part of a coding challenge. The goal was to build a small full-stack application that helps a customer support team triage inbound messages. 
The system stores support tickets, analyzes them, suggest replies and tracks wether those 
suggestions were useful.

For prioritizing, categorizing and suggesting replies, this system uses an OpenAI Agent
which analyzes every newly created ticket.


> **Note**: This application is just a proof-of-concept and not production ready. It does not contain authentication and ticket-creation and -handling is done in one place so it's not suitable for real-world-usage.

## Backend (Python Django)

### Requirements
> **Note**: The mentioned versions are the ones I used and not necessarily the minimum versions
- **Python** 3.12.1
- **PostgreSQL** 18.1

### Setup

1. Go to backend folder
    ```shell
    cd .\backend\
    ```

2. Create virtual environment
    ```shell
    python -m venv .env
    ```

3. Activate virtual environment
    ```shell
    .\.env\Scripts\activate
    ```

4. Install dependencies
    ```shell
    pip install django djangorestframework psycopg2 django-environ openai-agents
    ```

5. Setup database \
    Create PostgreSQL database by executing in psql-shell:
    ```sql
    /* database name must match your settings.py */
    CREATE DATABASE tickets_db;

    /* username and password must match your settings.py */
    CREATE USER admin WITH PASSWORD 'admin';

    /* needed to create database during testing */
    ALTER USER admin CREATEDB; 

    /* grant privileges for tickets_db */
    GRANT ALL PRIVILEGES ON DATABASE tickets_db TO admin;
    ALTER DATABASE tickets_db OWNER TO admin;
    ```

    Create datatables for tickets:

    ```shell
    python manage.py makemigrations tickets
    python manage.py migrate tickets
    ```
    
5. Make sure the environment variable `OPENAI_API_KEY` is set.

5. Run development server
    ```shell
    python manage.py runserver
    ```

### Testing

Run unit tests with
```shell
python manage.py test tickets
```

## Frontend (Angular)

### Requirements
> **Note**: The mentioned versions are the ones I used and not necessarily the minimum versions
- **Node.js** 25.5.0

### Setup

1. Go to frontend folder
    ```shell
    cd .\frontend\
    ```

2. Install dependencies
    ```shell
    npm install
    ```

3. Run development server
    ```shell
    npm start
    ```

### Testing

Run unit tests with
```shell
npm test
```

## Design choices

Filtering, pagination and sorting of the ticket list is done on the client. This results in fewer requests to the backend and a smoother user experience with a lower ticket volume.

For a much higher volume of tickets, backend filtering, pagination and sorting would be preferred 
to minimize initial loading times and memory use for the client.
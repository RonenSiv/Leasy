# Leasy Project - Server Setup Guide

## Getting Started

Follow these steps to set up and run the server for the first time.

### Prerequisites

-   PHP 8.2 or higher
-   Composer
-   MySQL or any other database supported by Laravel

### Steps to Run the Server

1. **Clone the repository**  
   If you haven't already, clone the project repository to your local machine.

    ```bash
    git clone <your-repository-url>
    cd Leasy
    ```

2. **Install dependencies**  
   Install all required PHP packages using Composer.

    ```bash
    composer install
    ```

3. **Add the `.env` file**  
   Create a copy of the `.env.example` file and rename it to `.env`.

    ```bash
    cp .env.example .env
    ```

4. **Update `.env` with the following configurations**  
   Add these lines to your `.env` file:

    ```env
    TELESCOPE_ENABLED=false
    ACCESS_TOKEN_NAME="LeasyToken"
    STORAGE_SERVICE='local'
    STORAGE_PATH = "app/public"
    ```

    Then, make sure to fill in your database details as follows:

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=leasy_db
    DB_USERNAME=root
    DB_PASSWORD=your_password
    ```

5. **Set up Laravel Passport keys**  
   Generate encryption keys required by Laravel Passport.

    ```bash
    php artisan passport:keys
    ```

6. **Generate the application key**  
   Run the following command to generate a new application key.

    ```bash
    php artisan key:generate
    ```

7. **Optimize the application**  
   Run the optimization command to cache configuration and routes.

    ```bash
    php artisan optimize
    ```

8. **Generate API documentation**  
   Generate Swagger documentation using l5-swagger.

    ```bash
    php artisan l5-swagger:generate
    ```

9. **Run database migrations**  
   Migrate the database schema to create the necessary tables. If the database doesn't exist, you will be prompted to create it; enter `yes`.

    ```bash
    php artisan migrate
    ```

10. **Create a personal access client for Passport**  
    Create a personal access token client for Laravel Passport. When prompted, enter the token name `LeasyToken`.

    ```bash
    php artisan passport:client --personal
    ```

11. **Run the development server**  
    Start the Laravel development server.

    ```bash
    php artisan serve
    ```

That's it! Your server should now be up and running.

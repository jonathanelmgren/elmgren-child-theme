
# WordPress Child Theme Development with Docker

This project provides a template for developing WordPress child themes using Docker. It incorporates modern development tools like TailwindCSS, Webpack, and Sass. The project also facilitates local HTTPS development by generating SSL certificates and provides utilities to synchronize with a production environment.

## Technologies Used:
- **Docker**: Containerizes the WordPress environment.
- **Webpack**: Bundles and optimizes assets.
- **TailwindCSS**: A utility-first CSS framework.
- **Sass**: A popular CSS preprocessor.
- **BrowserSync**: Synchronizes browsers and automatically refreshes pages during development.

## Getting Started:

### 1. Clone the Repository
```bash
git clone https://github.com/jonathanelmgren/elmgren-child-theme project-name
cd project-name
```

The project name should for simplicity always be the same as the theme name (COMPOSE_PROJECT_NAME).

### 2. Configure Environment Variables
Edit the `.env` file in the root directory. Set the necessary environment variables like `WORDPRESS_DB_HOST`, `WORDPRESS_SITE_URL`, etc. Here are some key variables:
- `COMPOSE_PROJECT_NAME`: The name of your Docker Compose project.
- `GITHUB_TOKEN`: Your GitHub token, if required.
- `WORDPRESS_DB_HOST`, `WORDPRESS_DB_USER`, etc.: WordPress database configurations.
- `MARIADB_ROOT_PASSWORD`, `MARIADB_DATABASE`: MariaDB configurations.
- `SYNC_PROD_SSH_USER`, `SYNC_PROD_SSH_HOST`, etc.: Details for syncing with the production environment.

### 3. Generate SSL Certificates
Run the `ssl.sh` script to generate a self-signed SSL certificate for local development.
```bash
docker/ssl/ssl.sh
```
**Note**: For macOS users, the script also adds the certificate to the system keychain. Ensure you have the necessary permissions.

### 4. Build and Start the Docker Containers
Use Docker Compose to build and run the services.
```bash
docker-compose up --build
```

### 5. Access the WordPress Site
Once the containers are up and running, you can access the WordPress site via the URL you set in the `.env` file (e.g., `https://elmgren-child-theme.potato`).

## Synchronizing with Production:

To sync your local development environment with the production server, use the `sync_prod.sh` script. This script fetches the production database and content, excluding the current theme.
```bash
docker/sync_prod.sh
```

## Database Migration:

If you're importing a database from another environment, you might need to update the URLs to match your local development setup. The `zwpmigrate.sh` script helps in this process by updating various WordPress database tables.

NOTE: This shell script runs automatically on database initial load. Do not run it manually unless you know what you are doing.

#### 1. Clear the docker database volume using `docker volume rm <VOLUME>`. For example:
```bash
docker volume rm elmgren-child-theme_db
```

#### 2. Add your SQL dump in `docker/sql`.
#### 3. Start your Docker containers using `docker compose up`.

## Docker Content and SQL Folders:

- `content`: This directory should contain a `wp-content.zip` file. This ZIP file should contain the `wp-content` directory with all its assets. If you're manually adding content for the initial load, ensure that when unzipped, it results in a `wp-content` directory structure. If you're using the synchronization script, it will handle the extraction process and create the `wp-content` directory structure as needed.
- `sql`: Contains SQL dumps, including the one fetched from the production server during synchronization. If you have a custom database dump, you can place it here for initialization during the container's first startup.

## Development Commands:

- **Build Production Assets**: 
  ```bash
  npm run build
  ```

- **Start Development Mode with Watch**: 
  ```bash
  npm run dev
  ```

## Contributing:
For contributions, please create a new branch and submit a Pull Request.


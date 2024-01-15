# Fetch the latest Wordpress image
FROM wordpress:latest

# Install required packages and clean up in the same layer
RUN apt-get update && \
    apt-get install -y unzip curl jq openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Update Node.js to a newer LTS version if necessary
RUN curl -sS https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Fetch the latest theme files from GitHub
RUN mkdir -p /usr/src/wordpress/wp-content/themes/elmgren-theme && \
    curl -s https://api.github.com/repos/jonathanelmgren/elmgren-theme/releases/latest \
    | jq -r ".assets[] | select(.name == \"elmgren-theme.zip\") | .browser_download_url" \
    | xargs curl -LJO && \
    unzip -d /usr/src/wordpress/wp-content/themes/elmgren-theme elmgren-theme.zip && \
    rm -f elmgren-theme.zip

# Enable SSL in Apache
RUN a2enmod ssl && \
    a2enmod socache_shmcb && \
    a2ensite default-ssl

# Copy SSL certificates and update Apache configuration
COPY docker/ssl/*.crt /etc/ssl/certs/server.crt
COPY docker/ssl/*.key /etc/ssl/private/server.key
RUN sed -i '/SSLCertificateFile.*snakeoil\.pem/c\SSLCertificateFile \/etc\/ssl\/certs\/server.crt' /etc/apache2/sites-available/default-ssl.conf && \
    sed -i '/SSLCertificateKeyFile.*snakeoil\.key/c\SSLCertificateKeyFile \/etc\/ssl\/private\/server.key' /etc/apache2/sites-available/default-ssl.conf

# Fetch the latest Wordpress image
FROM wordpress:latest

# Install required packages
RUN apt-get update && \
    apt-get install -y nodejs unzip curl jq && \
    curl -s https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer && \
    curl -s https://deb.nodesource.com/setup_16.x | bash && \
    apt-get install -y nodejs && \
    apt-get install unzip

# Fetch the latest theme files from GitHub
RUN mkdir -p /usr/src/wordpress/wp-content/themes/elmgren-theme && \
    curl -s https://api.github.com/repos/jonathanelmgren/elmgren-theme/releases/latest \
    | jq -r ".assets[] | select(.name == \"elmgren-theme.zip\") | .browser_download_url" \
    | xargs curl -LJO && \
    unzip -d /usr/src/wordpress/wp-content/themes/elmgren-theme elmgren-theme.zip && \
    rm -f elmgren-theme.zip

# Install SSL dependencies
RUN apt-get update && \
    apt-get install -y openssl && \
    a2enmod ssl && \
    a2enmod socache_shmcb && \
    a2ensite default-ssl && \
    rm -rf /var/lib/apt/lists/*

# Generate SSL certificate and key
COPY docker/ssl/*.crt /etc/ssl/certs/server.crt
COPY docker/ssl/*.key /etc/ssl/private/server.key

RUN sed -i '/SSLCertificateFile.*snakeoil\.pem/c\SSLCertificateFile \/etc\/ssl\/certs\/server.crt' /etc/apache2/sites-available/default-ssl.conf
RUN sed -i '/SSLCertificateKeyFile.*snakeoil\.key/c\SSLCertificateKeyFile \/etc\/ssl\/private\/server.key' /etc/apache2/sites-available/default-ssl.conf

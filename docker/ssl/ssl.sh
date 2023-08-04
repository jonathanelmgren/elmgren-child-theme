#!/bin/bash

source ../../.env

# Step 1: Strip the http schema from the domain name
domain=$(echo $WORDPRESS_SITE_URL | sed 's#^http[s]*://##')

# Step 2: Add the domain name to the hosts file
sudo sh -c "echo '127.0.0.1\t$domain' >> /etc/hosts"

# Step 3: Generate a self-signed SSL certificate
echo "domain=$domain" | cat - openssl.cfg > tmp.cfg

openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.crt -days 365 -nodes -subj "/CN=$domain" -extensions v3_req -config tmp.cfg

rm tmp.cfg
# Step 4: Add the certificate to the keychain on macOS
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain server.crt

echo "Done!"

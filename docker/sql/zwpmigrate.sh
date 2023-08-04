#!/usr/bin/env sh

# Shell script to update URLs to local specified in .env file. Starts with z due to mariadb loading files in alphabetic order
echo "* Check site url modification"

PREFIX=$WORDPRESS_TABLE_PREFIX
SITE_URL=$WORDPRESS_SITE_URL
OLD_SITE=$(mysql --user=root --password=root -h localhost -sN $MARIADB_DATABASE -e "select option_value from ${PREFIX}options WHERE option_name = 'siteurl';")

echo "* Change site url"
mysql --user=root --password=root -h localhost $MARIADB_DATABASE -e "UPDATE ${PREFIX}options
SET option_value = replace(option_value, '$OLD_SITE', '$SITE_URL')
WHERE option_name = 'home'
OR option_name = 'siteurl';
"

echo "* Change guid url"
mysql --user=root --password=root -h localhost $MARIADB_DATABASE -e """UPDATE ${PREFIX}posts
SET guid = REPLACE (guid, '$OLD_SITE', '$SITE_URL');
"""

echo "* Change media's url in articles and pages"
mysql --user=root --password=root -h localhost $MARIADB_DATABASE -e """UPDATE ${PREFIX}posts
SET post_content = REPLACE (post_content, '$OLD_SITE', '$SITE_URL');
"""

echo "* Change url of meta data"
mysql --user=root --password=root -h localhost $MARIADB_DATABASE -e """UPDATE ${PREFIX}postmeta
SET meta_value = REPLACE (meta_value, '$OLD_SITE','$SITE_URL');
"""

echo "* New site url is now $SITE_URL (old was $OLD_SITE)"
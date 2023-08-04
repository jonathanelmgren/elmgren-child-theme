#!/bin/bash
source ../.env

SSHCMD=$SYNC_PROD_SSH_USER@$SYNC_PROD_SSH_HOST

docker compose down
ssh $SSHCMD "mysqldump --user='"$SYNC_PROD_DB_USER"' --password='"$SYNC_PROD_DB_PASS"' $SYNC_PROD_DB_NAME > ~/dump.sql && exit" &&
rsync -avz -e ssh $SSHCMD:~/dump.sql ./sql &&
ssh $SSHCMD 'rm ~/dump.sql' &&
ssh $SSHCMD "cd $SYNC_PROD_CONTENT_PATH && tar -czf - --exclude='themes/$COMPOSE_PROJECT_NAME' ." | zip > ./content/wp-content.zip &&

ssh $SSHCMD "cd $SYNC_PROD_CONTENT_PATH && zip -r -q wp-content.zip --exclude='themes/$COMPOSE_PROJECT_NAME' ." && \
scp $SSHCMD:$SYNC_PROD_CONTENT_PATH/wp-content.zip ./content/wp-content.zip && \
ssh $SSHCMD "rm -f $SYNC_PROD_CONTENT_PATH/wp-content.zip"

rm -rf ../.wp/wp-content/*
unzip -o ./content/wp-content.zip -d ../.wp/wp-content/
docker volume rm "$COMPOSE_PROJECT_NAME"_db
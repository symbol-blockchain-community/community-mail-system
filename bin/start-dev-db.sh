docker run \
    --name mail-system \
    -p 5432:5432 \
    -e POSTGRES_USER=test \
    -e POSTGRES_PASSWORD=password \
    -e POSTGRES_DB=mail \
    -d \
    --rm \
    postgres
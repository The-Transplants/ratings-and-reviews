FROM postgres:latest

RUN mkdir /seed/
COPY reviews/*.csv /seed/

RUN chmod a+rx /seed/

COPY database/schema.sql /docker-entrypoint-initdb.d
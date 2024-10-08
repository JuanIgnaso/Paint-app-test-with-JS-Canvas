FROM httpd
RUN  rm /usr/local/apache2/htdocs/*
COPY ./canvas_app/  /usr/local/apache2/htdocs/
EXPOSE 80




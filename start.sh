
#!/bin/sh
json-server --watch /app/db.json --port 3000 &
nginx -g 'daemon off;'

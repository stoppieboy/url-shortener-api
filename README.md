# URL Shortening API Service

update the pg_hba.conf file in postgres container to allow connections from all hosts for testing.
Add "host   all     all     all     trust" in pg_hba.conf

```bash
docker exec -it db /bin/bash
echo host all all all trust>>/var/lib/postgresql/data/pg_hba.conf
```

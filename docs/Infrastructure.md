# Suggested Infrastructure

## Images

There's three container images to deploy:

- [Nginx server to host the frontend](../frontend/Dockerfile)
- [FastAPI server](../backend/Dockerfile)
- PostGIS server (built from
  [docker-postgis](https://hub.docker.com/r/postgis/postgis/tags?page=1&name=17-3.5))

## Also needed:

- Proxy server o node balancer to proxy trafic to the frontend and FastAPI
  servers defined in the images.
  - TLS termination
- Storage volume for the PostGIS server to store its database. (Kubernetes
  Persistent Volume?)
  - I don't think we have any state to track (e.g. user accounts) so we could
    use an ephemeral volume instead.
- The PostGIS server only needs to be visible to the FastAPI container, it
  shouldn't be visible externally.
- If we're going to use the population density rasters, we'll need somewhere to
  store them (AWS S3?). My plan is the raster metadata will be in the PostGIS
  database with "outraster" links to file URLS.


## Alternatives

- We could use Amazon RDS (or something else) instead of the PostGIS container
  described above.
- We may want to use pre-generated vector tiles for the coastline (stored in
  S3?) but I don't think this is necessary,. We're going to want a database
  anyway, and I think having PostGIS generate the tiles on-the-fly and serving
  them through FastAPI will work well for our use case.

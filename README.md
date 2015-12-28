# OAuth Broker

## Currently supported services

* Spotify
* Twitter

## Docker Usage
```shell
docker run -d \
  --name oauth-broker \
  -p 8888:80 \
  \
  -e BASE_URL=https://my-code-project.com \
  \
  -e SPOTIFY_CLIENT_ID=<token> \
  -e SPOTIFY_CLIENT_SECRET=<secret> \
  \
  -e TWITTER_CLIENT_ID=<token> \
  -e TWITTER_CLIENT_SECRET=<secret> \
  \
  -e REDIS_HOST=my-redis-host \
  -e REDIS_PORT=6379 \
  \
  -e MONGO_HOST=my-mongo-host \
  -e MONGO_PORT=27017 \
  -e MONGO_DB=accounts \
  \
  joshwillik/oauth-broker
```

# NPM Usage
This is possible but I don't have the time to write out the docs or publish the package. If you need this, ping me (email on GitHub).

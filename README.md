# Orthomoji
Available as a GitHub Page: [visit me here!](https://mcd-3.github.io/orthomoji-web/)

A frontend web interface for [orthomoji-dom](https://github.com/mcd-3/orthomoji-dom)

Built with React and NextJS

# Building
You can chose to build the app with either NodeJS, Docker, or with Docker Compose

## Node
To build the app locally, perform the following:
```sh
    # Install Dependencies
    npm i
```

```sh
    # Start the App
    npm run build
    npm run start
```

You may also try `npm run dev` instead of `build` and `start`, but it is not as stable as building and starting.

## Docker
To start your image, perform the following:
```sh
    # Build the image
    docker build -t <tag-name> .

    # Start the image
    docker run -dp 3000:3000 <tag-name>
```
After this, go to [localhost:3000](localhost:3000) and your app should be hosted there!

To stop your container, perform the following:
```sh
    # Get the image name
    docker container ls

    # After copying the CONTAINER ID from the above
    docker rm -f <container-id>
```

Note: if you used `docker-compose` to start your container, you will need to stop it otherwise you will get a port conflict.

## Docker Compose
Alternatively, you can use Docker Compose to build your Docker images
```sh
    # Start & build container
    docker-compose up -d 

    # Stop container
    docker-compose down
```

Note: if you used `docker` to start your container, you will need to stop it otherwise you will get a port conflict.
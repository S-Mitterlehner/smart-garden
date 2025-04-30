# Smart-Garten

This repo is a IoT project for an extensible gardening system.

## Getting Started

### Frontend

The frontend is made with react, so you have to install the dependencies first. Since it's using `tailwindcss` version ´4´ it is required to run it with the `force`-option:

```sh
npm i -f
```

After that you can run vite via

```sh
npm run dev
```

#### Mock-Api

When you're working with the frontend alone, you can also start the mock api in order to get data. Run the following script from a second shell:

```sh
npm run api-mock
```

### Backend

In order to run the Backend, all you need to do is to open the sln with Visual Studio or Rider. After that you can run the docker-compose project in VS or the `Docker Compose [Windows/Unix/Linux]` Configuration in Rider.

This will also start the postgresdb for the application.

#### Controller / Arduino

In order to compile the `ino`-files you need to create a `arduino_secrets.h` file in each module. The content of this file should look like this:

```cpp
#define SECRET_SSID "yourwifissid"
#define SECRET_PASS "yourwifipw"
```

Please refer to the module descriptions in order to prepare the correct setup for each module.

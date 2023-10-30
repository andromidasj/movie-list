# Movie List 🍿

## ❓ What is it?
This is a simple movie list app that allows you to track the movies you've watched across multiple lists. Key features include
- [x] Create and edit multiple watchlists
- [x] Search movies to add using the TMDB API
- [x] Track watched movies with stats like total watch time
- [x] Slick mobile interface
- [x] Self-hostable via Docker

<div align="center">
  <img src="https://github.com/andromidasj/movie-list/assets/66661368/ae3c677b-3cf4-4b55-86f7-bd0e4c2e8cb8" width="19%" >
  <img src="https://github.com/andromidasj/movie-list/assets/66661368/ef45b5ef-268b-4ca3-b4fb-27af91dcece1" width="19%" >
  <img src="https://github.com/andromidasj/movie-list/assets/66661368/aba80424-c7eb-40ad-ba21-41fccebac240" width="19%" >
  <img src="https://github.com/andromidasj/movie-list/assets/66661368/753982f6-ed2b-4f54-b027-2bf672f074db" width="19%" >
  <img src="https://github.com/andromidasj/movie-list/assets/66661368/7a53c699-fb6d-4b74-aa56-27065d7bc53c" width="19%" >
</div>

![11317353-DCFD-499F-A695-CDFEDD4CC150_1_101_o](https://github.com/andromidasj/movie-list/assets/66661368/ae3c677b-3cf4-4b55-86f7-bd0e4c2e8cb8)
![919AE9A5-2B49-4D20-9B0E-B6572D3B887B_1_101_o](https://github.com/andromidasj/movie-list/assets/66661368/ef45b5ef-268b-4ca3-b4fb-27af91dcece1)
![95E3E04E-1D70-4D34-AD96-6DEC95A9C753_1_101_o](https://github.com/andromidasj/movie-list/assets/66661368/aba80424-c7eb-40ad-ba21-41fccebac240)
![8C0F3F94-2883-4788-B1CD-74D1CA1EFF80_1_101_o](https://github.com/andromidasj/movie-list/assets/66661368/753982f6-ed2b-4f54-b027-2bf672f074db)
![02E08839-A6FC-4161-9984-56055770C983_1_101_o](https://github.com/andromidasj/movie-list/assets/66661368/7a53c699-fb6d-4b74-aa56-27065d7bc53c)

## Docker installation

To install with Docker, use a docker-compose.yml file like the following:

```yml
version: "3"
services:
  movie-list:
    image: joshandromidas/movie-list
    container_name: movie-list
    ports:
      - 3000:3000
    volumes:
      - /docker/movie-list:/data
    environment:
      - TMDB_API_KEY=your_api_key_here
```

# Movie List 🍿

## ❓ What is it?
This is a simple movie list app that allows you to track the movies you've watched across multiple lists. Key features include
- [x] Create and edit multiple watchlists
- [x] Search movies to add using the TMDB API
- [x] Track watched movies with stats like total watch time
- [x] Slick mobile interface
- [x] Self-hostable via Docker

<table>
  <tr>
    <td>
      <img align=top src="https://github.com/andromidasj/movie-list/assets/66661368/6826cb30-80ab-4236-b9de-a823ee0ab28a"/>
    </td>
    <td>
      <img align=top src="https://github.com/andromidasj/movie-list/assets/66661368/890ac1d4-76b6-4ccb-9965-15742516ece8"/>
    </td>
    <td>
      <img align=top src="https://github.com/andromidasj/movie-list/assets/66661368/c2b00170-1b54-4094-b292-c61efea4b645"/>
    </td>
    <td>
      <img align=top src="https://github.com/andromidasj/movie-list/assets/66661368/60d484d5-cca5-43cd-8ed5-55e83cc318a2"/>
    </td>
    <td>
      <img align=top src="https://github.com/andromidasj/movie-list/assets/66661368/5c7f6e69-4ad8-44ab-bb86-7addb36ea188"/>
    </td>
  </tr>
</table>

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

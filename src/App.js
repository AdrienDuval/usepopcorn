import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
    {
        imdbID: "tt1375666",
        Title: "Inception",
        Year: "2010",
        Poster:
            "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    },
    {
        imdbID: "tt0133093",
        Title: "The Matrix",
        Year: "1999",
        Poster:
            "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    },
    {
        imdbID: "tt6751668",
        Title: "Parasite",
        Year: "2019",
        Poster:
            "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
    },
];

const tempWatchedData = [
    {
        imdbID: "tt1375666",
        Title: "Inception",
        Year: "2010",
        Poster:
            "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
        runtime: 148,
        imdbRating: 8.8,
        userRating: 10,
    },
    {
        imdbID: "tt0088763",
        Title: "Back to the Future",
        Year: "1985",
        Poster:
            "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
        runtime: 116,
        imdbRating: 8.5,
        userRating: 9,
    },
];

const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Navbar({ children }) {

    return (
        <nav className="nav-bar">
            <Logo />

            {children}
        </nav>
    )
}
function Logo() {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
    )
}
function Search({ query, setQuery }) {
    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    )
}

function NumResult({ movies }) {
    return (
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    )
}
export default function App() {
    const [query, setQuery] = useState("The Avengers");
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    // useEffect(function () {
    //     console.log("After the initial render");
    // }, []);
    // useEffect(function () {
    //     console.log("After every render");
    // });
    // console.log("During render");

    function handleAddWatched(movie) {
        setWatched(watched => [...watched, movie]);
    }

    function handleDeleteWatch(id) {
        setWatched(watched => watched.filter(movie => movie.imdbID !== id));
    }
    useEffect(function () {
        async function fetchMovies() {
            try {
                setIsLoading(true);
                setError("");
                const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=761673db&s=${query}`);
                if (query === '') throw new Error("Search for a movie");
                if (!res.ok) throw new Error("Some thing went wrong with fetching movies");
                const data = await res.json();
                if (data.Response === "False") throw new Error("Movie not found");
                setMovies(data.Search);
                // setIsLoading(false);
            } catch (err) {
                // console.error(err.message)
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        if (query.length < 3) {
            setMovies([]);
            setError('');
            return;
        }
        fetchMovies();
    }, [query])


    return (
        <>
            <Navbar>
                <Search query={query} setQuery={setQuery} />
                <NumResult movies={movies} />
            </Navbar>

            <Main>
                <Box>
                    {isLoading && <Loader />}
                    {!isLoading && !error && <MovieList movies={movies} selectedId={selectedId} setSelectedId={setSelectedId} />}
                    {error && <ErrorMessage message={error} />}
                </Box>
                <Box>
                    {selectedId ? <MoviewDetails selectedId={selectedId} setSelectedId={setSelectedId} onAddWatched={handleAddWatched} watched={watched} /> :
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatch} />
                        </>
                    }
                </Box>
            </Main>
        </>
    );
}

function Loader() {
    return (
        <p className="loader">Loading...</p>
    )
}
function ErrorMessage({ message }) {
    return <p className="error">
        <span>❌{message}</span>
    </p>
}

function Main({ children }) {
    return (
        <main className="main">
            {children}
        </main>
    )
}

function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && children}
        </div>
    )
}

// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);
//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>

//           <WatchedSummary watched={watched} />
//           <WatchedMovieList watched={watched} />
//         </>
//       )}
//     </div>
//   )
// }

function MovieList({ movies, selectedId, setSelectedId }) {

    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID} setSelectedId={setSelectedId} selectedId={selectedId} />
            ))}
        </ul>
    )
}

function Movie({ movie, selectedId, setSelectedId }) {
    // console.log(selectedId);
    // console.log(movie.imdbID);
    return (
        <li key={movie.imdbID} onClick={() => { if (selectedId === movie.imdbID) { setSelectedId(null) } else { setSelectedId(movie.imdbID) } }} >
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓️</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    )
}

function MoviewDetails({ selectedId, setSelectedId, onAddWatched, watched }) {

    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userRating, setUserRating] = useState('');

    const isWatched = watched.map(movie => movie.imdbID).includes(selectedId);

    const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating
    console.log(isWatched);
    const { Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot, Released: released, Actors: actors, Director: director, Genre: genre, Language: language, BoxOffice: boxoffice } = movie;

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title, year, poster, imdbRating: Number(imdbRating), runtime: Number(runtime.split(" ").at(0)), userRating,
        };
        console.log(movie.imdbID);


        onAddWatched(newWatchedMovie);
        setSelectedId(null);
    }


    useEffect(function () {
        async function getMovieDetails() {
            try {
                setIsLoading(true);
                const res = await fetch(`http://www.omdbapi.com/?apikey=761673db&i=${selectedId}`);
                if (!res.ok) throw new Error("Some thing went wrong while fetching the movie");
                const data = await res.json();
                console.log(data);
                setMovie(data);
            } catch (err) {
                console.log(err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }

        }
        getMovieDetails();
    }, [selectedId]);


    return (
        <div className="details">
            {error ? <ErrorMessage message={error} /> :
                <>
                    {isLoading ? <Loader /> :
                        <>
                            <header>

                                <button className="btn-back" onClick={() => setSelectedId(null)}>⬅</button>

                                <img src={poster} alt="" />
                                <div className="details-overview">
                                    <h2>{title}</h2>
                                    <p>{released} &bull; {runtime}</p>
                                    <p>{genre}</p>

                                    <p><span>⭐</span>{imdbRating} IMDb rating</p>
                                </div>

                            </header>

                            <section>
                                <div className="rating">
                                    {!isWatched ? <>
                                        <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                                        {userRating > 0 ? <button className="btn-add" onClick={handleAdd}>+ Add to list</button> : null}
                                    </>
                                        : <p>🥲 You already rated this movie {watchedUserRating}⭐</p>}

                                </div>
                                <p><>{plot}</></p>
                                <p>Language: {language}</p>
                                <p>Actors: {actors}</p>
                                <p>Director: {director}</p>
                                {boxoffice && <p>Box Office: <strong>{boxoffice}</strong></p>}
                            </section>
                        </>
                    }
                </>
            }
        </div>
    )
}
function WatchedSummary({ watched, }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));
    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    )
}

function WatchedMovieList({ watched, onDeleteWatched }) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
            ))}
        </ul>
    )
}

function WatchedMovie({ movie, onDeleteWatched }) {
    return (
        <li key={movie.imdbID}>
            <img src={movie.poster} alt={`${movie.title} poster`} />
            <h3>{movie.title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>
                <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>x</button>
            </div>
        </li>
    )
}

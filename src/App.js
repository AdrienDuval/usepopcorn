import { useEffect, useState } from "react";
import StarRating from "./StarRating";

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
    const [query, setQuery] = useState("Avengers");
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    // const [watched, setWatched] = useState([]);
    const [watched, setWatched] = useState(function () {
        const storedValue = localStorage.getItem('watched');
        console.log(JSON.parse(storedValue));
        return JSON.parse(storedValue);
    });


    function handleAddWatched(movie) {
        setWatched(watched => [...watched, movie]);

        // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
    }

    function handleDeleteWatch(id) {
        setWatched(watched => watched.filter(movie => movie.imdbID !== id));
    }

    useEffect(function () {
        localStorage.setItem('watched', JSON.stringify(watched));
    }, [watched]);

    useEffect(function () {
        const controller = new AbortController();
        async function fetchMovies() {
            try {
                setIsLoading(true);
                setError("");
                const res = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=761673db&s=${query}`, { signal: controller.signal });
                if (query === '') throw new Error("Search for a movie");
                if (!res.ok) throw new Error("Some thing went wrong with fetching movies");
                const data = await res.json();
                if (data.Response === "False") throw new Error("Movie not found");
                setMovies(data.Search);
                // setIsLoading(false);
                setError('');
            } catch (err) {
                // console.error(err.message)
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
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

        return () => { controller.abort() }
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
    /* eslint-disable */
    // if (imdbRating > 8) [isTop, setIsTop] = useState(true);

    const [averageRating, setAverageRating] = useState(0);
    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title, year, poster, imdbRating: Number(imdbRating), runtime: Number(runtime.split(" ").at(0)), userRating,
        };
        // console.log(movie.imdbID);


        onAddWatched(newWatchedMovie);
        setSelectedId(null);


    }


    useEffect(function () {

        async function getMovieDetails() {
            try {
                setIsLoading(true);
                const res = await fetch(`https://www.omdbapi.com/?apikey=761673db&i=${selectedId}`);
                if (!res.ok) throw new Error("Some thing went wrong while fetching the movie");
                const data = await res.json();
                // console.log(data);
                setMovie(data);
            } catch (err) {
                // console.log(err.message);
                // setError(err.message);
            } finally {
                setIsLoading(false);
            }

        }
        getMovieDetails();
    }, [selectedId]);

    useEffect(function () {
        if (!title) return
        document.title = `Movie | ${title}`
        return () => {
            document.title = 'UsePopcorn'
            console.log(`clean up effect for movie ${title}`)
        }
    }, [title]);


    useEffect(function () {
        function callback(e) {
            if (e.code === 'Escape') {
                console.log(e.code);
                setSelectedId(null);
                console.log("clossing")
            }
        }
        document.addEventListener('keydown', callback);

        return () => { document.removeEventListener('keydown', callback) }
    }, [setSelectedId]);


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
                            {/* {averageRating} */}
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

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getBackdropUrl, getMovieList, getPosterUrl, getTrendingMovies, getTvList } from "../../services/tmdb";
import "./Browse.css";

const pageConfig = {
  movies: {
    title: "Movies",
    mediaType: "movie",
    load: getMovieList,
    category: "popular",
  },
  "tv-shows": {
    title: "TV Shows",
    mediaType: "tv",
    load: getTvList,
    category: "popular",
  },
  "new-popular": {
    title: "New & Popular",
    mediaType: "movie",
    load: getTrendingMovies,
  },
};

const Browse = () => {
  const { pageType } = useParams();
  const config = pageConfig[pageType] || pageConfig.movies;
  const [titles, setTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError("");

    const request =
      config.category === undefined
        ? config.load({ signal: controller.signal })
        : config.load(config.category, { signal: controller.signal });

    request
      .then((res) => {
        setTitles(res.results || []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setTitles([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [config]);

  return (
    <div className="browse-page">
      <Navbar />
      <main className="browse-content">
        <h1>{config.title}</h1>
        {isLoading && <p className="browse-message">Loading titles...</p>}
        {error && <p className="browse-message">{error}</p>}
        {!isLoading && !error && titles.length === 0 && (
          <p className="browse-message">No titles found.</p>
        )}
        <div className="browse-grid">
          {titles.map((title) => {
            const imageUrl =
              getBackdropUrl(title.backdrop_path) || getPosterUrl(title.poster_path);
            const name = title.title || title.name || title.original_title || title.original_name;

            return (
              <Link
                to={`/player/${config.mediaType}/${title.id}`}
                className="browse-card"
                key={title.id}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt={name} />
                ) : (
                  <div className="browse-card-placeholder">No image</div>
                )}
                <div>
                  <h2>{name}</h2>
                  <p>
                    {title.release_date?.slice(0, 4) ||
                      title.first_air_date?.slice(0, 4) ||
                      config.title}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Browse;

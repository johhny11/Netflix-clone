import React, { useEffect, useState } from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import play_icon from "../../assets/play_icon.png";
import info_icon from "../../assets/info_icon.png";
import TitleCards from "../../components/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { getBackdropUrl, getPosterUrl, getTrendingAll, searchMovies } from "../../services/tmdb";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showAllResults, setShowAllResults] = useState(false);
  const [heroTitles, setHeroTitles] = useState([]);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 2) {
      setSearchResults([]);
      setSearchError("");
      setIsSearching(false);
      setShowAllResults(false);
      return;
    }

    const controller = new AbortController();
    const debounceId = setTimeout(() => {
      setIsSearching(true);

      searchMovies(query, { signal: controller.signal })
        .then((res) => {
          setSearchResults(res.results || []);
          setSearchError("");
          setShowAllResults(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setSearchError(err.message);
            setSearchResults([]);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsSearching(false);
          }
        });
    }, 350);

    return () => {
      clearTimeout(debounceId);
      controller.abort();
    };
  }, [searchQuery]);

  useEffect(() => {
    const controller = new AbortController();

    getTrendingAll({ signal: controller.signal })
      .then((res) => {
        const trendingTitles = (res.results || []).filter((title) => {
          return (
            (title.media_type === "movie" || title.media_type === "tv") &&
            title.backdrop_path &&
            title.overview
          );
        });

        setHeroTitles(trendingTitles.slice(0, 8));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (heroTitles.length <= 1) {
      return;
    }

    const intervalId = setInterval(() => {
      setActiveHeroIndex((currentIndex) => (currentIndex + 1) % heroTitles.length);
    }, 6000);

    return () => {
      clearInterval(intervalId);
    };
  }, [heroTitles.length]);

  const hasSearchQuery = searchQuery.trim().length >= 2;
  const activeHero = heroTitles[activeHeroIndex];
  const activeHeroName =
    activeHero?.title || activeHero?.name || activeHero?.original_title || activeHero?.original_name;
  const activeHeroMediaType = activeHero?.media_type === "tv" ? "tv" : "movie";

  return (
    <div className="home">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults}
        isSearching={isSearching}
        searchError={searchError}
        showSearchDropdown={hasSearchQuery && !showAllResults}
        onSeeAll={() => setShowAllResults(true)}
      />
      {!showAllResults && (
        <div className="hero">
          {activeHero && (
            <img
              src={getBackdropUrl(activeHero.backdrop_path, "original")}
              alt={activeHeroName}
              className="banner-img"
            />
          )}
          {!activeHero && <div className="banner-img hero-loading" />}
          <div className="hero-caption">
            <span className="hero-kicker">Trending Now</span>
            <h1>{activeHeroName || "Loading trending titles..."}</h1>
            <p>{activeHero?.overview || "Fetching this week's most watched movies and shows."}</p>
            <div className="hero-btns">
              <Link
                to={
                  activeHero
                    ? `/player/${activeHeroMediaType}/${activeHero.id}`
                    : "/"
                }
                className="btn"
              >
                <img src={play_icon} alt="" />
                Play
              </Link>
              <button className="btn dark-btn">
                <img src={info_icon} alt="" />
                More Info
              </button>
            </div>
            <div className="hero-dots" aria-label="Trending carousel position">
              {heroTitles.map((title, index) => (
                <button
                  type="button"
                  className={index === activeHeroIndex ? "active" : ""}
                  onClick={() => setActiveHeroIndex(index)}
                  aria-label={`Show ${title.title || title.name}`}
                  key={`${title.media_type}-${title.id}`}
                />
              ))}
            </div>
            <TitleCards />
          </div>
        </div>
      )}
      {hasSearchQuery && showAllResults && (
        <section className="search-results" aria-live="polite">
          <h2>Search results for "{searchQuery.trim()}"</h2>
          {isSearching && <p className="search-message">Searching TMDB...</p>}
          {searchError && <p className="search-message">{searchError}</p>}
          {!isSearching && !searchError && searchResults.length === 0 && (
            <p className="search-message">No movies found.</p>
          )}
          <div className="search-grid">
            {searchResults.map((movie) => {
              const imageUrl =
                getBackdropUrl(movie.backdrop_path) || getPosterUrl(movie.poster_path);

              return (
                <Link to={`/player/movie/${movie.id}`} className="search-card" key={movie.id}>
                  {imageUrl ? (
                    <img src={imageUrl} alt={movie.title || movie.original_title} />
                  ) : (
                    <div className="search-card-placeholder">No image</div>
                  )}
                  <div>
                    <h3>{movie.title || movie.original_title}</h3>
                    <p>{movie.release_date ? movie.release_date.slice(0, 4) : "Movie"}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
      {!showAllResults && (
        <>
          <div className="more-cards">
            <TitleCards title={"Blockbuster Movies"} category={"top_rated"} />
            <TitleCards title={"Only on Thriller"} category={"popular"} />
            <TitleCards title={"Upcoming"} category={"upcoming"} />
            <TitleCards title={"Top pics for you"} category={"now_playing"} />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Home;

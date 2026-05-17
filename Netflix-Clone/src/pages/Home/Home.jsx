import React, { useEffect, useState } from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import hero_banner from "../../assets/hero_banner.jpg";
import hero_title from "../../assets/hero_title.png";
import play_icon from "../../assets/play_icon.png";
import info_icon from "../../assets/info_icon.png";
import TitleCards from "../../components/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { getBackdropUrl, getPosterUrl, searchMovies } from "../../services/tmdb";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showAllResults, setShowAllResults] = useState(false);

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

  const hasSearchQuery = searchQuery.trim().length >= 2;

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
          <img src={hero_banner} alt="" className="banner-img" />
          <div className="hero-caption">
            <img src={hero_title} alt="" className="caption-img" />
            <p>
              Discovering his ties to a secret ancient order, a young man living
              in modern Istanbul embarks on a quest to save the city from an
              immortal enemy.
            </p>
            <div className="hero-btns">
              <button className="btn">
                <img src={play_icon} alt="" />
                Play
              </button>
              <button className="btn dark-btn">
                <img src={info_icon} alt="" />
                More Info
              </button>
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
                <Link to={`/player/${movie.id}`} className="search-card" key={movie.id}>
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

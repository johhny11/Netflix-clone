import React, { useEffect, useRef } from "react";
import "./Navbar.css";
import search_icon from "../../assets/search_icon.svg";
import bell_icon from "../../assets/bell_icon.svg";
import profile_img from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import { logout } from "../../Firebase";
import { Link } from "react-router-dom";
import { getPosterUrl } from "../../services/tmdb";

const Navbar = ({
  searchQuery = "",
  onSearchChange = () => {},
  searchResults = [],
  isSearching = false,
  searchError = "",
  showSearchDropdown = false,
  onSeeAll = () => {},
}) => {
  const navRef = useRef();
  const previewResults = searchResults.slice(0, 5);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) {
        return;
      }

      if (window.scrollY >= 80) {
        navRef.current.classList.add("nav-dark");
      } else {
        navRef.current.classList.remove("nav-dark");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={navRef} className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand-logo">Thriller</Link>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/tv-shows">Tv Shows</Link>
          </li>
          <li>
            <Link to="/movies">Movies</Link>
          </li>
          <li>
            <Link to="/new-popular">New & Popular</Link>
          </li>
          <li>My List</li>
          <li>Browse by Languages</li>
        </ul>
      </div>
      <div className="navbar-right">
        <div className="search-wrapper">
          <form className="search-box" onSubmit={(event) => event.preventDefault()}>
            <img src={search_icon} alt="" className="icons" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search movies"
              aria-label="Search movies"
            />
          </form>
          {showSearchDropdown && (
            <div className="search-dropdown" aria-live="polite">
              {isSearching && <p className="search-dropdown-message">Searching TMDB...</p>}
              {searchError && <p className="search-dropdown-message">{searchError}</p>}
              {!isSearching && !searchError && previewResults.length === 0 && (
                <p className="search-dropdown-message">No movies found.</p>
              )}
              {!searchError &&
                previewResults.map((movie) => (
                  <Link to={`/player/movie/${movie.id}`} className="search-dropdown-item" key={movie.id}>
                    {movie.poster_path ? (
                      <img
                        src={getPosterUrl(movie.poster_path, "w92")}
                        alt={movie.title || movie.original_title}
                      />
                    ) : (
                      <span className="search-dropdown-poster">No image</span>
                    )}
                    <span>
                      <strong>{movie.title || movie.original_title}</strong>
                      <small>{movie.release_date ? movie.release_date.slice(0, 4) : "Movie"}</small>
                    </span>
                  </Link>
                ))}
              {!isSearching && !searchError && searchResults.length > 0 && (
                <button type="button" className="see-all-btn" onClick={onSeeAll}>
                  See all
                </button>
              )}
            </div>
          )}
        </div>
        <p>Children</p>
        <img src={bell_icon} alt="" className="icons" />
        <div className="navbar-profile">
          <img src={profile_img} alt="" className="Profile" />
          <img src={caret_icon} alt="" />
          <div className="dropdown">
            <p
              onClick={() => {
                logout();
              }}
            >
              sign out of Thriller
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

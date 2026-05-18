import React, { useEffect, useRef, useState } from "react";
import "./TitleCards.css";
import { Link } from "react-router-dom";
import { getBackdropUrl, getMovieList } from "../../services/tmdb";

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState("");

  const cardsRef = useRef();

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    const controller = new AbortController();
    const currentCardsRef = cardsRef.current;

    getMovieList(category, { signal: controller.signal })
      .then((res) => {
        setApiData(res.results || []);
        setError("");
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      });

    currentCardsRef.addEventListener("wheel", handleWheel);

    return () => {
      controller.abort();
      currentCardsRef.removeEventListener("wheel", handleWheel);
    };
  }, [category]);

  return (
    <div className="title-cards">
      <h2>{title ? title : "Popular on Thriller"}</h2>
      {error && <p className="cards-message">{error}</p>}
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => {
          return (
            <Link to={`/player/movie/${card.id}`} className="card" key={index}>
              <img
                src={getBackdropUrl(card.backdrop_path)}
                alt={card.title || card.original_title}
              />
              <p>{card.original_title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TitleCards;

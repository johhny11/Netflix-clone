import React, { useEffect, useState } from "react";
import "./Player.css";
import back_arrow_icon from "../../assets/back_arrow_icon.png";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieVideos } from "../../services/tmdb";

const Player = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    getMovieVideos(id, { signal: controller.signal })
      .then((response) => {
        const videos = response.results || [];
        const trailer =
          videos.find((video) => video.site === "YouTube" && video.type === "Trailer") ||
          videos.find((video) => video.site === "YouTube") ||
          videos[0];

        setApiData(trailer || {});
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      });

    return () => {
      controller.abort();
    };
  }, [id]);

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt=""
        onClick={() => {
          navigate(-1);
        }}
      />
      {apiData.key ? (
        <iframe
          src={`https://www.youtube.com/embed/${apiData.key}`}
          frameBorder="0"
          width="90%"
          height="90%"
          title="trailer"
          allowFullScreen
        ></iframe>
      ) : (
        <p className="player-message">No trailer available for this movie.</p>
      )}
      <div className="player-info">
        <p>{apiData.published_at?.slice(0, 10)}</p>
        <p>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div>
    </div>
  );
};

export default Player;

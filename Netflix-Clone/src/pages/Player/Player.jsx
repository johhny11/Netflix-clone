import React, { useEffect, useState } from "react";
import "./Player.css";
import back_arrow_icon from "../../assets/back_arrow_icon.png";
import { useNavigate, useParams } from "react-router-dom";

const Player = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: "",
  });

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2NiMzI3Y2Q2OGJmMjQ2YjlkZTJiOTA2M2JlOTJmMyIsIm5iZiI6MTc0MTQ2MzM4Ny40MTEsInN1YiI6IjY3Y2M5ZjViMmZlNzFiOGM0NWY1YjE3OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EvJ7qmekF1ZZOaGiJ4OUtiaAWJ9I07fFQMOSMG3gDc8",
    },
  };
  // const url = "https://api.themoviedb.org/3/movie/950396/videos?language=en-US";

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      options
    )
      .then((Response) => Response.json())
      .then((Response) => setApiData(Response.results[0]))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt=""
        onClick={() => {
          navigate(-1);
        }}
      />
      <iframe
        src={`https://www.youtube.com/embed/${apiData.key}`}
        frameborder="0"
        width="90%"
        height="90%"
        title="trailer"
        allowFullScreen
      ></iframe>
      <div className="player-info">
        <p>{apiData.published_at.slice(0, 10)}</p>
        <p>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div>
    </div>
  );
};

export default Player;

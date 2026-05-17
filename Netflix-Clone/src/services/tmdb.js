const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const readAccessToken = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

const buildUrl = (path, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

const request = async (path, params, options = {}) => {
  if (!readAccessToken) {
    throw new Error("Missing VITE_TMDB_READ_ACCESS_TOKEN in your environment.");
  }

  const response = await fetch(buildUrl(path, params), {
    signal: options.signal,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${readAccessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}`);
  }

  return response.json();
};

export const getMovieList = (category = "now_playing", options) => {
  return request(`/movie/${category}`, { language: "en-US", page: 1 }, options);
};

export const searchMovies = (query, options) => {
  return request(
    "/search/movie",
    {
      query: query.trim(),
      include_adult: false,
      language: "en-US",
      page: 1,
    },
    options
  );
};

export const getMovieVideos = (id, options) => {
  return request(`/movie/${id}/videos`, { language: "en-US" }, options);
};

export const getBackdropUrl = (path, size = "w780") => {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : "";
};

export const getPosterUrl = (path, size = "w342") => {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : "";
};

import React from "react";
import { CssBaseline, Grid } from "@material-ui/core";
import List from "./components/List";
import Map from "./components/Map";
import Header from "./components/Header";
import { getPlacesData, getWeatherData } from "./api/index";

function App() {
  const [places, setPlaces] = React.useState([]);
  const [filteredPlaces, setFilteredPlaces] = React.useState([]);
  const [coords, setCoords] = React.useState({});
  const [bounds, setBounds] = React.useState({});
  const [childClicked, setChildClicked] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [type, setType] = React.useState("restaurants");
  const [rating, setRating] = React.useState("");
  const [weatherData, setWeatherData] = React.useState([]);

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  React.useEffect(() => {
    const filteredPlaces = places?.filter((place) => place.rating > rating);
    setFilteredPlaces(filteredPlaces);
  }, [rating, places]);

  React.useEffect(() => {
    if (bounds.ne && bounds.sw) {
      setIsLoading(true);
      getWeatherData(coords.lat, coords.lng).then((data) =>
        setWeatherData(data)
      );
      getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
        setFilteredPlaces([]);
        setIsLoading(false);
      });
    }
  }, [bounds, type]);

  return (
    <>
      <CssBaseline />
      <Header setCoords={setCoords} />
      <Grid container spacing={3} sx={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces?.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            setType={setType}
            type={type}
            setRating={setRating}
            rating={rating}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Map
            setBounds={setBounds}
            setCoords={setCoords}
            coords={coords}
            places={filteredPlaces?.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;

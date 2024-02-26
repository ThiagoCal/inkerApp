export const fetchCities = async (searchTerm, token) => {
  console.log("hi from fetch cities", searchTerm, token);
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTerm}.json?access_token=${token}&cachebuster=1625641871908&autocomplete=true&types=place`
    );

    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  } catch (err) {
    return { error: "Unable to retrieve places" };
  }
};

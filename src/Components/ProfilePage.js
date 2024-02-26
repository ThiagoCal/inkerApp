import React, { useState, useRef, useEffect } from "react";
import { auth, functions } from "../firebase";
import { httpsCallable } from "firebase/functions";
import { DatePicker } from "react-rainbow-components";
import { fetchCities } from "../Services/cityService";
import Loading from "./Loading";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useLocation, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [userData, setUserData] = useState("");
  const [responseData, setResponseData] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [picUrl, setPicUrl] = useState("");
  const [hasTattoo, setHasTattoo] = useState("");
  const [yearsExperience, setYearsOfExperience] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [genderState, setGenderState] = useState(userData?.gender || "");
  const [birthdate, setBirthdate] = useState("");
  const [newTag, setNewTag] = useState("");
  const [place, setCity] = useState("");
  const [tags, setTags] = useState([]);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [autocompleteCities, setAutocompleteCities] = useState([]);
  const [autocompleteErr, setAutocompleteErr] = useState("");

  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");
  const [rawPhoneNumber, setRawPhoneNumber] = useState("");

  const [image, setImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const navigate = useNavigate();

  const inputRef = useRef(null);

  const genderArray = [" ", "male", "female", "other"];
  const g = genderArray.map((gender) => (
    <option value={gender}>{gender}</option>
  ));

  function handleMouseDown(e) {
    if (e.target.id !== "tag-input") {
      return;
    }
    if (e.type !== "mousedown") return;
    const value = e.target.value;
    if (!value.trim()) return;
    setTags([...tags, value]);
    e.target.value = "";
  }

  function removeTag(index) {
    setTags(tags.filter((el, i) => i !== index));
  }

  const handlePhoneNumberChange = (event) => {
    const inputPhoneNumber = event.target.value.replace(/\D/g, "");

    let formattedNumber = "";

    if (inputPhoneNumber.length <= 2) {
      formattedNumber = `(${inputPhoneNumber}`;
    } else if (inputPhoneNumber.length <= 7) {
      formattedNumber = `(${inputPhoneNumber.slice(
        0,
        2
      )}) ${inputPhoneNumber.slice(2)}`;
    } else {
      formattedNumber = `(${inputPhoneNumber.slice(
        0,
        2
      )}) ${inputPhoneNumber.slice(2, 7)}-${inputPhoneNumber.slice(7, 11)}`;
    }
    setFormattedPhoneNumber(formattedNumber);
    setRawPhoneNumber(inputPhoneNumber);
  };

  const formatPhoneNumber = (phone) => {
    let formattedNumber = "";
    formattedNumber = `(${phone.slice(0, 2)}) ${phone.slice(
      2,
      7
    )}-${phone.slice(7, 11)}`;
    setFormattedPhoneNumber(formattedNumber);
  };

  const handlePlaceChange = async (e) => {
    setCity(e.target.value);
    if (!place) return;

    const res = await fetchCities(place, process.env.REACT_APP_MAPBOX_TOKEN);
    !autocompleteCities.includes(e.target.value) &&
      res.features &&
      setAutocompleteCities(res.features.map((place) => place.place_name));
    res.error ? setAutocompleteErr(res.error) : setAutocompleteErr("");
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/Login");
      })
      .catch((error) => alert(error.message));
  };

  const uploadImage = () => {
    if (image == null) return;
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        return;
      }
    });
    const randomNumber = Math.floor(Math.random() * 1000);
    const userId = auth.currentUser?.uid; // This should be dynamically obtained, e.g., from Firebase Authentication
    const timestamp = Date.now(); // Current timestamp for uniqueness
    const fileExtension = "jpg"; // This should be dynamically determined based on the file being uploaded

    const filePath = `users/${userId}/profilePicture_${randomNumber}${timestamp}.${fileExtension}`;
    const file = image;

    const storage = getStorage();
    const storageRef = ref(storage, filePath); // Use the file path you created

    // Upload the file
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        // Here you might want to save the downloadURL to your database
        setPicUrl(downloadURL); // Implement this function based on your database
      });
    });
  };

  const fetchUserData = async () => {
    const getUser = httpsCallable(functions, "getUser");
    getUser(auth.currentUser?.uid)
      .then((result) => {
        const userData = result.data.user[0];
        console.log("user data ", userData);
        if (userData) {
          setUserData(userData);
          setGenderState(userData.gender || "");
          setBirthdate(
            userData.birthdate ? new Date(userData.birthdate) : new Date()
          );
          setCity(userData.place || "");
          setTags(userData.style || []);
          setBio(userData.bio || "");
          setFirstName(userData.firstName || "");
          setLastName(userData.lastName || "");
          setRawPhoneNumber(userData.phoneNumber || "");
          formatPhoneNumber(userData.phoneNumber);
          setUserName(userData.userName || "");
          setPortfolio(userData.portfolio || "");
          setInstagram(userData.instagram || "");
          setTwitter(userData.twitter || "");
          setFacebook(userData.facebook);
          setYearsOfExperience(userData.yearsXp);
          setPicUrl(userData.pic_url);
          setHasTattoo(userData.hasTattoo);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoading(true);
        await fetchUserData();
        setIsLoading(false);
      } else {
        handleSignOut();
      }
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        if (newTag.trim() !== "") {
          setTags([...tags, newTag]);
          setNewTag("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    console.log("tags", tags);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tags, newTag]);

  const handleInputChange = (event) => {
    setNewTag(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && newTag.trim() !== "") {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleCallFunction = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const infoPassed = {
      uid: auth.currentUser.uid,
      newData: {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        phoneNumber: rawPhoneNumber,
        gender: genderState,
        bio: bio,
        place: place,
        style: tags,
        birthdate: birthdate.toLocaleDateString(),
        pic_url: picUrl,
        // hasTattoo: hasTattoo.current.value,
        yearsXp: yearsExperience,
        // revshare: userData.revshare,
        instagram: instagram,
        twitter: twitter,
        facebook: facebook,
        portfolio: portfolio,
      },
    };
    uploadImage();
    console.log(infoPassed);
    try {
      const updateUser = httpsCallable(functions, "updateUser");

      const response = await updateUser(infoPassed);

      setResponseData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error calling the function:", error);
      setError("Error calling the function. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-lg p-4" onMouseDown={handleMouseDown}>
      {/* {isLoading ? (
        <>
          <Loading />
        </>
      ) : ( */}
      <>
        <form
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          onSubmit={handleCallFunction}
          className="shadow-sm p-4 bg-white rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
          <div className=" justify-center">
            <div className="mb-4">
              <label htmlFor="first-name" className="block mb-2 font-semibold">
                First Name:
              </label>
              <input
                type="text"
                name="first-name"
                id="first-name"
                minLength={2}
                maxLength={15}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="last-name" className="block mb-2 font-semibold">
                Last Name:
              </label>
              <input
                type="text"
                name="last-name"
                id="last-name"
                minLength={2}
                maxLength={20}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block mb-2 font-semibold">
                Username:
              </label>
              <input
                type="text"
                name="username"
                id="username"
                minLength={5}
                maxLength={20}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-semibold">
                Email:
              </label>
              <input
                type="text"
                name="email"
                id="email"
                defaultValue={userData?.email || ""}
                readOnly
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            <div className="mb-4">
              {picUrl && <img src={picUrl} alt="User Avatar" />}
            </div>
            <div className="mb-4">
              <label htmlFor="avatar" className="block mb-2 font-semibold">
                Avatar Picture:
              </label>
              <input type="file" onChange={handleImageChange} />
              <button onClick={uploadImage}>Upload Image</button>
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block mb-2 font-semibold">
                Phone Number:
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formattedPhoneNumber}
                onChange={(event) => handlePhoneNumberChange(event)}
                maxLength={15}
                minLength={15}
                required
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="experience" className="block mb-2 font-semibold">
                Years of Experience:
              </label>
              <input
                name="experience"
                id="experience"
                maxLength={2}
                value={yearsExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                required
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="bio" className="block mb-2 font-semibold">
                Bio:
              </label>
              <input
                type="text"
                name="bio"
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={250}
                required
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select an option:
              </label>
              <select
                id="gender"
                value={genderState}
                onChange={(event) => setGenderState(event.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm
                  rounded-lg focus:ring-blue-500 focus:border-blue-500 block
                  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                  dark:placeholder-gray-400 dark:text-white
                  dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                {g}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="place" className="block mb-2 font-semibold">
                Your place:
                {autocompleteErr && (
                  <span className="text-red-500 ml-1">{autocompleteErr}</span>
                )}
              </label>
              <input
                list="places"
                type="text"
                id="place"
                name="place"
                onChange={handlePlaceChange}
                value={place}
                required
                autoComplete="off"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <datalist id="places">
                {autocompleteCities.map((place, i) => (
                  <option key={i}>{place}</option>
                ))}
              </datalist>
              <p className="text-sm text-gray-500 mt-1">
                * Start typing and choose your city from the given options.
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="tags" className="block mb-2 font-semibold">
                Tags:
              </label>
              <div className="border border-gray-300 rounded-md items-center flex-auto flex-wrap px-3 py-2 w-full">
                {tags.map((tag, index) => (
                  <div
                    className="bg-gray inline-block px-2 mx-1 py-3 border rounded-md my-1"
                    key={index}
                    id="tag-input"
                  >
                    <span className="m-1">{tag}</span>
                    <span
                      className="bg-slate-500 border rounded-md inline-flex justify-center items-center ml-1 px-2 py-1 cursor-pointer"
                      onClick={() => removeTag(index)}
                    >
                      &times;
                    </span>
                  </div>
                ))}
                <div ref={inputRef}>
                  <input
                    className="bg-gray inline-block px-2 mx-1 py-3 border rounded-md"
                    type="text"
                    value={newTag}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type something"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="portfolio" className="block mb-2 font-semibold">
                Portfolio:
              </label>
              <input
                type="text"
                name="portfolio"
                id="portfolio"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="instagram" className="block mb-2 font-semibold">
                Instagram:
              </label>
              <input
                type="text"
                name="instagram"
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="twitter" className="block mb-2 font-semibold">
                Twitter:
              </label>
              <input
                type="text"
                name="twitter"
                id="twitter"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="facebook" className="block mb-2 font-semibold">
                Facebook:
              </label>
              <input
                type="text"
                name="facebook"
                id="facebook"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="birthdate" className="block mb-2 font-semibold">
                Select Date:
              </label>
              <DatePicker
                id="birthdate"
                selected={userData?.birthdate || new Date()}
                onChange={(date) => setBirthdate(date)}
                value={birthdate}
                formatStyle="medium"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <input
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 cursor-pointer"
              value="Edit Profile"
            />
          </div>
        </form>
        {responseData && (
          <div>
            <h2>Response from Cloud Function:</h2>
            <p>Message: {responseData.message}</p>
            <p>UID: {responseData.uid}</p>
          </div>
        )}
      </>
      {/* )} */}
    </div>
  );
};

export default ProfilePage;

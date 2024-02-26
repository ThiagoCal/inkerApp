import React, { useState, useRef } from "react";
import { auth, functions } from "../firebase";
import { httpsCallable } from "firebase/functions";
import DatePicker from "react-datepicker";
import "./datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";

const MyComponent = () => {
  const [responseData, setResponseData] = useState(null);
  // const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const sessionName = useRef(null);
  const [date, setDate] = useState(new Date());
  // const [price, setPrice] = useState(null);
  const [message, setMessage] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  const sessionPrice = useRef(null);
  const [name, setNameProps] = useState("");

  const handleCallFunction = async (e) => {
    e.preventDefault();
    const infoPassed = {
      name: auth.currentUser.email,
      sessionInfo: {
        tattooArtist: sessionName.current.value,
        date: date,
        price: sessionPrice.current.value,
      },
    };
    try {
      // Get reference to the Cloud Function
      const createSession = httpsCallable(functions, "createSession");

      // Call the Cloud Function with the desired data
      const response = await createSession(infoPassed);

      // Set the response data
      setResponseData(response.data);
    } catch (error) {
      console.error("Error calling the function:", error);
      setError("Error calling the function. Please try again.");
    }
  };

  return (
    <div>
      <>
        <form
          onSubmit={handleCallFunction}
          className="block w-100 justify-self-center shadow-sm p-2"
        >
          <h3>Create Session</h3>
          <div className=" justify-center">
            <div className="mb-4">
              <label
                htmlFor="session-name"
                className="block mb-2 font-semibold"
              >
                Enter the name of the artist:
              </label>
              <input
                type="text"
                name="session-name"
                id="session-name"
                ref={sessionName}
                required
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="session-name"
                className="block mb-2 font-semibold"
              >
                Price of the tattoo:
              </label>
              <input
                type="text"
                name="session-price"
                id="session-price"
                ref={sessionPrice}
                required
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="date" className="block mb-2 font-semibold">
                Select Date:
              </label>
              <div className="datepicker-1">
                <DatePicker
                  id="date"
                  selected={date}
                  onChange={(date) => setDate(date)}
                  showTimeSelect
                  // filterTime={filterPassedTime}
                  dateFormat="dd MMM yyyy - h:mm aa"
                  wrapperClassName="picker-style"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <input
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 cursor-pointer"
              value="Create Session"
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
    </div>
    /*
    <div>
      <h1>Call myOnCallFunction Cloud Function</h1>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button onClick={handleCallFunction}>Call Function</button>
      {responseData && (
        <div>
          <h2>Response from Cloud Function:</h2>
          <p>Message: {responseData.message}</p>
          <p>UID: {responseData.uid}</p>
        </div>
      )}
      {error && <p>{error}</p>}
    </div> */
  );
};

export default MyComponent;

import React, { useState } from "react";
import "./inputPage.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { auth, db } from "../../firebase";
import {addDoc, collection,doc,setDoc} from "firebase/firestore";

const InputPage = () => {
  const [data, setData] = useState({});
  const user = auth.currentUser;

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const rep = await addDoc(collection(db, "Devices"), {
    //   uid : auth.currentUser.uid,
    //   name: "Los Angeles",
    //   state: "CA",
    //   country: "USA"
    // });
    console.log(auth.currentUser.uid);
    try {
      if (user) {
        const inputData = {
          uid: user.uid,
          deviceName: data.deviceName,
          channelId: data.channelId,
          apiKey: data.apiKey,
        };

        // Use collection and addDoc to add a new document with an auto-generated ID
        const devicesCollection = collection(db, "Devices");
        const newDocRef = await addDoc(devicesCollection, {
          ...inputData,
        });

        console.log("Device entry created:", inputData);
        console.log("Document ID:", newDocRef.id);

        console.log("Device entry created:", inputData);
      } else {
        console.log("No user is logged in");
      }
    } catch (error) {
      console.error("Error creating device entry:", error);
    }
  };

  return (
    <div className="inputPage">
      <Sidebar />
      <div className="inputPageContainer">
        <Navbar />
        <div className="top">
          <h1>REGISTER YOUR DEVICE</h1>
        </div>
        <div className="bottom">

          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label htmlFor="deviceName">Device Name:</label>
                <input
                  id="deviceName"
                  type="text"
                  placeholder="Enter device name"
                  onChange={handleInput}
                />
              </div>
              <div className="formInput">
                <label htmlFor="channelId">Channel ID:</label>
                <input
                  id="channelId"
                  type="text"
                  placeholder="Enter channel ID"
                  onChange={handleInput}
                />
              </div>
              <div className="formInput">
                <label htmlFor="apiKey">API Key:</label>
                <input
                  id="apiKey"
                  type="text"
                  placeholder="Enter API key"
                  onChange={handleInput}
                />
              </div>
              <button type="submit">Send</button>
            </form>
          </div>
          <div className="left">
            <img
            src="https://picsum.photos/1000/500">
            </img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPage;

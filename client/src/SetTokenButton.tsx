import React, { FC, useState } from "react";
import axios from "axios";

interface SetTokenButtonProps {
  token: string | null;
}

const SetTokenButton: FC<SetTokenButtonProps> = ({ token }) => {
  const handleClick = async () => {
    try {
      const response = await axios.post("http://localhost:3001/setToken", {
        accessToken: token,
      });
      console.log(response.data); // Success message from server
    } catch (error) {
      console.error("Error setting token", error);
    }
  };

  return (
    <button type="button" onClick={handleClick}>
      Set Token
    </button>
  );
};

export default SetTokenButton;

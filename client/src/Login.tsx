import React from "react";
// import querystring from 'querystring';
// import { randomBytes } from 'crypto'; TODO: create state for security
import { Container } from "react-bootstrap";

const AUTH_URL: string =
  "https://accounts.spotify.com/authorize?client_id=5e3726a0ec3f4360bf3d47eb34207aa8&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify";

const Login = () => {
  // const handleButtonClick = () => {
  //   const client_id = '5e3726a0ec3f4360bf3d47eb34207aa8';
  //   const redirect_uri = 'http://localhost:3000';
  //   // const state = generateRandomString(16);
  //   const scope =
  //     'user-read-private user-read-email user-library-read user-library-modify';

  //   const url =
  //     'https://accounts.spotify.com/authorize?' +
  //     querystring.stringify({
  //       response_type: 'code',
  //       client_id: client_id,
  //       scope: scope,
  //       redirect_uri: redirect_uri,
  //       // state: state,
  //     });

  //   fetch(url)
  //     .then((response) => response.json())
  //     .then(() => {
  //       // handle the response data
  //     })
  //     .catch(() => {
  //       // handle the error
  //     });
  // };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login with Spotify
      </a>
    </Container>
  );
};

export default Login;

// function generateRandomString(length: number): string {
//   return randomBytes(Math.ceil(length / 2))
//     .toString('hex') // convert the bytes to a hexadecimal string
//     .slice(0, length); // trim to the desired length
// }

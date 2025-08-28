// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container mx-auto px-6 py-12 text-center">
      <h1 className="text-9xl font-extrabold text-orange-500">404</h1>
      <h2 className="mt-4 text-4xl font-bold text-gray-800">Page Not Found</h2>
      <p className="mt-4 text-lg text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transition-shadow"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;

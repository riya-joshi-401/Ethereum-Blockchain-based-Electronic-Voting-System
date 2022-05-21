import React from "react";

export default function Loading() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5">
      <div className="spinner-grow text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

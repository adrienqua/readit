import React from "react";

const SearchBar = ({ handleSearch }) => {
  return (
    <div className="row searchbar mb-3">
      <input
        type="search"
        className="form-control"
        placeholder="Rechercher une publication"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;

import React from "react";
import { Input } from "antd";

const SearchBar = ({ setSearchedText }) => {
  return (
    <div>
      <Input.Search
        size="large"
        style={{ width: 350, marginTop: 12 }}
        placeholder="Recherche..."
        onChange={(e) => {
          setSearchedText(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchBar;

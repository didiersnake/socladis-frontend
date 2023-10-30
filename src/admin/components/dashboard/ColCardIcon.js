import React from "react";

const ColCardIcon = ({ iconName, color }) => {
  return (
    <img
      src={iconName}
      style={{
        width: 38,
        padding: 10,
        margin: 4,
        backgroundColor: `${color}`,
        borderRadius: 6,
      }}
      alt="img"
    />
  );
};

export default ColCardIcon;

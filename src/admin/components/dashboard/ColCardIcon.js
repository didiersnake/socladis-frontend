import React from "react";

const ColCardIcon = ({ iconName, color }) => {
  return (
    <img
      src={iconName}
      style={{
        width: 46,
        padding: 8,
        backgroundColor: `${color}`,
        borderRadius: 10,
      }}
      alt="sales"
    />
  );
};

export default ColCardIcon;

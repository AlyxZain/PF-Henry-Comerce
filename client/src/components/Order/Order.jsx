/** @format */

import "./Order.scss";

export const Order = ({ handleOrderByPrice }) => {
  return (
    <div className="order pb-4">
      <h3>Order by</h3>
      <div className="select">
        <select
          name="Price"
          onChange={(event) => {
            handleOrderByPrice(event);
          }}
        >
          <option hidden>Price</option>
          <option value="low">Lower price</option>
          <option value="top">Higher price</option>
        </select>
      </div>
    </div>
  );
};

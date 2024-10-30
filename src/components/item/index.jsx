import React from 'react';


const Item = () => {
  return (
    <ul className="product-list">
        <li tabIndex="-1" className="product-list-item">
          <div className="product-container">
            <div className="product-info-container">
              <div className="product-image-container" data-testid="product-image">
                <img
                  alt="skksks"
                  src="kdkdk"
                  loading="lazy"
                  className="product-image"
                  aria-hidden="true"
                />
              </div>
              <div className="price-container" data-testid="price-product-tile">
                <p className="price-paragraph" data-testid="price">e9393</p>
              </div>
              <a href="lalal" className="link-box-overlay">
                <div className="overlay-container">
                  <p className="product-brand-paragraph" data-testid="product-brand">dkdkdk</p>
                  <h3 className="product-title-heading" data-testid="product-title">dkddkdkdk dkdkdkdkddk kdk</h3>
                  <p className="package-size-paragraph" data-testid="product-package-size">dkdkdk</p>
                </div>
              </a>
              <div className="additional-container">
                {/* Your additional content */}
              </div>
            </div>
            <div className="another-container">
              {/* Your content for this container */}
            </div>
            <div className="yet-another-container">
              {/* Your content for this container */}
            </div>
            <div className="small-container">
              <button type="button" className="action-button" data-testid="atc-button">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  focusable="false"
                  className="action-button-icon"
                  data-testid="btn-icon"
                  aria-hidden="true"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                </svg>
                <span className="button-text">Add to cart</span>
              </button>
            </div>
          </div>
        </li>
    </ul>
  );
};

export default Item;

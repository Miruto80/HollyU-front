import { Link } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useGetFetch } from "../../hooks/useGetFetch";
import { SERVER_URL } from "../../services/api";
import ProductModal from "../../components/catalog/ProductModal";

import "@splidejs/react-splide/css";
import "../../assets/css/FeaturedProducts.css";

export default function FeaturedProducts() {
  const { data: products, loading } = useGetFetch("/productos/mas-vendidos?limit=6");

  const options = {
    type: "loop",
    perPage: 3,
    perMove: 1,
    gap: "1.5rem",
    arrows: true,
    pagination: false,
    drag: true,
    autoplay: false,
    breakpoints: {
      991: { perPage: 2 },
      575: { perPage: 1 },
    },
  };

  if (loading || !products?.length) return null;

  return (
    <section className="featured-products">
      <div className="container">
        <div className="featured-header">
          <div>
            <span className="featured-subtitle">NUESTRA COLECCIÓN</span>
            <h2 className="featured-title">Productos destacados</h2>
            <p className="featured-description">
              Descubre algunos de nuestros uniformes más destacados,
              diseñados para ofrecer comodidad, elegancia y una imagen
              profesional.
            </p>
          </div>
        </div>

        <Splide options={options} aria-label="Productos destacados" className="featured-splide">
          {products.map((product) => {
            const imagen = product.Producto_imagenes?.[0]?.imagen;
            const imgSrc = imagen ? `${SERVER_URL}${imagen}` : "/images/no-image.jpg";

            return (
              <SplideSlide key={product.id}>
                <Link to={`/product/${product.id}`} className="featured-card">
                  <div className="featured-image">
                    <img src={imgSrc} alt={product.nombre} loading="lazy" />
                    <span className="featured-badge">Destacado</span>
                  </div>

                  <div className="featured-card-body">
                    <span className="featured-category">
                      {product.Categoria?.nombre ?? ""}
                    </span>

                    <h5 className="featured-product-name">{product.nombre}</h5>

                    <div className="featured-product-footer">
                      <span className="featured-price">
                        ${Number(product.precio).toLocaleString()}
                      </span>
                      <span className="featured-arrow">→</span>
                    </div>
                  </div>
                </Link>
              </SplideSlide>
            );
          })}
        </Splide>

        <div className="featured-button-container">
          <Link to="/catalog/all" className="featured-button">
            Ver todos los productos
          </Link>
        </div>
      </div>
    </section>
  );
}
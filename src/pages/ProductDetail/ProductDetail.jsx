// src/pages/ProductDetail/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../../api/productApi";
import { addToCart } from "../../api/cartApi";
import Spinner from "../../components/ui/Spinner";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { slug } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await getProduct(slug);
      setProduct(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart({ product_id: product.id, quantity });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  // 3️⃣ guard null BEFORE using product
  if (loading) return <Spinner />;
  if (!product) return <p className="text-center text-gray-500">Product not found</p>;

  // 4️⃣ safe to use product here — it's guaranteed to exist
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const imageUrl = primaryImage
    ? `${import.meta.env.VITE_STORAGE_URL}/${primaryImage.image_url}`
    : '/placeholder.png';

  return (
    <div className="container mx-auto p-6 grid md:grid-cols-2 gap-8">

      {/* Image Section */}
      <div>
        {/* Main Image */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={
              product.images?.[activeImage]
                ? `${import.meta.env.VITE_STORAGE_URL}/${product.images[activeImage].image_url}`
                : '/placeholder.png'
            }
            alt={product.name}
            className="w-full h-[420px] object-cover transition duration-300"
          />

          {/* Sale Badge */}
          {product.is_on_sale && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              SALE
            </span>
          )}

          {/* Arrow buttons — only if multiple images */}
          {product.images?.length > 1 && (
            <>
              <button
                onClick={() => setActiveImage(i => Math.max(i - 1, 0))}
                disabled={activeImage === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow transition disabled:opacity-30"
              >
                ‹
              </button>
              <button
                onClick={() => setActiveImage(i => Math.min(i + 1, product.images.length - 1))}
                disabled={activeImage === product.images.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow transition disabled:opacity-30"
              >
                ›
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-2 h-2 rounded-full transition ${i === activeImage ? 'bg-indigo-600 w-4' : 'bg-white/70'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails — only if multiple images */}
        {product.images?.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {product.images.map((img, i) => (
              <img
                key={img.id}
                src={`${import.meta.env.VITE_STORAGE_URL}/${img.image_url}`}
                alt=""
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer flex-shrink-0 transition border-2 ${i === activeImage
                    ? 'border-indigo-500 opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        {/* Category */}
        {product.category && (
          <p className="text-sm text-indigo-600 font-medium mb-1">
            {product.category.name}
          </p>
        )}

        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

        {/* Price */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl text-indigo-600 font-bold">
            ${product.current_price}
          </span>
          {product.is_on_sale && (
            <span className="line-through text-gray-400 text-lg">
              ${product.price}
            </span>
          )}
          {product.is_on_sale && (
            <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded">
              SALE
            </span>
          )}
        </div>

        {/* Stock */}
        <p className={`mt-2 text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
        </p>

        {/* Description */}
        <p className="mt-4 text-gray-600 leading-relaxed">
          {product.description || 'No description available'}
        </p>

        {/* Quantity + Add to Cart */}
        {product.stock > 0 && (
          <div className="mt-6 flex items-center gap-3">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        )}

        {/* SKU */}
        {product.sku && (
          <p className="mt-4 text-xs text-gray-400">SKU: {product.sku}</p>
        )}
      </div>
    </div>
  );
}
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ArrowLeft, ShoppingCart, Loader, Camera, Info, Settings, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import ARCamera from '../components/ar/ARCamera';
import ProductSwitcher from '../components/ar/ProductSwitcher';
import { formatPrice } from '../utils/currency';

const productImages = import.meta.glob('../assets/products/{fashion,eyewear,jewelry}/{1,2,3,4,5,6,7,8}.png', {
  eager: true,
  query: '?url',
  import: 'default'
});
const beautyImages = import.meta.glob('../assets/products/beauty/shade_*.png', {
  eager: true,
  query: '?url',
  import: 'default'
});

const productImage = (category, filename) => {
  const images = category === 'beauty' ? beautyImages : productImages;
  return images[`../assets/products/${category}/${filename}`];
};

const TryOn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState('fashion');
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const categories = [
    { id: 'fashion', label: 'Apparel', icon: '👕' },
    { id: 'eyewear', label: 'Eyewear', icon: '🕶️' },
    { id: 'jewelry', label: 'Jewelry', icon: '💎' },
    { id: 'beauty', label: 'Beauty', icon: '💄' }
  ];

  const productData = useMemo(() => ({
    fashion: [
      { id: 4, name: 'Premium Classic Shirt', price: '4799', image: productImage('fashion', '1.png') },
      { id: 5, name: 'Signature Navy T-Shirt', price: '14399', image: productImage('fashion', '2.png') },
      { id: 6, name: 'Modern Fit T-Shirt', price: '10399', image: productImage('fashion', '3.png') },
      { id: 41, name: 'Midnight Essential', price: '5299', image: productImage('fashion', '4.png') },
      { id: 42, name: 'Arctic White Tee', price: '3499', image: productImage('fashion', '5.png') },
      { id: 43, name: 'Street Style Tee', price: '4999', image: productImage('fashion', '6.png') },
      { id: 44, name: 'Urban Graphic Shirt', price: '5799', image: productImage('fashion', '7.png') },
      { id: 45, name: 'Bold Print Tee', price: '4299', image: productImage('fashion', '8.png') },
    ],
    eyewear: [
      { id: 1, name: 'Aviator Stealth', price: '11999', image: productImage('eyewear', '1.png') },
      { id: 2, name: 'Urban Wayfarer', price: '7199', image: productImage('eyewear', '2.png') },
      { id: 3, name: 'Gold Rim Lux', price: '15999', image: productImage('eyewear', '3.png') },
      { id: 31, name: 'Cyber Shield', price: '18999', image: productImage('eyewear', '1.png') },
      { id: 32, name: 'Retro Round', price: '9499', image: productImage('eyewear', '2.png') },
    ],
    jewelry: [
      { id: 7, name: 'Diamond Pendant', price: '24999', image: productImage('jewelry', '1.png') },
      { id: 8, name: 'Gold Pendant', price: '18999', image: productImage('jewelry', '2.png') },
      { id: 71, name: 'Silver Pendant', price: '12999', image: productImage('jewelry', '3.png') },
      { id: 72, name: 'Rose Gold Pendant', price: '21499', image: productImage('jewelry', '1.png') },
      { id: 73, name: 'Crystal Pendant', price: '16999', image: productImage('jewelry', '4.png') },
    ],
    beauty: [
      { id: 101, name: 'Nude Silk', price: '2499', image: productImage('beauty', 'shade_nude.png'), color: { r: 188, g: 130, b: 110 } },
      { id: 102, name: 'Mauve Mist', price: '2699', image: productImage('beauty', 'shade_mauve.png'), color: { r: 150, g: 70, b: 120 } },
      { id: 103, name: 'Deep Plum', price: '2899', image: productImage('beauty', 'shade_plum.png'), color: { r: 80, g: 0, b: 50 } },
      { id: 104, name: 'Sunset Coral', price: '2499', image: productImage('beauty', 'shade_coral.png'), color: { r: 255, g: 80, b: 60 } },
      { id: 105, name: 'Ruby Rush', price: '2999', image: productImage('beauty', 'shade_ruby.png'), color: { r: 180, g: 0, b: 0 } },
      { id: 106, name: 'Petal Pink', price: '2499', image: productImage('beauty', 'shade_nude.png'), color: { r: 230, g: 140, b: 160 } },
      { id: 107, name: 'Vintage Rose', price: '2499', image: productImage('beauty', 'shade_nude.png'), color: { r: 160, g: 70, b: 80 } },
      { id: 108, name: 'Cocoa Glaze', price: '2499', image: productImage('beauty', 'shade_nude.png'), color: { r: 90, g: 50, b: 40 } },
      { id: 109, name: 'Berry Bliss', price: '2499', image: productImage('beauty', 'shade_nude.png'), color: { r: 120, g: 0, b: 30 } },
      { id: 110, name: 'Honey Beige', price: '2499', image: productImage('beauty', 'shade_nude.png'), color: { r: 200, g: 150, b: 120 } },
      { id: 111, name: 'Electric Red', price: '2499', image: productImage('beauty', 'shade_ruby.png'), color: { r: 255, g: 0, b: 0 } },
      { id: 112, name: 'Soft Peach', price: '2499', image: productImage('beauty', 'shade_nude.png'), color: { r: 255, g: 180, b: 150 } },
      { id: 113, name: 'Wine Deep', price: '2499', image: productImage('beauty', 'shade_nude.png'), color: { r: 100, g: 10, b: 10 } },
      { id: 114, name: 'Candy Fuchsia', price: '2499', image: productImage('beauty', 'shade_nude.png'), color: { r: 210, g: 20, b: 140 } },
      { id: 115, name: 'Burnt Sienna', price: '2499', image: productImage('beauty', 'shade_nude.png'), color: { r: 140, g: 60, b: 40 } }
    ]
  }), []);

  const currentCategoryProducts = productData[activeCategory] || [];
  const activeProduct = currentCategoryProducts[currentProductIndex] || currentCategoryProducts[0];
  
  const nextIndex = (currentProductIndex + 1) % (currentCategoryProducts.length || 1);
  const prevIndex = (currentProductIndex - 1 + (currentCategoryProducts.length || 1)) % (currentCategoryProducts.length || 1);
  const nextProduct = currentCategoryProducts[nextIndex];
  const prevProduct = currentCategoryProducts[prevIndex];

  // Removed server-side sync for AR as it is now handled client-side in ARCamera.jsx

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setCurrentProductIndex(0);
  };

  const handleAddToCart = () => {
    if (!activeProduct) return;
    
    dispatch(addToCart({
      product: String(activeProduct.id),
      name: activeProduct.name,
      image: activeProduct.image,
      price: Number(activeProduct.price),
      countInStock: 10,
      qty: 1
    }));

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, background: '#000', zIndex: 9999, fontFamily: "'Poppins', sans-serif", cursor: 'auto' }}>
      
      {/* AR Viewport */}
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <ARCamera currentProduct={activeProduct} category={activeCategory} />
        
        {/* Mirror Header */}
        <div style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
          <h1 style={{ color: 'white', fontSize: '12px', fontWeight: 200, margin: 0, letterSpacing: '10px', textTransform: 'uppercase', opacity: 0.5 }}>Neural Mirror</h1>
        </div>
      </div>

      {/* Mirror Navigation Overlay */}
      <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '800px', zIndex: 10 }}>
        
        {/* Category Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '24px' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              style={{
                background: activeCategory === cat.id ? 'white' : 'rgba(0,0,0,0.4)',
                border: 'none',
                color: activeCategory === cat.id ? 'black' : 'white',
                padding: '10px 20px',
                borderRadius: '30px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '12px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeCategory === cat.id ? '0 10px 20px rgba(255,255,255,0.2)' : 'none'
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Switcher Bar */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '30px', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          {/* Previous Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setCurrentProductIndex(prevIndex)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', opacity: 0.5, border: '1px solid rgba(255,255,255,0.2)', background: `url(${prevProduct?.image}) center/cover`, display: 'none', sm: 'block' }} title={prevProduct?.name} />
          </div>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: activeCategory === 'beauty' ? activeProduct?.color ? `rgb(${activeProduct.color.r},${activeProduct.color.g},${activeProduct.color.b})` : 'white' : `url(${activeProduct?.image}) center/cover`, border: '1px solid rgba(255,255,255,0.2)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2px' }}>{activeCategory}</div>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: 300, letterSpacing: '0.5px' }}>{activeProduct?.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'white', fontSize: '18px', fontWeight: 500 }}>{formatPrice(activeProduct?.price)}</div>
            </div>
          </div>

          {/* Next Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', opacity: 0.5, border: '1px solid rgba(255,255,255,0.2)', background: `url(${nextProduct?.image}) center/cover`, display: 'none', sm: 'block' }} title={nextProduct?.name} />
            <button onClick={() => setCurrentProductIndex(nextIndex)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</button>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        style={{ position: 'absolute', top: '30px', left: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}
      >
        <ArrowLeft size={20} />
      </button>

      {/* Cart Action */}
      <div style={{ position: 'absolute', top: '30px', right: '30px', display: 'flex', gap: '15px' }}>
        <button 
          onClick={handleAddToCart}
          style={{
            padding: '12px 30px',
            borderRadius: '30px',
            background: addedToCart ? '#4BB543' : 'white',
            color: 'black',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 20px rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease'
          }}
        >
          {addedToCart ? 'ADDED TO BAG' : (
            <>
              <ShoppingCart size={16} />
              ADD TO BAG
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TryOn;

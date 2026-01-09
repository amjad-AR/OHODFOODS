import { useEffect, useState, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { productsAPI, usersAPI, ordersAPI } from "../services/api";

// تم إضافة: Authentication Context لإدارة حالة تسجيل الدخول
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Sidebar Component
function Sidebar({ logout }) {
  const [activeLink, setActiveLink] = useState("products");
  const navigate = useNavigate();
  
  const handleLogout = () => {
    if (window.confirm("هل أنت متأكد من تسجيل الخروج؟")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="w-64 h-screen bg-[#254E06] text-white p-5 fixed left-0 top-0 shadow-lg flex flex-col">
      <div className="flex items-center mb-8 mt-2">
        <div className="w-10 h-10 rounded-full bg-[#EAC800] flex items-center justify-center mr-3">
          <span className="text-[#254E06] font-bold text-lg">A</span>
        </div>
        <h1 className="text-2xl font-bold">Admin</h1>
      </div>

      <nav className="flex flex-col gap-2">
        <Link
          to="/"
          className={`flex items-center gap-3 p-3 rounded-lg transition ${
            activeLink === "products"
              ? "bg-[#EAC800] text-[#254E06]"
              : "hover:bg-[#3a6b0a]"
          }`}
          onClick={() => setActiveLink("products")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
              clipRule="evenodd"
            />
          </svg>
          Products
        </Link>

        <Link
          to="/create"
          className={`flex items-center gap-3 p-3 rounded-lg transition ${
            activeLink === "create"
              ? "bg-[#EAC800] text-[#254E06]"
              : "hover:bg-[#3a6b0a]"
          }`}
          onClick={() => setActiveLink("create")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Product
        </Link>

        <div className="mt-4 pt-4 border-t border-[#3a6b0a]">
          <p className="text-xs text-[#EAD465] uppercase tracking-wider mb-2 px-3">
            Management
          </p>

          <Link
            to="/users"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              activeLink === "users"
                ? "bg-[#EAC800] text-[#254E06]"
                : "hover:bg-[#3a6b0a]"
            }`}
            onClick={() => setActiveLink("users")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Users
          </Link>

          <Link
            to="/orders"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              activeLink === "orders"
                ? "bg-[#EAC800] text-[#254E06]"
                : "hover:bg-[#3a6b0a]"
            }`}
            onClick={() => setActiveLink("orders")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
            Orders
          </Link>
        </div>
      </nav>

      {/* Logout Section at Bottom */}
      <div className="mt-auto pt-4 border-t border-[#3a6b0a]">
        <div className="flex items-center gap-3 p-3 bg-[#3a6b0a] rounded-lg mb-3">
          <div className="w-8 h-8 rounded-full bg-[#EAD465] flex items-center justify-center">
            <span className="text-[#254E06] font-bold text-sm">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-[#EAD465]">admin@admin.com</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}

// Navbar Component (بدون زر logout - تم نقله للـ Sidebar)
function Navbar() {
  const user = JSON.parse(
    localStorage.getItem("user") || '{"email":"admin@admin.com"}'
  );

  return (
    <div className="ml-64 h-16 bg-white shadow-md flex items-center justify-between px-6">
      <div className="text-xl font-semibold text-[#254E06]">Admin Panel</div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-[#F5EAB9] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </button>
        <div className="flex items-center gap-3 px-4 py-2 bg-[#F5EAB9] rounded-lg">
          <div className="w-8 h-8 rounded-full bg-[#254E06] flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-[#254E06]">{user.email}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Dashboard List
function ProductsDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // Public images available in dashboard/public
  const publicPhotos = [
    "/FB_IMG_1763538235881.jpg",
    "/FB_IMG_1763538242804.jpg",
    "/FB_IMG_1763538258695.jpg",
    "/FB_IMG_1763538511999.jpg",
    "/FB_IMG_1763538544326.jpg",
    "/FB_IMG_1763538551724.jpg",
    "/FB_IMG_1763538553726.jpg",
    "/FB_IMG_1763538563793.jpg",
    "/FB_IMG_1763538581608.jpg",
    "/FB_IMG_1763538609255.jpg",
    "/FB_IMG_1763538627188.jpg",
    "/FB_IMG_1763538629557.jpg",
    "/FB_IMG_1763538632169.jpg",
    "/FB_IMG_1763538650382.jpg",
    "/FB_IMG_1763538652770.jpg",
    "/FB_IMG_1763538671794.jpg",
    "/FB_IMG_1763538675439.jpg",
    "/FB_IMG_1763538678983.jpg",
    "/FB_IMG_1763538680684.jpg",
    "/FB_IMG_1763538682949.jpg",
    "/FB_IMG_1763538684851.jpg",
    "/FB_IMG_1763538686906.jpg",
    "/FB_IMG_1763538695180.jpg",
    "/FB_IMG_1763538699519.jpg",
    "/FB_IMG_1763538703791.jpg",
    "/FB_IMG_1763538814134.jpg",
    "/FB_IMG_1763538829904.jpg",
    "/FB_IMG_1763538842905.jpg",
    "/FB_IMG_1763538852803.jpg",
    "/FB_IMG_1763538862264.jpg",
    "/FB_IMG_1763538880233.jpg",
    "/FB_IMG_1763538883344.jpg",
    "/FB_IMG_1763538888180.jpg",
    "/FB_IMG_1763538958966.jpg",
    "/FB_IMG_1763539009125.jpg",
    "/FB_IMG_1763539015009.jpg",
    "/FB_IMG_1763539050449.jpg",
    "/FB_IMG_1763539089692.jpg",
    "/FB_IMG_1763539143193.jpg",
    "/FB_IMG_1763539155362.jpg",
    "/FB_IMG_1763539167506.jpg",
    "/FB_IMG_1763539188534.jpg",
    "/FB_IMG_1763539253904.jpg",
    "/FB_IMG_1763539256030.jpg",
    "/T11.jpg",
    "/T12.jpg",
    "/T13.jpg",
    "/T14.jpg",
    "/T15.jpg",
    "/T16.jpg",
    "/T17.jpg",
    "/T18.jpg",
    "/T21.jpg",
    "/T22.jpg",
    "/T23.jpg",
    "/T24.jpg",
    "/T25.jpg",
    "/T26.jpg",
    "/T31.jpg",
    "/T32.jpg",
    "/T33.jpg",
    "/T34.jpg",
    "/T35.jpg",
    "/T36.jpg",
  ];

  // تم إصلاح: جعل fetchProducts دالة يمكن استدعاؤها بعد التحديثات
  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll({ limit: 1000 }); // Get all products for dashboard
      setProducts(Array.isArray(data) ? data : []);
      return true;
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // تم إصلاح: إعادة جلب البيانات عند العودة إلى الصفحة الرئيسية من صفحة التعديل
  useEffect(() => {
    if (location.pathname === "/") {
      fetchProducts();
    }
  }, [location.pathname]);

  // استخراج جميع الوسوم الفريدة للمنتجات
  const allTags = [...new Set(products.flatMap((p) => p.tags || []))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.ingredients &&
        p.ingredients.some((ing) =>
          ing.toLowerCase().includes(search.toLowerCase())
        ));

    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    const matchesTag =
      tagFilter === "all" || (p.tags && p.tags.includes(tagFilter));

    let matchesStock = true;
    if (stockFilter === "inStock") matchesStock = p.stock > 0;
    if (stockFilter === "outOfStock") matchesStock = p.stock === 0;
    if (stockFilter === "lowStock") matchesStock = p.stock > 0 && p.stock < 10;

    return matchesSearch && matchesCategory && matchesTag && matchesStock;
  });

  // تم إصلاح: تحسين معالجة حذف المنتج وإعادة جلب البيانات
  const deleteProduct = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        await productsAPI.delete(id);
        // إعادة جلب البيانات للتأكد من التزامن مع الخادم
        await fetchProducts();
        alert("تم حذف المنتج بنجاح!");
      } catch (error) {
        console.error("Error deleting product:", error);
        const errorMessage =
          error?.message || "فشل حذف المنتج. يرجى المحاولة مرة أخرى.";
        
        // إذا كان الخطأ متعلقاً بالمصادقة، إعادة توجيه لصفحة تسجيل الدخول
        if (errorMessage.includes("انتهت صلاحية الجلسة") || errorMessage.includes("401")) {
          alert("انتهت صلاحية الجلسة. سيتم إعادة توجيهك لصفحة تسجيل الدخول");
          navigate("/login");
          return;
        }
        
        alert(`خطأ: ${errorMessage}`);
      }
    }
  };

  // تم إصلاح: تحسين toggleProductStatus - إعادة جلب البيانات بعد التحديث الناجح
  const toggleProductStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await productsAPI.update(id, { isActive: newStatus });

      // تحديث محلي فوري للاستجابة السريعة
      setProducts(
        products.map((p) => (p._id === id ? { ...p, isActive: newStatus } : p))
      );

      // إعادة جلب البيانات للتأكد من التزامن مع الخادم
      await fetchProducts();
    } catch (error) {
      console.error("Error updating product status:", error);
      const errorMessage =
        error?.message || "Failed to update product status. Please try again.";
      alert(errorMessage);
      // إعادة جلب البيانات في حالة الخطأ للتأكد من الحالة الصحيحة
      await fetchProducts();
    }
  };

  if (loading)
    return (
      <div className="ml-64 p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#EAC800] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );

  return (
    <div className="ml-64 p-6 bg-[#F5EAB9] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#254E06]">
          Products Management
        </h1>
        <p className="text-gray-600">
          Manage your product inventory and details
        </p>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products by name, description, or ingredients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full pl-10 focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
            />
          </div>

          <select
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="raw_ingredients">Raw Ingredients</option>
            <option value="ready_products">Ready Products</option>
            <option value="beverages">Beverages</option>
          </select>

          <select
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          >
            <option value="all">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">All Stock</option>
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
            <option value="lowStock">Low Stock (&lt;10)</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, idx) => (
          <div
            key={product._id}
            className={`bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300 ${
              !product.isActive ? "opacity-70" : ""
            }`}
          >
            <div className="relative">
              {/* تم إصلاح مسار الصورة: استخدام product.image إذا كان متوفراً، وإلا استخدام صورة افتراضية من publicPhotos */}
              <img
                src={product.image || publicPhotos[idx % publicPhotos.length]}
                alt={product.name || "Product image"}
                className="rounded-lg w-full h-40 object-cover"
                onError={(e) => {
                  // في حالة فشل تحميل الصورة، استخدم صورة افتراضية
                  e.target.src = publicPhotos[0];
                }}
              />
              {!product.isActive && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                  Inactive
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-[#254E06] text-white px-2 py-1 rounded text-xs capitalize">
                {(product.category || "general").replace("_", " ")}
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-3 text-[#254E06]">
              {product.name}
            </h2>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {product.description}
            </p>

            <div className="mt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Price:
                </span>
                <span className="text-sm font-semibold text-[#254E06]">
                  ${product.price}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Stock:
                </span>
                <span
                  className={`text-sm font-semibold ${
                    product.stock === 0
                      ? "text-red-600"
                      : product.stock < 10
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}
                >
                  {product.stock} units
                </span>
              </div>
              {product.sku && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    SKU:
                  </span>
                  <span className="text-sm text-gray-600">{product.sku}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#EAD465] text-[#254E06] text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Nutrition Info */}
            {product.nutrition && (
              <div className="mt-2 text-xs text-gray-500 border-t pt-2">
                <span className="font-semibold">Nutrition:</span>
                {product.nutrition.calories &&
                  ` ${product.nutrition.calories} cal`}
                {product.nutrition.protein &&
                  ` • ${product.nutrition.protein}g protein`}
              </div>
            )}

            <div className="flex gap-2 mt-3 flex-wrap">
              <Link
                to={`/edit/${product._id}`}
                className="px-3 py-1 bg-[#254E06] text-white rounded-lg hover:bg-[#3a6b0a] text-sm transition flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </Link>
              <button
                onClick={() =>
                  toggleProductStatus(product._id, product.isActive)
                }
                className={`px-3 py-1 text-white rounded-lg text-sm transition flex items-center gap-1 ${
                  product.isActive
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {product.isActive ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Deactivate
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Activate
                  </>
                )}
              </button>
              <button
                onClick={() => deleteProduct(product._id)}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-4">
            No products match your search criteria.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-[#254E06] text-white px-4 py-2 rounded-lg hover:bg-[#3a6b0a] transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Product
          </Link>
        </div>
      )}
    </div>
  );
}

// Create Product Page
function CreateProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "raw_ingredients",
    price: 0,
    image: "/T11.jpg",
    tags: [],
    ingredients: [],
    nutrition: {
      calories: "",
      protein: "",
      fat: "",
      carbs: "",
      fiber: "",
    },
    stock: 0,
    sku: "",
    isActive: true,
  });
  const [newTag, setNewTag] = useState("");
  const [newIngredient, setNewIngredient] = useState("");

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const addIngredient = () => {
    if (newIngredient && !formData.ingredients.includes(newIngredient)) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, newIngredient],
      });
      setNewIngredient("");
    }
  };

  const removeIngredient = (ingredientToRemove) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter(
        (ing) => ing !== ingredientToRemove
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تنظيف البيانات قبل الإرسال
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      nutrition: Object.fromEntries(
        Object.entries(formData.nutrition).map(([key, value]) => [
          key,
          value ? parseFloat(value) : undefined,
        ])
      ),
    };

    try {
      const response = await productsAPI.create(submitData);
      console.log("Product created successfully:", response);
      alert("تم إنشاء المنتج بنجاح!");
      navigate("/");
    } catch (error) {
      console.error("Error creating product:", error);
      const errorMessage =
        error?.message || "فشل إنشاء المنتج. يرجى المحاولة مرة أخرى.";
      
      // إذا كان الخطأ متعلقاً بالمصادقة، إعادة توجيه لصفحة تسجيل الدخول
      if (errorMessage.includes("انتهت صلاحية الجلسة") || errorMessage.includes("401")) {
        alert("انتهت صلاحية الجلسة. سيتم إعادة توجيهك لصفحة تسجيل الدخول");
        navigate("/login");
        return;
      }
      
      alert(`خطأ: ${errorMessage}`);
    }
  };

  return (
    <div className="ml-64 p-6 bg-[#F5EAB9] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#254E06]">Add New Product</h1>
        <p className="text-gray-600">Create a new product for your inventory</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl bg-white p-6 rounded-xl shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Product Name *
              </label>
              <input
                type="text"
                required
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Description
              </label>
              <textarea
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Category *
              </label>
              <select
                required
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="raw_ingredients">Raw Ingredients</option>
                <option value="ready_products">Ready Products</option>
                <option value="beverages">Beverages</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Price *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Stock *
              </label>
              <input
                type="number"
                required
                min="0"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Image URL
              </label>
              <input
                type="url"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                SKU
              </label>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag (e.g., gluten-free)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-[#254E06] text-white px-3 rounded-lg hover:bg-[#3a6b0a] transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#EAD465] text-[#254E06] text-xs px-2 py-1 rounded flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-[#254E06] hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Ingredients
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Add an ingredient"
                />
                <button
                  type="button"
                  onClick={addIngredient}
                  className="bg-[#254E06] text-white px-3 rounded-lg hover:bg-[#3a6b0a] transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="bg-[#EAC800] text-[#254E06] text-xs px-2 py-1 rounded flex items-center"
                  >
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => removeIngredient(ingredient)}
                      className="ml-1 text-[#254E06] hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Information */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium mb-3 text-[#254E06]">
            Nutrition Information (Optional)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Calories
              </label>
              <input
                type="number"
                min="0"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={formData.nutrition.calories}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nutrition: {
                      ...formData.nutrition,
                      calories: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Protein (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={formData.nutrition.protein}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nutrition: {
                      ...formData.nutrition,
                      protein: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Fat (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={formData.nutrition.fat}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, fat: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Carbs (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={formData.nutrition.carbs}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, carbs: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Fiber (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={formData.nutrition.fiber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nutrition: { ...formData.nutrition, fiber: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            className="bg-[#254E06] text-white py-2 px-6 rounded-lg hover:bg-[#3a6b0a] transition flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Create Product
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Edit Product Page
function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [newIngredient, setNewIngredient] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productsAPI.getById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to load product. Please try again.");
      }
    };
    fetchProduct();
  }, [id]);

  // تم إصلاح معالجة tags: إضافة فحص null/undefined لتجنب الأخطاء
  const addTag = () => {
    const tags = product?.tags || [];
    if (newTag && product && !tags.includes(newTag)) {
      setProduct({
        ...product,
        tags: [...tags, newTag],
      });
      setNewTag("");
    }
  };

  // تم إصلاح removeTag: إضافة فحص null/undefined
  const removeTag = (tagToRemove) => {
    if (!product) return;
    const tags = product.tags || [];
    setProduct({
      ...product,
      tags: tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // تم إصلاح معالجة ingredients: إضافة فحص null/undefined لتجنب الأخطاء
  const addIngredient = () => {
    const ingredients = product?.ingredients || [];
    if (newIngredient && product && !ingredients.includes(newIngredient)) {
      setProduct({
        ...product,
        ingredients: [...ingredients, newIngredient],
      });
      setNewIngredient("");
    }
  };

  // تم إصلاح removeIngredient: إضافة فحص null/undefined
  const removeIngredient = (ingredientToRemove) => {
    if (!product) return;
    const ingredients = product.ingredients || [];
    setProduct({
      ...product,
      ingredients: ingredients.filter((ing) => ing !== ingredientToRemove),
    });
  };

  // تم إصلاح: تحسين updateProduct - إضافة معالجة أفضل للأخطاء ورسائل واضحة
  const updateProduct = async () => {
    if (!product) return;

    // التحقق من البيانات المطلوبة
    if (!product.name || !product.name.trim()) {
      alert("Product name is required!");
      return;
    }

    const updateData = {
      ...product,
      price: parseFloat(product.price) || 0,
      stock: parseInt(product.stock) || 0,
      nutrition: product.nutrition
        ? Object.fromEntries(
            Object.entries(product.nutrition).map(([key, value]) => [
              key,
              value ? parseFloat(value) : undefined,
            ])
          )
        : {},
    };

    try {
      const response = await productsAPI.update(id, updateData);
      console.log("Product updated successfully:", response);
      alert("تم تحديث المنتج بنجاح!");
      // الانتقال إلى الصفحة الرئيسية
      navigate("/");
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMessage =
        error?.message || "فشل تحديث المنتج. يرجى المحاولة مرة أخرى.";
      
      // إذا كان الخطأ متعلقاً بالمصادقة، إعادة توجيه لصفحة تسجيل الدخول
      if (errorMessage.includes("انتهت صلاحية الجلسة") || errorMessage.includes("401")) {
        alert("انتهت صلاحية الجلسة. سيتم إعادة توجيهك لصفحة تسجيل الدخول");
        navigate("/login");
        return;
      }
      
      alert(`خطأ: ${errorMessage}`);
    }
  };

  if (!product)
    return (
      <div className="ml-64 p-6 bg-[#F5EAB9] min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#EAC800] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );

  return (
    <div className="ml-64 p-6 bg-[#F5EAB9] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#254E06]">Edit Product</h1>
        <p className="text-gray-600">Update product information</p>
      </div>

      <div className="max-w-4xl bg-white p-6 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Product Name *
              </label>
              <input
                type="text"
                required
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Description
              </label>
              <textarea
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                rows="3"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Category *
              </label>
              <select
                required
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={product.category}
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value })
                }
              >
                <option value="raw_ingredients">Raw Ingredients</option>
                <option value="ready_products">Ready Products</option>
                <option value="beverages">Beverages</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Price *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Stock *
              </label>
              <input
                type="number"
                required
                min="0"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={product.stock}
                onChange={(e) =>
                  setProduct({ ...product, stock: e.target.value })
                }
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Image URL
              </label>
              <input
                type="url"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={product.image}
                onChange={(e) =>
                  setProduct({ ...product, image: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                SKU
              </label>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={product.sku || ""}
                onChange={(e) =>
                  setProduct({ ...product, sku: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Status
              </label>
              {/* تم إصلاح isActive: تحويل القيمة إلى string لتتوافق مع قيمة option */}
              <select
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={String(product.isActive ?? true)}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    isActive: e.target.value === "true",
                  })
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-[#254E06] text-white px-3 rounded-lg hover:bg-[#3a6b0a] transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {product.tags &&
                  product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#EAD465] text-[#254E06] text-xs px-2 py-1 rounded flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-[#254E06] hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Ingredients
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Add an ingredient"
                />
                <button
                  type="button"
                  onClick={addIngredient}
                  className="bg-[#254E06] text-white px-3 rounded-lg hover:bg-[#3a6b0a] transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {product.ingredients &&
                  product.ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="bg-[#EAC800] text-[#254E06] text-xs px-2 py-1 rounded flex items-center"
                    >
                      {ingredient}
                      {/* تم إصلاح زر الحذف: إضافة نص × لإكمال الزر */}
                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-1 text-[#254E06] hover:text-red-700"
                        aria-label={`Remove ${ingredient}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Information */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium mb-3 text-[#254E06]">
            Nutrition Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Calories
              </label>
              <input
                type="number"
                min="0"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={product.nutrition?.calories || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    nutrition: {
                      ...product.nutrition,
                      calories: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Protein (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={product.nutrition?.protein || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    nutrition: {
                      ...product.nutrition,
                      protein: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Fat (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={product.nutrition?.fat || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    nutrition: { ...product.nutrition, fat: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Carbs (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={product.nutrition?.carbs || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    nutrition: { ...product.nutrition, carbs: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#254E06]">
                Fiber (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
                value={product.nutrition?.fiber || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    nutrition: { ...product.nutrition, fiber: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={updateProduct}
            className="bg-[#254E06] text-white py-2 px-6 rounded-lg hover:bg-[#3a6b0a] transition flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Save Changes
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Users Management Component
function UsersDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersAPI.getAll();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      await usersAPI.update(id, { isActive: !currentStatus });
      setUsers(
        users.map((u) =>
          u._id === id ? { ...u, isActive: !currentStatus } : u
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status. Please try again.");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await usersAPI.delete(id);
        setUsers(users.filter((u) => u._id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  if (loading)
    return (
      <div className="ml-64 p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#EAC800] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );

  return (
    <div className="ml-64 p-6 bg-[#F5EAB9] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#254E06]">Users Management</h1>
        <p className="text-gray-600">
          Manage registered users and their information
        </p>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full pl-10 focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
            />
          </div>

          <select
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#254E06] text-white">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Dietary Constraints</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user._id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-[#F5EAB9]"
                } hover:bg-[#EAD465] transition`}
              >
                <td className="p-4 font-medium text-[#254E06]">{user.name}</td>
                <td className="p-4 text-gray-700">{user.email}</td>
                <td className="p-4 text-gray-600">{user.phone || "N/A"}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {user.dietaryConstraints &&
                    user.dietaryConstraints.length > 0 ? (
                      user.dietaryConstraints.map((constraint) => (
                        <span
                          key={constraint}
                          className="bg-[#EAC800] text-[#254E06] text-xs px-2 py-1 rounded"
                        >
                          {constraint}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">None</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleUserStatus(user._id, user.isActive)}
                      className={`px-3 py-1 text-white rounded text-xs transition ${
                        user.isActive
                          ? "bg-orange-600 hover:bg-orange-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                    {user.role !== "admin" && (
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No users found
            </h3>
            <p className="text-gray-500">
              No users match your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Orders Management Component
function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getAll();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="ml-64 p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#EAC800] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );

  return (
    <div className="ml-64 p-6 bg-[#F5EAB9] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#254E06]">Orders Management</h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500">
              Orders will appear here once customers start purchasing.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#254E06] text-white">
              <tr>
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Products</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-[#F5EAB9]"
                  }`}
                >
                  <td className="p-4 font-mono text-sm">{order._id}</td>
                  <td className="p-4">
                    {order.userId?.name || order.user?.name || "Unknown"}
                    {order.userId?.email && (
                      <span className="block text-xs text-gray-500">{order.userId.email}</span>
                    )}
                  </td>
                  <td className="p-4">{order.items?.length || 0} items</td>
                  <td className="p-4 font-semibold text-[#254E06]">
                    ${order.totalAmount}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      {order.status || "Completed"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// تم إضافة: Login Page للأدمن
function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // إذا كان المستخدم مسجل دخول بالفعل، إعادة توجيهه
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // التحقق من البيانات المطلوبة
    if (!email || !password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      setLoading(false);
      return;
    }

    try {
      await login({ email, password });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error?.message ||
          "فشل تسجيل الدخول. الرجاء التحقق من البريد الإلكتروني وكلمة المرور"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EAB9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#254E06] flex items-center justify-center mx-auto mb-4">
            <span className="text-[#EAC800] font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-bold text-[#254E06] mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600">تسجيل الدخول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-[#254E06]"
            >
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 text-[#254E06]"
            >
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#EAC800] focus:border-transparent"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#254E06] text-white py-3 rounded-lg hover:bg-[#3a6b0a] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري تسجيل الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            معلومات تسجيل الدخول الافتراضية:
            <br />
            <span className="font-semibold text-[#254E06]">
              admin@admin.com / admin123
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// تم إضافة: Protected Route Component لحماية الصفحات
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EAB9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#EAC800] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// تم إضافة: Auth Provider Component لإدارة حالة المصادقة
function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // التحقق من حالة تسجيل الدخول عند تحميل التطبيق
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // التحقق من وجود window و localStorage
        if (typeof window === 'undefined' || !window.localStorage) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        if (token) {
          // التحقق من صحة الـ token عبر API
          try {
            // محاولة جلب الملف الشخصي للتحقق من صحة الـ token
            await usersAPI.getProfile();
            setIsAuthenticated(true);
          } catch (error) {
            // إذا فشل التحقق، تنظيف localStorage
            console.error("Token validation failed:", error);
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
            }
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      // استخدام API الحقيقي فقط - لا mock tokens
      const response = await usersAPI.login(credentials);
      
      // التحقق من وجود token في الاستجابة (يتم حفظه تلقائياً في الـ interceptor)
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
        // حفظ معلومات المستخدم - الـ response هو بيانات المستخدم مباشرة من الـ interceptor
        if (response) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              email: response.email || credentials.email,
              role: response.role || "admin",
              id: response.id || response._id,
              name: response.name || ""
            })
          );
        }
        return { success: true, data: response };
      } else {
        throw new Error("لم يتم استلام token من الخادم");
      }
    } catch (error) {
      console.error("Login error:", error);
      // تنظيف localStorage في حالة الخطأ
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Main App
function AppContent() {
  const { logout } = useAuth();

  return (
    <>
      <Sidebar logout={logout} />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProductsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

// Main App Component
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

# 🔧 دليل الصيانة والتطوير

## البيئة المطلوبة

- **Node.js**: v18+ أو أحدث
- **npm**: v9+
- **متصفح حديث**: Chrome, Firefox, Safari, Edge
- **OS**: Windows, macOS, أو Linux

## الأوامر الأساسية

### تثبيت المشروع

```bash
npm install
```

### تشغيل خادم التطوير

```bash
npm run dev
```

يفتح التطبيق على `http://localhost:5173`

### بناء للإنتاج

```bash
npm run build
```

ينتج مجلد `dist` جاهز للنشر

### معاينة البناء

```bash
npm run preview
```

### التحقق من الأخطاء

```bash
npm run lint
```

---

## هيكل المشروع الموصى به

```
dashboard/
├── public/              # ملفات ثابتة
├── src/
│   ├── config/         # إعدادات التطبيق
│   │   └── api.js      # إعدادات API
│   ├── services/       # خدمات (API calls)
│   │   └── api.js      # دوال جلب البيانات
│   ├── assets/         # الصور والملفات
│   ├── components/     # المكونات (يمكن إضافة)
│   ├── pages/          # الصفحات (يمكن إضافة)
│   ├── hooks/          # Custom Hooks (يمكن إضافة)
│   ├── App.jsx         # المكون الرئيسي
│   ├── main.jsx        # نقطة الدخول
│   ├── index.css       # الأنماط العامة
│   └── App.css         # أنماط التطبيق
├── .env                # متغيرات البيئة
├── .env.example        # مثال متغيرات البيئة
├── vite.config.js      # إعدادات Vite
├── eslint.config.js    # إعدادات ESLint
├── package.json        # معالج المشروع
└── index.html          # صفحة HTML الرئيسية
```

---

## دليل التطوير

### إضافة مكون جديد

```javascript
// src/components/MyComponent.jsx
export function MyComponent() {
  return <div>{/* محتوى المكون */}</div>;
}
```

### إضافة دالة API جديدة

```javascript
// في src/services/api.js
export const newAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get("/new-endpoint");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },
};
```

### استخدام API في مكون

```javascript
import { useState, useEffect } from "react";
import { newAPI } from "../services/api";

function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await newAPI.getAll();
        setData(result);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

---

## Best Practices

### 1. معالجة الأخطاء

```javascript
try {
  const data = await API.fetch();
  // معالجة النجاح
} catch (error) {
  console.error("Error message:", error.message);
  // عرض رسالة خطأ للمستخدم
}
```

### 2. استخدام Loading States

```javascript
const [loading, setLoading] = useState(true);
// ... في useEffect
finally {
  setLoading(false);
}
```

### 3. استخدام Try-Finally

```javascript
useEffect(() => {
  const fetch = async () => {
    try {
      const data = await API.fetch();
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);
```

---

## التحقق من الجودة

### قبل الـ Commit

```bash
# تشغيل الفحوصات
npm run lint

# بناء اختبار
npm run build

# التحقق من عدم وجود أخطاء
npm run preview
```

### إصلاح الأخطاء تلقائياً (إن وجدت)

```bash
npx eslint . --fix
```

---

## النشر والإنتاج

### 1. البناء النهائي

```bash
npm run build
```

### 2. اختبار البناء محلياً

```bash
npm run preview
```

### 3. نشر على الخادم

#### خيار 1: Netlify

```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# نشر
netlify deploy --prod --dir=dist
```

#### خيار 2: Vercel

```bash
# تثبيت Vercel CLI
npm install -g vercel

# نشر
vercel --prod
```

#### خيار 3: يدوي

- انسخ محتوى مجلد `dist` إلى الخادم الخاص بك
- تأكد من تكوين الخادم لـ Single Page Application

---

## استكشاف الأخطاء

### المشكلة: "Module not found"

**الحل**:

```bash
npm install
rm -rf node_modules package-lock.json
npm install
```

### المشكلة: Port 5173 مشغول

**الحل**:

```bash
npm run dev -- --port 5174
```

### المشكلة: تغييرات لم تُطبق

**الحل**:

- احفظ الملف (Ctrl+S)
- انتظر Hot Reload
- أعد تحميل الصفحة (F5)
- امسح Cache (Ctrl+Shift+Del)

---

## الملفات المهمة

| الملف              | الوصف                             |
| ------------------ | --------------------------------- |
| `.env`             | متغيرات البيئة (لا تشاركه في Git) |
| `.gitignore`       | ملفات مستبعدة من Git              |
| `vite.config.js`   | إعدادات Vite                      |
| `package.json`     | معالج المشروع والـ scripts        |
| `eslint.config.js` | قواعد فحص الكود                   |

---

## التحديثات والصيانة الدورية

### تحديث المكتبات

```bash
# عرض المكتبات التي يمكن تحديثها
npm outdated

# تحديث جميع المكتبات
npm update

# تحديث مكتبة محددة
npm install package-name@latest
```

### فحص الثغرات الأمنية

```bash
npm audit
npm audit fix
```

---

## خيارات التطوير المتقدمة

### استخدام React DevTools

- ثبت الإضافة من Chrome Web Store
- افتح DevTools واختر "Components" tab

### استخدام Vite DevTools

- Vite يوفر HMR (Hot Module Replacement) تلقائياً
- سيعكس التغييرات فوراً دون إعادة تحميل

---

## القيود والملاحظات

- التطبيق يعتمد على React 19+
- يستخدم Vite للبناء السريع
- Tailwind CSS للتصميم
- React Router v7 للتوجيه

---

## الدعم والموارد

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Axios Documentation](https://axios-http.com/)

---

## آخر تحديث

**التاريخ**: 20 نوفمبر 2025  
**الإصدار**: 1.0.0  
**الحالة**: ✅ مستقر وجاهز للإنتاج

# 🎨 Quick Animation Reference & Code Examples

## Common Animation Classes

### Fade Animations
```jsx
// Fade in smoothly
<div className="animate-fade-in">Content</div>

// Fade in with delay
<div className="animate-fade-in animation-delay-200">Content</div>
<div className="animate-fade-in animation-delay-400">Content</div>
```

### Slide Animations
```jsx
// Slide in from left
<div className="animate-slide-in-left">Content</div>

// Slide in from right
<div className="animate-slide-in-right">Content</div>

// Slide up from bottom
<div className="animate-slide-in-up animation-delay-200">Content</div>

// Slide down from top
<div className="animate-slide-in-down">Content</div>
```

### Scale & Hover Effects
```jsx
// Scale up on hover
<button className="hover:scale-105 transition-all duration-300">
  Hover me
</button>

// Scale on hover with shadow
<div className="hover:scale-110 hover:shadow-2xl transition-all duration-300">
  Card
</div>

// Scale up animation on load
<div className="animate-scale-up">Appears big</div>
```

### Continuous Animations
```jsx
// Floating effect
<div className="animate-float">☕</div>

// Pulse glow effect
<div className="animate-pulse-glow">Glowing element</div>

// Blob animation (background)
<div className="animate-blob">Shape</div>

// Bounce right
<div className="animate-bounce-right">→</div>
```

---

## Staggered List Animations

```jsx
// Animate list items with delays
{items.map((item, idx) => (
  <div
    key={item.id}
    className="animate-slide-in-up"
    style={{ animationDelay: `${idx * 100}ms` }}
  >
    {item.name}
  </div>
))}
```

**Output:** Items slide in one after another with 100ms delay between each

---

## Card Component with Animations

```jsx
const Card = ({ title, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group bg-gradient-to-br from-[#3a2415] to-[#2a1b15] 
                 rounded-xl p-6 shadow-lg border border-amber-900 
                 hover:border-amber-500 transition-all duration-300 
                 transform hover:scale-105 hover:shadow-2xl 
                 hover:shadow-amber-900/50 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4 h-48 rounded-lg overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform 
                     duration-500 group-hover:scale-110"
        />
      </div>

      <h3 className="text-xl font-bold text-amber-100 
                     group-hover:text-amber-50 transition-colors duration-300">
        {title}
      </h3>

      {children}
    </div>
  );
};
```

---

## Interactive Button

```jsx
// Animated button with ripple effect
<button
  className="bg-gradient-to-r from-amber-500 to-yellow-400 
             hover:from-amber-400 hover:to-yellow-300 
             text-black font-bold py-3 px-6 rounded-lg 
             transition-all duration-300 transform 
             hover:scale-105 active:scale-95 shadow-lg 
             hover:shadow-xl"
>
  Click me
</button>
```

**Features:**
- Gradient background that changes on hover
- Scale animation (105% on hover, 95% on click)
- Dynamic shadow
- Smooth transitions

---

## Loading State with Animation

```jsx
// Loading spinner
{loading ? (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="text-6xl animate-spin mb-4">☕</div>
    <p className="text-xl text-amber-200 animate-pulse">
      Loading delicious items...
    </p>
  </div>
) : (
  <div>Content</div>
)}
```

---

## Navbar with Mobile Menu

```jsx
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

return (
  <header className="sticky top-0 z-40 bg-gradient-to-r 
                     from-[#1c140f] via-[#2a1b15] to-[#1c140f] 
                     text-white shadow-xl border-b border-amber-800">
    {/* Desktop Nav */}
    <nav className="hidden md:flex space-x-8">
      <Link
        to="/"
        className="relative group text-gray-200 hover:text-amber-300 
                   transition-colors duration-200"
      >
        Home
        <span className="absolute bottom-0 left-0 w-0 h-0.5 
                        bg-gradient-to-r from-amber-400 to-yellow-300 
                        group-hover:w-full transition-all duration-300"></span>
      </Link>
    </nav>

    {/* Mobile Menu Button */}
    <button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="md:hidden text-2xl text-amber-400 
                 hover:text-amber-300 transition-colors duration-200"
    >
      {mobileMenuOpen ? <FiX /> : <FiMenu />}
    </button>

    {/* Mobile Menu */}
    {mobileMenuOpen && (
      <div className="md:hidden bg-gradient-to-b from-[#2a1b15] to-[#1c140f] 
                      border-t border-amber-800 px-4 py-4 space-y-3 
                      animate-in slide-in-from-top-2 duration-200">
        <Link to="/" className="block px-4 py-2">Home</Link>
      </div>
    )}
  </header>
);
```

---

## Hero Section with Animations

```jsx
<section className="relative min-h-screen bg-gradient-to-b 
                    from-[#1c140f] via-[#2a1b15] to-[#1c140f] 
                    text-white overflow-hidden">
  {/* Animated background blobs */}
  <div className="absolute top-10 left-10 w-72 h-72 bg-amber-600 
                  rounded-full mix-blend-multiply filter blur-3xl 
                  opacity-20 animate-blob"></div>

  {/* Content with animations */}
  <div className="relative z-10 flex items-center justify-around 
                  px-16 py-20 gap-8">
    <div className="max-w-xl animate-fade-in">
      <h2 className="text-6xl font-extrabold 
                     bg-gradient-to-r from-amber-200 to-yellow-300 
                     bg-clip-text text-transparent 
                     animate-slide-in-left">
        Discover The Art Of Perfect Coffee
      </h2>

      <div className="flex gap-6 animate-slide-in-up animation-delay-400">
        <Button primary onClick={handleBook}>
          Book Table
        </Button>
      </div>
    </div>

    {/* Floating image */}
    <div className="relative animate-float">
      <img
        src={coffeeImage}
        alt="coffee"
        className="w-[420px] drop-shadow-2xl 
                   hover:drop-shadow-[0_0_30px_rgba(217,119,6,0.8)] 
                   transition-all duration-300 
                   transform hover:scale-110"
      />
    </div>
  </div>
</section>
```

---

## Menu Grid with Hover Effects

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item, idx) => (
    <div
      key={item.id}
      className="group animate-fade-in"
      style={{ animationDelay: `${idx * 50}ms` }}
    >
      <div className="bg-gradient-to-br from-[#3a2415] to-[#2a1b15] 
                      rounded-xl p-4 shadow-xl border border-amber-900 
                      hover:border-amber-500 transition-all duration-300 
                      transform hover:scale-105 
                      hover:shadow-2xl hover:shadow-amber-900/50">
        {/* Image with zoom effect */}
        <div className="relative mb-4 h-48 rounded-lg overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover 
                       transition-transform duration-500 
                       group-hover:scale-110"
          />
        </div>

        {/* Badge animation */}
        <div className="absolute top-2 right-2 
                        bg-gradient-to-r from-amber-500 to-yellow-400 
                        px-3 py-1 rounded-full text-sm font-bold 
                        opacity-0 group-hover:opacity-100 
                        transform translate-y-2 
                        group-hover:translate-y-0 
                        transition-all duration-300">
          Popular ⭐
        </div>

        <h3 className="text-xl font-bold text-amber-100 
                       group-hover:text-amber-50 
                       transition-colors duration-300">
          {item.name}
        </h3>
      </div>
    </div>
  ))}
</div>
```

---

## Text Gradient Effects

```jsx
// Simple gradient text
<h1 className="bg-gradient-to-r from-amber-200 to-yellow-300 
               bg-clip-text text-transparent">
  Your Coffee Hub
</h1>

// Animated gradient text (requires CSS)
<h1 className="text-gradient-amber animate-text-gradient">
  Your Coffee Hub
</h1>
```

---

## Smooth Transitions

```jsx
// Transition on all properties
<div className="transition-all duration-300">Element</div>

// Transition only on transform
<div className="transition-transform duration-300">Element</div>

// Custom transition with ease
<div className="transition-all duration-500 ease-out">Element</div>
```

---

## Focus States for Accessibility

```jsx
// Input with focus ring
<input
  className="px-4 py-2 rounded-lg 
             focus:outline-none focus:ring-2 
             focus:ring-amber-400 focus:ring-opacity-50 
             transition-all duration-300"
  placeholder="Type something..."
/>

// Button with focus
<button
  className="px-6 py-2 rounded-lg 
             focus:outline-none focus:ring-2 
             focus:ring-amber-400"
>
  Click me
</button>
```

---

## Animation Delays Chart

```jsx
const delays = [
  "animation-delay-200",   // 200ms
  "animation-delay-400",   // 400ms
  "animation-delay-600",   // 600ms
  "animation-delay-2000",  // 2 seconds
  "animation-delay-4000",  // 4 seconds
];

// Use for staggered animations
items.forEach((item, idx) => {
  // Using delay = idx * 100ms
  return (
    <div
      className={`animate-slide-in-up ${delays[Math.min(idx, delays.length - 1)]}`}
      key={item.id}
    >
      {item.name}
    </div>
  );
});
```

---

## Combining Multiple Animations

```jsx
<div
  className="animate-fade-in animation-delay-200 
             hover:scale-105 transition-all duration-300 
             active:scale-95"
>
  Multi-animated element
</div>

// Flow:
// 1. Fades in after 200ms
// 2. Scales to 105% on hover (smooth transition)
// 3. Scales down to 95% on click
```

---

## Performance Optimization

```jsx
// ✅ GOOD - Uses transform (GPU accelerated)
<div className="hover:scale-110 transition-transform duration-300">
  Good performance
</div>

// ❌ AVOID - Uses width (causes layout reflows)
<div className="hover:w-120 transition-all duration-300">
  Bad performance
</div>

// ✅ GOOD - Uses opacity (GPU accelerated)
<div className="hover:opacity-80 transition-opacity duration-300">
  Good performance
</div>

// ❌ AVOID - Uses display (causes reflow)
<div className="hover:flex transition-all duration-300">
  Bad performance
</div>
```

---

## Responsive Animation Adjustments

```jsx
// Disable animations on mobile
<div
  className="animate-slide-in-up 
             md:animate-fade-in
             sm:animation-delay-0"
>
  Responsive animations
</div>

// Reduce animation on small screens
@media (max-width: 768px) {
  .animate-slide-in-up {
    animation-duration: 0.4s; /* Faster on mobile */
  }
}
```

---

## Utility Classes Created

```css
/* Available utility classes */
.gradient-text              /* Gradient text effect */
.btn-gradient              /* Button gradient */
.dark-gradient-bg          /* Dark gradient background */
.shadow-sm-amber           /* Small amber shadow */
.shadow-md-amber           /* Medium amber shadow */
.shadow-lg-amber           /* Large amber shadow */
.glow-amber               /* Amber glow effect */
.hover-glow-amber         /* Glow on hover */
.hover-lift               /* Lift animation on hover */
.hover-scale-105          /* Scale 105% on hover */
.hover-scale-110          /* Scale 110% on hover */
.hover-brighten           /* Brighten on hover */
.focus-ring               /* Focus ring for forms */
```

---

## Tips & Tricks

1. **Stagger animations with array index**
   ```jsx
   style={{ animationDelay: `${idx * 100}ms` }}
   ```

2. **Use `group` for coordinated hover effects**
   ```jsx
   className="group hover:scale-105"
   className="group-hover:text-amber-50"
   ```

3. **Combine multiple transitions**
   ```jsx
   className="transition-all duration-300"  // All properties
   className="transition-transform duration-300"  // Only transform
   ```

4. **Use `will-change` sparingly for performance**
   ```jsx
   className="will-change-transform"
   ```

5. **Test on actual devices**, not just browser previews

---

**Use these examples to create beautiful, interactive components! ☕✨**

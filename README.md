# Book Worm - E-Bookstore Platform

A modern, responsive Angular 17+ e-bookstore application with a dark theme UI, built using standalone components and TailwindCSS.

## Features

- 🎨 **Dark Theme UI** - Modern, eye-friendly dark interface
- 📚 **Book Catalog** - Browse books by categories with search and filters
- 🔍 **Book Details** - Detailed book information with reviews and related books
- 🛒 **Shopping Cart** - Add books to cart with quantity management
- 💳 **Checkout Flow** - Complete checkout with address form and payment options
- ✅ **Order Success** - Beautiful success confirmation page
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⚡ **Angular 17+ Standalone Components** - Modern Angular architecture
- 🎯 **TailwindCSS** - Utility-first CSS framework for styling

## Tech Stack

- **Angular 17+** - Latest Angular with standalone components
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Angular Router** - Client-side routing
- **Angular Signals** - Reactive state management

## Project Structure

```
book-worm/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable components
│   │   │   ├── header/          # Navigation header
│   │   │   ├── sidebar/         # Category sidebar
│   │   │   └── book-card/       # Book display card
│   │   ├── pages/               # Page components
│   │   │   ├── home/            # Home page with book listings
│   │   │   ├── book-detail/     # Book detail page
│   │   │   ├── cart/            # Shopping cart page
│   │   │   ├── payment/         # Payment page
│   │   │   └── payment-success/ # Success confirmation
│   │   ├── services/            # Business logic services
│   │   │   └── book.service.ts  # Book and cart management
│   │   ├── models/              # TypeScript interfaces
│   │   │   └── book.model.ts    # Data models
│   │   ├── app.routes.ts        # Route configuration
│   │   └── app.ts               # Root component
│   ├── styles.css               # Global styles
│   └── index.html               # HTML entry point
├── tailwind.config.js           # TailwindCSS configuration
└── package.json                 # Dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd book-worm
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:4200
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Lint the code

## Features Overview

### Home Page
- Category sidebar with 20+ categories
- Search functionality
- Multiple filter options (Language, Format, Price Range, Sort)
- Book sections: Recommended, Bestsellers, New Launches
- Responsive book cards with quick add-to-cart

### Book Detail Page
- Large book cover image
- Comprehensive book information
- Author biography section
- Customer reviews with rating system
- Related books recommendations
- Add to cart and wishlist options

### Shopping Cart
- Cart items with quantity controls
- Address form for delivery
- Order summary with pricing breakdown
- Coupon code application
- Responsive layout

### Payment Page
- Multiple payment methods (Credit Card, Debit Card, UPI, Wallet)
- Animated background with floating books
- Secure payment form
- Beautiful UI with smooth transitions

### Success Page
- Order confirmation with purchased books
- Animated success indicator
- Continue shopping option

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
theme: {
  extend: {
    colors: {
      dark: {
        bg: '#1a1a1a',
        card: '#2a2a2a',
        hover: '#3a3a3a',
      }
    }
  }
}
```

### Mock Data
Update book data in `src/app/services/book.service.ts`:
```typescript
private mockBooks: Book[] = [
  // Add your books here
];
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Book cover images from Unsplash
- Icons from Heroicons
- Font: Inter from Google Fonts

## Contact

For questions or support, please open an issue in the repository.

---

Built with ❤️ using Angular 17+ and TailwindCSS

# 💰 Expense Tracker

A modern, responsive expense tracking application built with React and Vite. This project demonstrates clean code architecture, modern React patterns, and professional UI/UX design - perfect for showcasing development skills.

![Expense Tracker](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.8-green)
![CSS3](https://img.shields.io/badge/CSS3-Modern-orange)

## ✨ Features

### Core Functionality
- **Add Expenses**: Create new expense entries with amount, description, category, and date
- **Edit Expenses**: Modify existing expenses with inline editing
- **Delete Expenses**: Remove expenses with confirmation dialog
- **Category Management**: Organize expenses with color-coded categories
- **Data Persistence**: All data saved to localStorage for offline access

### Advanced Features
- **Search & Filter**: Find expenses by description or filter by category
- **Sorting**: Sort expenses by date, amount, description, or category
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Statistics**: View total expenses and filtered counts
- **Form Validation**: Comprehensive client-side validation with user feedback
- **Loading States**: Smooth loading indicators and transitions

## 🛠️ Technical Highlights

### Architecture & Patterns
- **React Hooks**: useState, useEffect, useContext, useReducer, useMemo
- **Context API**: Global state management with custom provider
- **Component Architecture**: Modular, reusable components with clear separation of concerns
- **Custom Hooks**: useLocalStorage for data persistence abstraction
- **Error Handling**: Graceful error states and user feedback

### Modern Development Practices
- **ES6+ Features**: Arrow functions, destructuring, template literals, async/await
- **CSS Custom Properties**: Consistent theming with CSS variables
- **Mobile-First Design**: Responsive layout with CSS Grid and Flexbox
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Performance**: Memoized computations and optimized re-renders

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📁 Project Structure

```
expense-tracker/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ExpenseForm/
│   │   │   ├── ExpenseForm.jsx
│   │   │   └── ExpenseForm.css
│   │   ├── ExpenseList/
│   │   │   ├── ExpenseList.jsx
│   │   │   └── ExpenseList.css
│   │   └── ExpenseItem/
│   │       ├── ExpenseItem.jsx
│   │       └── ExpenseItem.css
│   ├── context/
│   │   └── ExpenseContext.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: #2563eb (Blue)
- **Secondary**: #64748b (Slate)
- **Success**: #10b981 (Emerald)
- **Danger**: #ef4444 (Red)
- **Warning**: #f59e0b (Amber)

### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', etc.)
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Spacing & Layout
- **Container**: Max-width 1200px with responsive padding
- **Grid System**: CSS Grid for complex layouts, Flexbox for alignment
- **Border Radius**: 0.5rem for consistent rounded corners

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 481px - 768px
- **Desktop**: > 768px

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Components

### ExpenseContext
Global state management using React Context API with useReducer for complex state updates.

### ExpenseForm
Controlled form component with comprehensive validation and error handling.

### ExpenseList
Advanced list component with search, filtering, and sorting capabilities.

### ExpenseItem
Individual expense display with edit/delete actions and responsive design.

## 💡 Learning Outcomes

This project demonstrates proficiency in:

- **React Fundamentals**: Components, props, state, lifecycle methods
- **Modern React**: Hooks, Context API, functional components
- **State Management**: Complex state with useReducer, local storage integration
- **CSS Architecture**: Component-scoped styles, responsive design, CSS variables
- **User Experience**: Form validation, loading states, error handling
- **Code Organization**: Modular architecture, separation of concerns
- **Performance**: Memoization, optimized re-renders

## 🚀 Deployment

This project can be deployed to various platforms:

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### GitHub Pages
```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the lightning-fast build tool
- The open-source community for inspiration and resources

---

⭐ If you found this project helpful, please give it a star on GitHub!

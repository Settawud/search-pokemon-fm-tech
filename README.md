# Search Pokemon FM Tech

A modern, high-performance Pokémon Search application built with Next.js 16, GraphQL, and Tailwind CSS. Explore the complete desktop and mobile-friendly Pokédex with detailed stats, combat information, and evolution chains.

![React](https://img.shields.io/badge/React-19-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)
![Apollo Client](https://img.shields.io/badge/Apollo_Client-GraphQL-purple)

## 🚀 Features

- **Real-time Search**: Instantly find Pokémon by name with optimized debounced search.
- **Detailed Stats**: View comprehensive statistics including Max CP, Max HP, Weight, Height, and Flee Rate.
- **Combat Intel**: tailored information on:
  - Fast & Special Attacks with damage meters.
  - Type Weaknesses & Resistances.
- **Evolution Chains**: Visual navigation through Pokémon evolution paths.
- **Modern UI/UX**:
  - Immersive dark mode with mesh gradients.
  - Smooth page transitions and micro-interactions using **Framer Motion**.
  - Responsive design for all devices.
  - Skeleton loading states for improved perceived performance.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Fetching**: [Apollo Client](https://www.apollographql.com/docs/react/) (GraphQL)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utility**: [clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/search-pokemon-fm-tech.git
   cd search-pokemon-fm-tech
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Running Tests

This project uses Jest for unit testing.

```bash
npm test
```

## 📂 Project Structure

```
├── app/                  # App Router directories
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities & Apollo Client setup
│   ├── pokemon/[name]/   # Dynamic Pokemon details page
│   └── page.tsx          # Main search page
├── __tests__/            # Jest test files
├── public/               # Static assets
└── ...config files       # Next.js, Tailwind, Jest configs
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

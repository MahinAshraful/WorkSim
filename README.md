# JobSim - Real-World Job Simulations

JobSim is a comprehensive job simulation platform that allows users to practice real-world job skills through interactive simulations. Currently focused on data analysis with SQL, the platform is designed to be scalable and easily extensible for other job roles.

## 🚀 Features

### Current Implementation
- **Data Analyst SQL Simulation**: Complete SQL practice environment with 5 progressive challenges
- **Professional SQL IDE**: Monaco Editor with syntax highlighting, autocomplete, and real-time validation
- **Real Database**: SQLite-based in-browser database with realistic business data
- **Progressive Challenges**: From basic queries to advanced analytics
- **Smart Validation**: Intelligent query validation with detailed feedback
- **Progress Tracking**: Visual progress indicators and attempt tracking
- **Responsive Design**: Modern, professional UI that works on all devices

### Scalable Architecture
- **Modular Design**: Easy to add new job simulations
- **Type-Safe**: Full TypeScript implementation
- **Modern Stack**: Next.js 15, Tailwind CSS v4, React 19
- **Vercel Ready**: Optimized for easy deployment

## 🛠 Tech Stack

- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with custom design system
- **Database**: SQL.js (SQLite in browser)
- **Editor**: Monaco Editor (VS Code's editor)
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
jobsimhack/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles with Tailwind v4
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── simulations/             # Simulation pages
│   │   ├── page.tsx            # Simulations listing
│   │   └── data-analyst-sql/   # SQL simulation
│   └── ...
├── components/                   # Reusable components
│   ├── UI/                     # Base UI components
│   ├── Layout/                 # Layout components
│   ├── SQLEditor.tsx           # SQL IDE component
│   └── SimulationCard.tsx      # Simulation cards
├── data/                        # Static data
│   └── sqlChallenges.ts        # SQL challenges and sample data
├── lib/                         # Utilities
│   ├── sqlUtils.ts             # SQL.js utilities
│   └── utils.ts                # General utilities
├── types/                       # TypeScript definitions
│   └── index.ts                # Type definitions
└── public/                      # Static assets
```

## 🎯 SQL Simulation Features

### Challenge Progression
1. **Employee Salary Analysis** (Beginner): Basic WHERE clauses with multiple conditions
2. **Product Category Performance** (Intermediate): GROUP BY with aggregations
3. **Customer Purchase Patterns** (Advanced): Complex subqueries and self-joins
4. **Top Performing Products** (Intermediate): JOINs with ordering and limits
5. **Monthly Sales Trend Analysis** (Expert): Window functions and growth calculations

### Database Schema
- **employees**: Employee data with departments and salaries
- **products**: Product catalog with categories and pricing
- **customers**: Customer information
- **orders**: Order transactions with relationships

### Smart Validation
- Column presence validation
- Row count verification
- Query syntax checking
- Real-time feedback with helpful hints

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jobsimhack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app is built with Next.js and can be deployed to any platform that supports Node.js applications.

## 🔧 Development

### Adding New Job Simulations

1. **Create simulation data** in `data/` directory
2. **Add simulation to constants** in `lib/constants.ts`
3. **Create simulation page** in `app/simulations/[simulation-id]/`
4. **Update types** in `types/index.ts` if needed

### Styling Guidelines
- Use Tailwind CSS v4 with `@import "tailwindcss"`
- Follow the established color system (primary, gray, success, warning, error)
- Maintain responsive design principles
- Use the existing component library

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Component-based architecture
- Proper error handling and loading states

## 🎨 Design System

### Colors
- **Primary**: Blue palette for main actions and branding
- **Gray**: Neutral colors for text and backgrounds
- **Success**: Green for positive feedback
- **Warning**: Yellow for cautions
- **Error**: Red for errors and failures

### Components
- **Button**: Multiple variants (primary, secondary, ghost)
- **Card**: Consistent container styling
- **Badge**: Status and category indicators
- **SQLEditor**: Professional SQL development environment

## 🔮 Future Roadmap

### Phase 1 (Current)
- ✅ Data Analyst SQL Simulation
- ✅ Professional UI/UX
- ✅ Responsive design
- ✅ Smart validation

### Phase 2 (Planned)
- [ ] Frontend Engineer Simulation (React/TypeScript challenges)
- [ ] Product Designer Simulation (UI/UX challenges)
- [ ] Marketing Analyst Simulation (Analytics challenges)
- [ ] User authentication and progress saving

### Phase 3 (Future)
- [ ] Backend Engineer Simulation
- [ ] Product Manager Simulation
- [ ] Advanced analytics and reporting
- [ ] Community features and leaderboards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**JobSim** - Practice real job skills, master your craft. 🚀

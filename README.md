# DataAlchemy - AI-Powered Synthetic Data Generator

Prototype: https://youtu.be/YJ-Xt6YWWvs?si=_IMg_xoh2UidACDf

## 🚀 Project Overview

DataAlchemy is an advanced AI-powered platform for generating high-quality synthetic data that mimics real-world datasets. Built with Next.js and Python, DataAlchemy provides a seamless user experience for data scientists, developers, and researchers who need realistic synthetic data for testing, development, and machine learning model training.

## 🎯 Key Features

### Data Generation
- **Smart Data Synthesis**: Generate realistic synthetic data using advanced statistical models
- **Multi-Format Support**: Export data in CSV, JSON, and other popular formats
- **Customizable Schemas**: Define custom data schemas with various data types and constraints
- **Privacy-Preserving**: Create datasets that maintain statistical properties without exposing sensitive information

### Data Analysis
- **Statistical Analysis**: Comprehensive statistical summaries of generated data
- **Data Visualization**: Built-in visualization tools for data exploration
- **Correlation Preservation**: Maintain relationships between variables in synthetic data
- **Quality Metrics**: Evaluate the quality and realism of generated data

### User Experience
- **Intuitive Interface**: Clean, modern UI built with Next.js and Tailwind CSS
- **Real-time Preview**: See data generation results instantly
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Dark/Light Mode**: Built-in theme support for comfortable usage

## 🛠️ Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- Python 3.9+
- npm (Node Package Manager)
- Git

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/DataAlchemy.git
   cd DataAlchemy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup

1. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## 📁 Project Structure

```
DataAlchemy/
├── app/                    # Next.js app directory
│   ├── models/            # Data model pages
│   │   └── page.tsx       # Models page component
│   ├── ml/               # Machine learning implementation
│   ├── page.tsx          # Main page component
│   └── globals.css       # Global styles
├── components/           # Reusable React components
│   ├── ui/              # UI component library
│   │   ├── tooltip.tsx
│   │   ├── toggle.tsx
│   │   ├── toast.tsx
│   │   └── ... (other UI components)
│   ├── upload-success-dialog.tsx
│   ├── model-training.tsx
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── ... (other components)
├── contexts/             # React context providers
│   ├── data-context.tsx
│   └── notification-context.tsx
├── hooks/                # Custom React hooks
│   └── use-toast.ts
├── lib/                  # Utility functions
│   ├── utils.ts
│   └── data-service.ts
├── public/               # Static assets
│   ├── DataAlchemy Logo.png
│   ├── DataAlchemy Short Logo.png
│   ├── correlation_matrix.png
│   ├── dataset_SYNTHETIC.csv
│   └── distributions.png
├── uploads/              # User uploaded files
│   └── dataset.csv
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── requirements.txt
├── tailwind.config.ts
└── tsconfig.json
```

## 🛠️ Technical Stack

### Frontend
- **Framework**: Next.js 13+ (App Router)
- **Styling**: Tailwind CSS with CSS Modules
- **State Management**: React Context API
- **UI Components**: Radix UI Primitives
- **Data Visualization**: Recharts
- **Form Handling**: React Hook Form with Zod validation
- **Theming**: next-themes
- **Notifications**: Sonner

### Backend
- **Language**: Python 3.9+
- **Data Processing**: Pandas, NumPy
- **Machine Learning**: scikit-learn, SciPy
- **Data Visualization**: Matplotlib, Seaborn
- **API**: Next.js API Routes

## 📝 Usage Guide

1. **Getting Started**
   - Navigate to the DataAlchemy dashboard
   - Upload your dataset or start with a template
   - Configure data generation parameters
   - Generate synthetic data with a single click

2. **Advanced Configuration**
   - Define custom data schemas
   - Adjust statistical properties
   - Set relationships between variables
   - Configure privacy constraints

3. **Export & Integration**
   - Download generated datasets in multiple formats
   - Copy data to clipboard
   - Generate API endpoints for programmatic access

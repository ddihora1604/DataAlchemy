# DataAlchemy - AI-Powered Synthetic Data Generator

Prototype: https://youtu.be/YJ-Xt6YWWvs?si=_IMg_xoh2UidACDf

## 🚀 Project Overview

DataAlchemy is an advanced AI-powered platform for generating high-quality synthetic data that mimics real-world datasets. Built with Next.js and Python, DataAlchemy provides a seamless user experience for data scientists, developers, and researchers who need realistic synthetic data for testing, development, and machine learning model training.

## 🎯 Key Features

### Advanced Data Generation
- **Gaussian Mixture Models (GMM)**: Sophisticated statistical modeling for realistic data synthesis
- **Mixed Data Support**: Handles both continuous and discrete data types seamlessly
- **Smart Feature Analysis**: Automatically detects and processes different feature types
- **Correlation Preservation**: Maintains relationships between variables in generated data
- **Privacy Protection**: Generates synthetic data that preserves statistical properties without exposing sensitive information

### Comprehensive Analysis
- **Statistical Comparison**: Side-by-side analysis of original vs. synthetic data distributions
- **Quality Metrics**: Kolmogorov-Smirnov tests and other statistical measures for quality assessment
- **Visual Analytics**: Built-in visualizations including distribution plots and correlation matrices
- **Data Profiling**: Automatic detection of data types, missing values, and statistical properties

### Machine Learning Integration
- **Model Training**: Train and evaluate models on both original and synthetic data
- **Performance Comparison**: Compare model performance across different datasets
- **Feature Importance**: Analyze which features contribute most to model predictions
- **Hyperparameter Tuning**: Optimize model parameters for better performance

### User Experience
- **Interactive Dashboard**: Modern, responsive interface built with Next.js and React
- **Drag-and-Drop Interface**: Intuitive controls for data upload and processing
- **Real-time Feedback**: Immediate visualization of data generation results
- **Responsive Design**: Works seamlessly across desktop and tablet devices

### Data Management
- **CSV Import/Export**: Easily import datasets and export generated synthetic data
- **Data Preview**: Quick view of data samples before and after generation
- **Batch Processing**: Generate multiple synthetic datasets with different parameters
- **History Tracking**: Keep track of previously generated datasets

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

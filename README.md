# FINANCE DASHBOARD - A Zorvyn Product

FINANCE DASHBOARD is a sophisticated, bento-grid style finance dashboard designed for clarity and precision by Zorvyn Fintech. It focuses on providing a high-density, minimalist interface for tracking assets, income, and spending patterns.

## Core Experience

- **Bento Dashboard**: A modern, grid-based layout that organizes financial data into logical, high-impact blocks.
- **Wealth Timeline**: A step-after area chart visualizing balance movements over time, providing a clear picture of financial growth.
- **Allocation Insights**: Circular distribution charts for understanding expense categories at a glance.
- **Dynamic Ledger**: A robust transaction history with real-time search, type filtering, and administrative controls.
- **Dual-Role Interface**:
  - **Viewer**: A read-only mode for safe data exploration.
  - **Admin**: Full control over the ledger, including adding, editing, and deleting entries.
- **Minimalist Aesthetic**: A custom Indigo-based color palette with a deep dark mode, utilizing high-contrast typography and generous spacing.

## Technical Foundation

- **React 19**: Leveraging the latest React features for state management and component architecture.
- **Tailwind CSS 4.0**: Custom utility-first styling with a focus on minimalist design patterns.
- **Recharts**: Precision data visualization for financial timelines and allocations.
- **Motion**: Fluid interactions and state-driven animations.
- **Date-fns**: Reliable date parsing and formatting for the ledger.

## Project Structure

- `src/App.tsx`: The central hub containing the bento-grid layout and core application logic.
- `src/types.ts`: Strongly typed interfaces for transactions, roles, and statistics.
- `src/data/mockData.ts`: Logic for generating realistic financial datasets and calculating dashboard metrics.
- `src/lib/utils.ts`: Helper functions for dynamic class merging.

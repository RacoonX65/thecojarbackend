# The Jar Co - Sanity Backend Setup Guide

This guide will walk you through setting up the Sanity.io backend for The Jar Co e-commerce platform.

## Prerequisites

- Node.js 16.14 or later
- npm (comes with Node.js) or yarn
- Sanity CLI (install with `npm install -g @sanity/cli`)
- A Sanity.io account (sign up at [sanity.io](https://www.sanity.io/))

## Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/RacoonX65/thecojarbackend.git
   cd thecojarbackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:
   ```
   SANITY_PROJECT_ID=your_project_id
   SANITY_DATASET=production
   SANITY_API_VERSION=2023-05-03
   ```

## Sanity Studio Setup

1. **Login to Sanity**
   ```bash
   sanity login
   ```

2. **Link to Sanity Project**
   ```bash
   sanity init
   ```
   - Choose "Create new project" or "Use existing project"
   - Follow the prompts to configure your project

3. **Deploy Studio**
   ```bash
   sanity deploy
   ```
   This will deploy your Sanity Studio to a public URL.

## Content Structure

### Product Types

1. **iPhones**
   - Supports multiple color variants
   - Storage options: 64GB, 128GB, 256GB
   - Battery grades: A (90-100%), B (80-89%), C (70-79%)
   - Conditions: New, Refurbished, Used

2. **Sneakers**
   - Multiple color variants
   - UK sizing with individual stock levels
   - Conditions: New, Used

### Creating Your First Product

1. **iPhone**
   - Go to the "iPhone" section in Sanity Studio
   - Click "Add iPhone"
   - Fill in the required fields (model, condition, network)
   - Add color variants with their respective inventory
   - Configure storage options and battery grades
   - Add product images

2. **Sneaker**
   - Go to the "Sneaker" section
   - Click "Add Sneaker"
   - Enter brand, model, and description
   - Add color variants with size options
   - Set pricing and inventory

## Local Development

1. **Start the development server**
   ```bash
   npm run dev
   ```
   This will start Sanity Studio at `http://localhost:3333`

2. **Build for production**
   ```bash
   npm run build
   ```

## Deployment

1. **Deploy Studio Changes**
   ```bash
   sanity deploy
   ```

2. **Deploy GraphQL API** (if enabled)
   ```bash
   sanity graphql deploy
   ```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SANITY_PROJECT_ID` | Yes | Your Sanity project ID |
| `SANITY_DATASET` | Yes | Dataset name (e.g., 'production') |
| `SANITY_API_VERSION` | Yes | API version (e.g., '2023-05-03') |

## Troubleshooting

### Common Issues

1. **Missing Dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Deployment Issues**
   - Ensure you're logged in with `sanity login`
   - Verify your project ID in `sanity.json`
   - Check network connectivity

3. **Schema Validation Errors**
   - Run schema validation:
     ```bash
     sanity debug --secrets
     ```

## Support

For additional help, please contact the development team or refer to the [Sanity documentation](https://www.sanity.io/docs).

## License

MIT

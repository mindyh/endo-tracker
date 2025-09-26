# Endo Tracker

A mobile-first web application for tracking endometriosis events including pain, triggers, treatments, and daily activities. Built with React and designed for quick, on-the-go event logging.

You've got a blank canvas to work on from a git perspective as well. There's a single initial commit with the what you're seeing right now - where you go from here is up to you!

Everything you do here is contained within this one codespace. There is no repository on GitHub yet. If and when you’re ready you can click "Publish Branch" and we’ll create your repository and push up your project. If you were just exploring then and have no further need for this code then you can simply delete your codespace and it's gone forever.

This project was bootstrapped for you with [Vite](https://vitejs.dev/).

## Available Scripts

In the project directory, you can run:

### `npm start`

We've already run this for you in the `Codespaces: server` terminal window below. If you need to stop the server for any reason you can just run `npm start` again to bring it back online.

Runs the app in the development mode.\
Open [http://localhost:3000/](http://localhost:3000/) in the built-in Simple Browser (`Cmd/Ctrl + Shift + P > Simple Browser: Show`) to view your running application.

The page will reload automatically when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Vite documentation](https://vitejs.dev/guide/).

To learn Vitest, a Vite-native testing framework, go to [Vitest documentation](https://vitest.dev/guide/)

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://sambitsahoo.com/blog/vite-code-splitting-that-works.html](https://sambitsahoo.com/blog/vite-code-splitting-that-works.html)

### Analyzing the Bundle Size

This section has moved here: [https://github.com/btd/rollup-plugin-visualizer#rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer#rollup-plugin-visualizer)

### Making a Progressive Web App

This section has moved here: [https://dev.to/hamdankhan364/simplifying-progressive-web-app-pwa-development-with-vite-a-beginners-guide-38cf](https://dev.to/hamdankhan364/simplifying-progressive-web-app-pwa-development-with-vite-a-beginners-guide-38cf)

### Advanced Configuration

This section has moved here: [https://vitejs.dev/guide/build.html#advanced-base-options](https://vitejs.dev/guide/build.html#advanced-base-options)

### Deployment

This section has moved here: [https://vitejs.dev/guide/build.html](https://vitejs.dev/guide/build.html)

### Troubleshooting

This section has moved here: [https://vitejs.dev/guide/troubleshooting.html](https://vitejs.dev/guide/troubleshooting.html)

# 📁 Project Structure

```
src/
├── App.jsx                    # Main app component (simplified)
├── App.css                    # Main styles
├── components/                # Reusable UI components
│   ├── TabNavigation.jsx      # Tab navigation component
│   ├── EventForm.jsx          # Event logging form
│   ├── SettingsPanel.jsx     # Settings management panel
│   ├── ItemManager.jsx       # Reusable item management component
│   └── RecentEvents.jsx      # Recent events display
├── hooks/                     # Custom React hooks
│   ├── useFormState.js        # Form state management hook
│   └── useItemManager.js      # Item management logic hook
├── data/                      # Static data and constants
│   └── constants.js           # App constants (event types, pain levels, etc.)
└── utils/                     # Utility functions
    └── timeUtils.js           # Time formatting and helper functions
```

## 🔧 Of note

### 1. **Custom Hooks for State Management**
- `useFormState`: Manages all form-related state and actions
- `useItemManager`: Handles CRUD operations for pain locations and allergens

### 2. **Component Separation**
- **TabNavigation**: Handles tab switching logic
- **EventForm**: All event logging functionality
- **SettingsPanel**: Configuration management interface  
- **ItemManager**: Reusable component for managing lists (allergens, pain locations)
- **RecentEvents**: Display and formatting of logged events

### 3. **Centralized Data**
- All constants in `data/constants.js`
- Utility functions in `utils/` directory

## 🚀 How to Add New Features

### Adding a New Item Type (e.g., Medications):
1. Add the item type to `data/constants.js`
2. Create a new manager instance using `useItemManager` hook
3. Add the configuration section to `SettingsPanel`
4. No need to duplicate CRUD logic!

### Adding a New Form Field:
1. Update the form schema in `useFormState`
2. Add the field to `EventForm` component
3. Update `RecentEvents` to display the new field

### Adding Utility Functions:
1. Add to appropriate file in `utils/` directory
2. Import where needed - no code duplication

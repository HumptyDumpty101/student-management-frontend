# Student Management System - Frontend

This is the frontend web application for the Student Management System built with React, Material-UI, and Redux Toolkit.

## Live Demo

Visit the live application at: https://student.rohithks.com

## Features

- Modern React 18 application with functional components
- Material-UI (MUI) for consistent design system
- Redux Toolkit for state management
- Responsive design for desktop, tablet, and mobile
- Real-time form validation with Yup
- Role-based access control and permissions
- Dashboard with analytics and statistics
- Student and staff management interfaces
- Profile management and settings
- File upload for profile photos
- Toast notifications and loading states

## Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Routing**: React Router
- **Form Validation**: Yup
- **Icons**: Material-UI Icons
- **Date Handling**: Built-in Date APIs

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Running backend server (see backend README)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables file (see Environment Setup section below)

4. Start the development server:
```bash
npm start
```

The application will open at http://localhost:3000

## Environment Setup

Create a `.env` file in the frontend directory:

### Development Environment
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Student Management System
VITE_ENVIRONMENT=development
```

### Production Environment
```env
VITE_API_URL=https://student.rohithks.com
VITE_APP_NAME=Student Management System
VITE_ENVIRONMENT=production
```

## Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Install dependencies
npm install
```

## Project Structure

```
frontend/
├── public/
│   ├── index.html              # HTML template
│   └── favicon.ico             # App icon
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── ConfirmDialog.jsx    # Reusable confirm dialog
│   │   │   ├── StyledTextField.jsx  # Custom text field
│   │   │   └── index.js             # Component exports
│   │   ├── students/
│   │   │   ├── StudentForm.jsx      # Student creation/edit form
│   │   │   ├── StudentList.jsx      # Student list with table/cards
│   │   │   ├── StudentDetails.jsx   # Student details modal
│   │   │   └── index.js             # Component exports
│   │   └── staff/
│   │       ├── StaffForm.jsx        # Staff creation/edit form
│   │       ├── StaffList.jsx        # Staff list with table/cards
│   │       ├── StaffDetails.jsx     # Staff details modal
│   │       └── index.js             # Component exports
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx        # Login interface
│   │   ├── dashboard/
│   │   │   └── DashboardPage.jsx    # Main dashboard
│   │   ├── students/
│   │   │   └── StudentsPage.jsx     # Student management page
│   │   ├── staff/
│   │   │   └── StaffPage.jsx        # Staff management page
│   │   └── profile/
│   │       └── ProfilePage.jsx      # User profile settings
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js         # Authentication state
│   │   │   ├── studentSlice.js      # Student management state
│   │   │   ├── staffSlice.js        # Staff management state
│   │   │   └── uiSlice.js           # UI state (dialogs, notifications)
│   │   └── index.js                 # Store configuration
│   ├── utils/
│   │   ├── apiClient.js             # Axios configuration
│   │   └── validation.js            # Yup validation schemas
│   ├── App.jsx                      # Main app component
│   └── main.jsx                     # App entry point
├── .env                             # Environment variables
├── package.json                     # Dependencies and scripts
├── vite.config.js                   # Vite configuration
└── README.md                        # This file
```

## Key Features

### Dashboard
- Modern gradient design with statistics cards
- Quick navigation to different modules
- Real-time data display
- Responsive layout for all screen sizes

### Student Management
- Comprehensive student registration form
- Advanced search and filtering
- Hybrid table/card layout (table on desktop, cards on mobile)
- Detailed student profiles with all information
- Edit and delete functionality with proper permissions

### Staff Management
- Staff registration with role-based permissions
- Department-wise organization
- Permission management for students and staff modules
- Profile management and status control

### Authentication
- Secure JWT-based login system
- Automatic token refresh
- Password change functionality
- Session management with logout

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interface
- Optimized for all device sizes

## State Management

The application uses Redux Toolkit for state management with the following slices:

- **authSlice**: User authentication, tokens, permissions
- **studentSlice**: Student data, filters, pagination
- **staffSlice**: Staff data, filters, pagination  
- **uiSlice**: Dialog states, notifications, loading states

## API Integration

The frontend communicates with the backend API using Axios with:

- Automatic request/response interceptors
- JWT token management
- Error handling and retry logic
- Request timeout configuration
- Development logging

## Form Validation

Uses Yup for comprehensive form validation:

- Real-time field validation
- Custom error messages
- Phone number and email validation
- Date validation and constraints
- Required field enforcement

## Routing Structure

```
/                    # Dashboard (protected)
/login              # Login page (public)
/students           # Student management (protected)
/staff              # Staff management (protected)
/profile            # User profile settings (protected)
```

## Build and Deployment

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist` directory.

### Deployment Options

**Static Hosting (Recommended)**
- Netlify, Vercel, or GitHub Pages
- Upload the `dist` directory contents
- Configure environment variables in hosting platform

**Traditional Web Server**
- Apache or Nginx
- Serve files from `dist` directory
- Configure fallback to `index.html` for client-side routing

**Docker Deployment**

Create `Dockerfile`:
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Code splitting with React.lazy
- Image optimization and lazy loading
- Bundle size optimization with Vite
- Efficient re-rendering with React.memo
- Optimized API calls with request deduplication

## Troubleshooting

### Common Issues

**API Connection Failed**
- Check VITE_API_URL in .env file
- Verify backend server is running
- Check network connectivity

**Authentication Issues**
- Clear browser localStorage and cookies
- Check JWT token expiration
- Verify API credentials

**Build Failures**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors
- Verify environment variables

**Responsive Layout Issues**
- Check browser developer tools
- Test on actual devices
- Verify breakpoint configurations

### Development Tips

- Use React Developer Tools browser extension
- Monitor Network tab for API calls
- Check Console for JavaScript errors
- Use Redux DevTools for state debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Test on multiple screen sizes
5. Submit a pull request

## License

This project is licensed under the MIT License.

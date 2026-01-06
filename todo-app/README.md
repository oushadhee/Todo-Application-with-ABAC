# Todo Application with ABAC (Attribute-Based Access Control)

A comprehensive todo application demonstrating Attribute-Based Access Control (ABAC) implementation using Next.js, Better Auth, Prisma, and shadcn/ui.

## Features

- **User Authentication**: Secure authentication with Better Auth
- **Role-Based Access Control**: Three user roles (USER, MANAGER, ADMIN) with different permissions
- **Todo Management**: Create, read, update, and delete todos with proper access controls
- **Modern UI**: Clean interface built with shadcn/ui components
- **Real-time Updates**: TanStack Query for efficient data fetching and caching

## User Roles & Permissions

### USER
- ✅ View own todos
- ✅ Create new todos
- ✅ Update own todos
- ❌ Delete only own draft todos

### MANAGER
- ✅ View all todos (read-only)
- ❌ Create todos
- ❌ Update todos
- ❌ Delete todos

### ADMIN
- ✅ View all todos
- ❌ Create todos
- ❌ Update todos
- ✅ Delete any todo (regardless of status)

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query
- **Authentication**: Better Auth
- **Database**: SQLite with Prisma ORM
- **TypeScript**: Full type safety

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Testing the Application

1. **Register new users** or use these test accounts:
   - `user@example.com` (USER role)
   - `manager@example.com` (MANAGER role)
   - `admin@example.com` (ADMIN role)
   - Password: `password123`

2. **Test ABAC permissions**:
   - Create todos as a USER
   - Switch accounts to see different permission levels
   - Try updating/deleting todos with different roles

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/route.ts    # Better Auth API routes
│   │   └── todos/                    # Todo CRUD API routes
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout with providers
│   └── page.tsx                      # Main application page
├── components/
│   ├── auth-form.tsx                 # Authentication form
│   ├── providers.tsx                 # React Query provider
│   ├── todo-form.tsx                 # Todo creation/editing form
│   ├── todo-list.tsx                 # Todo list display
│   └── ui/                           # shadcn/ui components
├── hooks/
│   ├── use-auth.ts                   # Authentication hook
│   └── use-todos.ts                  # Todo API hooks
└── lib/
    ├── abac.ts                       # Access control logic
    ├── auth.ts                       # Better Auth configuration
    └── prisma.ts                     # Prisma client
```

## ABAC Implementation

The access control is implemented in `src/lib/abac.ts` with functions that check permissions based on:
- User role (USER, MANAGER, ADMIN)
- Todo ownership (userId)
- Todo status (DRAFT, IN_PROGRESS, COMPLETED)

## Deployment

The application can be deployed to Vercel, Render, or any platform supporting Next.js:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy** to your preferred platform

## Environment Variables

Create a `.env` file with:
```
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="your-secret-key"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

<div align='center'>

# **Linkflow**

Linkflow is a streamlined workflow builder app that enables your organization to create efficient workflows for your teams

Note: The project is currently under development

<br/>

<img src="https://img.shields.io/github/stars/yuvarajmadineni/linkflow?style=for-the-badge&logo=powerpages&color=cba6f7&logoColor=D9E0EE&labelColor=302D41"/>
<img src="https://img.shields.io/github/last-commit/yuvarajmadineni/linkflow?style=for-the-badge&logo=github&color=a6da95&logoColor=D9E0EE&labelColor=302D41"/>
<img src="https://img.shields.io/github/repo-size/yuvarajmadineni/linkflow?style=for-the-badge&logo=dropbox&color=7dc4e4&logoColor=D9E0EE&labelColor=302D41"/>

<br/>
<br/>
<br/>

</div>

### TECH STACK

- Framework - Nextjs
- Database - Supabase
- UI - Shadcn
- Auth - Clerk
- Orm - DrizzleORM
- State management - Zustand

## Getting Started

To begin using the Linkflow application, you'll need authentication credentials from Clerk and the database URL

Please follow this documentation to setup clerk credentials (https://clerk.com/docs/quickstarts/nextjs)

Add these values in .env.local

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
DATABASE_URL
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

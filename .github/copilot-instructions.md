I am building a gym fitness app using NextJs, shadcn/ui, default shadcn forms that use react hook form. I have created home page for now. 

layoutPage:
[layout](/app/layout.tsx)

homePage:
[page](/app/page.tsx)

signupPage:
[page](/app/(auth)/signup/page.tsx)

signinPage:
[page](/app/(auth)/signin/page.tsx)

profilePage:
[page](/app/profile/page.tsx)

The backend service is provided by Appwrite. The appwrite configuration is inside the lib folder of the main root directory. It is defined as follows:

[appwrite.ts](/lib/appwrite.ts)

[user.actions.ts](/lib/user.actions.ts)

The app uses react query for handling server state for the UI components. There is a custom hook called useAuth to handle fetching data from user.actions.ts and appwrite.ts defined as follows:

[use-auth.ts](/hooks/use-auth.ts)

The provider for react query is simply defined by this file:

[query-provider.tsx](/providers/query-provider.tsx)

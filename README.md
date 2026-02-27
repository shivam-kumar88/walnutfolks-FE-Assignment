
## Getting Started

Go to the project directory
for here /walnutfolks-FE-Assignment

First install all dependecies of the project using command 

```bash
npm i

#or

npm install
```

run the project in development server:

```bash
npm run dev
```


run the production server:

```bash
npm run build

#then
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

But alternatively you can reach the deployed website using the link -
[https://walnutfolks-fe.netlify.app/](https://walnutfolks-fe.netlify.app/) 


##  Architectural Decisions

Next.js - 16 for frontend Framework
supabase - for Auth flow and database to save user's call analyttics data 
Redux Toolkit - for state management 
Redux-Thunk -  for data fetching from the supabase (In a real-world scenario, TanStack Query/React Query is often more suitable for Supabase data fetching because it simplifies the process with built-in caching and automatic loading state management.)
shadcn ui -  For ui components like dilogs, toast message etc..
Rechart - For Chart representaions



## The Data Flow Model

Auth Flow: User signs up/in → Supabase sets a cookie → Redux authSlice is updated → Header displays user name.

Chart Flow: Dashboard mounts → useEffect dispatches fetchUserChartData → Thunk calls Supabase → Data populates Redux → Recharts animates into view.

Update Flow: User edits in Modal → Hits "Save" → AlertDialog confirms → upsert call to Supabase → Redux state syncs → Toast notification appears.

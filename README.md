# How did we get here?

### Create a React app
```
$ npx create-react-app react-router-tutorial
```
### Install react-router dependencies
```
$ cd react-router-tutorial
$ yarn add react-router-dom@6
```
### Complete switch from npm to yarn
```
$ rm package-lock.json
```
### Get rid of boilerplate stuff
Basically want `index.js` and `App.js` to be extremely boring.

### Startup the app
```
$ yarn start
```
## Introduce React-Router
Following along with the tutorial at the official React-Router site:
https://reactrouter.com/docs/en/v6/getting-started/tutorial#tutorial

### Connect the URL
Need to import `BrowserRouter` and render it around your entire app:
```javascript
// in src/index.js
import { BrowserRouter } from "react-router-dom";
...
render(
  <BrowserRouter>
      <App />
  </BrowserRouter>, 
  rootElement
);
```

### Add Some Links
```javascript
// in src/App.js
import { Link } from "react-router-dom";
...
  <Link to="/invoices">Invoices</Link> |{" "}
  <Link to="/expenses">Expenses</Link>
```
React Router is now controlling the URL!

### Tell React-Router how to render
Create files that render the routes (`src/routes/expenses.js` and `src/routes/invoices.js`).
```javascript
// in index.js
...
import Expenses from "./routes/expenses";
import Invoices from "./routes/invoices";

render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="invoices" element={<Invoices />} />
        </Routes>
    </BrowserRouter>,
    rootElement
);
```
### Nested Routes
Repeat the shared layout that we have in `App.js` in each of the routes by introducing and "Outlet".

First, nest the routes:
```javascript
// in index.js
render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
              <Route path="expenses" element={<Expenses />} />
              <Route path="invoices" element={<Invoices />} />
            </Route>
        </Routes>
    </BrowserRouter>,
    rootElement
);
```
See the difference there? When routes have children, 2 things happen:
1. The URLs are nested (`"/" + "expenses"` and `"/" + "invoices"`)
2. The UI components are nested for shared layout when the child route matches. 

However, before (2) will work, we need to render an `Outlet` in the `App.js` "parent" route. This tells React where the content of the child routes should render in relation to their parent.
```javascript
// in App.js
return (
  <div>
...
    <nav>
      <Link to="/invoices">Invoices</Link> |{" "}
      <Link to="/expenses">Expenses</Link>
    </nav>
    <Outlet />
  </div>
);
```
### Add a "No Match" route
It's good practice to always handle the "no match" case. You can handle this in the config of the `BrowserRouter`.
```javascript
// in index.js
<Routes>
    <Route path="/" element={<App/>}>
        <Route path="expenses" element={<Expenses/>}/>
        <Route path="invoices" element={<Invoices/>}/>
        <Route path="*"
               element={
                   <main style={{padding: "1rem"}}>
                       <p>Sadly, there's nothing here.</p>
                   </main>
               }
        />
    </Route>
</Routes>
```
The `"*"` has special meaning here. It will only match when no other routes do.

And since it is included in the nested routes, it will render in the `Outlet` of the parent route, just like its other siblings.

## Reading URL Params
To add a route for a specific invoice, we want to pull the invoice number off of the URL.

Create a new nested route under the existing "invoices" route:
```javascript
// in src/index.js
...
<Routes>
    <Route path="/" element={<App />}>
        <Route path="expenses" element={<Expenses />} />
        <Route path="invoices" element={<Invoices />}>
            <Route path=":invoiceId" element={<Invoice />} />
        </Route>
...
</Routes>
```
This new nested route will match all URLs like "/invoices/2005" and "/invoices/1998". The `:invoiceId` part fo the path is a "URL param", meaning it can match any value as long as it fits the pattern.

Note that because the route is nested, the UI will be too, but in order to display the invoice component, we need to add an `Outlet` to the parent layout route (see `src/routes/invoices.js`).

You access the value of the URL param using a hook into React-Router:
```javascript
// in src/routes/invoice.js
import { useParams } from "react-router-dom";

export default function Invoice() {
    let params = useParams();
    return <h2>Invoice: {params.invoiceId}</h2>;
}
```
Note that the key of the param on the `params` object is the same as the dynamic segment of the route path:
```javascript
:invoiceId -> params.invoiceId
```

### Index Routes
Index routes match when a parent route matches, but none of the other children routes match. 
```javascript
// in src/index.js
...
<Route path="invoices" element={<Invoices/>}>
    <Route index element={
        <p>Please select an invoice.</p>
    }/>
    <Route path=":invoiceId" element={<Invoice/>}/>
</Route>
...
```
So in this case the index route will be displayed in the parent's `Outlet` when the URL does not include anything after "/invoices".

### Active Links
To indicate the link that is currently active, use `NavLink`, and base the style on the `isActive` value that `NavLink` passes into the `style` or `className` function. So something like:
```javascript
<NavLink style={({ isActive }) => {
             return {
                 display: "block",
                 margin: "1rem 0",
                 color: isActive ? "red" : "",
             };
         }} ... />
```
or
```javascript
<NavLink className={({ isActive }) => isActive ? "red" : "blue"} />
```

### Search Params
Access search params (URL parameters after the `"?"`) with the `useSearchParams` hook. It works a lot like `React.useState()` but stores and sets the state in the URL search params instead of in memory.
```javascript
const [searchParams, setSearchParams] = useSearchParams();
```

### Custom Behavior
Can access attributes about what React-Router thinks the current location is via the `useLocation` hook.
```javascript
const location = useLocation();
```
A location looks something like this:
```javascript
{
  pathname: "/invoices",
  search: "?filter=sa",
  hash: "",
  state: null,
  key: "ae4cz2j"
}
```

### Navigating Programmatically
What if we want to add a button that marks an invoice as paid and then navigates to the index route?

Can access a function that tells the router to navigate to a new route via the `useNavigation` hook.
```javascript
const navigate = useNavigate();
```
Then later, most likely in an `onClick` handler, can navigate to a new route with:
```javascript
navigate("/invoices");
```

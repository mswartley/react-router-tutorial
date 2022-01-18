import { NavLink, Outlet, useSearchParams } from 'react-router-dom';
import { getInvoices } from '../data';

export default function Invoices() {
    const invoices = getInvoices();
    const [searchParams, setSearchParams] = useSearchParams();
    return (
        <div style={{display: "flex"}}>
            <nav style={{
                borderRight: "solid 1px",
                padding: "1rem",
            }}>
                <input value={searchParams.get('filter') || ''}
                    onChange={event => {
                        let filter = event.target.value;
                        if (filter) {
                            setSearchParams({filter});
                        } else {
                            setSearchParams({});
                        }
                    }}
                />
                {invoices
                    .filter(invoice => {
                        const filter = searchParams.get('filter');
                        if (!filter) {
                            return true;
                        }
                        return invoice.name.toLowerCase().startsWith(filter.toLowerCase());
                    })
                    .map(invoice => (
                        <NavLink style={({ isActive }) => {
                                     return {
                                         display: "block",
                                         margin: "1rem 0",
                                         color: isActive ? "red" : "",
                                     };
                                 }}
                                 to={`/invoices/${invoice.number}`}
                                 key={invoice.number}>
                            {invoice.name}
                        </NavLink>
                    ))}
            </nav>
            <div style={{margin: "0 1rem"}}>
                <Outlet/>
            </div>
        </div>
    );
}

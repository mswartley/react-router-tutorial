import { useParams, useNavigate } from 'react-router-dom';
import { getInvoice, deleteInvoice } from '../data';

export default function Invoice() {
    const navigate = useNavigate();
    const { invoiceId } = useParams();
    const invoice = getInvoice(parseInt(invoiceId, 10));
    return (
        <main>
            {invoice ? <>
                <h2>Total Due: {invoice.amount}</h2>
                <p>{invoice.name}: {invoice.number}</p>
                <p>Due Date: {invoice.due}</p>
                <p>
                    <button onClick={() => { deleteInvoice(invoice.number); navigate("/invoices"); }}>
                        Delete
                    </button>
                </p>
            </> : <>
                <h2>Error</h2>
                <p>Could not find invoice #{invoiceId}!</p>
            </>}
        </main>
    );
}

export function generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 9999);
    return `FREE-${timestamp}${random}`;
}

export function generateInvoiceId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "BC";
    for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

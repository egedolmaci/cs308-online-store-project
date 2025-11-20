from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from app.domains.order.entity import Order

def generate_invoice_pdf(order: Order, customer_name: str | None = None, company_name: str = "Fashion Store") -> bytes:
    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()
    elements = []

    # Header
    elements.append(Paragraph(company_name, styles["Title"]))
    elements.append(Paragraph("Invoice", styles["Heading2"]))
    elements.append(Spacer(1, 12))

    # Order info
    created_str = order.created_at.strftime("%Y-%m-%d %H:%M") if order.created_at else ""
    elements.append(Paragraph(f"Order ID: {order.id}", styles["Normal"]))
    elements.append(Paragraph(f"Order Date: {created_str}", styles["Normal"]))
    elements.append(Paragraph(f"Status: {order.status}", styles["Normal"]))
    if customer_name:
        elements.append(Paragraph(f"Customer: {customer_name}", styles["Normal"]))
    if order.delivery_address:
        elements.append(Paragraph(f"Delivery Address: {order.delivery_address}", styles["Normal"]))
    elements.append(Spacer(1, 12))

    # Items
    data = [["Item", "Qty", "Price", "Total"]]
    for item in order.items:
        data.append([
            getattr(item, "product_name", f"Product ID {item.product_id}"),
            str(item.quantity),
            f"${item.product_price:.2f}",
            f"${item.subtotal:.2f}",
        ])

    table = Table(data, colWidths=[250, 50, 80, 80])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#B6AE9F")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("ALIGN", (1, 1), (-1, -1), "RIGHT"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
        ("GRID", (0, 0), (-1, -1), 0.25, colors.grey),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 12))

    # Totals
    totals = [
        ["Tax", f"${order.tax_amount:.2f}"],
        ["Shipping", f"${order.shipping_amount:.2f}"],
        ["Total", f"${order.total_amount:.2f}"],
    ]
    totals_table = Table(totals, colWidths=[380, 80])
    totals_table.setStyle(TableStyle([
        ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
    ]))
    elements.append(totals_table)

    doc.build(elements)
    pdf = buf.getvalue()
    buf.close()
    return pdf

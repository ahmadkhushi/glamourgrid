import nodemailer from 'nodemailer';

const ADMIN_EMAIL = 'glamourgrid32@gmail.com';

async function createVerifiedTransporter() {
  const user = (process.env.EMAIL_USER || ADMIN_EMAIL).trim();
  const pass = (process.env.EMAIL_APP_PASS || '').trim();

  console.log('Nodemailer Config Check:', {
    user,
    hasPass: !!pass,
    passLength: pass ? pass.length : 0,
    envUserSet: !!process.env.EMAIL_USER,
    envPassSet: !!process.env.EMAIL_APP_PASS,
  });

  if (!pass) {
    console.warn('⚠️ Nodemailer Warning: EMAIL_APP_PASS environment variable is NOT set or empty!');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });

  try {
    console.log('Verifying SMTP Connection to Gmail for user:', user);
    await transporter.verify();
    console.log('SMTP Connection verified successfully!');
  } catch (verifyError) {
    console.error('SMTP Connection Verification Error:', verifyError);
  }

  return transporter;
}

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedColor?: string;
}

export interface EmailOrderDetails {
  orderRef: string;
  customerName: string;
  customerEmail?: string | null;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  total: number;
  items: OrderItem[] | any;
  status?: string;
}

// Common luxury layout wrapper matching GlamourGrid theme
function wrapEmailTemplate(title: string, contentHtml: string): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0f0c08; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #FDFBF7;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f0c08; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #16100a; border: 1px solid #2a2018; border-radius: 8px; overflow: hidden; max-width: 600px; width: 100%;">
            <!-- Header -->
            <tr>
              <td align="center" style="padding: 30px 20px; background-color: #0f0c08; border-bottom: 1px solid #2a2018;">
                <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; color: #d4af37; letter-spacing: 2px; text-transform: uppercase;">GLAMOURGRID</h1>
                <p style="margin: 5px 0 0 0; font-size: 11px; color: #a89f91; letter-spacing: 3px; text-transform: uppercase;">Luxury Cosmetics & Fragrances</p>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding: 30px 25px;">
                ${contentHtml}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding: 20px; background-color: #0f0c08; border-top: 1px solid #2a2018; font-size: 12px; color: #a89f91;">
                <p style="margin: 0 0 5px 0;">Need assistance? Contact our luxury concierge at <a href="mailto:glamourgrid32@gmail.com" style="color: #d4af37; text-decoration: none;">glamourgrid32@gmail.com</a></p>
                <p style="margin: 0; font-size: 11px; color: #665f54;">&copy; ${new Date().getFullYear()} GlamourGrid. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

// 1. Send Order Confirmation Email to Customer
export async function sendOrderConfirmationEmail(order: EmailOrderDetails): Promise<boolean> {
  const recipientEmail = order.customerEmail;
  if (!recipientEmail) {
    console.log('No customer email provided for order confirmation, skipping customer email.');
    return false;
  }

  try {
    const transporter = await createVerifiedTransporter();
    const itemsList = Array.isArray(order.items) ? order.items : [];

    const itemsHtml = itemsList
      .map(
        (item: OrderItem) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #2a2018; color: #FDFBF7; font-size: 14px;">
          ${item.name} ${item.selectedColor ? `<span style="color: #a89f91; font-size: 12px;">(${item.selectedColor})</span>` : ''} × ${item.quantity || 1}
        </td>
        <td align="right" style="padding: 10px 0; border-bottom: 1px solid #2a2018; color: #d4af37; font-size: 14px; font-weight: bold;">
          Rs. ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
        </td>
      </tr>
    `
      )
      .join('');

    const bodyHtml = `
      <h2 style="font-family: Georgia, serif; color: #d4af37; font-size: 20px; margin-top: 0;">Thank You for Your Order, ${order.customerName}!</h2>
      <p style="color: #a89f91; font-size: 14px; line-height: 1.6;">
        We have received your order <strong style="color: #d4af37;">#${order.orderRef}</strong> and it is currently being prepared with care.
      </p>

      <div style="background-color: #0f0c08; border: 1px solid #2a2018; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #d4af37; text-transform: uppercase; letter-spacing: 1px;">Order Summary</h3>
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          ${itemsHtml}
          <tr>
            <td style="padding-top: 15px; font-weight: bold; color: #a89f91; font-size: 14px;">Total Amount:</td>
            <td align="right" style="padding-top: 15px; font-weight: bold; color: #d4af37; font-size: 18px;">
              Rs. ${Number(order.total).toLocaleString()}
            </td>
          </tr>
        </table>
      </div>

      <div style="background-color: #0f0c08; border: 1px solid #2a2018; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 13px; color: #a89f91;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #d4af37; text-transform: uppercase; letter-spacing: 1px;">Delivery Details</h3>
        <p style="margin: 3px 0;"><strong style="color: #FDFBF7;">Phone:</strong> ${order.phone}</p>
        <p style="margin: 3px 0;"><strong style="color: #FDFBF7;">City:</strong> ${order.city}</p>
        <p style="margin: 3px 0;"><strong style="color: #FDFBF7;">Address:</strong> ${order.address}</p>
        <p style="margin: 3px 0;"><strong style="color: #FDFBF7;">Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
      </div>

      <p style="color: #a89f91; font-size: 13px; line-height: 1.6;">
        You can track your order status anytime on our website using your Order Reference: <strong style="color: #d4af37;">${order.orderRef}</strong>.
      </p>
    `;

    console.log(`Sending Customer Confirmation Email to ${recipientEmail}...`);
    const info = await transporter.sendMail({
      from: `"GlamourGrid" <${process.env.EMAIL_USER || ADMIN_EMAIL}>`,
      to: recipientEmail,
      subject: `Order Confirmation - #${order.orderRef} | GlamourGrid`,
      html: wrapEmailTemplate('Order Confirmation', bodyHtml),
    });

    console.log('Nodemailer Success:', info);
    return true;
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return false;
  }
}

// 2. Send New Order Received Alert to Admin
export async function sendAdminNewOrderNotification(order: EmailOrderDetails): Promise<boolean> {
  const adminRecipient = (process.env.EMAIL_USER || ADMIN_EMAIL).trim();

  try {
    const transporter = await createVerifiedTransporter();
    const itemsList = Array.isArray(order.items) ? order.items : [];

    const itemsHtml = itemsList
      .map(
        (item: OrderItem) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #2a2018; color: #FDFBF7; font-size: 13px;">
          ${item.name} ${item.selectedColor ? `(${item.selectedColor})` : ''} × ${item.quantity || 1}
        </td>
        <td align="right" style="padding: 8px 0; border-bottom: 1px solid #2a2018; color: #d4af37; font-size: 13px;">
          Rs. ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
        </td>
      </tr>
    `
      )
      .join('');

    const bodyHtml = `
      <h2 style="font-family: Georgia, serif; color: #d4af37; font-size: 20px; margin-top: 0;">🛒 New Order Received!</h2>
      <p style="color: #a89f91; font-size: 14px;">
        A new order <strong style="color: #d4af37;">#${order.orderRef}</strong> has been placed on GlamourGrid.
      </p>

      <div style="background-color: #0f0c08; border: 1px solid #2a2018; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #d4af37; text-transform: uppercase;">Customer Details</h3>
        <p style="margin: 4px 0; color: #FDFBF7; font-size: 14px;"><strong>Name:</strong> ${order.customerName}</p>
        <p style="margin: 4px 0; color: #FDFBF7; font-size: 14px;"><strong>Email:</strong> ${order.customerEmail || 'N/A'}</p>
        <p style="margin: 4px 0; color: #FDFBF7; font-size: 14px;"><strong>Phone:</strong> ${order.phone}</p>
        <p style="margin: 4px 0; color: #FDFBF7; font-size: 14px;"><strong>City:</strong> ${order.city}</p>
        <p style="margin: 4px 0; color: #FDFBF7; font-size: 14px;"><strong>Address:</strong> ${order.address}</p>
        <p style="margin: 4px 0; color: #FDFBF7; font-size: 14px;"><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
      </div>

      <div style="background-color: #0f0c08; border: 1px solid #2a2018; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #d4af37; text-transform: uppercase;">Ordered Items</h3>
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          ${itemsHtml}
          <tr>
            <td style="padding-top: 12px; font-weight: bold; color: #a89f91;">Grand Total:</td>
            <td align="right" style="padding-top: 12px; font-weight: bold; color: #d4af37; font-size: 16px;">
              Rs. ${Number(order.total).toLocaleString()}
            </td>
          </tr>
        </table>
      </div>
    `;

    console.log(`Sending Admin New Order Alert Email to ${adminRecipient}...`);
    const info = await transporter.sendMail({
      from: `"GlamourGrid System" <${process.env.EMAIL_USER || ADMIN_EMAIL}>`,
      to: adminRecipient,
      subject: `🛒 New Order #${order.orderRef} - Rs. ${Number(order.total).toLocaleString()}`,
      html: wrapEmailTemplate('New Order Alert', bodyHtml),
    });

    console.log('Nodemailer Success:', info);
    return true;
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return false;
  }
}

// 3. Send Order Status Tracking Email to Customer
export async function sendOrderStatusUpdateEmail(
  order: EmailOrderDetails,
  newStatus: string
): Promise<boolean> {
  const recipientEmail = order.customerEmail;
  if (!recipientEmail) {
    console.log('No customer email found for order status update email, skipping.');
    return false;
  }

  try {
    const transporter = await createVerifiedTransporter();

    let statusDescription = '';
    let statusTitle = newStatus;

    switch (newStatus.toUpperCase()) {
      case 'PROCESSING':
        statusTitle = 'Processing';
        statusDescription = 'Your order is currently being processed by our packaging team and will be dispatched shortly.';
        break;
      case 'SHIPPED':
        statusTitle = 'Shipped';
        statusDescription = 'Great news! Your package has been handed over to our courier partner and is on its way to you.';
        break;
      case 'DELIVERED':
        statusTitle = 'Delivered';
        statusDescription = 'Your order has been marked as successfully delivered. We hope you love your luxury products!';
        break;
      case 'CANCELLED':
        statusTitle = 'Cancelled';
        statusDescription = 'Your order status has been updated to Cancelled. If you have any questions, please contact our support.';
        break;
      default:
        statusDescription = `Your order status has been updated to ${newStatus}.`;
    }

    const bodyHtml = `
      <h2 style="font-family: Georgia, serif; color: #d4af37; font-size: 20px; margin-top: 0;">Order Status Update</h2>
      <p style="color: #a89f91; font-size: 14px;">
        Dear <strong style="color: #FDFBF7;">${order.customerName}</strong>,
      </p>
      <p style="color: #a89f91; font-size: 14px; line-height: 1.6;">
        The status of your order <strong style="color: #d4af37;">#${order.orderRef}</strong> has been updated to:
      </p>

      <div style="background-color: #0f0c08; border: 1px solid #d4af37; padding: 20px; text-align: center; margin: 25px 0; border-radius: 4px;">
        <span style="font-size: 12px; color: #a89f91; text-transform: uppercase; letter-spacing: 2px;">Current Status</span>
        <h3 style="margin: 5px 0 0 0; font-size: 24px; color: #d4af37; text-transform: uppercase; letter-spacing: 1px;">
          ${statusTitle}
        </h3>
      </div>

      <p style="color: #FDFBF7; font-size: 14px; line-height: 1.6; background-color: #0f0c08; border: 1px solid #2a2018; padding: 15px; border-radius: 4px;">
        ${statusDescription}
      </p>

      <div style="margin-top: 25px; text-align: center;">
        <a href="https://glamourgrid.vercel.app/track-order" style="background-color: #d4af37; color: #0f0c08; padding: 12px 25px; text-decoration: none; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; border-radius: 4px;">
          Track Your Order
        </a>
      </div>
    `;

    console.log(`Sending Order Status Update (${statusTitle}) Email to ${recipientEmail}...`);
    const info = await transporter.sendMail({
      from: `"GlamourGrid" <${process.env.EMAIL_USER || ADMIN_EMAIL}>`,
      to: recipientEmail,
      subject: `Order Update - #${order.orderRef} is now ${statusTitle} | GlamourGrid`,
      html: wrapEmailTemplate('Order Status Update', bodyHtml),
    });

    console.log('Nodemailer Success:', info);
    return true;
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return false;
  }
}

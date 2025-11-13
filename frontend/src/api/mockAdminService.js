// Mock Admin API Service
// Simulates backend API calls with setTimeout for latency

// Utility function to simulate API delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data generators
const generateMockInvoices = (startDate, endDate) => {
  const invoices = [];
  const count = Math.floor(Math.random() * 10) + 5;

  for (let i = 0; i < count; i++) {
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let total = 0;

    for (let j = 0; j < itemCount; j++) {
      const price = Math.random() * 150 + 30;
      const quantity = Math.floor(Math.random() * 3) + 1;
      items.push({
        productId: `PROD-${3000 + Math.floor(Math.random() * 20)}`,
        productName: `Product ${Math.floor(Math.random() * 20) + 1}`,
        quantity,
        price: price.toFixed(2),
        subtotal: (price * quantity).toFixed(2),
      });
      total += price * quantity;
    }

    invoices.push({
      id: `INV-${1000 + i}`,
      orderId: `ORD-${2000 + i}`,
      customerName: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      amount: total.toFixed(2),
      items,
      date: new Date(
        startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
      ).toISOString().split('T')[0],
      status: ['Paid', 'Pending', 'Overdue'][Math.floor(Math.random() * 3)],
      address: `${100 + i} Main Street, City, State 12345`,
    });
  }

  return invoices.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const generateMockFinancials = (startDate, endDate) => {
  const revenue = (Math.random() * 50000 + 10000).toFixed(2);
  const costs = (revenue * (Math.random() * 0.4 + 0.3)).toFixed(2);
  const profit = (revenue - costs).toFixed(2);

  return {
    revenue,
    costs,
    profit,
    profitMargin: ((profit / revenue) * 100).toFixed(2),
    orders: Math.floor(Math.random() * 200 + 50),
    averageOrderValue: (revenue / Math.floor(Math.random() * 200 + 50)).toFixed(2),
    period: {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    },
  };
};

const generateMockProducts = () => {
  const categories = ['T-Shirts', 'Jeans', 'Hoodies', 'Jackets', 'Sneakers'];
  const products = [];

  for (let i = 0; i < 20; i++) {
    products.push({
      id: `PROD-${3000 + i}`,
      name: `Product ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      salePrice: (Math.random() * 200 + 30).toFixed(2),
      costPrice: (Math.random() * 100 + 15).toFixed(2),
      stock: Math.floor(Math.random() * 100),
      sku: `SKU-${10000 + i}`,
      status: Math.random() > 0.2 ? 'active' : 'inactive',
      image: `https://source.unsplash.com/300x300/?fashion,clothing&sig=${i}`,
      description: `This is a description for product ${i + 1}`,
    });
  }

  return products;
};

const generateMockCategories = () => {
  return [
    { id: 1, name: 'T-Shirts', slug: 't-shirts', productCount: 45 },
    { id: 2, name: 'Jeans', slug: 'jeans', productCount: 32 },
    { id: 3, name: 'Hoodies', slug: 'hoodies', productCount: 28 },
    { id: 4, name: 'Jackets', slug: 'jackets', productCount: 18 },
    { id: 5, name: 'Sneakers', slug: 'sneakers', productCount: 52 },
  ];
};

const generateMockDeliveries = () => {
  const statuses = ['pending', 'processing', 'in-transit', 'delivered'];
  const deliveries = [];

  for (let i = 0; i < 15; i++) {
    deliveries.push({
      id: `DEL-${4000 + i}`,
      orderId: `ORD-${2000 + i}`,
      customer: `Customer ${i + 1}`,
      product: `Product ${i + 1}`,
      address: `${100 + i} Main Street, City, State 12345`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      estimatedDelivery: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  }

  return deliveries;
};

const generateMockComments = () => {
  const comments = [];

  for (let i = 0; i < 10; i++) {
    comments.push({
      id: `CMT-${5000 + i}`,
      productId: `PROD-${3000 + Math.floor(Math.random() * 20)}`,
      productName: `Product ${Math.floor(Math.random() * 20) + 1}`,
      userId: `USER-${6000 + i}`,
      userName: `User ${i + 1}`,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: `This is a sample comment #${i + 1}. ${Math.random() > 0.5 ? 'Great product!' : 'Could be better.'}`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
    });
  }

  return comments;
};

const generateMockChats = () => {
  const chats = [];

  for (let i = 0; i < 8; i++) {
    const isClaimed = i < 3;
    chats.push({
      id: `CHAT-${7000 + i}`,
      customerId: `USER-${6000 + i}`,
      customerName: `Customer ${i + 1}`,
      status: isClaimed ? 'active' : 'waiting',
      agentId: isClaimed ? 'AGENT-001' : null,
      agentName: isClaimed ? 'Current Agent' : null,
      lastMessage: `Last message from customer ${i + 1}...`,
      lastMessageTime: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
      unreadCount: Math.floor(Math.random() * 5),
      isLinkedUser: Math.random() > 0.3,
    });
  }

  return chats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
};

const generateMockChatMessages = (chatId) => {
  const messages = [];

  for (let i = 0; i < 10; i++) {
    messages.push({
      id: `MSG-${8000 + i}`,
      chatId,
      sender: i % 3 === 0 ? 'agent' : 'customer',
      message: `Sample message ${i + 1}. This is a longer message to test the chat interface.`,
      timestamp: new Date(Date.now() - (10 - i) * 5 * 60 * 1000).toISOString(),
    });
  }

  return messages;
};

const generateCustomerContext = (customerId) => {
  return {
    profile: {
      id: customerId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2023-05-15',
      loyaltyPoints: Math.floor(Math.random() * 1000),
    },
    cart: [
      {
        id: 'PROD-3001',
        name: 'Classic T-Shirt',
        quantity: 2,
        price: 29.99,
      },
      {
        id: 'PROD-3005',
        name: 'Denim Jeans',
        quantity: 1,
        price: 79.99,
      },
    ],
    orders: [
      {
        id: 'ORD-2001',
        date: '2024-11-01',
        total: 159.97,
        status: 'delivered',
      },
      {
        id: 'ORD-2015',
        date: '2024-11-10',
        total: 89.99,
        status: 'in-transit',
      },
    ],
    wishlist: [
      {
        id: 'PROD-3010',
        name: 'Leather Jacket',
        price: 199.99,
      },
      {
        id: 'PROD-3012',
        name: 'Running Sneakers',
        price: 89.99,
      },
    ],
  };
};

// API Service Functions

export const fetchInvoices = async (startDate, endDate) => {
  await delay();
  return generateMockInvoices(new Date(startDate), new Date(endDate));
};

export const fetchFinancials = async (startDate, endDate) => {
  await delay();
  return generateMockFinancials(new Date(startDate), new Date(endDate));
};

export const updateProductPrice = async (data) => {
  await delay();
  console.log('Updating product prices:', data);
  return {
    success: true,
    message: `Discount of ${data.discountRate}% applied to ${data.productIds.length} products`,
    notifiedUsers: Math.floor(Math.random() * 50 + 10),
  };
};

export const fetchProducts = async () => {
  await delay();
  return generateMockProducts();
};

export const createProduct = async (productData) => {
  await delay();
  console.log('Creating product:', productData);
  return {
    success: true,
    product: {
      id: `PROD-${Math.floor(Math.random() * 10000)}`,
      ...productData,
    },
  };
};

export const updateProduct = async (productId, productData) => {
  await delay();
  console.log('Updating product:', productId, productData);
  return {
    success: true,
    product: {
      id: productId,
      ...productData,
    },
  };
};

export const deleteProduct = async (productId) => {
  await delay();
  console.log('Deleting product:', productId);
  return {
    success: true,
    message: 'Product deleted successfully',
  };
};

export const fetchCategories = async () => {
  await delay();
  return generateMockCategories();
};

export const createCategory = async (categoryData) => {
  await delay();
  console.log('Creating category:', categoryData);
  return {
    success: true,
    category: {
      id: Math.floor(Math.random() * 10000),
      ...categoryData,
    },
  };
};

export const updateCategory = async (categoryId, categoryData) => {
  await delay();
  console.log('Updating category:', categoryId, categoryData);
  return {
    success: true,
    category: {
      id: categoryId,
      ...categoryData,
    },
  };
};

export const deleteCategory = async (categoryId) => {
  await delay();
  console.log('Deleting category:', categoryId);
  return {
    success: true,
    message: 'Category deleted successfully',
  };
};

export const fetchDeliveries = async () => {
  await delay();
  return generateMockDeliveries();
};

export const updateDeliveryStatus = async (deliveryId, newStatus) => {
  await delay();
  console.log('Updating delivery status:', deliveryId, newStatus);
  return {
    success: true,
    message: `Delivery ${deliveryId} status updated to ${newStatus}`,
    delivery: {
      id: deliveryId,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const fetchPendingComments = async () => {
  await delay();
  return generateMockComments();
};

export const approveComment = async (commentId) => {
  await delay();
  console.log('Approving comment:', commentId);
  return {
    success: true,
    message: 'Comment approved successfully',
  };
};

export const disapproveComment = async (commentId) => {
  await delay();
  console.log('Disapproving comment:', commentId);
  return {
    success: true,
    message: 'Comment disapproved successfully',
  };
};

export const fetchActiveChats = async () => {
  await delay();
  return generateMockChats();
};

export const claimChat = async (chatId, agentId) => {
  await delay();
  console.log('Claiming chat:', chatId, agentId);
  return {
    success: true,
    message: 'Chat claimed successfully',
    chat: {
      id: chatId,
      agentId,
      status: 'active',
    },
  };
};

export const fetchChatMessages = async (chatId) => {
  await delay();
  return generateMockChatMessages(chatId);
};

export const sendChatMessage = async (chatId, message) => {
  await delay();
  console.log('Sending message:', chatId, message);
  return {
    success: true,
    message: {
      id: `MSG-${Math.floor(Math.random() * 10000)}`,
      chatId,
      sender: 'agent',
      message,
      timestamp: new Date().toISOString(),
    },
  };
};

export const fetchCustomerContext = async (customerId) => {
  await delay();
  return generateCustomerContext(customerId);
};

export const uploadFile = async (file) => {
  await delay();
  console.log('Uploading file:', file.name);
  return {
    success: true,
    fileUrl: `https://example.com/uploads/${file.name}`,
    message: 'File uploaded successfully',
  };
};

// Stock Management Functions
export const fetchProductsWithStock = async () => {
  await delay();
  return generateMockProducts();
};

export const updateProductStock = async (productId, newStock) => {
  await delay();
  console.log('Updating stock:', productId, newStock);
  return {
    success: true,
    message: `Stock updated to ${newStock} for product ${productId}`,
    product: {
      id: productId,
      stock: newStock,
      updatedAt: new Date().toISOString(),
    },
  };
};

// Purchase History Functions
export const fetchAllPurchases = async (startDate, endDate) => {
  await delay();
  const purchases = generateMockInvoices(new Date(startDate || '2024-01-01'), new Date(endDate || Date.now()));
  return purchases;
};

export const fetchPurchaseById = async (purchaseId) => {
  await delay();
  // Generate a single detailed purchase/invoice
  const mockInvoices = generateMockInvoices(new Date('2024-01-01'), new Date());
  return mockInvoices.find(inv => inv.id === purchaseId) || mockInvoices[0];
};

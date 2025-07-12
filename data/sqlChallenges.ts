import { SQLChallenge, Difficulty } from '@/types';

export const SQL_CHALLENGES: SQLChallenge[] = [
  {
    id: 'challenge-1',
    title: 'Employee Salary Analysis',
    description: 'Find all employees in the Engineering department who earn more than $100,000 and were hired after 2021',
    difficulty: Difficulty.BEGINNER,
    hint: 'Use WHERE clause with multiple conditions: department = "Engineering", salary > 100000, and hire_date > "2021-12-31"',
    testCases: [
      {
        id: 'test-1',
        description: 'Should return employees from Engineering with salary > 100000 hired after 2021',
        expectedColumns: ['employee_id', 'first_name', 'last_name', 'department', 'salary', 'hire_date'],
      }
    ],
    tables: [
      {
        name: 'employees',
        columns: [
          { name: 'employee_id', type: 'INTEGER', nullable: false, primaryKey: true },
          { name: 'first_name', type: 'TEXT', nullable: false },
          { name: 'last_name', type: 'TEXT', nullable: false },
          { name: 'department', type: 'TEXT', nullable: false },
          { name: 'salary', type: 'INTEGER', nullable: false },
          { name: 'hire_date', type: 'DATE', nullable: false },
        ]
      }
    ]
  },
  {
    id: 'challenge-2',
    title: 'Product Category Performance',
    description: 'Calculate the total revenue and average price for each product category, ordered by total revenue descending',
    difficulty: Difficulty.INTERMEDIATE,
    hint: 'Use GROUP BY with aggregate functions (SUM, AVG) and ORDER BY to sort results',
    testCases: [
      {
        id: 'test-2',
        description: 'Should return category-wise revenue and average price, sorted by revenue',
        expectedColumns: ['category', 'total_revenue', 'avg_price'],
      }
    ],
    tables: [
      {
        name: 'products',
        columns: [
          { name: 'product_id', type: 'INTEGER', nullable: false, primaryKey: true },
          { name: 'product_name', type: 'TEXT', nullable: false },
          { name: 'category', type: 'TEXT', nullable: false },
          { name: 'price', type: 'DECIMAL', nullable: false },
        ]
      },
      {
        name: 'orders',
        columns: [
          { name: 'order_id', type: 'INTEGER', nullable: false, primaryKey: true },
          { name: 'product_id', type: 'INTEGER', nullable: false },
          { name: 'quantity', type: 'INTEGER', nullable: false },
          { name: 'order_date', type: 'DATE', nullable: false },
        ]
      }
    ]
  },
  {
    id: 'challenge-3',
    title: 'Customer Purchase Patterns',
    description: 'Find customers who made purchases in both January and December 2023, along with their total spending in each month',
    difficulty: Difficulty.ADVANCED,
    hint: 'Use subqueries or self-joins to find customers with orders in both months, then aggregate their spending',
    testCases: [
      {
        id: 'test-3',
        description: 'Should return customers with orders in both January and December 2023',
        expectedColumns: ['customer_id', 'customer_name', 'jan_spending', 'dec_spending'],
      }
    ],
    tables: [
      {
        name: 'customers',
        columns: [
          { name: 'customer_id', type: 'INTEGER', nullable: false, primaryKey: true },
          { name: 'customer_name', type: 'TEXT', nullable: false },
          { name: 'email', type: 'TEXT', nullable: false },
        ]
      },
      {
        name: 'orders',
        columns: [
          { name: 'order_id', type: 'INTEGER', nullable: false, primaryKey: true },
          { name: 'customer_id', type: 'INTEGER', nullable: false },
          { name: 'order_date', type: 'DATE', nullable: false },
          { name: 'total_amount', type: 'DECIMAL', nullable: false },
        ]
      }
    ]
  },
  {
    id: 'challenge-4',
    title: 'Top Performing Products',
    description: 'Find the top 3 products by total quantity sold, including their category and average order value',
    difficulty: Difficulty.INTERMEDIATE,
    hint: 'Use JOIN to combine products and orders, then GROUP BY and ORDER BY with LIMIT',
    testCases: [
      {
        id: 'test-4',
        description: 'Should return top 3 products by quantity sold',
        expectedColumns: ['product_name', 'category', 'total_quantity', 'avg_order_value'],
      }
    ],
    tables: [
      {
        name: 'products',
        columns: [
          { name: 'product_id', type: 'INTEGER', nullable: false, primaryKey: true },
          { name: 'product_name', type: 'TEXT', nullable: false },
          { name: 'category', type: 'TEXT', nullable: false },
          { name: 'price', type: 'DECIMAL', nullable: false },
        ]
      },
      {
        name: 'orders',
        columns: [
          { name: 'order_id', type: 'INTEGER', nullable: false, primaryKey: true },
          { name: 'product_id', type: 'INTEGER', nullable: false },
          { name: 'quantity', type: 'INTEGER', nullable: false },
          { name: 'order_date', type: 'DATE', nullable: false },
        ]
      }
    ]
  },
  {
    id: 'challenge-5',
    title: 'Monthly Sales Trend Analysis',
    description: 'Calculate the month-over-month growth rate in total sales for 2023, showing month, total sales, and growth percentage',
    difficulty: Difficulty.EXPERT,
    hint: 'Use window functions (LAG) to compare current month with previous month, then calculate percentage change',
    testCases: [
      {
        id: 'test-5',
        description: 'Should return monthly sales with growth rate',
        expectedColumns: ['month', 'total_sales', 'growth_rate'],
      }
    ],
    tables: [
      {
        name: 'orders',
        columns: [
          { name: 'order_id', type: 'INTEGER', nullable: false, primaryKey: true },
          { name: 'product_id', type: 'INTEGER', nullable: false },
          { name: 'quantity', type: 'INTEGER', nullable: false },
          { name: 'order_date', type: 'DATE', nullable: false },
        ]
      },
      {
        name: 'products',
        columns: [
          { name: 'product_id', type: 'INTEGER', nullable: false, primaryKey: true },
          { name: 'product_name', type: 'TEXT', nullable: false },
          { name: 'category', type: 'TEXT', nullable: false },
          { name: 'price', type: 'DECIMAL', nullable: false },
        ]
      }
    ]
  }
];

export const SAMPLE_DATABASE_SCHEMA = `
-- Employees table
CREATE TABLE employees (
    employee_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    department TEXT NOT NULL,
    salary INTEGER NOT NULL,
    hire_date DATE NOT NULL
);

-- Products table
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Customers table
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- Orders table
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
`;

export const SAMPLE_DATA = `
-- Insert employees
INSERT INTO employees VALUES 
(1, 'John', 'Doe', 'Engineering', 120000, '2021-01-15'),
(2, 'Jane', 'Smith', 'Engineering', 110000, '2021-03-20'),
(3, 'Bob', 'Johnson', 'Sales', 90000, '2020-11-10'),
(4, 'Alice', 'Williams', 'Engineering', 95000, '2022-02-01'),
(5, 'Charlie', 'Brown', 'Marketing', 85000, '2021-07-15'),
(6, 'Diana', 'Davis', 'Engineering', 130000, '2020-09-01'),
(7, 'Eve', 'Wilson', 'Sales', 105000, '2021-12-01'),
(8, 'Frank', 'Taylor', 'Marketing', 75000, '2022-06-15'),
(9, 'Grace', 'Anderson', 'Engineering', 115000, '2022-03-10'),
(10, 'Henry', 'Martinez', 'Sales', 95000, '2021-05-20');

-- Insert products
INSERT INTO products VALUES 
(1, 'Laptop Pro', 'Electronics', 1299.99),
(2, 'Wireless Mouse', 'Electronics', 49.99),
(3, 'Office Chair', 'Furniture', 399.99),
(4, 'Standing Desk', 'Furniture', 699.99),
(5, 'Notebook Set', 'Stationery', 19.99),
(6, 'Monitor 4K', 'Electronics', 599.99),
(7, 'Desk Lamp', 'Furniture', 79.99),
(8, 'Pen Pack', 'Stationery', 9.99),
(9, 'Keyboard Mechanical', 'Electronics', 199.99),
(10, 'Whiteboard', 'Stationery', 89.99);

-- Insert customers
INSERT INTO customers VALUES 
(1, 'Acme Corp', 'contact@acme.com'),
(2, 'TechStart Inc', 'info@techstart.com'),
(3, 'Global Solutions', 'hello@globalsolutions.com'),
(4, 'Innovation Labs', 'team@innovationlabs.com'),
(5, 'Digital Ventures', 'support@digitalventures.com'),
(6, 'Future Systems', 'hello@futuresystems.com'),
(7, 'Data Analytics Co', 'info@dataanalytics.com');

-- Insert orders
INSERT INTO orders VALUES 
(1, 1, 1, 5, '2023-01-15', 6499.95),
(2, 2, 2, 20, '2023-01-20', 999.80),
(3, 1, 3, 10, '2023-12-05', 3999.90),
(4, 3, 4, 5, '2023-10-15', 3499.95),
(5, 4, 5, 50, '2023-11-20', 999.50),
(6, 5, 6, 3, '2023-12-10', 1799.97),
(7, 1, 7, 15, '2023-12-15', 1199.85),
(8, 2, 8, 100, '2023-10-25', 999.00),
(9, 3, 1, 2, '2023-11-30', 2599.98),
(10, 4, 2, 30, '2023-12-20', 1499.70),
(11, 5, 9, 8, '2023-01-10', 1599.92),
(12, 6, 10, 12, '2023-12-08', 1079.88),
(13, 7, 3, 6, '2023-01-25', 2399.94),
(14, 1, 6, 4, '2023-02-15', 2399.96),
(15, 2, 4, 3, '2023-12-12', 2099.97),
(16, 3, 5, 25, '2023-03-20', 499.75),
(17, 4, 7, 20, '2023-12-18', 1599.80),
(18, 5, 1, 1, '2023-04-10', 1299.99),
(19, 6, 8, 75, '2023-12-22', 748.50),
(20, 7, 2, 15, '2023-05-15', 749.85);
`;
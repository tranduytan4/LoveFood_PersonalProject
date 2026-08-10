require("dotenv").config();
const { initDb, pool } = require("../config/db");

const runSeed = async () => {
  console.log("🌱 Starting full database seed...");
  await initDb();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Clean existing tables in reverse dependency order
    await client.query(`
      TRUNCATE TABLE system_audit_logs, reviews, order_status_history, order_items, orders, 
                     vouchers, product_toppings, products, categories, user_addresses, users, roles 
      RESTART IDENTITY CASCADE;
    `);

    // 1. Seed Roles
    const rolesRes = await client.query(`
      INSERT INTO roles (name, description) VALUES
        ('admin', 'System Administrator with full CRUD access'),
        ('customer', 'Standard Customer account for placing food orders'),
        ('driver', 'Delivery driver partner'),
        ('manager', 'Restaurant store manager')
      RETURNING id, name;
    `);
    const roleMap = Object.fromEntries(rolesRes.rows.map((r) => [r.name, r.id]));

    // 2. Seed Admin & Customer Users
    const usersRes = await client.query(`
      INSERT INTO users (role_id, name, email, phone, password_hash, avatar_url, status) VALUES
        (${roleMap.admin}, 'Super Admin', 'admin@lovefood.com', '0901111222', 'admin_hash_pass', 'https://ui-avatars.com/api/?name=Admin&background=ff3838&color=fff', 'active'),
        (${roleMap.customer}, 'Tun Nguyen', 'tun.nguyen@example.com', '0909999888', 'customer_hash_pass', 'https://ui-avatars.com/api/?name=Tun+Nguyen&background=ff3838&color=fff', 'active'),
        (${roleMap.driver}, 'Nguyen Van Shipper', 'driver@lovefood.com', '0903333444', 'driver_hash_pass', 'https://ui-avatars.com/api/?name=Shipper&background=ff3838&color=fff', 'active')
      RETURNING id, email;
    `);
    const userMap = Object.fromEntries(usersRes.rows.map((u) => [u.email, u.id]));

    // 3. Seed User Addresses
    const addrRes = await client.query(`
      INSERT INTO user_addresses (user_id, recipient_name, phone, address_line, city, district, is_default) VALUES
        (${userMap['tun.nguyen@example.com']}, 'Tun Nguyen', '0909999888', '123 Le Loi Street, Ward 1', 'Ho Chi Minh City', 'District 1', true)
      RETURNING id;
    `);
    const defaultAddrId = addrRes.rows[0].id;

    // 4. Seed Categories
    const catRes = await client.query(`
      INSERT INTO categories (name, slug, image_url, display_order, is_active) VALUES
        ('Burger', 'burger', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', 1, true),
        ('Pizza', 'pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', 2, true),
        ('Drinks', 'drink', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500', 3, true),
        ('Combos', 'combo', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', 4, true),
        ('Dessert', 'dessert', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500', 5, true)
      RETURNING id, slug;
    `);
    const catMap = Object.fromEntries(catRes.rows.map((c) => [c.slug, c.id]));

    // 5. Seed Products
    const prodRes = await client.query(`
      INSERT INTO products (category_id, name, slug, description, image_url, price, original_price, is_available, is_featured, sold_count, rating_avg, rating_count) VALUES
        (${catMap.burger}, 'Double Cheese Beef Burger', 'double-cheese-burger', 'Flame-grilled double beef patty with melted cheddar cheese and special sauce.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', 65000, 79000, true, true, 120, 4.9, 45),
        (${catMap.burger}, 'Crispy Chicken Burger', 'crispy-chicken-burger', 'Golden crunchy chicken fillet with lettuce and garlic mayo.', 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500', 55000, 65000, true, false, 85, 4.7, 32),
        (${catMap.pizza}, 'Pepperoni Supreme Pizza', 'pepperoni-supreme-pizza', 'Loaded with premium pepperoni, mozzarella cheese and Italian herbs.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', 129000, 149000, true, true, 210, 5.0, 98),
        (${catMap.pizza}, 'Seafood Hawaiian Pizza', 'seafood-hawaiian-pizza', 'Fresh shrimp, crab sticks, pineapple slices on tomato basil base.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500', 139000, 159000, true, false, 95, 4.8, 40),
        (${catMap.drink}, 'Iced Peach Milk Tea', 'iced-peach-milk-tea', 'Refreshing peach black tea topped with creamy cheese foam.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500', 35000, 42000, true, true, 340, 4.9, 110),
        (${catMap.drink}, 'Coca Cola Zero 330ml', 'coca-cola-zero', 'Chilled zero calorie sparkling soda.', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500', 18000, 20000, true, false, 500, 4.6, 150),
        (${catMap.combo}, 'Ultimate Super Combo', 'ultimate-super-combo', '1 Double Cheese Burger + 1 Medium Fries + 1 Iced Peach Milk Tea.', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', 99000, 125000, true, true, 410, 5.0, 180)
      RETURNING id, slug;
    `);
    const prodMap = Object.fromEntries(prodRes.rows.map((p) => [p.slug, p.id]));

    // 6. Seed Product Toppings / Options
    await client.query(`
      INSERT INTO product_toppings (product_id, name, price_adjustment, is_available) VALUES
        (${prodMap['double-cheese-burger']}, 'Extra Cheddar Cheese', 10000, true),
        (${prodMap['double-cheese-burger']}, 'Bacon Strip', 15000, true),
        (${prodMap['pepperoni-supreme-pizza']}, 'Extra Mozzarella Crust', 25000, true),
        (${prodMap['iced-peach-milk-tea']}, 'Add Egg Pudding', 8000, true),
        (${prodMap['iced-peach-milk-tea']}, 'Add Black Boba Pearls', 8000, true);
    `);

    // 7. Seed Vouchers
    const voucherRes = await client.query(`
      INSERT INTO vouchers (code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, is_active) VALUES
        ('WELCOME50', '50% off for first-time orders', 'percentage', 50, 100000, 40000, 500, true),
        ('LOVEFOOD10K', 'Direct 10,000 VND discount on all orders', 'fixed_amount', 10000, 50000, 10000, 1000, true)
      RETURNING id, code;
    `);
    const voucherMap = Object.fromEntries(voucherRes.rows.map((v) => [v.code, v.id]));

    // 8. Seed Orders & Order Items
    const orderRes = await client.query(`
      INSERT INTO orders (order_code, user_id, address_id, shipping_address_snapshot, recipient_name, recipient_phone, subtotal, shipping_fee, discount_amount, total_amount, voucher_id, payment_method, payment_status, order_status, note) VALUES
        ('LFO-20260810-001', ${userMap['tun.nguyen@example.com']}, ${defaultAddrId}, '123 Le Loi Street, Ward 1, District 1, Ho Chi Minh City', 'Tun Nguyen', '0909999888', 134000, 15000, 10000, 139000, ${voucherMap['LOVEFOOD10K']}, 'COD', 'paid', 'completed', 'Please bring extra chili sauce.')
      RETURNING id;
    `);
    const orderId = orderRes.rows[0].id;

    await client.query(`
      INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, item_total, options_json) VALUES
        (${orderId}, ${prodMap['double-cheese-burger']}, 'Double Cheese Beef Burger', 65000, 1, 65000, '{"toppings": ["Extra Cheddar Cheese"]}'::jsonb),
        (${orderId}, ${prodMap['ultimate-super-combo']}, 'Ultimate Super Combo', 99000, 1, 99000, '{}'::jsonb);
    `);

    await client.query(`
      INSERT INTO order_status_history (order_id, status, note, created_by) VALUES
        (${orderId}, 'pending', 'Order submitted by customer', ${userMap['tun.nguyen@example.com']}),
        (${orderId}, 'confirmed', 'Order confirmed by kitchen', ${userMap['admin@lovefood.com']}),
        (${orderId}, 'completed', 'Delivered successfully', ${userMap['driver@lovefood.com']});
    `);

    // 9. Seed Reviews
    await client.query(`
      INSERT INTO reviews (order_id, product_id, user_id, rating, comment) VALUES
        (${orderId}, ${prodMap['double-cheese-burger']}, ${userMap['tun.nguyen@example.com']}, 5, 'Burger was super juicy and warm!');
    `);

    // 10. Seed System Audit Logs
    await client.query(`
      INSERT INTO system_audit_logs (admin_id, action, target_type, target_id, details) VALUES
        (${userMap['admin@lovefood.com']}, 'INITIALIZE_SYSTEM_SEED', 'DATABASE', 1, '{"message": "Commercial database seeded successfully"}'::jsonb);
    `);

    await client.query("COMMIT");
    console.log("🎉 PostgreSQL Commercial Seed Completed Successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Seed transaction error:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

runSeed().catch((err) => {
  console.error("❌ Fatal Seed error:", err.message);
  process.exit(1);
});

require("dotenv").config();
const bcrypt = require("bcryptjs");
const { initDb, pool } = require("../config/db");

const runSeed = async () => {
  console.log("🌱 Starting full database seed in English with encrypted passwords...");
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
        ('admin', 'System Administrator with full access'),
        ('customer', 'Standard Customer account'),
        ('driver', 'Delivery driver partner'),
        ('manager', 'Restaurant store manager')
      RETURNING id, name;
    `);
    const roleMap = Object.fromEntries(rolesRes.rows.map((r) => [r.name, r.id]));

    // 2. Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassHash = await bcrypt.hash("admin123", salt);
    const customerPassHash = await bcrypt.hash("password123", salt);
    const driverPassHash = await bcrypt.hash("driver123", salt);

    // 3. Seed Admin & Customer Users
    const usersRes = await client.query(`
      INSERT INTO users (role_id, name, email, phone, password_hash, avatar_url, status) VALUES
        (${roleMap.admin}, 'Super Admin', 'admin@lovefood.com', '+1 555-0100', '${adminPassHash}', 'https://ui-avatars.com/api/?name=Admin&background=ff3838&color=fff', 'active'),
        (${roleMap.customer}, 'Alex Morgan', 'tun.nguyen@example.com', '+1 555-0199', '${customerPassHash}', 'https://ui-avatars.com/api/?name=Alex+Morgan&background=ff3838&color=fff', 'active'),
        (${roleMap.driver}, 'David Shipper', 'driver@lovefood.com', '+1 555-0155', '${driverPassHash}', 'https://ui-avatars.com/api/?name=Shipper&background=ff3838&color=fff', 'active')
      RETURNING id, email;
    `);
    const userMap = Object.fromEntries(usersRes.rows.map((u) => [u.email, u.id]));

    // 4. Seed User Addresses
    const addrRes = await client.query(`
      INSERT INTO user_addresses (user_id, recipient_name, phone, address_line, city, district, is_default) VALUES
        (${userMap['tun.nguyen@example.com']}, 'Alex Morgan', '+1 555-0199', '742 Evergreen Terrace, Apt 4B', 'Springfield', 'Downtown', true),
        (${userMap['tun.nguyen@example.com']}, 'Alex Morgan (Office)', '+1 555-0199', '100 Innovation Way, Suite 300', 'Springfield', 'Tech Park', false)
      RETURNING id;
    `);
    const defaultAddrId = addrRes.rows[0].id;

    // 5. Seed Categories
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

    // 6. Seed Products (in USD)
    const prodRes = await client.query(`
      INSERT INTO products (category_id, name, slug, description, image_url, price, original_price, is_available, is_featured, sold_count, rating_avg, rating_count) VALUES
        (${catMap.burger}, 'Double Cheese Beef Burger', 'double-cheese-burger', 'Flame-grilled double beef patty with melted cheddar cheese and special house sauce.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500', 7.99, 9.99, true, true, 230, 4.9, 58),
        (${catMap.burger}, 'Crispy Chicken Burger', 'crispy-chicken-burger', 'Golden crunchy chicken fillet with fresh crisp lettuce and garlic mayo.', 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=500', 6.49, 7.99, true, false, 145, 4.7, 39),
        (${catMap.burger}, 'Smoky Bacon Burger', 'smoky-bacon-burger', 'Crispy bacon strips, caramelized onions, melted cheddar and rich smoky BBQ sauce.', 'https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg?auto=compress&cs=tinysrgb&w=500', 8.99, 10.99, true, true, 180, 4.8, 44),
        (${catMap.burger}, 'Vegan Plant Burger', 'vegan-plant-burger', '100% plant-based patty with fresh avocado, arugula and truffle vegan mayo.', 'https://images.pexels.com/photos/1639556/pexels-photo-1639556.jpeg?auto=compress&cs=tinysrgb&w=500', 7.49, 8.99, true, false, 92, 4.6, 21),

        (${catMap.pizza}, 'Pepperoni Supreme Pizza', 'pepperoni-supreme-pizza', 'Loaded with premium Italian pepperoni, stretchy mozzarella cheese and fresh oregano.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=500', 12.99, 15.99, true, true, 310, 5.0, 112),
        (${catMap.pizza}, 'Seafood Hawaiian Pizza', 'seafood-hawaiian-pizza', 'Fresh shrimp, crab meat and sweet roasted pineapple slices on classic tomato sauce base.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=500', 14.99, 17.99, true, false, 195, 4.8, 67),
        (${catMap.pizza}, 'BBQ Chicken Pizza', 'bbq-chicken-pizza', 'Tender grilled chicken, smoky BBQ glaze, red onions and melted mozzarella cheese.', 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=500', 13.99, 16.99, true, true, 160, 4.7, 48),

        (${catMap.drink}, 'Iced Peach Milk Tea', 'iced-peach-milk-tea', 'Refreshing black peach tea topped with rich creamy cheese foam macchiato.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=500', 3.99, 4.99, true, true, 420, 4.9, 130),
        (${catMap.drink}, 'Iced Caramel Macchiato', 'iced-caramel-macchiato', 'Freshly brewed espresso layered with chilled milk and premium buttery caramel drizzle.', 'https://images.pexels.com/photos/1193335/pexels-photo-1193335.jpeg?auto=compress&cs=tinysrgb&w=500', 4.49, 5.49, true, false, 280, 4.8, 75),
        (${catMap.drink}, 'Fresh Orange Juice', 'fresh-orange-juice', '100% freshly squeezed California oranges packed with pure natural vitamin C.', 'https://images.pexels.com/photos/158053/fresh-orange-juice-squeezed-refreshing-citrus-158053.jpeg?auto=compress&cs=tinysrgb&w=500', 3.49, 3.99, true, false, 310, 4.7, 85),
        (${catMap.drink}, 'Coca Cola Zero 330ml', 'coca-cola-zero', 'Chilled zero calorie sparkling soda.', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=500', 1.99, 2.49, true, false, 650, 4.6, 190),

        (${catMap.combo}, 'Ultimate Super Combo', 'ultimate-super-combo', '1 Double Cheese Burger + 1 Seasoned French Fries + 1 Iced Peach Milk Tea.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=500', 11.99, 15.99, true, true, 580, 5.0, 220),
        (${catMap.combo}, 'Pizza Party Duo Combo', 'pizza-party-combo', '2 Medium Pepperoni Pizzas + 1 Garlic Bread + 2 Cans of Cold Cola.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500', 24.99, 32.99, true, true, 290, 4.9, 95),
        (${catMap.combo}, 'Snack Time Special', 'snack-time-special', 'Crispy Chicken Nuggets + Golden Onion Rings + 1 Fresh Lemonade.', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=500', 8.99, 11.99, true, false, 210, 4.7, 60),

        (${catMap.dessert}, 'New York Cheesecake', 'new-york-cheesecake', 'Velvety authentic New York style baked cheesecake served with wild berry compote.', 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=500', 4.99, 5.99, true, true, 190, 4.9, 65),
        (${catMap.dessert}, 'Walnut Fudge Brownie', 'walnut-fudge-brownie', 'Rich dark chocolate fudge brownie topped with toasted walnuts.', 'https://images.pexels.com/photos/887853/pexels-photo-887853.jpeg?auto=compress&cs=tinysrgb&w=500', 3.99, 4.99, true, false, 160, 4.8, 50)
      RETURNING id, slug;
    `);
    const prodMap = Object.fromEntries(prodRes.rows.map((p) => [p.slug, p.id]));

    // 7. Seed Product Toppings / Options
    await client.query(`
      INSERT INTO product_toppings (product_id, name, price_adjustment, is_available) VALUES
        (${prodMap['double-cheese-burger']}, 'Extra Cheddar Cheese Slice', 1.00, true),
        (${prodMap['double-cheese-burger']}, 'Smoked Bacon Strip', 1.50, true),
        (${prodMap['double-cheese-burger']}, 'Fried Egg Sunny Side Up', 0.99, true),
        (${prodMap['smoky-bacon-burger']}, 'Extra Spicy BBQ Dip', 0.50, true),
        (${prodMap['smoky-bacon-burger']}, 'Extra Grilled Beef Patty', 2.99, true),
        (${prodMap['pepperoni-supreme-pizza']}, 'Stuffed Mozzarella Cheese Crust', 2.50, true),
        (${prodMap['pepperoni-supreme-pizza']}, 'Extra Pepperoni Slices', 1.99, true),
        (${prodMap['seafood-hawaiian-pizza']}, 'Extra Cheesy Crust', 2.50, true),
        (${prodMap['iced-peach-milk-tea']}, 'Add Golden Boba Pearls', 0.80, true),
        (${prodMap['iced-peach-milk-tea']}, 'Add Egg Pudding Custard', 0.80, true),
        (${prodMap['iced-peach-milk-tea']}, 'Extra Creamy Cheese Foam', 1.00, true),
        (${prodMap['ultimate-super-combo']}, 'Upgrade to Cheese Shaker Fries', 1.20, true);
    `);

    // 8. Seed Vouchers
    const voucherRes = await client.query(`
      INSERT INTO vouchers (code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, is_active) VALUES
        ('WELCOME50', '50% OFF for your first order (Max $5.00 discount)', 'percentage', 50, 10.00, 5.00, 500, true),
        ('LOVEFOOD5', 'Direct $5.00 OFF for orders over $15.00', 'fixed_amount', 5.00, 15.00, 5.00, 1000, true),
        ('FREESHIP', 'Free Delivery on orders over $10.00', 'fixed_amount', 2.50, 10.00, 2.50, 500, true)
      RETURNING id, code;
    `);
    const voucherMap = Object.fromEntries(voucherRes.rows.map((v) => [v.code, v.id]));

    // 9. Seed Orders & Order Items
    const orderRes = await client.query(`
      INSERT INTO orders (order_code, user_id, address_id, shipping_address_snapshot, recipient_name, recipient_phone, subtotal, shipping_fee, discount_amount, total_amount, voucher_id, payment_method, payment_status, order_status, note) VALUES
        ('LF-20260825-1001', ${userMap['tun.nguyen@example.com']}, ${defaultAddrId}, '742 Evergreen Terrace, Apt 4B, Springfield, Downtown', 'Alex Morgan', '+1 555-0199', 19.98, 2.50, 5.00, 17.48, ${voucherMap['LOVEFOOD5']}, 'COD', 'paid', 'completed', 'Please ring the doorbell upon arrival.')
      RETURNING id;
    `);
    const orderId = orderRes.rows[0].id;

    await client.query(`
      INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, item_total, options_json) VALUES
        (${orderId}, ${prodMap['double-cheese-burger']}, 'Double Cheese Beef Burger', 7.99, 1, 7.99, '{"toppings": ["Extra Cheddar Cheese Slice"], "size": "Standard"}'::jsonb),
        (${orderId}, ${prodMap['ultimate-super-combo']}, 'Ultimate Super Combo', 11.99, 1, 11.99, '{"toppings": [], "size": "Standard"}'::jsonb);
    `);

    await client.query(`
      INSERT INTO order_status_history (order_id, status, note, created_by) VALUES
        (${orderId}, 'pending', 'Order placed by customer', ${userMap['tun.nguyen@example.com']}),
        (${orderId}, 'confirmed', 'Order confirmed by restaurant', ${userMap['admin@lovefood.com']}),
        (${orderId}, 'preparing', 'Kitchen is cooking your meal', ${userMap['admin@lovefood.com']}),
        (${orderId}, 'shipping', 'Driver is on the way with your hot meal', ${userMap['driver@lovefood.com']}),
        (${orderId}, 'completed', 'Order delivered successfully', ${userMap['driver@lovefood.com']});
    `);

    // 10. Seed Reviews
    await client.query(`
      INSERT INTO reviews (order_id, product_id, user_id, rating, comment) VALUES
        (${orderId}, ${prodMap['double-cheese-burger']}, ${userMap['tun.nguyen@example.com']}, 5, 'The burger was incredibly juicy, warm, and freshly grilled!');
    `);

    // 11. Seed System Audit Logs
    await client.query(`
      INSERT INTO system_audit_logs (admin_id, action, target_type, target_id, details) VALUES
        (${userMap['admin@lovefood.com']}, 'INITIALIZE_SYSTEM_SEED', 'DATABASE', 1, '{"message": "English Commercial database seeded successfully"}'::jsonb);
    `);

    await client.query("COMMIT");
    console.log("🎉 English Commercial PostgreSQL Seed Completed Successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Seed error:", err);
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

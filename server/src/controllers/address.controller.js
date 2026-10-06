const Address = require("../models/address.model");

const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.findByUserId(req.user.id);
    res.json({ data: addresses });
  } catch (err) {
    next(err);
  }
};

const createAddress = async (req, res, next) => {
  try {
    const { recipientName, phone, addressLine, city, district, isDefault } = req.body;

    if (!recipientName || !phone || !addressLine) {
      return res.status(400).json({
        message: "Please enter recipient name, phone number, and street address.",
      });
    }

    const newAddress = await Address.create({
      userId: req.user.id,
      recipientName,
      phone,
      addressLine,
      city,
      district,
      isDefault: Boolean(isDefault),
    });

    res.status(201).json({
      message: "Delivery address added successfully!",
      data: newAddress,
    });
  } catch (err) {
    next(err);
  }
};

const setDefaultAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const addressId = parseInt(id, 10);
    if (isNaN(addressId)) {
      return res.status(400).json({ message: "Invalid address ID provided." });
    }

    const success = await Address.setDefault(addressId, req.user.id);
    if (!success) {
      return res.status(404).json({ message: "Address not found." });
    }
    res.json({ message: "Set as default address successfully!" });
  } catch (err) {
    next(err);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const addressId = parseInt(id, 10);
    if (isNaN(addressId)) {
      return res.status(400).json({ message: "Invalid address ID provided." });
    }

    const success = await Address.delete(addressId, req.user.id);
    if (!success) {
      return res.status(404).json({ message: "Address not found." });
    }
    res.json({ message: "Address deleted successfully!" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAddresses, createAddress, setDefaultAddress, deleteAddress };

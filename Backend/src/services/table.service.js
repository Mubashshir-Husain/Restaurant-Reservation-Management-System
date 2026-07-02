import Table from '../Models/Table.js';
import ApiError from '../utils/ApiError.js';

const createTable = async ({ label, capacity }) => {
  const existing = await Table.findOne({ label });
  if (existing) {
    throw new ApiError(409, `A table with label '${label}' already exists.`);
  }
  return Table.create({ label, capacity });
};

const listTables = async ({ activeOnly = false } = {}) => {
  const filter = activeOnly ? { isActive: true } : {};
  return Table.find(filter).sort({ label: 1 });
};

const getTableById = async (id) => {
  const table = await Table.findById(id);
  if (!table) {
    throw new ApiError(404, 'Table not found.');
  }
  return table;
};

const updateTable = async (id, updates) => {
  const table = await getTableById(id);
  if (updates.label !== undefined) table.label = updates.label;
  if (updates.capacity !== undefined) table.capacity = updates.capacity;
  if (updates.isActive !== undefined) table.isActive = updates.isActive;
  await table.save();
  return table;
};

const deleteTable = async (id) => {
  const table = await getTableById(id);
  await table.deleteOne();
  return table;
};

export { createTable, listTables, getTableById, updateTable, deleteTable };
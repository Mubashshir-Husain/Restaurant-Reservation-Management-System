import asyncHandler from '../utils/asyncHandler.js';
import * as tableService from '../services/table.service.js';

const createTable = asyncHandler(async (req, res) => {
  const table = await tableService.createTable(req.body);
  res.status(201).json({ success: true, data: table });
});

const listTables = asyncHandler(async (req, res) => {
  const activeOnly = req.query.activeOnly === 'true';
  const tables = await tableService.listTables({ activeOnly });
  res.status(200).json({ success: true, data: tables });
});

const updateTable = asyncHandler(async (req, res) => {
  const table = await tableService.updateTable(req.params.id, req.body);
  res.status(200).json({ success: true, data: table });
});

const deleteTable = asyncHandler(async (req, res) => {
  await tableService.deleteTable(req.params.id);
  res.status(200).json({ success: true, message: 'Table deleted.' });
});

export { createTable, listTables, updateTable, deleteTable };
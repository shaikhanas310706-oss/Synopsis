import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { seedData } from "./seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "db.json");

let memoryDb = null;

export const initStore = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      memoryDb = JSON.parse(data);
    } else {
      memoryDb = JSON.parse(JSON.stringify(seedData));
      saveStore();
    }
  } catch (err) {
    console.error("Error loading store, falling back to seedData:", err);
    memoryDb = JSON.parse(JSON.stringify(seedData));
  }
};

export const getStore = () => {
  if (!memoryDb) initStore();
  return memoryDb;
};

export const saveStore = () => {
  try {
    if (memoryDb) {
      fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Error saving store to disk:", err);
  }
};

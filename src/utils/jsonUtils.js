import { JSONPath } from 'jsonpath-plus';

export const formatJSON = (json, indent = 2) => {
  try {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    return JSON.stringify(parsed, null, indent);
  } catch (error) {
    throw new Error('Invalid JSON');
  }
};

export const validateJSON = (jsonString) => {
  try {
    JSON.parse(jsonString);
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

export const minifyJSON = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error('Invalid JSON');
  }
};

export const extractJSONPath = (jsonString, path) => {
  try {
    const json = JSON.parse(jsonString);
    const result = JSONPath({ path, json });
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

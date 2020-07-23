import path from 'path';
import fs from 'fs';

export function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, '..', 'data', filename), 'utf8', (err, jsonString) => {
      if (err) {
        console.log('read file error', err);
        reject(false);
        return;
      }
      
      try {
        const dataObject = JSON.parse(jsonString);
        resolve(dataObject.data);
        return;
      } catch(err) {
        console.log('parse JSON string error', err);
        reject(false);
        return;
      }
    })
  })
};

export function updateFile() {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(__dirname, '..', 'data', filename), err => {
      if (err) {
        console.log('write file error', err);
        reject(false);
        return;
      }

      resolve(true);
    })
  })
};
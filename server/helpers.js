import path from 'path';
import fs from 'fs';

export function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, 'data', filename), 'utf8', (err, jsonString) => {
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

export function updateFile(filename, data) {
  return new Promise((resolve, reject) => {
    const _path = path.resolve(__dirname, 'data', filename);

    fs.writeFile(_path, JSON.stringify({ data }), 'utf8', err => {
      if (err) {
        console.log('update file error', err);
        reject(err);
        return;
      }
      resolve(true);
    });
  });
}
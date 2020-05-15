class Vehicle {
  constructor(file, data) {
    if (file) {
      this.createBookFromFile(file);
    } else {
      this.createBookFromData(data);
    }
  }
}

module.exports = Vehicle;

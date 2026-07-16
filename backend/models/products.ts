import fs from "fs";
import path from "path";

class Products {
  static getAllProduct(cb: (data: any) => void) {
    fs.readFile(
      path.join(__dirname, "../data/products.json"),
      (err: any, data: any) => {
        if (err) {
          return cb([]);
        }

        const products = JSON.parse(data);
        cb(products);
      },
    );
  }
}

export default Products;

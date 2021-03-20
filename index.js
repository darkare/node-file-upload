const express = require("express");
const fileupload = require("express-fileupload");
const fileType = require("file-type");
const path = require("path");
const fs = require("fs");
const util = require("util");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());

// app.use(express.static('./public'));

app.get("/getfile/:filename", (req, res) => {
//  res.status(200).send(req.params.filename);
   console.log(req.params.filename);
   res.sendFile(req.params.filename,{ root: './public/'});
});

app.post("/upload", (req, res) => {
  (async () => {
    try {
      const file = req.files.file;
      const name = file.name;
      const size = file.data.length;
      const type = await fileType.fromBuffer(file.data);
      console.log(name, type);
      const url = "./public/" + file.md5 + "." + type.ext;

      util.promisify(file.mv)(url);
      res.status(200).send({ status: "Uploaded" });
    } catch (err) {
      console.log("err", err);
      res.status(500).send({ status: "Upload failed" });
    }
  })();
});

app.listen(8888, () => {
  console.log("listenting at 8888");
});

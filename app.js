const oracledb = require("oracledb");
const express = require("express");
const app = express();
var pjson = require("./package.json");
const dbConfig = require("./database/dbConfig");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.post("/api/login", (req, res) => {
  res.send({
    value: req.body.value,
  });
});


app.post("/api/amauntLayakPotong", async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `
      SELECT LAY_BAKILAYAK 
      FROM SADM.VPY_GAJILAYAK
      WHERE LAY_PAYNUMBER= :value
      OR LAY_STAFNEWIC = :value
      `,
      {value:req.body.value},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.send(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
        res.send(err);
      }
    }
  }
});


//http://localhost:3333/api/lokasi

app.get("/api/lokasi", async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT 
                pt.PTJ_PTJPKCODE,pt.PTJ_CAWANGNAM,
                pt.PTJ_SHORTNAME,pt.PTJ_PTJPKNAME,
                pt.PTJ_STAFTUGAS,pe.MAS_STAFFNAME 
                FROM SUTL.UTL_PTJPKCODE pt
                LEFT JOIN SPER.PER_MASTERREC  pe
                ON pt.PTJ_STAFTUGAS = pe.MAS_PAYNUMBER
                ORDER BY
                pt.PTJ_PTJPKNAME`,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.send(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
        res.send(err);
      }
    }
  }
});

//PORT
const port = process.env.PORT || 3333;

app.listen(port, () => console.log(`Listening on port ${port}...`));
console.log(`[Server]API Version: ${pjson.version}`);

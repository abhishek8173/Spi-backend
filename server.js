// importing
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import companies from "./companies.js";

// app config
const app = express();
const port = process.env.PORT || 9000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DB config pass=
const connection_url =
  "mongodb+srv://Abhishek_1191:NVhVzUrb7XF0fP2J@spi-companydatacluster.nl28t3b.mongodb.net/SPI-CommpanyData?retryWrites=true&w=majority";
mongoose.connect(connection_url);

const db = mongoose.connection;

db.once("open", () => console.log("DB connected"));

// api routes
app.get("/", (req, res) => {
  res.status(200).send("hello");
});

// new company
app.post("/company/new", async (req, res) => {
  const company = req.body;
  try {
    await companies.create(company).then((result) => {
      console.log(result);
      res.status(201).send();
    });
  } catch (e) {
    res.status(500).send("Error");
    console.log(e);
  }
});

//update company info
app.put("/company/update", async (req, res) => {
  const newInfo = req.body;
  try {
    await companies.updateOne({ _id: newInfo._id }, newInfo).then((result) => {
      console.log(result);
      res.status(202).send();
    });
  } catch (e) {
    res.status(500).send("Error");
    console.log(e);
  }
});

//remove company
app.delete("/company/remove", async (req, res) => {
  const toDelete = req.body;
  try {
    await companies.deleteOne({ _id: toDelete._id }).then((result) => {
      console.log(result);
      res.status(202).send();
    });
  } catch (e) {
    res.status(500).send("Error");
    console.log(e);
  }
});

//Category

//add new category
app.put("/category/new", async (req, res) => {
  const newCategory = req.body;
  try {
    await companies
      .updateOne(
        {
          _id: newCategory._id,
        },
        {
          $push: {
            jobcategories: newCategory.category,
          },
        }
      )
      .then((result) => {
        console.log(result);
        res.status(201).send();
      });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

//delete category
app.put("/category/remove", async (req, res) => {
  const toRemove = req.body;
  try {
    await companies
      .find({ _id: toRemove._id, "jobcategories._id": toRemove.cid })
      .then(async (result) => {
        if (result[0].jobcategories[0].jobs.length === 0) {
          await companies
            .updateOne(
              { _id: toRemove._id },
              {
                $pull: { jobcategories: { _id: toRemove.cid } },
              }
            )
            .then((change) => {
              console.log(change);
              res.status(202).send();
            });
        } else {
          res.status(406).send();
        }
      });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

//JOBS

//add new job
app.put("/job/new", async (req, res) => {
  const newJob = req.body;
  try {
    await companies
      .updateOne(
        { _id: newJob._id, "jobcategories._id": newJob.cid },
        {
          $push: {
            "jobcategories.$.jobs": newJob.job,
          },
        }
      )
      .then((result) => {
        console.log(result);
        res.status(201).send();
      });
  } catch (e) {
    res.status(500).send("Error");
    console.log(e);
  }
});

//update a job
app.put("/job/update", async (req, res) => {
  const jobToUpdate = req.body;
  try {
    await companies
      .updateOne(
        {
          _id: jobToUpdate._id,
          "jobcategories._id": jobToUpdate.cid,
          "jobs._id": jobToUpdate.jid,
        },
        {
          $set: {
            "jobs.$": jobToUpdate.job,
          },
        }
      )
      .then((result) => {
        console.log(result);
        res.status(200).send();
      });
  } catch (e) {
    console.log(e);
    res.status(500).send("error");
  }
});

// delete a job
app.put("/job/remove", async (req, res) => {
  const jobToDelete = req.body;
  //const cid = jobToDelete.cid;
  try {
    await companies
      .updateOne(
        { _id: jobToDelete._id, "jobcategories._id": jobToDelete.cid },
        {
          $pull: {
            //jobcategories: { jobs: { $elemMatch: { name: jobToDelete.jid } } },
            "jobcategories.$.jobs": { _id: jobToDelete.jid },
          },
        }
      )
      .then((result) => {
        console.log(result);
        res.status(200).send();
      });
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
});

app.get("/company/get", async (req, res) => {
  const companyId = req.body;
  try {
    await companies.findOne(companyId).then((result) => {
      console.log(result);
      res.status(200).send(result);
    });
  } catch (e) {
    res.status(404).send("Not Found");
    console.log(e);
  }
});

app.listen(port, () => console.log(`listening on localhost:${port}`));

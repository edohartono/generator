const conf = new (require("conf"))();
const chalk = require("chalk");
const fs = require("fs");
function rn(task, action) {
  const actions = task.split(" ");
  const root = process.cwd();
  const directories = action.split("/");
  let prevDirectory = "";
  for (const directory of directories) {
    prevDirectory += `/${directory}`;

    if (!fs.existsSync(`${root}${prevDirectory}`)) {
      console.log("creating directory", `${root}${prevDirectory}`);
      fs.mkdirSync(`${root}${prevDirectory}`);
    }
  }

  //create file
  const modulePath = `${root}${prevDirectory}/${task}`;

  if (fs.existsSync(modulePath)) {
    console.log(chalk.yellow(`Folder ${task} already exists`));
    return;
  } else {
    //create directory
    fs.mkdirSync(modulePath);
  }

  //read template controller
  fs.readFile(
    `${__dirname}/../template/rn/ModuleController.model`,
    { encoding: "utf-8" },
    (err, data) => {
      var filtered = data;
      filtered = filtered.replace(new RegExp(`\\#module#`, "gm"), task);
      fs.writeFileSync(`${modulePath}/${task}Controller.js`, filtered);
      console.log("Generating controller");
    }
  );

  fs.readFile(
    `${__dirname}/../template/rn/Module.model`,
    { encoding: "utf-8" },
    (err, data) => {
      var filtered = data;
      filtered = filtered.replace(new RegExp(`\\#module#`, "gm"), task);

      fs.writeFileSync(`${modulePath}/${task}.jsx`, filtered);
      console.log("Generating view");
    }
  );
}
module.exports = rn;

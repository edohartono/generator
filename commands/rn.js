const conf = new (require("conf"))();
const chalk = require("chalk");
const fs = require("fs");
function rn(task, action, dir) {
  const root = process.cwd();
  const directories = action.split("/");

  if (task === "service") {
    return generateService(action, dir);
  }

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

function generateService(action, directory) {
  console.log("Generate service...");
  const servicePath = `${__dirname}/../template/rn/${action}.model`;

  if (!fs.existsSync(servicePath)) {
    console.log(chalk.yellow(`Service ${action} doesnt exists`));
    return;
  }

  if (!fs.existsSync(`${process.cwd()}/${directory}`)) {
    console.log(chalk.yellow(`Directory ${directory} doesnt exists`));
    return;
  }

  fs.copyFileSync(servicePath, `${process.cwd()}/${directory}/${action}.js`);
}
module.exports = rn;
